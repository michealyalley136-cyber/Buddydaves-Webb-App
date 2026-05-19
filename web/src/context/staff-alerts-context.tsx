"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  unlockStaffAlertAudio,
  playStaffAlertSound,
  playKitchenTestAlert,
} from "@/lib/staff-alert-audio";
import {
  requestNotificationPermission,
  showTestNotification,
  vibrateAlert,
} from "@/lib/staff-alert-notify";
import {
  getEffectiveAlertVolume,
  isAudioUnlockedSession,
  isAlertsMuted,
  loadAlertSettings,
  muteAlertsForMinutes,
  saveAlertSettings,
  setAudioUnlockedSession,
  wantsSound,
  wantsPopup,
  type StaffAlertSettings,
} from "@/lib/staff-alert-settings";

const DEFAULT_ALERT_SETTINGS: StaffAlertSettings = {
  enabled: true,
  alertMode: "both",
  soundId: "kitchen-buzzer-strong",
  alertVolume: 1,
  repeatUntilAcknowledged: true,
  kitchenMode: false,
  mutedUntilMs: null,
};

export type TestAlertResult = { ok: boolean; message: string } | null;

type StaffAlertsContextValue = {
  settings: StaffAlertSettings;
  persistSettings: (s: StaffAlertSettings) => void;
  audioUnlocked: boolean;
  unlockAudio: () => Promise<boolean>;
  notificationPermission: NotificationPermission | "unsupported";
  requestDesktopNotifications: () => Promise<boolean>;
  testAlert: () => Promise<TestAlertResult>;
  testKitchenAlert: () => Promise<TestAlertResult>;
  muteForFiveMinutes: () => void;
  testResult: TestAlertResult;
  clearTestResult: () => void;
  showTestVisualFlash: boolean;
};

const StaffAlertsContext = createContext<StaffAlertsContextValue | null>(null);

