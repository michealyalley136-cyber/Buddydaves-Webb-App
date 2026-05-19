export type StaffAlertSoundId =
  | "buddy-daves-announcement"
  | "classic-bell"
  | "diner-ding"
  | "kitchen-buzzer"
  | "kitchen-buzzer-strong"
  | "double-beep"
  | "long-alert"
  | "silent";

/** How new orders are announced on this device. */
export type StaffAlertMode = "sound" | "popup" | "both" | "visual";

export type StaffAlertSettings = {
  enabled: boolean;
  alertMode: StaffAlertMode;
  soundId: StaffAlertSoundId;
  /** Alert-only volume (0–1), separate from system volume. */
  alertVolume: number;
  repeatUntilAcknowledged: boolean;
  /** Large-type fullscreen-friendly layout for kitchen tablets. */
  kitchenMode: boolean;
  /** Unix ms — suppress sound/repeat/pop-up until this time. */
  mutedUntilMs: number | null;
};

const KEYS = {
  settings: "bd_staff_alert_settings_v3",
  acknowledged: "bd_staff_acknowledged_orders_v1",
  audioUnlocked: "bd_staff_audio_unlocked_session",
  notifiedPopups: "bd_staff_notified_popups_v1",
} as const;

const DEFAULT_SETTINGS: StaffAlertSettings = {
  enabled: true,
  alertMode: "both",
  soundId: "kitchen-buzzer-strong",
  alertVolume: 1,
  repeatUntilAcknowledged: true,
  kitchenMode: false,
  mutedUntilMs: null,
};

const MUTE_MS = 5 * 60 * 1000;

function parseAlertMode(value: unknown, soundId?: StaffAlertSoundId): StaffAlertMode {
  if (value === "sound" || value === "popup" || value === "both" || value === "visual") {
    return value;
  }
  if (soundId === "silent") return "visual";
  return "both";
}

function migrateSettings(raw: Record<string, unknown>): StaffAlertSettings {
  const soundId = (raw.soundId as StaffAlertSoundId) ?? DEFAULT_SETTINGS.soundId;
  const legacyVolume =
    typeof raw.volume === "number" ? Math.min(1, Math.max(0, raw.volume as number)) : undefined;
  const alertVolume =
    typeof raw.alertVolume === "number"
      ? Math.min(1, Math.max(0, raw.alertVolume as number))
      : (legacyVolume ?? DEFAULT_SETTINGS.alertVolume);

  return {
    enabled: (raw.enabled as boolean) ?? DEFAULT_SETTINGS.enabled,
    alertMode: parseAlertMode(raw.alertMode, soundId),
    soundId,
    alertVolume,
    repeatUntilAcknowledged:
      (raw.repeatUntilAcknowledged as boolean) ?? DEFAULT_SETTINGS.repeatUntilAcknowledged,
    kitchenMode: (raw.kitchenMode as boolean) ?? DEFAULT_SETTINGS.kitchenMode,
    mutedUntilMs:
      typeof raw.mutedUntilMs === "number" ? (raw.mutedUntilMs as number) : DEFAULT_SETTINGS.mutedUntilMs,
  };
}

export function loadAlertSettings(): StaffAlertSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw =
      localStorage.getItem(KEYS.settings) ??
      localStorage.getItem("bd_staff_alert_settings_v2") ??
      localStorage.getItem("bd_staff_alert_settings_v1");
    if (!raw) return DEFAULT_SETTINGS;
    return migrateSettings(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAlertSettings(settings: StaffAlertSettings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export function isAlertsMuted(settings: StaffAlertSettings): boolean {
  return settings.mutedUntilMs != null && Date.now() < settings.mutedUntilMs;
}

export function muteAlertsForMinutes(settings: StaffAlertSettings, minutes = 5): StaffAlertSettings {
  return { ...settings, mutedUntilMs: Date.now() + minutes * 60 * 1000 };
}

export function clearAlertMute(settings: StaffAlertSettings): StaffAlertSettings {
  return { ...settings, mutedUntilMs: null };
}

export function getMuteRemainingMs(settings: StaffAlertSettings): number {
  if (!settings.mutedUntilMs) return 0;
  return Math.max(0, settings.mutedUntilMs - Date.now());
}

export function loadAcknowledgedOrderIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEYS.acknowledged);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function saveAcknowledgedOrderIds(ids: Set<string>) {
  localStorage.setItem(KEYS.acknowledged, JSON.stringify([...ids]));
}

export function loadNotifiedPopupOrderIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(KEYS.notifiedPopups);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function saveNotifiedPopupOrderIds(ids: Set<string>) {
  sessionStorage.setItem(KEYS.notifiedPopups, JSON.stringify([...ids]));
}

export function isAudioUnlockedSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEYS.audioUnlocked) === "1";
}

