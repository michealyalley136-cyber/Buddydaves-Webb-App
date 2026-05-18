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
          body="Let's fix that — cheesesteaks, cheese curds, and fresh root beer are waiting on the menu."
          cta={{ href: "/menu", label: "Continue shopping" }}
        />
      </div>
    );
  }

  return (
    <div className="layout-page-narrow pb-28 sm:pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl text-[var(--brand-brown)] sm:text-5xl">Your cart</h1>
        <Link
          href="/menu"
          className="text-sm font-bold uppercase tracking-wide text-teal hover:underline"
        >
          Continue shopping
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink/70 sm:text-base">
        Review items before checkout. Pay in store at pickup.
      </p>
      <div className="mt-6 space-y-4 sm:mt-8">
        {lines.map((l) => (
          <div
            key={l.menuItemId}
            className="flex gap-3 rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-3 shadow-sm sm:gap-4 sm:p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
              <Image
                src={l.imageUrl ?? MENU_IMAGES.phillyCheesesteak}
                alt={l.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <p className="font-semibold leading-snug text-[var(--brand-brown)]">{l.name}</p>
                <p className="shrink-0 font-bold">${(l.price * l.quantity).toFixed(2)}</p>
              </div>
              <p className="text-sm text-ink/60">${l.price.toFixed(2)} each</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease ${l.name} quantity`}
                  className="h-9 w-9 rounded-full bg-black/5 text-lg font-bold"
                  onClick={() => setQty(l.menuItemId, l.quantity - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold">{l.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${l.name} quantity`}
                  className="h-9 w-9 rounded-full bg-black/5 text-lg font-bold"
                  onClick={() => setQty(l.menuItemId, l.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeLine(l.menuItemId)}
                  className="ml-auto text-xs font-bold uppercase tracking-wide text-[var(--accent-red)]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 hidden items-center justify-between rounded-2xl border border-[var(--line-subtle)] bg-white/70 px-5 py-4 sm:flex">
        <span className="text-sm font-semibold text-ink/70">Subtotal</span>
        <span className="font-display text-3xl text-[var(--brand-brown)]">${subtotal.toFixed(2)}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-6 hidden w-full items-center justify-center rounded-full bg-[var(--brand-gold)] py-4 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10 sm:flex"
      >
        Proceed to checkout
      </Link>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-subtle)] bg-[var(--card-bg)]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/55">Subtotal</p>
            <p className="font-display text-2xl text-[var(--brand-brown)]">${subtotal.toFixed(2)}</p>
          </div>
          <Link
            href="/checkout"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10 sm:flex-none sm:px-10"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
