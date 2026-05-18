"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin sections"
      className="border-b border-[var(--line-subtle)] bg-[var(--card-bg)] md:hidden"
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ADMIN_NAV_LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ring-1 transition",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand-teal)_14%,white)] text-teal ring-teal/25"
                  : "bg-white/80 text-ink/75 ring-black/10 hover:bg-white"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 self-start border-r border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 md:block">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">Admin</p>
      <p className="mt-2 font-display text-3xl text-[var(--brand-brown)]">Buddy Dave&apos;s</p>
      <nav className="mt-8 space-y-1" aria-label="Admin sections">
        {ADMIN_NAV_LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                active ? "bg-[color-mix(in_oklab,var(--brand-teal)_12%,white)] text-teal" : "text-ink/75 hover:bg-black/5"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
