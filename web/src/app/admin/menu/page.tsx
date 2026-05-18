"use client";

import { useEffect, useMemo, useState } from "react";
import { useStaffAuth } from "@/context/staff-auth-context";
import { apiGet, apiSend } from "@/lib/api";
import { AdminTable } from "@/components/admin-table";

type Category = { id: string; name: string; slug: string; active: boolean; sortOrder: number; itemCount: number };
type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  categoryId: string;
  category: { name: string; slug: string };
};

export default function AdminMenuPage() {
  const { token } = useStaffAuth();
  const [items, setItems] = useState<Item[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
  });

  async function refresh() {
    if (!token) return;
    const [mi, cat] = await Promise.all([
      apiGet<{ items: Item[] }>("/api/admin/menu-items", token),
      apiGet<{ categories: Category[] }>("/api/admin/categories", token),
    ]);
    setItems(mi.items);
    setCategories(cat.categories);
    setForm((f) => ({
      ...f,
      categoryId: f.categoryId || cat.categories[0]?.id || "",
    }));
  }

  useEffect(() => {
    refresh().catch(() => setItems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function toggle(id: string, active: boolean) {
    setBusy(id);
    try {
      await apiSend(`/api/admin/menu-items/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ active: !active }),
      });
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this menu item?")) return;
    setBusy(id);
    try {
      await apiSend(`/api/admin/menu-items/${id}`, { method: "DELETE", token });
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const price = Number(form.price);
    if (!form.name.trim() || !form.categoryId || !(price > 0)) return;
    setBusy("new");
    try {
      await apiSend("/api/admin/menu-items", {
        method: "POST",
        token,
        body: JSON.stringify({
          categoryId: form.categoryId,
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price,
        }),
      });
      setForm((f) => ({ ...f, name: "", description: "", price: "" }));
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  const rows = useMemo(() => {
    if (!items) return [];
    return items.map((i) => ({
      name: (
        <div>
          <p className="font-semibold text-[var(--brand-brown)]">{i.name}</p>
          <p className="text-xs text-ink/55">{i.category.name}</p>
        </div>
      ),
      price: `$${i.price.toFixed(2)}`,
      active: i.active ? "Active" : "Hidden",
      actions: (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy === i.id}
            className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-wide"
            onClick={() => toggle(i.id, i.active)}
          >
            {i.active ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            disabled={busy === i.id}
            className="rounded-full bg-[color-mix(in_oklab,var(--accent-red)_12%,white)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-red)]"
            onClick={() => remove(i.id)}
          >
            Delete
          </button>
        </div>
      ),
    }));
  }, [items, busy]);

  if (!items) {
    return <p className="text-sm text-ink/60">Loading menu…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl text-[var(--brand-brown)]">Menu items</h1>
        <p className="mt-2 text-sm text-ink/70">Add, toggle, or remove items synced to the customer menu.</p>
      </div>

      <form
        onSubmit={createItem}
        className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 shadow-sm"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">New item</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-ink/80">
            Category
            <select
              className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-ink/80">
            Price (USD)
            <input
              className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="md:col-span-2 text-sm font-semibold text-ink/80">
            Name
            <input
              className="mt-2 w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="md:col-span-2 text-sm font-semibold text-ink/80">
            Description
            <textarea
              className="mt-2 min-h-[88px] w-full rounded-xl border border-[var(--line-subtle)] bg-white px-3 py-3 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy === "new"}
          className="mt-4 rounded-full bg-[var(--brand-teal)] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50"
        >
          {busy === "new" ? "Saving…" : "Add menu item"}
        </button>
      </form>

      <AdminTable
        columns={[
          { key: "name", label: "Item" },
          { key: "price", label: "Price" },
          { key: "active", label: "Status" },
          { key: "actions", label: "Actions", className: "w-[220px]" },
        ]}
        rows={rows}
      />
    </div>
  );
}