export function StaffAlertsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StaffAlertSettings>(DEFAULT_ALERT_SETTINGS);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">("default");
  const [testResult, setTestResult] = useState<TestAlertResult>(null);
  const [showTestVisualFlash, setShowTestVisualFlash] = useState(false);
  const [, setMuteTick] = useState(0);

  useEffect(() => {
    setSettings(loadAlertSettings());
    setAudioUnlocked(isAudioUnlockedSession());
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }
  }, []);

  useEffect(() => {
    if (!settings.mutedUntilMs) return;
    const id = window.setInterval(() => {
      setSettings((s) => {
        if (!s.mutedUntilMs || Date.now() < s.mutedUntilMs) return s;
        const next = { ...s, mutedUntilMs: null };
        saveAlertSettings(next);
        return next;
      });
      setMuteTick((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [settings.mutedUntilMs]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("bd-kitchen-mode", settings.kitchenMode);
    return () => document.body.classList.remove("bd-kitchen-mode");
  }, [settings.kitchenMode]);

  const persistSettings = useCallback((next: StaffAlertSettings) => {
    setSettings(next);
    saveAlertSettings(next);
  }, []);

  const muteForFiveMinutes = useCallback(() => {
    const next = muteAlertsForMinutes(settings, 5);
    persistSettings(next);
    setTestResult({ ok: true, message: "Alerts muted for 5 minutes (visual banner may still show)." });
  }, [settings, persistSettings]);

  const unlockAudio = useCallback(async () => {
    const vol = getEffectiveAlertVolume(settings);
    if (wantsSound(settings)) {
      const result = await unlockStaffAlertAudio(settings.soundId, vol);
      if (result.ok) {
        setAudioUnlockedSession();
        setAudioUnlocked(true);
        setTestResult({ ok: true, message: result.detail });
        return true;
      }
      setTestResult({ ok: false, message: result.detail });
      return false;
    }
    setAudioUnlockedSession();
    setAudioUnlocked(true);
    setTestResult({ ok: true, message: "Visual and pop-up alerts ready." });
    return true;
  }, [settings]);

  const requestDesktopNotifications = useCallback(async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === "granted") {
      showTestNotification();
      setTestResult({ ok: true, message: "Pop-up enabled." });
    } else {
      setTestResult({ ok: false, message: "Pop-up blocked by browser." });
    }
    return perm === "granted";
  }, []);

  const testKitchenAlert = useCallback(async (): Promise<TestAlertResult> => {
    setShowTestVisualFlash(true);
    window.setTimeout(() => setShowTestVisualFlash(false), 3000);
    vibrateAlert([250, 100, 250, 100, 250]);

    if (isAlertsMuted(settings)) {
      const r = { ok: false, message: "Alerts are muted — unmute or wait for mute to expire." };
      setTestResult(r);
      return r;
    }

    let unlocked = audioUnlocked || isAudioUnlockedSession();
    if (!unlocked && wantsSound(settings)) {
      const u = await unlockStaffAlertAudio(settings.soundId, getEffectiveAlertVolume(settings));
      unlocked = u.ok;
      if (unlocked) {
        setAudioUnlockedSession();
        setAudioUnlocked(true);
      }
    }

    if (wantsSound(settings) && !unlocked) {
      const r = { ok: false, message: 'Click "Enable sound" first.' };
      setTestResult(r);
      return r;
    }

    const played = wantsSound(settings)
      ? await playKitchenTestAlert(settings)
      : { ok: true, method: "none" as const, detail: "Visual only." };

    const r = {
      ok: played.ok,
      message: played.ok ? `Kitchen test: ${played.detail}` : played.detail,
    };
    setTestResult(r);
    return r;
  }, [settings, audioUnlocked]);

  const testAlert = useCallback(async (): Promise<TestAlertResult> => {
    const parts: string[] = [];
    let ok = true;
    setShowTestVisualFlash(true);
    window.setTimeout(() => setShowTestVisualFlash(false), 2500);
    vibrateAlert([120, 60, 120]);

    if (isAlertsMuted(settings)) {
      return { ok: false, message: "Alerts muted — wait or disable mute." };
    }

    const vol = getEffectiveAlertVolume(settings);

    if (wantsSound(settings)) {
      let unlocked = audioUnlocked || isAudioUnlockedSession();
      if (!unlocked) {
        const unlock = await unlockStaffAlertAudio(settings.soundId, vol);
        unlocked = unlock.ok;
        if (unlocked) {
          setAudioUnlockedSession();
          setAudioUnlocked(true);
        }
      }
      if (!unlocked) {
        return { ok: false, message: 'Click "Enable sound" first.' };
      }
      const played = await playStaffAlertSound(settings.soundId, vol, {
        kitchenBoost: settings.kitchenMode,
      });
      parts.push(played.ok ? played.detail : `Sound failed: ${played.detail}`);
      if (!played.ok) ok = false;
    }

    if (wantsPopup(settings)) {
      if (Notification.permission !== "granted") {
        ok = false;
        parts.push("Enable desktop pop-ups.");
      } else {
        parts.push(showTestNotification() ? "Pop-up sent." : "Pop-up failed.");
      }
    }

    if (parts.length === 0) {
      parts.push("Enable alerts above.");
      ok = false;
    }

    const result = { ok, message: parts.join(" ") };
    setTestResult(result);
    return result;
  }, [settings, audioUnlocked]);

  const clearTestResult = useCallback(() => setTestResult(null), []);

  const value = useMemo(
    () => ({
      settings,
      persistSettings,
      audioUnlocked,
      unlockAudio,
      notificationPermission,
      requestDesktopNotifications,
      testAlert,
      testKitchenAlert,
      muteForFiveMinutes,
      testResult,
      clearTestResult,
      showTestVisualFlash,
    }),
    [
      settings,
      persistSettings,
      audioUnlocked,
      unlockAudio,
      notificationPermission,
      requestDesktopNotifications,
      testAlert,
      testKitchenAlert,
      muteForFiveMinutes,
      testResult,
      clearTestResult,
      showTestVisualFlash,
    ]
  );

  return <StaffAlertsContext.Provider value={value}>{children}</StaffAlertsContext.Provider>;
}

export function useStaffAlerts() {
  const ctx = useContext(StaffAlertsContext);
  if (!ctx) throw new Error("useStaffAlerts must be used within StaffAlertsProvider");
  return ctx;
}
