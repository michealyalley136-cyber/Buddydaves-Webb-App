import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  variant?: "gold" | "teal" | "ghost";
};

export function CtaButton({ className, variant = "gold", ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition will-change-transform hover:-translate-y-0.5";
  const styles =
    variant === "gold"
      ? "bg-[var(--brand-gold)] text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10 hover:bg-[var(--brand-gold-deep)]"
      : variant === "teal"
        ? "bg-[var(--brand-teal)] text-white shadow-lift ring-1 ring-black/10 hover:bg-[var(--brand-teal-deep)]"
        : "border border-[var(--line-subtle)] bg-white/80 text-teal shadow-sm hover:bg-white";
  return <Link className={clsx(base, styles, className)} {...rest} />;
}
