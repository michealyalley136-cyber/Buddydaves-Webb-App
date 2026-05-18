"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--brand-brown)]">We hit a snag</h1>
      <p className="mt-4 text-sm text-ink/70">
        The page could not load. Try refreshing, or head back to the menu.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--brand-teal)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border border-[var(--line-subtle)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-teal">
          Home
        </Link>
        <Link href="/menu" className="btn-diner-gold px-6 py-3 text-sm">
          Menu
        </Link>
      </div>
    </div>
  );
}
