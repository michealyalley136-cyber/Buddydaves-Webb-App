export type StaffAlertSoundId =
  | "buddy-daves-announcement"
  | "classic-bell"
  | "diner-ding"
  | "kitchen-buzzer"
  | "double-beep"
  | "long-alert"
  | "silent";

/** How new orders are announced on this device. */
export type StaffAlertMode = "sound" | "popup" | "both" | "visual";

export type StaffAlertSettings = {
  enabled: boolean;
  /** Sound + popup + both + visual (on-screen banner always when enabled). */
  alertMode: StaffAlertMode;
  soundId: StaffAlertSoundId;
  volume: number;
  repeatUntilAcknowledged: boolean;
};

const KEYS = {
  settings: "bd_staff_alert_settings_v2",
  acknowledged: "bd_staff_acknowledged_orders_v1",
  audioUnlocked: "bd_staff_audio_unlocked_session",
} as const;

const DEFAULT_SETTINGS: StaffAlertSettings = {
  enabled: true,
  alertMode: "both",
  soundId: "buddy-daves-announcement",
  volume: 1,
  repeatUntilAcknowledged: true,
};

function parseAlertMode(value: unknown, soundId?: StaffAlertSoundId): StaffAlertMode {
  if (value === "sound" || value === "popup" || value === "both" || value === "visual") {
    return value;
  }
  if (soundId === "silent") return "visual";
  return "both";
}

export function loadAlertSettings(): StaffAlertSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw =
      localStorage.getItem(KEYS.settings) ?? localStorage.getItem("bd_staff_alert_settings_v1");
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<StaffAlertSettings & { soundId?: string }>;
    const soundId = (parsed.soundId as StaffAlertSoundId) ?? DEFAULT_SETTINGS.soundId;
    return {
      enabled: parsed.enabled ?? DEFAULT_SETTINGS.enabled,
      alertMode: parseAlertMode(parsed.alertMode, soundId),
      soundId,
      volume:
        typeof parsed.volume === "number"
          ? Math.min(1, Math.max(0, parsed.volume))
          : DEFAULT_SETTINGS.volume,
      repeatUntilAcknowledged:
        parsed.repeatUntilAcknowledged ?? DEFAULT_SETTINGS.repeatUntilAcknowledged,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAlertSettings(settings: StaffAlertSettings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
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

export const STAFF_ALERT_SOUND_OPTIONS: { id: StaffAlertSoundId; label: string }[] = [
  { id: "buddy-daves-announcement", label: "Order announcement (recommended)" },
  { id: "classic-bell", label: "Classic Bell" },
  { id: "diner-ding", label: "Diner Ding" },
  { id: "kitchen-buzzer", label: "Kitchen Buzzer" },
  { id: "double-beep", label: "Double Beep" },
  { id: "long-alert", label: "Long Alert" },
  { id: "silent", label: "No sound file (use with pop-up / visual modes)" },
];

/** Custom clips (not generated WAV presets). */
const CUSTOM_SOUND_FILES: Partial<Record<StaffAlertSoundId, string>> = {
  "buddy-daves-announcement": "/sounds/buddy-daves-announcement.m4a",
};

export function soundFilePath(soundId: StaffAlertSoundId): string | null {
  if (soundId === "silent") return null;
  return CUSTOM_SOUND_FILES[soundId] ?? `/sounds/${soundId}.wav`;
}

/** Play the file only — no synthetic beep layered on top. */
export function isFileOnlyAlert(soundId: StaffAlertSoundId): boolean {
  return soundId === "buddy-daves-announcement";
}

export function wantsSound(settings: StaffAlertSettings): boolean {
  return (
    settings.enabled &&
    settings.soundId !== "silent" &&
    (settings.alertMode === "sound" || settings.alertMode === "both")
  );
}

export function wantsPopup(settings: StaffAlertSettings): boolean {
  return (
    settings.enabled && (settings.alertMode === "popup" || settings.alertMode === "both")
  );
}

export function wantsOnScreenVisual(settings: StaffAlertSettings): boolean {
  return settings.enabled;
}
