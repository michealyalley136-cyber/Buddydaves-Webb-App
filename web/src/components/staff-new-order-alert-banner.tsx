"use client";

import type { StaffOrderRow } from "@/components/staff-order-card";

type Props = {
  orders: StaffOrderRow[];
  onAcknowledgeAll: () => void;
  showVisualFallback: boolean;
};

export function StaffNewOrderAlertBanner({ orders, onAcknowledgeAll, showVisualFallback }: Props) {
  if (orders.length === 0) return null;

  return (
    <div
      role="alert"
      className="bd-new-order-banner relative overflow-hidden rounded-2xl border-2 border-[var(--accent-red)] bg-gradient-to-r from-[var(--accent-red)] via-[color-mix(in_oklab,var(--brand-gold)_75%,var(--accent-red))] to-[var(--brand-gold)] px-5 py-4 shadow-[0_0_32px_rgba(165,66,43,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/10" aria-hidden />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--brand-brown)]">
            New order
          </p>
          <h3 className="font-display text-3xl text-[var(--brand-brown)] sm:text-4xl">
            {orders.length === 1 ? "Incoming ticket!" : `${orders.length} new orders!`}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-brown)]/90">
            {orders.map((o) => o.code).join(" · ")}
          </p>
          {showVisualFallback && (
            <p className="mt-2 text-xs font-medium text-[var(--brand-brown)]/80">
              Visual alert active — enable speakers or use desktop notifications if needed.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onAcknowledgeAll}
          className="shrink-0 rounded-full bg-[var(--brand-brown)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--bg-cream)] shadow-lg ring-2 ring-white/30 transition hover:brightness-110"
        >
          Acknowledge {orders.length > 1 ? "all" : "order"}
        </button>
      </div>
    </div>
  );
}
