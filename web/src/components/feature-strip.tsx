import Link from "next/link";



const items: { label: string; href: string }[] = [

  { label: "Pickup & Drive-Thru", href: "/#drive-thru" },

  { label: "Pay in Store", href: "/menu" },

  { label: "Track Your Order", href: "/track-order" },

  { label: "Local & Family-Owned", href: "/our-story" },

  { label: "Order Now", href: "/menu" },

];



export function FeatureStrip() {

  return (

    <section className="border-y border-[var(--line-subtle)] bg-[color-mix(in_oklab,var(--brand-teal)_10%,var(--card-bg))]">

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-center md:px-6">

        {items.map((item) => (

          <Link

            key={item.label}

            href={item.href}

            scroll={item.href.startsWith("/#")}

            className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-brown)]/85 transition hover:text-teal"

          >

            {item.label}

          </Link>

        ))}

      </div>

    </section>

  );

}


