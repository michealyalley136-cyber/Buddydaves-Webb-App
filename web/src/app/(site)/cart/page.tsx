"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { EmptyState } from "@/components/empty-states";
import { MENU_IMAGES } from "@/lib/menu-images";

export default function CartPage() {
  const { lines, subtotal, setQty, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <div className="layout-page-narrow">
        <EmptyState
          title="Your cart is empty"
          body="Browse the menu to add sandwiches, sides, and fresh root beer to your order."
          cta={{ href: "/menu", label: "View menu" }}
        />
      </div>
    );
  }

  return (
    <div className="layout-page-narrow pb-28 sm:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="page-title !mt-1">Your order</h1>
        </div>
        <Link href="/menu" className="text-sm font-medium text-teal hover:underline">
          Continue shopping
        </Link>
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Review items before checkout. Pay in store at pickup.</p>

      <ul className="mt-8 space-y-4">
        {lines.map((l) => (
          <li
            key={l.menuItemId}
            className="flex gap-4 rounded-xl border border-[var(--line-subtle)] bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-cream)]">
              <Image
                src={l.imageUrl ?? MENU_IMAGES.phillyCheesesteak}
                alt={l.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[var(--brand-brown)]">{l.name}</p>
                <p className="shrink-0 font-semibold">${(l.price * l.quantity).toFixed(2)}</p>
              </div>
              <p className="text-sm text-[var(--text-muted)]">${l.price.toFixed(2)} each</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease ${l.name} quantity`}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line-subtle)] text-lg font-medium hover:bg-[var(--bg-cream)]"
                  onClick={() => setQty(l.menuItemId, l.quantity - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${l.name} quantity`}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line-subtle)] text-lg font-medium hover:bg-[var(--bg-cream)]"
                  onClick={() => setQty(l.menuItemId, l.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeLine(l.menuItemId)}
                  className="ml-auto text-xs font-medium text-[var(--accent-red)] hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 hidden items-center justify-between rounded-xl border border-[var(--line-subtle)] bg-white px-5 py-4 sm:flex">
        <span className="text-sm font-medium text-[var(--text-muted)]">Subtotal</span>
        <span className="text-xl font-semibold text-[var(--brand-brown)]">${subtotal.toFixed(2)}</span>
      </div>

      <Link href="/checkout" className="btn-gold mt-6 hidden w-full justify-center sm:flex">
        Proceed to checkout
      </Link>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-subtle)] bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">Subtotal</p>
            <p className="text-xl font-semibold text-[var(--brand-brown)]">${subtotal.toFixed(2)}</p>
          </div>
          <Link href="/checkout" className="btn-gold min-h-11 flex-1 justify-center sm:flex-none sm:px-10">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
