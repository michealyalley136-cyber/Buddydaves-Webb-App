import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { FeatureStrip } from "@/components/feature-strip";
import { OwnerPendingNote } from "@/components/owner-pending-note";
import { MENU_IMAGES } from "@/lib/menu-images";
import { getMenuItemPendingNote, PHOTOS_PENDING_NOTE } from "@/lib/approved-menu";

const features: {
  title: string;
  body: string;
  img: string;
  price: string;
  pendingNote?: string | null;
}[] = [
  {
    title: "Philly Cheesesteak",
    body: "Provolone cheese with seasoned grilled peppers and onions.",
    img: MENU_IMAGES.phillyCheesesteak,
    price: "$7.99",
  },
  {
    title: "Double Mushroom Melt",
    body: "Stacked, melty, and built for the drive home.",
    img: MENU_IMAGES.doubleMushroomMelt,
    price: "$7.69",
  },
  {
    title: "Cheese Curds",
    body: "Golden, crispy curds — a customer favorite side.",
    img: MENU_IMAGES.cheeseCurds,
    price: "$5.99",
  },
  {
    title: "Gallon Fresh Made Rootbeer",
    body: "Fresh-made root beer by the gallon for gatherings.",
    img: MENU_IMAGES.gallonRootbeer,
    price: "$7.99",
  },
  {
    title: "Rootbeer Float",
    body: "Fresh root beer crowned with creamy soft-serve.",
    img: MENU_IMAGES.rootbeerFloat,
    price: "$4.99",
    pendingNote: getMenuItemPendingNote("Rootbeer Float"),
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">On the menu</p>
          <h2 className="page-title">House favorites</h2>
          <p className="page-lead !mt-3">
            Five signature items available for pickup or drive-thru. Order online and pay when you
            arrive.
          </p>
          <OwnerPendingNote variant="banner" className="mt-4">
            {PHOTOS_PENDING_NOTE}
          </OwnerPendingNote>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="card-surface-hover flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={f.img}
                  alt={f.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-normal text-[var(--brand-brown)]">{f.title}</h3>
                  <span className="shrink-0 text-sm font-semibold text-teal">{f.price}</span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">{f.body}</p>
                {f.pendingNote && (
                  <p className="mt-3 rounded-md bg-[color-mix(in_oklab,var(--brand-gold)_10%,white)] px-3 py-2 text-xs text-[var(--brand-brown)]">
                    {f.pendingNote}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/menu" className="btn-primary px-8">
            View full menu
          </Link>
        </div>
      </section>

      <section
        id="drive-thru"
        className="scroll-mt-20 border-y border-[var(--line-subtle)] bg-[color-mix(in_oklab,var(--brand-brown)_6%,var(--bg-cream))]"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="eyebrow">Pickup &amp; drive-thru</p>
            <h2 className="page-title">Order ahead, pick up when ready</h2>
            <p className="page-lead !mt-3">
              Place your order online, then stop by the counter or drive-thru window. We&apos;ll have
              your food ready — pay in store with cash or card.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary">
                Start order
              </Link>
              <Link href="/contact" className="btn-secondary">
                Hours &amp; location
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--line-subtle)] shadow-[var(--shadow-card)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={MENU_IMAGES.rootbeerFloat}
                alt="Rootbeer float"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <FeatureStrip />
    </>
  );
}
