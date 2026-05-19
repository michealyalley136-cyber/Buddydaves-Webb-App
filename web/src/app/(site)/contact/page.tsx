import Link from "next/link";
import { BUSINESS_HOURS_PENDING_NOTE, PHONE_PENDING_NOTE } from "@/lib/approved-menu";
import { OwnerPendingNote } from "@/components/owner-pending-note";

export default function ContactPage() {
  return (
    <div className="layout-page">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Visit Buddy Dave&apos;s</h1>
          <p className="page-lead">
            Questions about hours, large orders, or directions? We&apos;re happy to help.
          </p>
          <div className="mt-8 space-y-6 rounded-xl border border-[var(--line-subtle)] bg-white p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Location</p>
              <p className="mt-1 text-lg font-medium text-[var(--brand-brown)]">Sevierville, Tennessee</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Hours</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Pickup and drive-thru — open daily.</p>
              <OwnerPendingNote className="mt-2">{BUSINESS_HOURS_PENDING_NOTE}</OwnerPendingNote>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Phone</p>
              <p className="mt-1 text-lg font-medium text-[var(--brand-brown)]">(865) 555‑0198</p>
              <OwnerPendingNote className="mt-1">{PHONE_PENDING_NOTE}</OwnerPendingNote>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--line-subtle)] bg-white p-8">
          <h2 className="font-display text-2xl font-normal text-[var(--brand-brown)]">Quick links</h2>
          <ul className="mt-6 space-y-3 text-sm font-medium">
            <li>
              <Link className="text-teal hover:underline" href="/menu">
                View menu &amp; order
              </Link>
            </li>
            <li>
              <Link className="text-teal hover:underline" href="/track-order">
                Track an order
              </Link>
            </li>
            <li>
              <Link className="text-teal hover:underline" href="/our-story">
                Our story
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-[var(--text-muted)]">
            For catering or large group orders, call ahead with your headcount and preferred pickup time.
          </p>
        </div>
      </div>
    </div>
  );
}
