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
  compact,
}: {
  href: string;
  label: string;
  alsoActive?: string[];
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || (alsoActive?.includes(pathname) ?? false);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        "rounded-full font-semibold tracking-wide transition whitespace-nowrap",
        compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
        "text-[var(--bg-cream)]/90 hover:bg-white/10 hover:text-[var(--bg-cream)]",
        active && "bg-white/15 text-[var(--bg-cream)] ring-1 ring-white/25"
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
    <header className="sticky top-0 z-40 w-full border-b border-black/15 bg-[var(--brand-teal)] shadow-[0_6px_22px_rgba(0,0,0,0.2)]">
      <div className="mx-auto grid min-h-[3.75rem] max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 sm:min-h-[4.25rem] sm:gap-3 sm:px-5 lg:px-6">
        <LogoMark className="justify-self-start" fallbackClassName="text-[var(--bg-cream)]" />

        <nav className="relative z-50 hidden min-w-0 justify-center lg:flex" aria-label="Main navigation">
          <div className="flex flex-wrap items-center justify-center gap-0.5 lg:gap-1">
            {links.map((l) => (
              <NavLink
                key={l.label}
                href={l.href}
                label={l.label}
                alsoActive={l.alsoActive}
                compact
              />
            ))}
          </div>
        </nav>

        <div className="relative z-50 flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-[var(--bg-cream)] transition hover:bg-white/15 lg:hidden"
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

          <Link
            href="/menu"
            className="hidden rounded-full border border-[var(--bg-cream)]/35 bg-[var(--brand-gold)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--brand-gold-deep)] sm:inline-flex lg:px-4 lg:text-sm"
          >
            Menu
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[var(--brand-brown)] text-[var(--bg-cream)] shadow-md transition hover:-translate-y-0.5 hover:brightness-110 sm:h-11 sm:w-11"
            aria-label={count > 0 ? `View cart (${count} items)` : "View cart"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-95" aria-hidden>
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
              <span className="absolute -right-1 -top-1 min-h-[1.25rem] min-w-[1.25rem] rounded-full bg-[var(--accent-red)] px-1 text-center text-[11px] font-bold leading-5 text-[var(--bg-cream)]">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[44] cursor-pointer bg-black/45 backdrop-blur-[1px] lg:hidden"
            onClick={closeMenu}
          />
          <aside
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 right-0 z-[45] flex w-[min(100%,20rem)] flex-col border-l border-white/15 bg-[var(--brand-teal-deep)] shadow-2xl lg:hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <LogoMark size="sm" fallbackClassName="text-[var(--bg-cream)]" />
              <button
                type="button"
                className="ml-auto rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--bg-cream)]"
                onClick={closeMenu}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main navigation">
              {links.map((l) => {
                const active =
                  pathname === l.href || (l.alsoActive?.includes(pathname) ?? false);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeMenu}
                    className={clsx(
                      "rounded-xl px-4 py-3 text-base font-semibold tracking-wide transition",
                      "text-[var(--bg-cream)]/95 hover:bg-white/10",
                      active && "bg-white/10 text-[var(--bg-cream)] ring-1 ring-white/20"
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
                className="flex w-full items-center justify-center rounded-full bg-[var(--brand-gold)] py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)]"
              >
                View full menu
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
