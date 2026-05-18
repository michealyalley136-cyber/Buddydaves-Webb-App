"use client";

import { useEffect, useState } from "react";
import { useStaffAuth } from "@/context/staff-auth-context";
import { apiGet } from "@/lib/api";
import { AdminTable } from "@/components/admin-table";

type Category = { id: string; name: string; slug: string; active: boolean; sortOrder: number; itemCount: number };

export default function AdminCategoriesPage() {
  const { token } = useStaffAuth();
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<{ categories: Category[] }>("/api/admin/categories", token)
      .then((r) => setCategories(r.categories))
      .catch(() => setCategories([]));
  }, [token]);

  if (!categories) return <p className="text-sm text-ink/60">Loading categories…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-[var(--brand-brown)]">Categories</h1>
        <p className="mt-2 text-sm text-ink/70">
          Category ordering and visibility controls can extend the API when you&apos;re ready — today this
          is a read-only audit of what&apos;s on the board.
        </p>
      </div>
      <AdminTable
        columns={[
          { key: "name", label: "Name" },
          { key: "slug", label: "Slug" },
          { key: "items", label: "Items" },
          { key: "active", label: "Active" },
        ]}
        rows={categories.map((c) => ({
          name: c.name,
          slug: <code className="text-xs">{c.slug}</code>,
          items: String(c.itemCount),
          active: c.active ? "Yes" : "No",
        }))}
      />
    </div>
  );
}
