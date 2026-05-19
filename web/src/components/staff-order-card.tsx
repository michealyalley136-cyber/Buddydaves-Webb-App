"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

export type StaffOrderRow = {
  id: string;
  code: string;
  status: string;
  orderType: string;
  customerName: string;
  phone: string;
  pickupTime: string | null;
  notes: string | null;
  total: number;
  createdAt: string;
  itemCount: number;
};

const badge: Record<string, string> = {
  PENDING:
    "bg-[var(--brand-gold)] text-[var(--brand-brown)] ring-2 ring-[var(--brand-gold)] shadow-[0_0_12px_rgba(212,160,23,0.5)]",
  PREPARING: "bg-[var(--brand-teal)] text-white ring-2 ring-[var(--brand-teal)]",
  READY: "bg-[var(--accent-red)] text-white ring-2 ring-[var(--accent-red)]",
  COMPLETED: "bg-white/15 text-white/70 ring-1 ring-white/20",
  CANCELLED: "bg-black/30 text-white/50 ring-1 ring-white/10",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StaffOrderCard({
  order,
  onStatus,
  busy,
  isAlerting = false,
  onAcknowledge,
  kitchenMode = false,
}: {
  order: StaffOrderRow;
  onStatus: (id: string, status: string) => void;
  busy?: string | null;
  isAlerting?: boolean;
  onAcknowledge?: (id: string) => void;
  kitchenMode?: boolean;
}) {
  const typeLabel = order.orderType === "drive_thru" ? "Drive-Thru" : "Pickup";
  const isPending = order.status === "PENDING";
  const btn =
    "rounded-2xl font-bold uppercase tracking-wide shadow-md transition active:scale-[0.98] disabled:opacity-50 min-h-[48px] touch-manipulation";
  const btnSm = kitchenMode
    ? `${btn} px-6 py-4 text-base sm:text-lg`
    : `${btn} px-5 py-3 text-sm`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "rounded-2xl border bg-[#1b1f24] text-white shadow-diner transition",
        kitchenMode ? "p-6 sm:p-8" : "p-5",
        isAlerting
          ? "bd-order-card-alert border-[var(--accent-red)] ring-4 ring-[var(--brand-gold)]"
          : isPending
            ? "border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/50"
            : "border-white/15"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {(isAlerting || isPending) && (
            <p
              className={clsx(
                "mb-3 inline-flex rounded-full px-4 py-1.5 font-bold uppercase tracking-widest",
                kitchenMode ? "text-sm" : "text-[10px]",
                isAlerting
                  ? "animate-pulse bg-[var(--accent-red)] text-white"
                  : "bg-[var(--brand-gold)] text-[var(--brand-brown)]"
              )}
            >
              {isAlerting ? "NEW ORDER" : "Pending"}
            </p>
          )}
          <p
            className={clsx(
              "font-display tracking-wide text-[var(--bg-cream)]",
              kitchenMode ? "text-5xl sm:text-6xl" : "text-3xl"
            )}
          >
            {order.code}
          </p>
          <p className={clsx("mt-2 font-semibold text-white/85", kitchenMode ? "text-lg" : "text-sm")}>
            {order.customerName} · {order.phone}
          </p>
        </div>
        <span
          className={clsx(
            "shrink-0 rounded-full px-4 py-2 font-bold uppercase tracking-widest",
            kitchenMode ? "text-sm" : "text-[11px]",
            badge[order.status] ?? badge.PENDING
          )}
        >
          {statusLabel[order.status] ?? order.status}
        </span>
      </div>

      <div
        className={clsx(
          "mt-5 grid gap-3 font-semibold text-white/90",
          kitchenMode ? "text-lg sm:grid-cols-2" : "text-sm sm:grid-cols-2"
        )}
      >
        <p>
          <span className="text-white/50">Type</span> · {typeLabel}
        </p>
        <p>
          <span className="text-white/50">Pickup</span> · {order.pickupTime ?? "ASAP"}
        </p>
        <p>
          <span className="text-white/50">Items</span> · {order.itemCount}
        </p>
        <p>
          <span className="text-white/50">Total</span> · ${order.total.toFixed(2)}{" "}
          <span className="text-white/50">(pay in store)</span>
        </p>
      </div>

      {order.notes && (
        <p
          className={clsx(
            "mt-4 rounded-xl bg-black/35 font-medium text-white",
            kitchenMode ? "px-4 py-3 text-lg" : "px-3 py-2 text-sm"
          )}
        >
          Note: {order.notes}
        </p>
      )}

      <div className={clsx("mt-6 flex flex-wrap gap-3", kitchenMode && "gap-4")}>
        {isAlerting && onAcknowledge && (
          <button
            type="button"
            onClick={() => onAcknowledge(order.id)}
            className={clsx(
              btnSm,
              "bg-[var(--brand-gold)] text-[var(--brand-brown)] ring-4 ring-white/30"
            )}
          >
            Acknowledge order
          </button>
        )}
        {order.status === "PENDING" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "PREPARING")}
            className={clsx(btnSm, "bg-[var(--brand-teal)] text-white ring-2 ring-white/20")}
          >
            {busy === order.id ? "Updating…" : "Start preparing →"}
          </button>
        )}
        {order.status === "PREPARING" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "READY")}
            className={clsx(btnSm, "bg-[var(--brand-gold)] text-[var(--brand-brown)]")}
          >
            {busy === order.id ? "Updating…" : "Mark ready →"}
          </button>
        )}
        {order.status === "READY" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "COMPLETED")}
            className={clsx(btnSm, "bg-white text-[var(--brand-brown)]")}
          >
            {busy === order.id ? "Updating…" : "Mark completed →"}
          </button>
        )}
        {!kitchenMode && (
          <Link
            href={`/track-order?code=${encodeURIComponent(order.code)}`}
            className={clsx(btnSm, "border border-white/20 bg-transparent text-white/90")}
          >
            Customer view
          </Link>
        )}
      </div>
    </motion.article>
  );
}
