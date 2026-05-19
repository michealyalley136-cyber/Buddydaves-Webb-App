"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

/** Sticky cart / checkout actions on the menu page. */
export function MenuCartBar() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-subtle)] bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            {count} item{count === 1 ? "" : "s"}
          </p>
          <p className="text-lg font-semibold text-[var(--brand-brown)]">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/cart" className="btn-secondary min-h-11 px-4">
            Cart
          </Link>
          <Link href="/checkout" className="btn-gold min-h-11 px-6">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
