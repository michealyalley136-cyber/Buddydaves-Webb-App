"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiGet, type TrackOrderResponse } from "@/lib/api";
import { OrderTimeline } from "@/components/order-timeline";
import { PickupCodeCallout } from "@/components/pickup-code-callout";

function statusLabel(status: string) {
  switch (status) {
    case "READY":
      return "Ready for pickup";
    case "PREPARING":
      return "Preparing";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Received";
  }
}

export function TrackOrderBody() {
  const sp = useSearchParams();
  const initial = sp.get("code") ?? "";
  const [query, setQuery] = useState(initial);
  const [data, setData] = useState<TrackOrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (c: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<TrackOrderResponse>(`/api/orders/${encodeURIComponent(c)}`);
      setData(res);
      setQuery(res.code);
    } catch {
      setData(null);
      setError("Order not found. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial) void fetchOrder(initial);
  }, [initial, fetchOrder]);

  useEffect(() => {
    if (!data?.code) return;
    const id = window.setInterval(() => {
      void fetchOrder(data.code);
    }, 12000);
    return () => window.clearInterval(id);
  }, [data?.code, fetchOrder]);

  const eta = useMemo(() => {
    if (!data?.pickupTime) return "ASAP";
    return data.pickupTime;
  }, [data]);

  return (
    <div className="layout-page-tight">
      <div className="mb-6 flex justify-end">
        <Link href="/menu" className="text-sm font-medium text-teal hover:underline">
          Back to menu
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-5 sm:p-6">
        <p className="eyebrow">Track order</p>
        <h1 className="page-title !mt-2">Order status</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Enter the code from your confirmation screen or receipt.
        </p>
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) void fetchOrder(query.trim());
          }}
        >
          <input
            className="input-field !mt-0 flex-1 font-mono uppercase tracking-wider sm:flex-1"
            placeholder="BD-000000-0000"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading || !query.trim()} className="btn-primary min-h-[42px] sm:shrink-0">
            {loading ? "Searching…" : "Track"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-[var(--accent-red)]">{error}</p>}
      </div>

      {data && (
        <div className="mt-8 space-y-6">
          <PickupCodeCallout code={data.code} orderType={data.orderType} />

          <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">Details</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Status</dt>
                <dd className="font-medium text-[var(--brand-brown)]">{statusLabel(data.status)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Pickup time</dt>
                <dd className="font-medium">{eta}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Type</dt>
                <dd className="font-medium">
                  {data.orderType === "drive_thru" ? "Drive-thru" : "Pickup"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Total at pickup</dt>
                <dd className="font-semibold text-[var(--brand-brown)]">${data.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {data.items.length > 0 && (
            <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Items</p>
              <ul className="mt-3 divide-y divide-[var(--line-subtle)] text-sm">
                {data.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3 py-2.5">
                    <span>
                      <span className="font-semibold text-[var(--brand-brown)]">{i.quantity}×</span> {i.name}
                    </span>
                    <span className="font-medium">${(i.price * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <OrderTimeline status={data.status} />

          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-cream)]/40 p-5 text-sm text-[var(--text-muted)]">
            <p className="font-medium text-[var(--brand-brown)]">{data.customerName}</p>
            <p>{data.phone}</p>
            <p className="mt-3 text-xs">Status refreshes automatically every few seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
}
