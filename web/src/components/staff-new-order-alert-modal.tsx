"use client";

import type { StaffOrderRow } from "@/components/staff-order-card";

type Props = {
  orders: StaffOrderRow[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
};

export function StaffNewOrderAlertModal({ orders, onAcknowledge, onAcknowledgeAll }: Props) {
  if (orders.length === 0) return null;

  const primary = orders[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-order-modal-title"
    >
      <div className="bd-new-order-modal relative w-full max-w-md overflow-hidden rounded-[1.5rem] border-4 border-[var(--brand-gold)] bg-[var(--card-bg)] p-6 shadow-2xl ring-4 ring-[var(--accent-red)]/40">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-red)]">
          New order
        </p>
        <h2
          id="new-order-modal-title"
          className="mt-2 text-center font-display text-4xl text-[var(--brand-brown)]"
        >
          {primary.code}
        </h2>
        <p className="mt-2 text-center text-sm text-ink/75">
          {primary.customerName} · {primary.itemCount} item{primary.itemCount === 1 ? "" : "s"} · $
          {primary.total.toFixed(2)}
        </p>
        {orders.length > 1 && (
          <p className="mt-2 text-center text-xs font-semibold text-ink/60">
            +{orders.length - 1} more waiting
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onAcknowledge(primary.id)}
            className="w-full rounded-full bg-[var(--brand-gold)] py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10"
          >
            Acknowledge &amp; dismiss
          </button>
          {orders.length > 1 && (
            <button
              type="button"
              onClick={onAcknowledgeAll}
              className="w-full rounded-full border-2 border-[var(--brand-teal)] py-3 text-sm font-bold uppercase tracking-wide text-teal"
            >
              Acknowledge all ({orders.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
