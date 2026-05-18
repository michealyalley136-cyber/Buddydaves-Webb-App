"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

/** Sticky cart / checkout actions on the menu page. */
export function MenuCartBar() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  const checkoutHref = count > 0 ? "/checkout" : "/cart";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-subtle)] bg-[var(--card-bg)]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/55">
            {count} item{count === 1 ? "" : "s"} in cart
          </p>
          <p className="font-display text-2xl text-[var(--brand-brown)]">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex flex-1 gap-2 sm:flex-none">
          <Link
            href="/cart"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[var(--line-subtle)] bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-teal sm:flex-none"
          >
            View cart
          </Link>
          <Link
            href={checkoutHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10 sm:flex-none"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
