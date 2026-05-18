import {
  type StaffAlertSoundId,
  isFileOnlyAlert,
  soundFilePath,
} from "@/lib/staff-alert-settings";

export type PlaySoundResult = {
  ok: boolean;
  /** How audio was delivered, if at all. */
  method: "webaudio" | "html-audio" | "none";
  detail: string;
};

let audioContext: AudioContext | null = null;
const audioCache = new Map<string, HTMLAudioElement>();

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function resumeAudioContext(): Promise<AudioContext> {
  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

function getTonePattern(soundId: StaffAlertSoundId): {
  freq: number;
  start: number;
  dur: number;
  type?: OscillatorType;
}[] {
  switch (soundId) {
    case "classic-bell":
      return [
        { freq: 880, start: 0, dur: 0.2 },
        { freq: 1174, start: 0.22, dur: 0.28 },
        { freq: 880, start: 0.55, dur: 0.18 },
      ];
    case "diner-ding":
      return [
        { freq: 1200, start: 0, dur: 0.12, type: "triangle" },
        { freq: 1567, start: 0.16, dur: 0.35, type: "triangle" },
      ];
    case "kitchen-buzzer":
      return [
        { freq: 280, start: 0, dur: 0.2, type: "square" },
        { freq: 280, start: 0.28, dur: 0.2, type: "square" },
        { freq: 280, start: 0.56, dur: 0.2, type: "square" },
      ];
    case "double-beep":
      return [
        { freq: 1046, start: 0, dur: 0.14 },
        { freq: 1046, start: 0.28, dur: 0.14 },
      ];
    case "long-alert":
      return [
        { freq: 659, start: 0, dur: 0.45 },
        { freq: 988, start: 0.5, dur: 0.55 },
      ];
    default:
      return [{ freq: 880, start: 0, dur: 0.25 }];
  }
}

/** Web Audio — most reliable after a user click; works without external sound files. */
function playWebAudio(
  ctx: AudioContext,
  soundId: StaffAlertSoundId,
  volume: number
): Promise<number> {
  return new Promise((resolve) => {
    const tones = getTonePattern(soundId);
    const master = ctx.createGain();
    const vol = Math.min(1, Math.max(0.1, volume));
    master.gain.value = vol;
    master.connect(ctx.destination);

    const now = ctx.currentTime;
    let end = 0;

    for (const t of tones) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = t.type ?? "sine";
      osc.frequency.value = t.freq;
      const peak = Math.min(0.95, vol * 0.85);
      g.gain.setValueAtTime(0.001, now + t.start);
      g.gain.exponentialRampToValueAtTime(peak, now + t.start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
      osc.connect(g);
      g.connect(master);
      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur + 0.05);
      end = Math.max(end, t.start + t.dur);
    }

    resolve((end + 0.2) * 1000);
  });
}

async function playHtmlAudio(path: string, volume: number): Promise<boolean> {
  try {
    let el = audioCache.get(path);
    if (!el) {
      el = new Audio(path);
      el.preload = "auto";
      audioCache.set(path, el);
    }
    el.volume = Math.min(1, Math.max(0.1, volume));
    el.currentTime = 0;
    await el.play();
    return true;
  } catch {
    return false;
  }
}

/** Play alert — Web Audio plus WAV fallback for devices where one path is silent. */
export async function playStaffAlertSound(
  soundId: StaffAlertSoundId,
  volume: number
): Promise<PlaySoundResult> {
  if (soundId === "silent" || volume <= 0) {
    return { ok: false, method: "none", detail: "Sound disabled or volume at 0." };
  }

  const path = soundFilePath(soundId);
  let webOk = false;
  let fileOk = false;

  if (path && isFileOnlyAlert(soundId)) {
    fileOk = await playHtmlAudio(path, volume);
    if (fileOk) {
      return {
        ok: true,
        method: "html-audio",
        detail: "Played order announcement clip.",
      };
    }
    return {
      ok: false,
      method: "none",
      detail: "Could not play announcement file. Click Enable sound and try again.",
    };
  }

  try {
    const ctx = await resumeAudioContext();
    const durationMs = await playWebAudio(ctx, soundId, volume);
    if (ctx.state === "running") {
      webOk = true;
      if (path) void playHtmlAudio(path, volume);
      await new Promise((r) => window.setTimeout(r, durationMs));
    }
  } catch {
    webOk = false;
  }

  if (path && !fileOk) {
    fileOk = await playHtmlAudio(path, volume);
  }

  if (webOk && fileOk) {
    return {
      ok: true,
      method: "webaudio",
      detail: "Played tone + sound file. Check system volume if you still hear nothing.",
    };
  }
  if (webOk) {
    return {
      ok: true,
      method: "webaudio",
      detail: "Played alert tone (Web Audio). Check Windows volume and that this browser tab is not muted.",
    };
  }
  if (fileOk) {
    return { ok: true, method: "html-audio", detail: "Played sound file." };
  }

  return {
    ok: false,
    method: "none",
    detail: "Could not start audio. Click Enable sound, then test again.",
  };
}

/** User gesture — unlock audio and play a clear test tone. */
export async function unlockStaffAlertAudio(
  soundId: StaffAlertSoundId,
  volume: number
): Promise<PlaySoundResult> {
  if (soundId === "silent") {
    return { ok: true, method: "none", detail: "No sound — use pop-up or on-screen mode." };
  }

  if (isFileOnlyAlert(soundId)) {
    return playStaffAlertSound(soundId, volume);
  }

  const ctx = await resumeAudioContext();

  const ping = ctx.createOscillator();
  const g = ctx.createGain();
  const vol = Math.min(1, Math.max(0.2, volume));
  ping.frequency.value = 880;
  ping.type = "sine";
  g.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  ping.connect(g);
  g.connect(ctx.destination);
  ping.start();
  ping.stop(ctx.currentTime + 0.3);

  await new Promise((r) => window.setTimeout(r, 320));

  return playStaffAlertSound(soundId, volume);
}
