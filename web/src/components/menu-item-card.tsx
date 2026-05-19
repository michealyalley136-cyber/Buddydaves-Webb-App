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
    <article className="card-surface-hover flex h-full flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-cream)]">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition duration-300 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-normal leading-snug text-[var(--brand-brown)]">{name}</h3>
          <p className="shrink-0 text-sm font-semibold text-teal">${price.toFixed(2)}</p>
        </div>
        {description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
        )}
        {pendingNote && (
          <p className="mt-2 rounded-md bg-[color-mix(in_oklab,var(--brand-gold)_10%,white)] px-2.5 py-1.5 text-xs text-[var(--brand-brown)]">
            {pendingNote}
          </p>
        )}
        <div className="mt-auto pt-4">
          <button type="button" onClick={handleAdd} className="btn-primary w-full">
            {added ? "Added" : "Add to order"}
          </button>
        </div>
      </div>
    </article>
  );
}