export function setAudioUnlockedSession() {
  sessionStorage.setItem(KEYS.audioUnlocked, "1");
}

export const STAFF_ALERT_MODE_OPTIONS: { id: StaffAlertMode; label: string; hint: string }[] = [
  {
    id: "both",
    label: "Sound + pop-up (recommended)",
    hint: "Plays through speakers and shows a desktop notification.",
  },
  {
    id: "sound",
    label: "Sound only",
    hint: "Best for kitchen devices with speakers — on-screen banner still shows.",
  },
  {
    id: "popup",
    label: "Pop-up only (no speakers)",
    hint: "Desktop notification + on-screen alert — no sound.",
  },
  {
    id: "visual",
    label: "On-screen only",
    hint: "Banner, flashing cards, and tab title — no sound or pop-up.",
  },
];

export function getAlertSoundLabel(soundId: StaffAlertSoundId): string {
  return STAFF_ALERT_SOUND_OPTIONS.find((o) => o.id === soundId)?.label ?? soundId;
}

export const STAFF_ALERT_SOUND_OPTIONS: { id: StaffAlertSoundId; label: string }[] = [
  { id: "kitchen-buzzer-strong", label: "Kitchen buzzer — strong (recommended)" },
  { id: "buddy-daves-announcement", label: "Order announcement" },
  { id: "kitchen-buzzer", label: "Kitchen buzzer" },
  { id: "classic-bell", label: "Classic bell" },
  { id: "diner-ding", label: "Diner ding" },
  { id: "double-beep", label: "Double beep" },
  { id: "long-alert", label: "Long alert" },
  { id: "silent", label: "No sound (visual / pop-up only)" },
];

const CUSTOM_SOUND_FILES: Partial<Record<StaffAlertSoundId, string>> = {
  "buddy-daves-announcement": "/sounds/buddy-daves-announcement.m4a",
};

export function soundFilePath(soundId: StaffAlertSoundId): string | null {
  if (soundId === "silent") return null;
  return CUSTOM_SOUND_FILES[soundId] ?? `/sounds/${soundId}.wav`;
}

export function isFileOnlyAlert(soundId: StaffAlertSoundId): boolean {
  return soundId === "buddy-daves-announcement";
}

/** Normalized 0.15–1 for Web Audio / HTML5. */
export function getEffectiveAlertVolume(settings: StaffAlertSettings): number {
  const v = Math.min(1, Math.max(0, settings.alertVolume));
  return Math.min(1, Math.max(0.15, v * 0.85 + 0.15));
}

export function wantsSound(settings: StaffAlertSettings): boolean {
  return (
    settings.enabled &&
    !isAlertsMuted(settings) &&
    settings.soundId !== "silent" &&
    (settings.alertMode === "sound" || settings.alertMode === "both")
  );
}

export function wantsPopup(settings: StaffAlertSettings): boolean {
  return (
    settings.enabled &&
    !isAlertsMuted(settings) &&
    (settings.alertMode === "popup" || settings.alertMode === "both")
  );
}

export function wantsOnScreenVisual(settings: StaffAlertSettings): boolean {
  return settings.enabled;
}

export function wantsRepeatSound(settings: StaffAlertSettings): boolean {
  return settings.repeatUntilAcknowledged && wantsSound(settings);
}

export { MUTE_MS };
