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
    <div className="rounded-xl border border-dashed border-[var(--line-subtle)] bg-white px-6 py-14 text-center">
      <p className="font-display text-2xl font-normal text-[var(--brand-brown)]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{body}</p>
      {cta && (
        <Link href={cta.href} className="btn-primary mt-6 inline-flex px-6">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
