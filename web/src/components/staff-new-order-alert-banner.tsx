"use client";

import clsx from "clsx";
import type { StaffOrderRow } from "@/components/staff-order-card";

type Props = {
  orders: StaffOrderRow[];
  onAcknowledgeAll: () => void;
  showVisualFallback: boolean;
  kitchenMode?: boolean;
  secondsUntilRepeat?: number;
  isMuted?: boolean;
};

export function StaffNewOrderAlertBanner({
  orders,
  onAcknowledgeAll,
  showVisualFallback,
  kitchenMode = false,
  secondsUntilRepeat = 0,
  isMuted = false,
}: Props) {
  if (orders.length === 0) return null;

  return (
    <div
      role="alert"
      className={clsx(
        "bd-new-order-banner relative overflow-hidden border-2 border-[var(--accent-red)] bg-gradient-to-r from-[var(--accent-red)] via-[color-mix(in_oklab,var(--brand-gold)_80%,var(--accent-red))] to-[var(--brand-gold)] shadow-[0_0_40px_rgba(165,66,43,0.55)]",
        kitchenMode
          ? "sticky top-0 z-30 rounded-none px-6 py-5 sm:rounded-2xl"
          : "rounded-2xl px-5 py-4"
      )}
    >
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/15" aria-hidden />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p
            className={clsx(
              "font-bold uppercase tracking-[0.35em] text-[var(--brand-brown)]",
              kitchenMode ? "text-sm" : "text-[10px]"
            )}
          >
            {isMuted ? "New order (sound muted)" : "New order — action required"}
          </p>
          <h3
            className={clsx(
              "font-display text-[var(--brand-brown)]",
              kitchenMode ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
            )}
          >
            {orders.length === 1 ? "Incoming ticket!" : `${orders.length} new orders!`}
          </h3>
          <p className={clsx("mt-2 font-bold text-[var(--brand-brown)]", kitchenMode ? "text-xl" : "text-sm")}>
            {orders.map((o) => o.code).join(" · ")}
          </p>
          {secondsUntilRepeat > 0 && !isMuted && (
            <p
              className={clsx(
                "mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--brand-brown)]/20 px-3 py-1 font-bold text-[var(--brand-brown)]",
                kitchenMode ? "text-sm" : "text-xs"
              )}
            >
              <span className="bd-alert-countdown inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent-red)]" />
              Alert repeats in {secondsUntilRepeat}s
            </p>
          )}
          {showVisualFallback && (
            <p className={clsx("mt-2 font-medium text-[var(--brand-brown)]/90", kitchenMode ? "text-sm" : "text-xs")}>
              Visual alert active — check speakers or use pop-up mode in Settings.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onAcknowledgeAll}
          className={clsx(
            "shrink-0 rounded-full bg-[var(--brand-brown)] font-bold uppercase tracking-wide text-[var(--bg-cream)] shadow-lg ring-4 ring-white/40 transition hover:brightness-110 active:scale-[0.98] touch-manipulation",
            kitchenMode ? "min-h-[56px] px-10 py-4 text-lg" : "px-6 py-3 text-sm"
          )}
        >
          Acknowledge {orders.length > 1 ? "all" : "order"}
        </button>
      </div>
    </div>
  );
}
