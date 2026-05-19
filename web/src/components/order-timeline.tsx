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
    <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal">Kitchen progress</p>
      <ol className="mt-5 space-y-0">
        {steps.map((s, idx) => {
          const stepRank = orderRank[s.key];
          const done = !cancelled && rank >= stepRank;
          const current = !cancelled && status === s.key;
          return (
            <li key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    done
                      ? "bg-[var(--brand-teal)] text-white"
                      : "border border-[var(--line-subtle)] bg-[var(--bg-cream)] text-[var(--text-muted)]"
                  )}
                >
                  {idx + 1}
                </span>
                {idx < steps.length - 1 && (
                  <span
                    className={clsx("my-1 h-8 w-px", done ? "bg-teal/40" : "bg-[var(--line-subtle)]")}
                    aria-hidden
                  />
                )}
              </div>
              <div className={clsx("pb-6", idx === steps.length - 1 && "pb-0")}>
                <p
                  className={clsx(
                    "font-medium",
                    current ? "text-teal" : done ? "text-[var(--brand-brown)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {s.label}
                </p>
                {current && (
                  <p className="mt-0.5 text-sm text-[var(--text-muted)]">In progress</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {cancelled && (
        <p className="mt-2 rounded-lg bg-[color-mix(in_oklab,var(--accent-red)_10%,white)] px-4 py-3 text-sm text-[var(--accent-red)]">
          This order was cancelled. Contact the restaurant if you have questions.
        </p>
      )}
    </div>
  );
}
