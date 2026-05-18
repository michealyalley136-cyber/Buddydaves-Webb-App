import Link from "next/link";
import { BUSINESS_HOURS_PENDING_NOTE, PHONE_PENDING_NOTE } from "@/lib/approved-menu";
import { OwnerPendingNote } from "@/components/owner-pending-note";

export default function ContactPage() {
  return (
    <div className="layout-page">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Contact</p>
          <h1 className="mt-2 font-display text-5xl text-[var(--brand-brown)] md:text-6xl">Say howdy</h1>
          <p className="mt-4 max-w-xl text-ink/75">
            Call ahead for large orders, ask about catering, or check hours before you head our way.
          </p>
          <div className="mt-8 space-y-4 rounded-3xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 shadow-lift">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Location</p>
              <p className="mt-1 text-lg font-semibold text-[var(--brand-brown)]">Sevierville, Tennessee</p>
              <p className="text-sm text-ink/65">Buddy Dave&apos;s — Local Eats • Frozen Treats • Root Beer</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Hours</p>
              <p className="mt-1 text-sm text-ink/75">Pickup and drive-thru — open daily.</p>
              <OwnerPendingNote className="mt-2">{BUSINESS_HOURS_PENDING_NOTE}</OwnerPendingNote>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Phone</p>
              <p className="mt-1 font-display text-3xl text-[var(--brand-brown)]">(865) 555‑0198</p>
              <OwnerPendingNote className="mt-1">{PHONE_PENDING_NOTE}</OwnerPendingNote>
            </div>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-gradient-to-br from-white to-[color-mix(in_oklab,var(--bg-cream)_60%,white)] p-8 shadow-diner">
          <h2 className="font-display text-3xl text-[var(--brand-brown)]">Quick links</h2>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-teal">
            <li>
              <Link className="hover:underline" href="/menu">
                View menu &amp; order
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/track-order">
                Track an order
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/our-story">
                Read our story
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-ink/65">
            Planning a family reunion or team feed? Mention your headcount — we&apos;ll help you build a
            tray that fits your table.
          </p>
        </div>
      </div>
    </div>
  );
}
