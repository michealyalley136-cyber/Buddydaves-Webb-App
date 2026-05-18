"use client";

import clsx from "clsx";

const steps = [
  { key: "PENDING", label: "Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Completed" },
] as const;

const orderRank: Record<string, number> = {
  PENDING: 0,
  PREPARING: 1,
  READY: 2,
  COMPLETED: 3,
  CANCELLED: -1,
};

export function OrderTimeline({ status }: { status: string }) {
  const rank = orderRank[status] ?? 0;
  const cancelled = status === "CANCELLED";

  return (
    <div className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-lift">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">Kitchen progress</p>
      <div className="mt-5 space-y-4">
        {steps.map((s, idx) => {
          const stepRank = orderRank[s.key];
          const done = !cancelled && rank >= stepRank;
          const current = !cancelled && status === s.key;
          return (
            <div key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={clsx(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-black ring-2",
                    done
                      ? "bg-[var(--brand-teal)] text-white ring-[var(--brand-teal-deep)]"
                      : "bg-white text-ink/35 ring-black/10"
                  )}
                >
                  {idx + 1}
                </span>
                {idx < steps.length - 1 && (
                  <span className="my-1 h-8 w-px bg-[var(--line-subtle)]" aria-hidden />
                )}
              </div>
              <div className="pb-2">
                <p className={clsx("font-semibold", current ? "text-teal" : "text-[var(--brand-brown)]")}>
                  {s.label}
                </p>
                {current && (
                  <p className="text-sm text-ink/65">We&apos;re on it — thanks for your patience.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {cancelled && (
        <p className="mt-4 rounded-2xl bg-[color-mix(in_oklab,var(--accent-red)_12%,white)] px-4 py-3 text-sm text-[var(--accent-red)]">
          This order was cancelled. Call the restaurant if you have questions.
        </p>
      )}
    </div>
  );
}
