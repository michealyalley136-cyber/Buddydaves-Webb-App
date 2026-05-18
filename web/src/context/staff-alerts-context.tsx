"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { unlockStaffAlertAudio, playStaffAlertSound } from "@/lib/staff-alert-audio";
import {
  requestNotificationPermission,
  showTestNotification,
  vibrateAlert,
} from "@/lib/staff-alert-notify";
import {
  isAudioUnlockedSession,
  loadAlertSettings,
  saveAlertSettings,
  setAudioUnlockedSession,
  wantsSound,
  wantsPopup,
  type StaffAlertSettings,
} from "@/lib/staff-alert-settings";

const DEFAULT_ALERT_SETTINGS: StaffAlertSettings = {
  enabled: true,
  alertMode: "both",
  soundId: "buddy-daves-announcement",
  volume: 1,
  repeatUntilAcknowledged: true,
};

export type TestAlertResult = {
  ok: boolean;
  message: string;
} | null;

type StaffAlertsContextValue = {
  settings: StaffAlertSettings;
  persistSettings: (s: StaffAlertSettings) => void;
  audioUnlocked: boolean;
  unlockAudio: () => Promise<boolean>;
  notificationPermission: NotificationPermission | "unsupported";
  requestDesktopNotifications: () => Promise<boolean>;
  testAlert: () => Promise<TestAlertResult>;
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

  useEffect(() => {
    setSettings(loadAlertSettings());
    setAudioUnlocked(isAudioUnlockedSession());
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }
  }, []);

  const persistSettings = useCallback((next: StaffAlertSettings) => {
    setSettings(next);
    saveAlertSettings(next);
  }, []);

  const unlockAudio = useCallback(async () => {
    const parts: string[] = [];

    if (wantsSound(settings)) {
      const result = await unlockStaffAlertAudio(settings.soundId, settings.volume);
      if (result.ok) {
        setAudioUnlockedSession();
        setAudioUnlocked(true);
        parts.push(result.detail);
      } else {
        setTestResult({
          ok: false,
          message: `${result.detail} Try pop-up mode if this PC has no speakers.`,
        });
        return false;
      }
    } else {
      setAudioUnlockedSession();
      setAudioUnlocked(true);
      parts.push("On-screen and pop-up alerts ready (no sound on this mode).");
    }

    if (wantsPopup(settings) && Notification.permission === "granted") {
      parts.push("Desktop pop-ups are enabled.");
    }

    setTestResult({
      ok: true,
      message: parts.join(" "),
    });
    return true;
  }, [settings]);

  const requestDesktopNotifications = useCallback(async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === "granted") {
      showTestNotification();
      setTestResult({
        ok: true,
        message: "Pop-up enabled — you should see a test notification.",
      });
    } else {
      setTestResult({ ok: false, message: "Pop-up notifications were blocked by the browser." });
    }
    return perm === "granted";
  }, []);

  const testAlert = useCallback(async (): Promise<TestAlertResult> => {
    const parts: string[] = [];
    let ok = true;

    setShowTestVisualFlash(true);
    window.setTimeout(() => setShowTestVisualFlash(false), 2500);
    vibrateAlert([120, 60, 120]);

    if (wantsSound(settings)) {
      if (settings.volume <= 0) {
        return {
          ok: false,
          message: "Volume is at 0% — raise the slider and try again.",
        };
      }

      let unlocked = audioUnlocked || isAudioUnlockedSession();
      if (!unlocked) {
        const unlock = await unlockStaffAlertAudio(settings.soundId, settings.volume);
        unlocked = unlock.ok;
        if (unlocked) {
          setAudioUnlockedSession();
          setAudioUnlocked(true);
        }
      }

      if (!unlocked) {
        return {
          ok: false,
          message: 'Click "Enable order alerts" first, then test again.',
        };
      }

      const played = await playStaffAlertSound(settings.soundId, settings.volume);
      if (played.ok) {
        parts.push(`Sound: ${played.detail}`);
      } else {
        ok = false;
        parts.push(`Sound failed — ${played.detail}`);
      }
    }

    if (wantsPopup(settings)) {
      if (Notification.permission !== "granted") {
        ok = false;
        parts.push("Pop-up not allowed — click Enable desktop notifications.");
      } else {
        const sent = showTestNotification();
        parts.push(sent ? "Pop-up test sent." : "Pop-up could not display.");
      }
    }

    if (settings.alertMode === "visual") {
      parts.push("On-screen flash shown (banner + tab pulse on real orders).");
    }

    if (parts.length === 0) {
      parts.push("Enable alerts and choose a mode above.");
      ok = false;
    }

    const result: TestAlertResult = { ok, message: parts.join(" ") };
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
