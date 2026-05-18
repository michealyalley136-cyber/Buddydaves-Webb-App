import clsx from "clsx";

export function PickupCodeCallout({
  code,
  orderType,
  className,
}: {
  code: string;
  orderType?: string | null;
  className?: string;
}) {
  const where =
    orderType === "drive_thru"
      ? "drive-thru window"
      : orderType === "pickup"
        ? "pickup counter or curbside"
        : "pickup counter or drive-thru window";

  return (
    <div
      className={clsx(
        "rounded-2xl border-2 border-[var(--brand-gold)] bg-[color-mix(in_oklab,var(--brand-gold)_22%,white)] px-5 py-5 text-center shadow-diner ring-1 ring-[var(--brand-gold)]/35",
        className
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal">Show this code</p>
      <p className="mt-2 font-display text-4xl tracking-wide text-[var(--brand-brown)] sm:text-5xl">
        {code}
      </p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/80">
        Have this ready at the <span className="text-[var(--brand-brown)]">{where}</span> when you
        arrive. Pay in store — cash or card.
      </p>
    </div>
  );
}
