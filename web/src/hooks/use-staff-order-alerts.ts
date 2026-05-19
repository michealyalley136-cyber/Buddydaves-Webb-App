"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StaffOrderRow } from "@/components/staff-order-card";
import { playStaffAlertSound } from "@/lib/staff-alert-audio";
import { startFaviconAlert, stopFaviconAlert } from "@/lib/staff-favicon-alert";
import { showNewOrderNotification, vibrateAlert } from "@/lib/staff-alert-notify";
import {
  getEffectiveAlertVolume,
  isAlertsMuted,
  loadAcknowledgedOrderIds,
  loadNotifiedPopupOrderIds,
  saveAcknowledgedOrderIds,
  saveNotifiedPopupOrderIds,
  wantsOnScreenVisual,
  wantsPopup,
  wantsRepeatSound,
  wantsSound,
} from "@/lib/staff-alert-settings";
import { useStaffAlerts } from "@/context/staff-alerts-context";

const REPEAT_MS = 4000;
const BASE_TITLE = "Buddy Dave's — Staff";

export function sortOrdersKitchenFirst(orders: StaffOrderRow[]): StaffOrderRow[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useStaffOrderAlerts(orders: StaffOrderRow[] | null, active: boolean) {
  const { settings, audioUnlocked } = useStaffAlerts();
  const [acknowledged, setAcknowledged] = useState<Set<string>>(() => loadAcknowledgedOrderIds());
  const [soundPlayedOk, setSoundPlayedOk] = useState(true);
  const [alertingIds, setAlertingIds] = useState<Set<string>>(new Set());
  const [secondsUntilRepeat, setSecondsUntilRepeat] = useState(REPEAT_MS / 1000);

  const knownIdsRef = useRef<Set<string> | null>(null);
  const repeatTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const notifiedPopupRef = useRef<Set<string>>(loadNotifiedPopupOrderIds());
  const lastSoundAtRef = useRef(0);
  const onNewAlertRef = useRef<((orderIds: string[]) => void) | null>(null);

  const muted = isAlertsMuted(settings);

  const unacknowledgedOrders = (orders ?? []).filter(
    (o) => o.status === "PENDING" && alertingIds.has(o.id) && !acknowledged.has(o.id)
  );

  const hasActiveAlert =
    active && wantsOnScreenVisual(settings) && unacknowledgedOrders.length > 0;

  const playAlertOnce = useCallback(async () => {
    if (muted) return true;

    let soundOk = true;
    const vol = getEffectiveAlertVolume(settings);
    const now = Date.now();
    if (now - lastSoundAtRef.current < 350) return soundOk;
    lastSoundAtRef.current = now;

    if (wantsSound(settings)) {
      if (!audioUnlocked || settings.alertVolume <= 0) {
        setSoundPlayedOk(false);
        soundOk = false;
      } else {
        const result = await playStaffAlertSound(settings.soundId, vol, {
          kitchenBoost: settings.kitchenMode,
        });
        setSoundPlayedOk(result.ok);
        soundOk = result.ok;
      }
    }

    if (!soundOk) vibrateAlert([200, 100, 200, 100, 200]);
    return soundOk;
  }, [settings, audioUnlocked, muted]);

  const acknowledgeOrder = useCallback((orderId: string) => {
    setAcknowledged((prev) => {
      const next = new Set(prev);
      next.add(orderId);
      saveAcknowledgedOrderIds(next);
      return next;
    });
    setAlertingIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
    notifiedPopupRef.current.delete(orderId);
    saveNotifiedPopupOrderIds(notifiedPopupRef.current);
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlertingIds((current) => {
      setAcknowledged((prev) => {
        const next = new Set(prev);
        for (const id of current) {
          next.add(id);
          notifiedPopupRef.current.delete(id);
        }
        saveAcknowledgedOrderIds(next);
        saveNotifiedPopupOrderIds(notifiedPopupRef.current);
        return next;
      });
      return new Set();
    });
  }, []);

  const registerOnNewAlert = useCallback((fn: (orderIds: string[]) => void) => {
    onNewAlertRef.current = fn;
  }, []);

  useEffect(() => {
    if (!active || !orders) return;
    if (knownIdsRef.current === null) {
      knownIdsRef.current = new Set(orders.map((o) => o.id));
      return;
    }
    const known = knownIdsRef.current;
    const newlyPending: StaffOrderRow[] = [];
    for (const o of orders) {
      if (o.status === "PENDING" && !known.has(o.id) && !acknowledged.has(o.id)) {
        newlyPending.push(o);
      }
      known.add(o.id);
    }
    if (newlyPending.length === 0 || !settings.enabled) return;

    const newIds = newlyPending.map((o) => o.id);
    setAlertingIds((prev) => {
      const next = new Set(prev);
      for (const id of newIds) next.add(id);
      return next;
    });

    if (wantsPopup(settings)) {
      for (const o of newlyPending) {
        if (!notifiedPopupRef.current.has(o.id)) {
          showNewOrderNotification(o.code, o.id);
          notifiedPopupRef.current.add(o.id);
        }
      }
      saveNotifiedPopupOrderIds(notifiedPopupRef.current);
    }

    vibrateAlert([200, 100, 200, 100, 200, 100, 200]);
    void playAlertOnce();
    onNewAlertRef.current?.(newIds);
  }, [orders, active, acknowledged, settings.enabled, settings, playAlertOnce]);

  useEffect(() => {
    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (!hasActiveAlert || !wantsRepeatSound(settings)) {
      setSecondsUntilRepeat(REPEAT_MS / 1000);
      return;
    }

    setSecondsUntilRepeat(REPEAT_MS / 1000);
    countdownRef.current = window.setInterval(() => {
      setSecondsUntilRepeat((s) => (s <= 1 ? REPEAT_MS / 1000 : s - 1));
    }, 1000);

    repeatTimerRef.current = window.setInterval(() => {
      setSecondsUntilRepeat(REPEAT_MS / 1000);
      void playAlertOnce();
    }, REPEAT_MS);

    return () => {
      if (repeatTimerRef.current) window.clearInterval(repeatTimerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, [hasActiveAlert, settings, playAlertOnce]);

  useEffect(() => {
    if (!hasActiveAlert) {
      document.title = BASE_TITLE;
      stopFaviconAlert();
      return;
    }
    startFaviconAlert();
    let on = true;
    document.title = "!! NEW ORDER !! | Buddy Dave's";
    const id = window.setInterval(() => {
      document.title = on ? "!! NEW ORDER !! | Buddy Dave's" : BASE_TITLE;
      on = !on;
    }, 800);
    return () => {
      window.clearInterval(id);
      document.title = BASE_TITLE;
      stopFaviconAlert();
    };
  }, [hasActiveAlert]);

  useEffect(() => {
    if (!hasActiveAlert) {
      document.body.classList.remove("bd-staff-alert-pulse", "bd-staff-alert-pulse-strong");
      return;
    }
    document.body.classList.add(
      settings.kitchenMode || !soundPlayedOk ? "bd-staff-alert-pulse-strong" : "bd-staff-alert-pulse"
    );
    return () => {
      document.body.classList.remove("bd-staff-alert-pulse", "bd-staff-alert-pulse-strong");
    };
  }, [hasActiveAlert, settings.kitchenMode, soundPlayedOk]);

  const isOrderAlerting = useCallback(
    (orderId: string) => alertingIds.has(orderId) && !acknowledged.has(orderId),
    [alertingIds, acknowledged]
  );

  const needsPopupFallback =
    wantsPopup(settings) && typeof Notification !== "undefined" && Notification.permission !== "granted";

  const forceFullscreenModal =
    hasActiveAlert &&
    (settings.kitchenMode || settings.alertMode === "visual" || settings.alertMode === "popup");

  return {
    unacknowledgedOrders,
    hasActiveAlert,
    acknowledgeOrder,
    acknowledgeAll,
    isOrderAlerting,
    registerOnNewAlert,
    secondsUntilRepeat,
    isMuted: muted,
    showVisualFallback:
      hasActiveAlert &&
      (settings.kitchenMode ||
        settings.alertMode === "visual" ||
        settings.alertMode === "popup" ||
        !audioUnlocked ||
        !soundPlayedOk ||
        needsPopupFallback),
    forceFullscreenModal,
  };
}
