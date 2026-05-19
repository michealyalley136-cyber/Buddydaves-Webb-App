"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  STAFF_ALERT_MODE_OPTIONS,
  STAFF_ALERT_SOUND_OPTIONS,
  clearAlertMute,
  getMuteRemainingMs,
  isAlertsMuted,
  wantsSound,
  wantsPopup,
  type StaffAlertSettings,
} from "@/lib/staff-alert-settings";
import { useStaffAlerts } from "@/context/staff-alerts-context";

export function StaffAlertSettingsPanel() {
  const {
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
    showTestVisualFlash,
  } = useStaffAlerts();

  const soundMode = wantsSound(settings);
  const popupMode = wantsPopup(settings);
  const muted = isAlertsMuted(settings);
  const muteMin = Math.ceil(getMuteRemainingMs(settings) / 60000);

  return (
    <>
      {showTestVisualFlash && (
        <div
          role="alert"
          className="mb-4 rounded-2xl border-2 border-[var(--accent-red)] bg-gradient-to-r from-[var(--accent-red)] to-[var(--brand-gold)] px-5 py-4 text-center shadow-lg"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-brown)]">
            Test visual alert
          </p>
          <p className="mt-1 font-display text-2xl text-[var(--brand-brown)]">
            This is what on-screen alerts look like
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-[var(--brand-teal)]/40 bg-[color-mix(in_oklab,var(--brand-teal)_22%,#1b1f24)] p-5 shadow-diner ring-1 ring-[var(--brand-teal)]/25">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-gold)]">Settings</p>
        <h2 className="mt-1 font-display text-3xl text-[var(--bg-cream)]">Kitchen alerts</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Tune this device for the line. Turn on <strong className="text-white/85">Kitchen mode</strong> on a
          tablet, enable sound once, then use demo order to practice.
        </p>

        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 px-4 py-3 text-sm font-semibold text-white">
          <input
            type="checkbox"
            checked={settings.kitchenMode}
            onChange={(e) => persistSettings({ ...settings, kitchenMode: e.target.checked })}
            className="h-5 w-5 rounded border-white/30 accent-[var(--brand-gold)]"
          />
          Kitchen mode (large text, sticky banner, fullscreen alert)
        </label>

        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/85">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => persistSettings({ ...settings, enabled: e.target.checked })}
            className="h-4 w-4 rounded border-white/30 accent-[var(--brand-gold)]"
          />
          Enable new-order alerts
        </label>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-white/55">
          Alert type
          <select
            value={settings.alertMode}
            onChange={(e) =>
              persistSettings({
                ...settings,
                alertMode: e.target.value as StaffAlertSettings["alertMode"],
              })
            }
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none ring-[var(--brand-gold)]/40 focus:ring-2"
          >
            {STAFF_ALERT_MODE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {soundMode && !audioUnlocked && (
            <button
              type="button"
              onClick={() => void unlockAudio()}
              className="min-h-[44px] rounded-full bg-[var(--brand-gold)] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] touch-manipulation"
            >
              Enable sound
            </button>
          )}
          {popupMode && notificationPermission !== "granted" && notificationPermission !== "unsupported" && (
            <button
              type="button"
              onClick={() => void requestDesktopNotifications()}
              className="min-h-[44px] rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white touch-manipulation"
            >
              Enable pop-ups
            </button>
          )}
          <button
            type="button"
            onClick={muteForFiveMinutes}
            disabled={muted}
            className="min-h-[44px] rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white/85 touch-manipulation disabled:opacity-50"
          >
            {muted ? `Muted (${muteMin}m left)` : "Mute 5 minutes"}
          </button>
          {muted && (
            <button
              type="button"
              onClick={() => persistSettings(clearAlertMute(settings))}
              className="min-h-[44px] rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold uppercase text-white touch-manipulation"
            >
              Unmute now
            </button>
          )}
        </div>

        {testResult && (
          <p
            role="status"
            className={clsx(
              "mt-4 rounded-xl px-4 py-3 text-sm font-medium leading-relaxed",
              testResult.ok
                ? "bg-[color-mix(in_oklab,var(--brand-teal)_25%,#1b1f24)] text-[var(--bg-cream)]"
                : "bg-[color-mix(in_oklab,var(--accent-red)_20%,#1b1f24)] text-[#ffb4a8]"
            )}
          >
            {testResult.message}
          </p>
        )}

        {settings.enabled && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-white/55">
              Alert sound
              <select
                value={settings.soundId}
                onChange={(e) =>
                  persistSettings({
                    ...settings,
                    soundId: e.target.value as StaffAlertSettings["soundId"],
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white"
              >
                {STAFF_ALERT_SOUND_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-white/55">
              Alert volume only · {Math.round(settings.alertVolume * 100)}%
              <input
                type="range"
                min={15}
                max={100}
                value={Math.max(15, Math.round(settings.alertVolume * 100))}
                onChange={(e) =>
                  persistSettings({ ...settings, alertVolume: Number(e.target.value) / 100 })
                }
                className="mt-3 w-full accent-[var(--brand-gold)]"
              />
              <span className="mt-1 block text-[10px] font-normal normal-case text-white/45">
                Does not change music/system volume — only order alerts.
              </span>
            </label>
          </div>
        )}

        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/85">
          <input
            type="checkbox"
            checked={settings.repeatUntilAcknowledged}
            onChange={(e) =>
              persistSettings({ ...settings, repeatUntilAcknowledged: e.target.checked })
            }
            className="h-4 w-4 rounded border-white/30 accent-[var(--brand-gold)]"
          />
          Repeat alert until acknowledged
        </label>

        <p className="mt-6 text-sm text-white/60">
          <Link href="/owner-guide" className="font-semibold text-[var(--brand-gold)] underline">
            Open owner training guide (in-app)
          </Link>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void testKitchenAlert()}
            className="min-h-[48px] rounded-full bg-[var(--accent-red)] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-lg touch-manipulation"
          >
            Test kitchen alert
          </button>
          <button
            type="button"
            onClick={() => void testAlert()}
            className="min-h-[48px] rounded-full bg-[var(--brand-gold)] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] touch-manipulation"
          >
            Test all alerts
          </button>
        </div>
      </section>
    </>
  );
}
