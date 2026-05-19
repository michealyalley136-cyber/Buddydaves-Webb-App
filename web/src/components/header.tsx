"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { LogoMark } from "./logo-mark";
import { useCart } from "@/context/cart-context";

type NavItem = {
  href: string;
  label: string;
  alsoActive?: string[];
};

function NavLink({
  href,
  label,
  alsoActive,
  onNavigate,
}: {
  href: string;
  label: string;
  alsoActive?: string[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (alsoActive?.includes(pathname) ?? false);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        "rounded-md px-3 py-2 text-sm font-medium transition whitespace-nowrap",
        active
          ? "bg-white/15 text-white"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const orderHref = count > 0 ? "/checkout" : "/menu";

  const links: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/menu", label: "Menu" },
      { href: orderHref, label: "Order", alsoActive: ["/cart", "/checkout"] },
      { href: "/track-order", label: "Track Order" },
      { href: "/our-story", label: "Our Story" },
      { href: "/contact", label: "Contact" },
    ],
    [orderHref]
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-[var(--brand-teal)]">
      <div className="mx-auto flex min-h-[4rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LogoMark className="shrink-0" fallbackClassName="text-[var(--bg-cream)]" />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {links.map((l) => (
            <NavLink key={l.label} href={l.href} label={l.label} alsoActive={l.alsoActive} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/menu"
            className="hidden rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:inline-flex"
          >
            View Menu
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-[var(--brand-brown)] text-white transition hover:bg-[var(--brand-brown)]/90"
            aria-label={count > 0 ? `View cart (${count} items)` : "View cart"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 7h15l-1.5 9H7.5L6 7Zm0 0L5 3H2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
              <circle cx="17" cy="19" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent-red)] px-1 text-[10px] font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[44] bg-black/40 lg:hidden"
            onClick={closeMenu}
          />
          <aside
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 right-0 z-[45] flex w-[min(100%,18rem)] flex-col border-l border-white/10 bg-[var(--brand-teal-deep)] shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <LogoMark size="sm" linked={false} fallbackClassName="text-[var(--bg-cream)]" />
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={closeMenu}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Main navigation">
              {links.map((l) => {
                const active =
                  pathname === l.href || (l.alsoActive?.includes(pathname) ?? false);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeMenu}
                    className={clsx(
                      "rounded-lg px-4 py-3 text-base font-medium transition",
                      active ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/10 p-4">
              <Link
                href="/menu"
                onClick={closeMenu}
                className="btn-gold flex w-full justify-center"
              >
                View Menu
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
