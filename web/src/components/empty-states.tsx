import Link from "next/link";

export function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--line-subtle)] bg-[var(--card-bg)] px-6 py-14 text-center shadow-sm">
      <p className="font-display text-3xl text-[var(--brand-brown)]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
