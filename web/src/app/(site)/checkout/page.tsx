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
        "relative rounded-2xl border-2 px-4 py-4 text-left transition",
        selected
          ? "border-[var(--brand-teal)] bg-[color-mix(in_oklab,var(--brand-teal)_12%,white)] shadow-md ring-2 ring-teal/25"
          : "border-[var(--line-subtle)] bg-white/70 hover:border-teal/30 hover:bg-white"
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-teal)] text-xs font-bold text-white">
          ✓
        </span>
      )}
      <p className="font-display text-2xl text-[var(--brand-brown)]">{title}</p>
      <p className="mt-1 text-sm text-ink/65">{subtitle}</p>
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
          title="Nothing to checkout yet"
          body="Add a few favorites from the menu — we'll have the kitchen ready."
          cta={{ href: "/menu", label: "Back to Menu" }}
        />
      </div>
    );
  }

  async function submit() {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone so we can reach you.");
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
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal">Checkout</p>
        <Link href="/menu" className="text-sm font-bold uppercase tracking-wide text-teal hover:underline">
          Back to menu
        </Link>
      </div>
      <h1 className="mt-2 font-display text-4xl text-[var(--brand-brown)] sm:text-5xl">Almost there</h1>

      <div className="mt-6 rounded-2xl border-2 border-[var(--brand-gold)] bg-[color-mix(in_oklab,var(--brand-gold)_20%,white)] px-5 py-4 text-center shadow-sm ring-1 ring-[var(--brand-gold)]/40">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-brown)]">
          Pay in store only
        </p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/85">
          Cash or card at pickup or the drive-thru window — we&apos;ll total your order when you arrive.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--line-subtle)] bg-white/80 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Your order</p>
        <ul className="mt-3 divide-y divide-[var(--line-subtle)]">
          {lines.map((l) => (
            <li key={l.menuItemId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="text-ink/80">
                <span className="font-bold text-[var(--brand-brown)]">{l.quantity}×</span> {l.name}
              </span>
              <span className="shrink-0 font-semibold">${(l.price * l.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--line-subtle)] pt-3">
          <span className="text-sm font-semibold text-ink/70">Subtotal due at pickup</span>
          <span className="font-display text-2xl text-[var(--brand-brown)]">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-lift sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Step 1 · How are you picking up?</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <OrderTypeOption
            selected={orderType === "pickup"}
            title="Pickup"
            subtitle="Counter or curbside — we'll call your name."
            onSelect={() => setOrderType("pickup")}
          />
          <OrderTypeOption
            selected={orderType === "drive_thru"}
            title="Drive-Thru"
            subtitle="Stay in your car — we'll hand it through the window."
            onSelect={() => setOrderType("drive_thru")}
          />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-teal">Step 2 · Your details</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink/80">
            Name
            <input
              className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block text-sm font-semibold text-ink/80">
            Phone
            <input
              className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold text-ink/80">
          Pickup time <span className="font-normal text-ink/50">(optional)</span>
          <input
            className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
            placeholder="e.g. 5:45 PM"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink/80">
          Notes <span className="font-normal text-ink/50">(optional)</span>
          <textarea
            className="mt-2 min-h-[96px] w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-[color-mix(in_oklab,var(--accent-red)_12%,white)] px-3 py-2 text-sm text-[var(--accent-red)]">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="mt-8 w-full rounded-full bg-[var(--brand-teal)] py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lift ring-1 ring-black/10 disabled:opacity-60"
        >
          {busy ? "Placing order…" : "Place order"}
        </button>
        <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-teal hover:underline">
          Back to cart
        </Link>
      </div>
    </div>
  );
}
