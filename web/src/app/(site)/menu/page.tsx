"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryPills } from "@/components/category-pills";
import { MenuItemCard } from "@/components/menu-item-card";
import { MenuGridSkeleton } from "@/components/loading-skeletons";
import { apiGet, type MenuCategoryDto, type MenuResponse } from "@/lib/api";
import {
  getMenuItemPendingNote,
  isApprovedMenuItemName,
  PHOTOS_PENDING_NOTE,
} from "@/lib/approved-menu";
import { OwnerPendingNote } from "@/components/owner-pending-note";
import { MenuCartBar } from "@/components/menu-cart-bar";
import { useCart } from "@/context/cart-context";

export default function MenuPage() {
  const { count } = useCart();
  const [data, setData] = useState<MenuCategoryDto[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [active, setActive] = useState("all");

  useEffect(() => {
    apiGet<MenuResponse>("/api/menu")
      .then((r) =>
        setData(
          r.categories
            .map((c) => ({
              ...c,
              items: c.items.filter((i) => isApprovedMenuItemName(i.name)),
            }))
            .filter((c) => c.items.length > 0)
        )
      )
      .catch(() => setErr("We couldn’t load the menu. Check your connection and try again."));
  }, []);

  const pills = useMemo(() => {
    const base = [{ id: "all", label: "All" }];
    if (!data) return base;
    return [...base, ...data.map((c) => ({ id: c.slug, label: c.name }))];
  }, [data]);

  const items = useMemo(() => {
    if (!data) return [];
    if (active === "all") return data.flatMap((c) => c.items);
    const cat = data.find((c) => c.slug === active);
    return cat?.items ?? [];
  }, [data, active]);

  return (
    <>
    <div className={count > 0 ? "layout-page pb-28" : "layout-page"}>
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Menu</p>
        <h1 className="mt-2 font-display text-5xl text-[var(--brand-brown)] md:text-6xl">Order your favorites</h1>
        <p className="mt-4 text-ink/70">
          Pickup or drive-thru — pay in store when you arrive. Five house favorites, ready to order.
        </p>
        <OwnerPendingNote variant="banner">{PHOTOS_PENDING_NOTE}</OwnerPendingNote>
      </div>
      <div className="mt-8">
        <CategoryPills pills={pills} active={active} onChange={setActive} />
      </div>
      {err && (
        <p className="mt-8 rounded-2xl border border-[var(--accent-red)]/30 bg-[color-mix(in_oklab,var(--accent-red)_10%,white)] px-4 py-3 text-sm text-[var(--accent-red)]">
          {err}
        </p>
      )}
      {!data && !err && <MenuGridSkeleton />}
      {data && items.length === 0 && (
        <p className="mt-10 rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] px-5 py-8 text-center text-sm text-ink/70">
          No items in this category right now. Try &ldquo;All&rdquo; to see the full menu.
        </p>
      )}
      {data && items.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <MenuItemCard
              key={i.id}
              id={i.id}
              name={i.name}
              description={i.description}
              price={i.price}
              imageUrl={i.imageUrl}
              pendingNote={getMenuItemPendingNote(i.name)}
            />
          ))}
        </div>
      )}
    </div>
    <MenuCartBar />
    </>
  );
}
