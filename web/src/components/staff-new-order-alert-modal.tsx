"use client";

import clsx from "clsx";
import type { StaffOrderRow } from "@/components/staff-order-card";

type Props = {
  orders: StaffOrderRow[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
  kitchenMode?: boolean;
};

export function StaffNewOrderAlertModal({
  orders,
  onAcknowledge,
  onAcknowledgeAll,
  kitchenMode = false,
}: Props) {
  if (orders.length === 0) return null;

  const primary = orders[0];
  const btn = clsx(
    "w-full rounded-full font-bold uppercase tracking-wide shadow-diner touch-manipulation active:scale-[0.98]",
    kitchenMode ? "min-h-[56px] py-4 text-lg" : "py-3 text-sm"
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-order-modal-title"
    >
      <div
        className={clsx(
          "bd-new-order-modal relative w-full overflow-hidden border-4 border-[var(--brand-gold)] bg-[var(--card-bg)] shadow-2xl ring-8 ring-[var(--accent-red)]/50",
          kitchenMode ? "max-w-2xl rounded-3xl p-8 sm:p-10" : "max-w-md rounded-[1.5rem] p-6"
        )}
      >
        <p
          className={clsx(
            "text-center font-bold uppercase tracking-[0.3em] text-[var(--accent-red)]",
            kitchenMode ? "text-sm" : "text-xs"
          )}
        >
          New order
        </p>
        <h2
          id="new-order-modal-title"
          className={clsx(
            "mt-2 text-center font-display text-[var(--brand-brown)]",
            kitchenMode ? "text-6xl sm:text-7xl" : "text-4xl"
          )}
        >
          {primary.code}
        </h2>
        <p className={clsx("mt-3 text-center font-semibold text-ink/80", kitchenMode ? "text-xl" : "text-sm")}>
          {primary.customerName} · {primary.itemCount} item{primary.itemCount === 1 ? "" : "s"} · $
          {primary.total.toFixed(2)}
        </p>
        {orders.length > 1 && (
          <p className={clsx("mt-2 text-center font-bold text-ink/65", kitchenMode ? "text-base" : "text-xs")}>
            +{orders.length - 1} more waiting
          </p>
        )}
        <div className={clsx("mt-8 flex flex-col", kitchenMode ? "gap-4" : "gap-2")}>
          <button
            type="button"
            onClick={() => onAcknowledge(primary.id)}
            className={clsx(btn, "bg-[var(--brand-gold)] text-[var(--brand-brown)] ring-2 ring-black/10")}
          >
            Acknowledge &amp; dismiss
          </button>
          {orders.length > 1 && (
            <button
              type="button"
              onClick={onAcknowledgeAll}
              className={clsx(btn, "border-2 border-[var(--brand-teal)] bg-white text-teal")}
            >
              Acknowledge all ({orders.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
