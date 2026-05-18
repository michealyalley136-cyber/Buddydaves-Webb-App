import Link from "next/link";
import { LogoMark } from "./logo-mark";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line-subtle)] bg-[var(--brand-brown)] text-[color-mix(in_oklab,var(--bg-cream)_88%,white)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[auto_1fr_1fr] md:items-start md:px-6">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <LogoMark
            size="footer"
            linked={false}
            fallbackClassName="text-[var(--bg-cream)]"
          />
          <div className="text-center md:text-left">
            <p className="font-display text-3xl tracking-wide text-[var(--bg-cream)]">Buddy Dave&apos;s</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
              Local eats, frozen treats, and fresh root beer — family-run in Sevierville, Tennessee.
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">Visit</p>
          <p className="mt-3 text-sm">Sevierville, TN</p>
          <p className="mt-1 text-sm text-white/75">Pickup &amp; drive-thru daily</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/menu">
                Menu
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/cart">
                Cart
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/track-order">
                Track order
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/our-story">
                Our story
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/staff/login">
                Staff
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        © {new Date().getFullYear()} Buddy Dave&apos;s. Local Eats • Frozen Treats • Root Beer.
      </div>
    </footer>
  );
}
