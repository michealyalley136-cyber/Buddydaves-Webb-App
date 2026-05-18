import clsx from "clsx";

/** Subtle owner sign-off note — use sparingly on customer pages. */
export function OwnerPendingNote({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "inline" | "banner";
}) {
  const styles =
    variant === "banner"
      ? "mt-4 rounded-xl border border-[var(--line-subtle)] bg-white/70 px-4 py-3 text-xs leading-relaxed text-ink/65"
      : variant === "inline"
        ? "text-xs leading-relaxed text-ink/55"
        : "mt-2 text-xs leading-relaxed text-ink/60";

  return <p className={clsx(styles, className)}>{children}</p>;
}
