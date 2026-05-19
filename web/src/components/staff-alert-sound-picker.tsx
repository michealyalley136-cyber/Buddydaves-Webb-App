"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  STAFF_ALERT_SOUND_OPTIONS,
  getAlertSoundLabel,
  type StaffAlertSoundId,
} from "@/lib/staff-alert-settings";
import { useStaffAlerts } from "@/context/staff-alerts-context";

export function StaffAlertSoundPicker({ needsUnlock }: { needsUnlock: boolean }) {
  const { settings, previewSound, assignSound } = useStaffAlerts();
  const [previewingId, setPreviewingId] = useState<StaffAlertSoundId | null>(null);
  const assignedId = settings.soundId;

  const handlePreview = async (soundId: StaffAlertSoundId) => {
    setPreviewingId(soundId);
    await previewSound(soundId);
    setPreviewingId(null);
  };

  return (
    <div className="sm:col-span-2">
      <p className="text-xs font-bold uppercase tracking-wide text-white/55">Notification sound</p>
      <p className="mt-1 text-sm text-white/70">
        Assigned:{" "}
        <span className="font-semibold text-[var(--brand-gold)]">
          {getAlertSoundLabel(assignedId)}
        </span>
      </p>
      <p className="mt-1 text-xs text-white/50">
        Preview a sound, then tap <strong className="text-white/70">Select</strong> to save it for
        new-order alerts on this device.
      </p>
      {needsUnlock && (
        <p className="mt-1 text-xs text-amber-200/90">Enable sound above before previewing.</p>
      )}
      <ul className="mt-3 max-h-[min(420px,50vh)] space-y-2 overflow-y-auto pr-1" role="listbox">
        {STAFF_ALERT_SOUND_OPTIONS.map((option) => {
          const isAssigned = option.id === assignedId;
          const isPreviewing = previewingId === option.id;

          return (
            <li
              key={option.id}
              role="option"
              aria-selected={isAssigned}
              className={clsx(
                "flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5 sm:flex-nowrap",
                isAssigned
                  ? "border-[var(--brand-gold)]/50 bg-[var(--brand-gold)]/10"
                  : "border-white/10 bg-black/20"
              )}
            >
              <span className="min-w-0 flex-1 text-sm font-medium text-white">{option.label}</span>
              <SoundPickerRowActions
                optionId={option.id}
                isAssigned={isAssigned}
                isPreviewing={isPreviewing}
                onPreview={handlePreview}
                onSelect={assignSound}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SoundPickerRowActions({
  optionId,
  isAssigned,
  isPreviewing,
  onPreview,
  onSelect,
}: {
  optionId: StaffAlertSoundId;
  isAssigned: boolean;
  isPreviewing: boolean;
  onPreview: (id: StaffAlertSoundId) => Promise<void>;
  onSelect: (id: StaffAlertSoundId) => void;
}) {
  return (
    <div className="flex w-full shrink-0 gap-2 sm:w-auto">
      <button
        type="button"
        onClick={() => void onPreview(optionId)}
        disabled={isPreviewing}
        className="min-h-[40px] flex-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white touch-manipulation disabled:opacity-60 sm:flex-none sm:px-4"
      >
        {isPreviewing ? "Playing…" : "Preview"}
      </button>
      {isAssigned ? (
        <span className="flex min-h-[40px] flex-1 items-center justify-center rounded-full bg-[var(--brand-gold)]/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-gold)] sm:flex-none sm:px-4">
          Assigned
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onSelect(optionId)}
          className="min-h-[40px] flex-1 rounded-full bg-[var(--brand-gold)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] touch-manipulation sm:flex-none sm:px-4"
        >
          Select
        </button>
      )}
    </div>
  );
}
