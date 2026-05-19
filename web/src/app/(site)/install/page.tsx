import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { InstallQrCopy } from "@/components/install-qr-copy";

export const metadata: Metadata = {
  title: "Install Buddy Dave's App",
  description: "Add Buddy Dave's to your phone Home Screen for faster ordering.",
};

export default function InstallHelpPage() {
  return (
    <div className="layout-page max-w-2xl">
      <p className="eyebrow">Help</p>
      <h1 className="page-title">Install Buddy Dave&apos;s App</h1>
      <p className="page-lead">
        Put Buddy Dave&apos;s on your Home Screen so you can open it like any other app — great for
        repeat orders.
      </p>

      <InstallQrCopy className="mt-6" />

      <section className="mt-10 rounded-2xl border border-[var(--line-subtle)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-[var(--brand-brown)]">iPhone (Safari)</h2>
        <ol className="mt-4 space-y-4 text-base leading-relaxed text-ink/85">
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
              1
            </span>
            <span>
              Open this website in <strong>Safari</strong> (not Facebook or Instagram).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
              2
            </span>
            <span>
              Tap the <strong>Share</strong> button at the bottom of the screen.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
              3
            </span>
            <span>
              Tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
            </span>
          </li>
        </ol>
        <p className="mt-4 text-sm text-ink/65">
          iPhone does not allow one-tap install from a website — these steps are required by Apple.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line-subtle)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-[var(--brand-brown)]">Android (Chrome)</h2>
        <ol className="mt-4 space-y-4 text-base leading-relaxed text-ink/85">
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
              1
            </span>
            <span>Open this site in Chrome.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-sm font-bold text-white">
              2
            </span>
            <span>
              Tap <strong>Install App</strong> on the banner, or use the menu →{" "}
              <strong>Install app</strong>.
            </span>
          </li>
        </ol>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line-subtle)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-[var(--brand-brown)]">Computer (Chrome / Edge)</h2>
        <p className="mt-3 text-base leading-relaxed text-ink/85">
          Look for the install icon in the address bar, or open the browser menu and choose{" "}
          <strong>Install Buddy Dave&apos;s</strong>.
        </p>
      </section>

      <section className="mt-8 flex items-center gap-4 rounded-2xl border border-[var(--brand-gold)]/30 bg-[color-mix(in_oklab,var(--brand-gold)_10%,white)] p-5">
        <Image
          src="/images/buddy-daves-logo.png"
          alt=""
          width={64}
          height={64}
          className="rounded-xl"
        />
        <div>
          <p className="font-display text-xl text-[var(--brand-brown)]">Ask staff for help</p>
          <p className="mt-1 text-sm text-ink/75">
            Our team can walk you through adding Buddy Dave&apos;s to your phone in about a minute.
          </p>
        </div>
      </section>

      <p className="mt-8 text-center">
        <Link href="/menu" className="font-semibold text-[var(--brand-teal)] underline">
          Back to menu
        </Link>
      </p>
    </div>
  );
}
