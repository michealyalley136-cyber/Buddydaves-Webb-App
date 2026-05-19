import Link from "next/link";

const items: { label: string; href: string }[] = [
  { label: "Pickup & drive-thru", href: "/#drive-thru" },
  { label: "Pay in store", href: "/menu" },
  { label: "Track your order", href: "/track-order" },
  { label: "Our story", href: "/our-story" },
];

export function FeatureStrip() {
  return (
    <section className="border-t border-[var(--line-subtle)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-center sm:px-6">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            scroll={item.href.includes("#")}
            className="text-sm font-medium text-[var(--text-muted)] transition hover:text-teal"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
