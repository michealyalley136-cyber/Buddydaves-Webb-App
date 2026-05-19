import Link from "next/link";
import { LogoMark } from "./logo-mark";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line-subtle)] bg-[var(--brand-brown)] text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
        <div>
          <LogoMark size="footer" linked={false} fallbackClassName="text-[var(--bg-cream)]" />
          <p className="mt-4 font-display text-2xl text-white">Buddy Dave&apos;s</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
            Locally owned in Sevierville, Tennessee. Sandwiches, sides, and fresh-made root beer.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">Visit</p>
          <p className="mt-3 text-sm">Sevierville, TN</p>
          <p className="mt-1 text-sm text-white/70">Pickup &amp; drive-thru</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/menu", label: "Menu" },
              { href: "/cart", label: "Cart" },
              { href: "/track-order", label: "Track order" },
              { href: "/our-story", label: "Our story" },
              { href: "/contact", label: "Contact" },
              { href: "/staff/login", label: "Staff login" },
            ].map((l) => (
              <li key={l.href}>
                <Link className="text-white/80 transition hover:text-white" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Buddy Dave&apos;s. All rights reserved.
      </div>
    </footer>
  );
}
