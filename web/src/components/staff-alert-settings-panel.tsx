"use client";

import clsx from "clsx";
import {
  STAFF_ALERT_MODE_OPTIONS,
  STAFF_ALERT_SOUND_OPTIONS,
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
    testResult,
    showTestVisualFlash,
  } = useStaffAlerts();

  const soundMode = wantsSound(settings);
  const popupMode = wantsPopup(settings);

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
        <h2 className="mt-1 font-display text-3xl text-[var(--bg-cream)]">Order alerts</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Choose how this device should announce new orders. Use <strong className="text-white/85">pop-up
          only</strong> for computers without speakers. Use <strong className="text-white/85">sound</strong>{" "}
          for tablets or PCs with speakers.
        </p>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/85">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => persistSettings({ ...settings, enabled: e.target.checked })}
            className="h-4 w-4 rounded border-white/30 accent-[var(--brand-gold)]"
          />
          Enable new-order alerts
        </label>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-white/55">
          Alert type for this device
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
          <span className="mt-2 block text-[11px] font-normal normal-case leading-relaxed text-white/50">
            {STAFF_ALERT_MODE_OPTIONS.find((o) => o.id === settings.alertMode)?.hint}
          </span>
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {soundMode && !audioUnlocked && (
            <button
              type="button"
              onClick={() => void unlockAudio()}
              className="rounded-full bg-[var(--brand-gold)] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] ring-1 ring-black/10"
            >
              Enable sound on this device
            </button>
          )}
          {soundMode && audioUnlocked && (
            <span className="inline-flex items-center rounded-full bg-[var(--brand-teal)]/30 px-3 py-1.5 text-xs font-semibold text-[var(--bg-cream)] ring-1 ring-white/15">
              Sound enabled
            </span>
          )}
          {popupMode && notificationPermission !== "granted" && notificationPermission !== "unsupported" && (
            <button
              type="button"
              onClick={() => void requestDesktopNotifications()}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
            >
              Enable desktop pop-ups
            </button>
          )}
          {popupMode && notificationPermission === "granted" && (
            <span className="inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/75">
              Pop-ups enabled
            </span>
          )}
        </div>

        {testResult && (
          <p
            role="status"
            className={clsx(
              "mt-4 rounded-xl px-4 py-3 text-sm font-medium leading-relaxed",
              testResult.ok
                ? "bg-[color-mix(in_oklab,var(--brand-teal)_25%,#1b1f24)] text-[var(--bg-cream)] ring-1 ring-[var(--brand-teal)]/40"
                : "bg-[color-mix(in_oklab,var(--accent-red)_20%,#1b1f24)] text-[#ffb4a8] ring-1 ring-[var(--accent-red)]/35"
            )}
          >
            {testResult.message}
          </p>
        )}

        {soundMode && (
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
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none ring-[var(--brand-gold)]/40 focus:ring-2"
              >
                {STAFF_ALERT_SOUND_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-white/55">
              Volume · {Math.round(settings.volume * 100)}%
              <input
                type="range"
                min={10}
                max={100}
                value={Math.max(10, Math.round(settings.volume * 100))}
                onChange={(e) =>
                  persistSettings({ ...settings, volume: Number(e.target.value) / 100 })
                }
                className="mt-3 w-full accent-[var(--brand-gold)]"
              />
              <span className="mt-1 block text-[10px] font-normal normal-case text-white/45">
                Turn up Windows volume too if you still hear nothing.
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

        <button
          type="button"
          onClick={() => void testAlert()}
          className="mt-5 rounded-full bg-[var(--brand-gold)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10 transition hover:bg-[var(--brand-gold-deep)]"
        >
          Test alerts now
        </button>
      </section>
    </>
  );
}
