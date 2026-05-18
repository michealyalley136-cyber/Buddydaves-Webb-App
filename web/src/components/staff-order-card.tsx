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
  PENDING: "bg-[color-mix(in_oklab,var(--brand-gold)_35%,white)] text-[var(--brand-brown)] ring-[var(--brand-gold)]/50",
  PREPARING: "bg-[color-mix(in_oklab,var(--brand-teal)_18%,white)] text-teal ring-teal/30",
  READY: "bg-[color-mix(in_oklab,var(--accent-red)_14%,white)] text-[var(--accent-red)] ring-[var(--accent-red)]/35",
  COMPLETED: "bg-black/5 text-ink/60 ring-black/10",
  CANCELLED: "bg-black/10 text-ink/50 ring-black/10",
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
}: {
  order: StaffOrderRow;
  onStatus: (id: string, status: string) => void;
  busy?: string | null;
  isAlerting?: boolean;
  onAcknowledge?: (id: string) => void;
}) {
  const typeLabel = order.orderType === "drive_thru" ? "Drive-Thru" : "Pickup";
  const isPending = order.status === "PENDING";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "rounded-2xl border bg-[#1b1f24] p-5 text-white shadow-diner transition",
        isAlerting
          ? "bd-order-card-alert border-[var(--accent-red)] ring-4 ring-[var(--brand-gold)]/60"
          : isPending
            ? "border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/40"
            : "border-white/10"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {(isAlerting || isPending) && (
            <p
              className={clsx(
                "mb-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                isAlerting
                  ? "animate-pulse bg-[var(--accent-red)] text-[var(--bg-cream)]"
                  : "bg-[var(--brand-gold)] text-[var(--brand-brown)]"
              )}
            >
              {isAlerting ? "New order!" : "Pending"}
            </p>
          )}
          <p className="font-display text-3xl tracking-wide text-[var(--bg-cream)]">{order.code}</p>
          <p className="mt-1 text-sm text-white/70">
            {order.customerName} · {order.phone}
          </p>
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ring-1",
            badge[order.status] ?? badge.PENDING
          )}
        >
          {statusLabel[order.status] ?? order.status}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
        <p>
          <span className="text-white/45">Type</span> · {typeLabel}
        </p>
        <p>
          <span className="text-white/45">Pickup</span> · {order.pickupTime ?? "ASAP"}
        </p>
        <p>
          <span className="text-white/45">Items</span> · {order.itemCount}
        </p>
        <p>
          <span className="text-white/45">Total</span> · ${order.total.toFixed(2)}{" "}
          <span className="text-white/45">(pay in store)</span>
        </p>
      </div>
      {order.notes && (
        <p className="mt-3 rounded-xl bg-black/25 px-3 py-2 text-sm text-white/85">Note: {order.notes}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {isAlerting && onAcknowledge && (
          <button
            type="button"
            onClick={() => onAcknowledge(order.id)}
            className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-md ring-2 ring-white/20"
          >
            Acknowledge
          </button>
        )}
        {order.status === "PENDING" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "PREPARING")}
            className="rounded-full bg-[var(--brand-teal)] px-4 py-2 text-xs font-bold uppercase tracking-wide ring-1 ring-white/10 disabled:opacity-50"
          >
            {busy === order.id ? "Updating…" : "Start preparing →"}
          </button>
        )}
        {order.status === "PREPARING" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "READY")}
            className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] ring-1 ring-black/10 disabled:opacity-50"
          >
            {busy === order.id ? "Updating…" : "Mark ready →"}
          </button>
        )}
        {order.status === "READY" && (
          <button
            type="button"
            disabled={busy === order.id}
            onClick={() => onStatus(order.id, "COMPLETED")}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] ring-1 ring-black/10 disabled:opacity-50"
          >
            {busy === order.id ? "Updating…" : "Mark completed →"}
          </button>
        )}
        <Link
          href={`/track-order?code=${encodeURIComponent(order.code)}`}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/85 hover:bg-white/5"
        >
          Customer view
        </Link>
      </div>
    </motion.article>
  );
}
