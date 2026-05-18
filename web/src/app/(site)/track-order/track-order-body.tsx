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
      return "Preparing now";
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
      setError("We couldn't find that order. Double-check the code on your receipt.");
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
    if (!data?.pickupTime) return "ASAP — we'll text if anything changes.";
    return data.pickupTime;
  }, [data]);

  return (
    <div className="layout-page-tight">
      <div className="mb-4 flex justify-end">
        <Link href="/menu" className="text-sm font-bold uppercase tracking-wide text-teal hover:underline">
          Back to menu
        </Link>
      </div>
      <div className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-diner sm:p-6 md:p-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-teal">Track order</p>
        <h1 className="mt-2 text-center font-display text-3xl text-[var(--brand-brown)] sm:text-4xl">
          Where&apos;s my order?
        </h1>
        <p className="mt-2 text-center text-sm text-ink/65">
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
            className="flex-1 rounded-2xl border border-[var(--line-subtle)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-widest outline-none ring-teal/25 focus:ring-2"
            placeholder="BD-000000-0000"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-2xl bg-[var(--brand-brown)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--bg-cream)] disabled:opacity-50 sm:shrink-0"
          >
            {loading ? "Looking…" : "Track"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-sm text-[var(--accent-red)]">{error}</p>}
      </div>

      {data && (
        <div className="mt-8 space-y-6">
          <PickupCodeCallout code={data.code} orderType={data.orderType} />

          <div className="rounded-3xl border border-[var(--line-subtle)] bg-gradient-to-br from-white to-[color-mix(in_oklab,var(--bg-cream)_55%,white)] p-5 shadow-lift sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">Order details</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/75">
              <p>
                <span className="font-semibold text-ink">Status</span> · {statusLabel(data.status)}
              </p>
              <p>
                <span className="font-semibold text-ink">Pickup time</span> · {eta}
              </p>
              <p>
                <span className="font-semibold text-ink">Type</span> ·{" "}
                {data.orderType === "drive_thru" ? "Drive-Thru" : "Pickup"}
              </p>
              <p>
                <span className="font-semibold text-ink">Total at pickup</span> · ${data.total.toFixed(2)}
              </p>
            </div>
          </div>

          {data.items.length > 0 && (
            <div className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Your items</p>
              <ul className="mt-3 divide-y divide-[var(--line-subtle)] text-sm">
                {data.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3 py-2.5">
                    <span>
                      <span className="font-bold text-[var(--brand-brown)]">{i.quantity}×</span> {i.name}
                    </span>
                    <span className="shrink-0 font-semibold">${(i.price * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <OrderTimeline status={data.status} />

          <div className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 text-sm text-ink/75 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">We&apos;ve got you</p>
            <p className="mt-2 leading-relaxed">
              Questions about your order? Call the restaurant with your code handy — we&apos;re happy to
              help, neighbor.
            </p>
            <div className="mt-4 rounded-2xl bg-[color-mix(in_oklab,var(--brand-teal)_8%,white)] px-4 py-3 text-ink">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal/90">On file</p>
              <p className="mt-1 font-semibold text-[var(--brand-brown)]">{data.customerName}</p>
              <p className="text-sm">{data.phone}</p>
            </div>
          </div>
          <p className="text-center text-xs text-ink/50">Status updates automatically every few seconds.</p>
        </div>
      )}
    </div>
  );
}
