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
      .catch(() => setErr("We couldn't load the menu. Check your connection and try again."));
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
          <p className="eyebrow">Menu</p>
          <h1 className="page-title">Order online</h1>
          <p className="page-lead">
            Select your items below. Pay in store when you pick up or use the drive-thru.
          </p>
          <OwnerPendingNote variant="banner">{PHOTOS_PENDING_NOTE}</OwnerPendingNote>
        </div>
        <div className="mt-8">
          <CategoryPills pills={pills} active={active} onChange={setActive} />
        </div>
        {err && (
          <p className="mt-8 rounded-lg border border-[var(--accent-red)]/25 bg-[color-mix(in_oklab,var(--accent-red)_8%,white)] px-4 py-3 text-sm text-[var(--accent-red)]">
            {err}
          </p>
        )}
        {!data && !err && <MenuGridSkeleton />}
        {data && items.length === 0 && (
          <p className="mt-10 rounded-lg border border-[var(--line-subtle)] bg-white px-5 py-8 text-center text-sm text-[var(--text-muted)]">
            No items in this category. Select &ldquo;All&rdquo; to see the full menu.
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
