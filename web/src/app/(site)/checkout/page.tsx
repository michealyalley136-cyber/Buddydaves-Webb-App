"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useCart } from "@/context/cart-context";
import { apiSend, type OrderPayload, type OrderResponse } from "@/lib/api";
import { EmptyState } from "@/components/empty-states";
import { saveLastOrder } from "@/lib/last-order";

function OrderTypeOption({
  selected,
  title,
  subtitle,
  onSelect,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "rounded-xl border-2 px-4 py-4 text-left transition",
        selected
          ? "border-[var(--brand-teal)] bg-[color-mix(in_oklab,var(--brand-teal)_8%,white)]"
          : "border-[var(--line-subtle)] bg-white hover:border-teal/25"
      )}
    >
      <p className="font-semibold text-[var(--brand-brown)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
    </button>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [orderType, setOrderType] = useState<"pickup" | "drive_thru">("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="layout-page-narrow">
        <EmptyState
          title="Nothing to checkout"
          body="Add items from the menu to place an order."
          cta={{ href: "/menu", label: "View menu" }}
        />
      </div>
    );
  }

  async function submit() {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setBusy(true);
    const payload: OrderPayload = {
      orderType,
      customerName: name.trim(),
      phone: phone.trim(),
      pickupTime: pickupTime.trim() || undefined,
      notes: notes.trim() || undefined,
      items: lines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
    };
    try {
      const res = await apiSend<OrderResponse>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      saveLastOrder({
        code: res.code,
        total: res.total,
        orderType: res.orderType,
        customerName: res.customerName,
        items: res.items,
      });
      clear();
      router.push(`/order/confirmation?code=${encodeURIComponent(res.code)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not place order.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="layout-page-narrow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="page-title !mt-1">Complete your order</h1>
        </div>
        <Link href="/menu" className="text-sm font-medium text-teal hover:underline">
          Back to menu
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--brand-gold)]/40 bg-[color-mix(in_oklab,var(--brand-gold)_12%,white)] px-5 py-4">
        <p className="text-sm font-semibold text-[var(--brand-brown)]">Pay in store only</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Cash or card at pickup or the drive-thru window. Your total is confirmed when you arrive.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--line-subtle)] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">Order summary</p>
        <ul className="mt-3 divide-y divide-[var(--line-subtle)]">
          {lines.map((l) => (
            <li key={l.menuItemId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--brand-brown)]">{l.quantity}×</span> {l.name}
              </span>
              <span className="shrink-0 font-medium">${(l.price * l.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--line-subtle)] pt-3">
          <span className="text-sm font-medium text-[var(--text-muted)]">Subtotal</span>
          <span className="text-lg font-semibold text-[var(--brand-brown)]">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-8 rounded-xl border border-[var(--line-subtle)] bg-white p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Pickup method</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <OrderTypeOption
              selected={orderType === "pickup"}
              title="Pickup"
              subtitle="Counter or curbside"
              onSelect={() => setOrderType("pickup")}
            />
            <OrderTypeOption
              selected={orderType === "drive_thru"}
              title="Drive-thru"
              subtitle="Stay in your vehicle"
              onSelect={() => setOrderType("drive_thru")}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Contact details</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--brand-brown)]">
              Name
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="block text-sm font-medium text-[var(--brand-brown)]">
              Phone
              <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium text-[var(--brand-brown)]">
            Preferred pickup time <span className="font-normal text-[var(--text-muted)]">(optional)</span>
            <input
              className="input-field"
              placeholder="e.g. 5:45 PM"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-[var(--brand-brown)]">
            Order notes <span className="font-normal text-[var(--text-muted)]">(optional)</span>
            <textarea
              className="input-field min-h-[96px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-[color-mix(in_oklab,var(--accent-red)_10%,white)] px-3 py-2 text-sm text-[var(--accent-red)]">
            {error}
          </p>
        )}

        <button type="button" disabled={busy} onClick={submit} className="btn-primary w-full disabled:opacity-60">
          {busy ? "Placing order…" : "Place order"}
        </button>
        <Link href="/cart" className="block text-center text-sm font-medium text-teal hover:underline">
          Back to cart
        </Link>
      </div>
    </div>
  );
}
