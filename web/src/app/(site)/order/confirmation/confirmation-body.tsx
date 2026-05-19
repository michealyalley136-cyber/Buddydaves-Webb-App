"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadLastOrder, type LastOrderSnapshot } from "@/lib/last-order";
import { PickupCodeCallout } from "@/components/pickup-code-callout";

export function ConfirmationBody() {
  const sp = useSearchParams();
  const code = sp.get("code");
  const [order, setOrder] = useState<LastOrderSnapshot | null>(null);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, [code]);

  if (!code) {
    return (
      <div className="layout-page-narrow max-w-2xl">
        <p className="eyebrow">Confirmation</p>
        <h1 className="page-title">Order code missing</h1>
        <p className="page-lead">If you just placed an order, use the link from your confirmation or track below.</p>
        <Link href="/track-order" className="mt-6 inline-flex text-sm font-medium text-teal hover:underline">
          Track an order
        </Link>
      </div>
    );
  }

  const items = order?.code === code ? order.items : [];
  const orderType = order?.code === code ? order.orderType : null;

  return (
    <div className="layout-page-narrow max-w-2xl">
      <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-6 sm:p-8">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="page-title !mt-2">Thank you for your order</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Save your order code below. Show it at pickup or the drive-thru window.
        </p>

        <PickupCodeCallout code={code} orderType={orderType} className="mt-8" />

        <div className="mt-6 rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-cream)]/50 px-4 py-4 text-left text-sm text-[var(--text-muted)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Next steps</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Head to Buddy Dave&apos;s when you&apos;re ready.</li>
            <li>Show your order code at the counter or window.</li>
            <li>Pay in store — cash or card.</li>
          </ol>
        </div>

        {items.length > 0 && (
          <div className="mt-6 rounded-lg border border-[var(--line-subtle)] px-4 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">Order summary</p>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>
                    <span className="font-semibold text-[var(--brand-brown)]">{i.quantity}×</span> {i.name}
                  </span>
                  <span className="shrink-0 font-medium">${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {order && (
              <p className="mt-3 border-t border-[var(--line-subtle)] pt-3 text-right text-lg font-semibold text-[var(--brand-brown)]">
                ${order.total.toFixed(2)} due at pickup
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/track-order?code=${encodeURIComponent(code)}`}
            className="btn-gold flex-1 justify-center"
          >
            Track order
          </Link>
          <Link href="/menu" className="btn-secondary flex-1 justify-center">
            Order again
          </Link>
        </div>
      </div>
    </div>
  );
}
