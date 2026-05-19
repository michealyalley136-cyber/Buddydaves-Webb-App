import clsx from "clsx";

/** Reusable counter / QR-friendly install copy (no QR image). */
export function InstallQrCopy({ className }: { className?: string }) {
  return (
    <p
      className={clsx(
        "rounded-xl border border-[var(--brand-gold)]/35 bg-[color-mix(in_oklab,var(--brand-gold)_12%,white)] px-4 py-3 text-center text-base font-semibold leading-snug text-[var(--brand-brown)]",
        className
      )}
    >
      Scan. Tap Install App. Order faster next time.
    </p>
  );
}
