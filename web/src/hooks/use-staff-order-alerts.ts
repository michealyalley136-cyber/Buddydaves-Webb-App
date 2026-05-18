"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StaffOrderRow } from "@/components/staff-order-card";
import { playStaffAlertSound } from "@/lib/staff-alert-audio";
import { showNewOrderNotification, vibrateAlert } from "@/lib/staff-alert-notify";
import {
  loadAcknowledgedOrderIds,
  saveAcknowledgedOrderIds,
  wantsSound,
  wantsPopup,
  wantsOnScreenVisual,
} from "@/lib/staff-alert-settings";
import { useStaffAlerts } from "@/context/staff-alerts-context";

const REPEAT_MS = 4000;
const BASE_TITLE = "Buddy Dave's — Staff";

export function useStaffOrderAlerts(orders: StaffOrderRow[] | null, active: boolean) {
  const { settings, audioUnlocked } = useStaffAlerts();
  const [acknowledged, setAcknowledged] = useState<Set<string>>(() => loadAcknowledgedOrderIds());
  const [soundPlayedOk, setSoundPlayedOk] = useState(true);
  const [alertingIds, setAlertingIds] = useState<Set<string>>(new Set());

  const knownIdsRef = useRef<Set<string> | null>(null);
  const repeatTimerRef = useRef<number | null>(null);

  const unacknowledgedOrders = (orders ?? []).filter(
    (o) => o.status === "PENDING" && alertingIds.has(o.id) && !acknowledged.has(o.id)
  );

  const hasActiveAlert =
    active && wantsOnScreenVisual(settings) && unacknowledgedOrders.length > 0;

  const playAlertOnce = useCallback(async () => {
    let soundOk = true;

    if (wantsSound(settings)) {
      if (!audioUnlocked || settings.volume <= 0) {
        setSoundPlayedOk(false);
        soundOk = false;
      } else {
        const result = await playStaffAlertSound(settings.soundId, settings.volume);
        setSoundPlayedOk(result.ok);
        soundOk = result.ok;
      }
    }

    if (!soundOk) {
      vibrateAlert([200, 100, 200]);
    }

    return soundOk;
  }, [settings, audioUnlocked]);

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
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlertingIds((current) => {
      setAcknowledged((prev) => {
        const next = new Set(prev);
        for (const id of current) next.add(id);
        saveAcknowledgedOrderIds(next);
        return next;
      });
      return new Set();
    });
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

    setAlertingIds((prev) => {
      const next = new Set(prev);
      for (const o of newlyPending) next.add(o.id);
      return next;
    });

    if (wantsPopup(settings)) {
      for (const o of newlyPending) {
        showNewOrderNotification(o.code, o.id);
      }
    }

    vibrateAlert([180, 80, 180, 80, 180]);
    void playAlertOnce();
  }, [orders, active, acknowledged, settings.enabled, settings, playAlertOnce]);

  useEffect(() => {
    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    if (!hasActiveAlert || !settings.repeatUntilAcknowledged) return;
    repeatTimerRef.current = window.setInterval(() => {
      void playAlertOnce();
    }, REPEAT_MS);
    return () => {
      if (repeatTimerRef.current) window.clearInterval(repeatTimerRef.current);
    };
  }, [hasActiveAlert, settings.repeatUntilAcknowledged, playAlertOnce]);

  useEffect(() => {
    if (!hasActiveAlert) {
      document.title = BASE_TITLE;
      return;
    }
    let on = true;
    document.title = "New Order! | Buddy Dave's Staff";
    const id = window.setInterval(() => {
      document.title = on ? "New Order! | Buddy Dave's Staff" : BASE_TITLE;
      on = !on;
    }, 1200);
    return () => {
      window.clearInterval(id);
      document.title = BASE_TITLE;
    };
  }, [hasActiveAlert]);

  useEffect(() => {
    if (!hasActiveAlert) {
      document.body.classList.remove("bd-staff-alert-pulse");
      return;
    }
    document.body.classList.add("bd-staff-alert-pulse");
    return () => document.body.classList.remove("bd-staff-alert-pulse");
  }, [hasActiveAlert]);

  const isOrderAlerting = useCallback(
    (orderId: string) => alertingIds.has(orderId) && !acknowledged.has(orderId),
    [alertingIds, acknowledged]
  );

  const needsPopupFallback =
    wantsPopup(settings) && typeof Notification !== "undefined" && Notification.permission !== "granted";

  return {
    unacknowledgedOrders,
    hasActiveAlert,
    acknowledgeOrder,
    acknowledgeAll,
    isOrderAlerting,
    showVisualFallback:
      hasActiveAlert &&
      (settings.alertMode === "visual" ||
        settings.alertMode === "popup" ||
        !audioUnlocked ||
        !soundPlayedOk ||
        needsPopupFallback),
  };
}
