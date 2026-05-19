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
        ? "pickup counter"
        : "pickup counter or drive-thru";

  return (
    <div
      className={clsx(
        "rounded-xl border-2 border-[var(--brand-teal)]/30 bg-[color-mix(in_oklab,var(--brand-teal)_6%,white)] px-5 py-6 text-center",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-teal">Your order code</p>
      <p className="mt-2 font-mono text-3xl font-bold tracking-wide text-[var(--brand-brown)] sm:text-4xl">
        {code}
      </p>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        Show this code at the <span className="font-medium text-[var(--brand-brown)]">{where}</span>.
        Pay in store when you arrive.
      </p>
    </div>
  );
}
