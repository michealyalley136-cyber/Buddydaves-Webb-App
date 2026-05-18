"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { MENU_IMAGES } from "@/lib/menu-images";

type Props = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  pendingNote?: string | null;
};

export function MenuItemCard({ id, name, description, price, imageUrl, pendingNote }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const src = imageUrl ?? MENU_IMAGES.phillyCheesesteak;

  function handleAdd() {
    addItem({ menuItemId: id, name, price, imageUrl });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="card-diner group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(44,36,28,0.12)]">
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand-brown)]/35 via-transparent to-transparent opacity-80" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl tracking-wide text-[var(--brand-brown)]">{name}</h3>
          <p className="shrink-0 rounded-full bg-[var(--brand-gold)]/25 px-3 py-1 text-sm font-bold text-[var(--brand-brown)] ring-1 ring-[var(--brand-gold)]/40">
            ${price.toFixed(2)}
          </p>
        </div>
        {description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{description}</p>
        )}
        {pendingNote && (
          <p className="mt-2 rounded-lg bg-[color-mix(in_oklab,var(--brand-gold)_12%,white)] px-2.5 py-1.5 text-[11px] font-medium leading-snug text-[var(--brand-brown)] ring-1 ring-[var(--brand-gold)]/30">
            {pendingNote}
          </p>
        )}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={handleAdd}
            className="relative z-10 w-full cursor-pointer rounded-full bg-[var(--brand-teal)] py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lift ring-1 ring-black/10 transition hover:bg-[var(--brand-teal-deep)] active:scale-[0.98]"
          >
            {added ? "Added to cart ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
