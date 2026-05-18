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
    body: "Provolone cheese with seasoned grilled peppers and onions — a Sevierville staple.",
    img: MENU_IMAGES.phillyCheesesteak,
    price: "$7.99",
  },
  {
    title: "Double Mushroom Melt",
    body: "Stacked, melty, and built for the drive home — one of our signature sandwiches.",
    img: MENU_IMAGES.doubleMushroomMelt,
    price: "$7.69",
  },
  {
    title: "Cheese Curds",
    body: "Golden, crispy curds — the side everyone asks for by name.",
    img: MENU_IMAGES.cheeseCurds,
    price: "$5.99",
  },
  {
    title: "Gallon Fresh Made Rootbeer",
    body: "Fresh made rootbeer by the gallon — perfect for the porch or the picnic table.",
    img: MENU_IMAGES.gallonRootbeer,
    price: "$7.99",
  },
  {
    title: "Rootbeer Float",
    body: "Rootbeer made fresh daily, crowned with creamy soft-serve.",
    img: MENU_IMAGES.rootbeerFloat,
    price: "$4.99",
    pendingNote: getMenuItemPendingNote("Rootbeer Float"),
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">On the menu now</p>
          <h2 className="mt-3 font-display text-3xl text-[var(--brand-brown)] sm:text-4xl md:text-5xl">
            Sandwiches, sides &amp; root beer
          </h2>
          <p className="mt-4 text-balance text-sm text-ink/70 sm:text-base">
            Five house favorites — sandwiches, sides, and fresh root beer. Order pickup or swing
            through the drive-thru.
          </p>
          <OwnerPendingNote variant="banner" className="mx-auto mt-4 max-w-lg">
            {PHOTOS_PENDING_NOTE}
          </OwnerPendingNote>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className={[
                "overflow-hidden rounded-[1.5rem] border border-[var(--line-subtle)] bg-[var(--card-bg)] shadow-diner",
                i === features.length - 1 ? "sm:col-span-2 lg:col-span-1" : "",
              ].join(" ")}
            >
              <div className="relative aspect-[16/10] sm:aspect-[5/3]">
                <Image src={f.img} alt={f.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand-brown)]/55 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 right-14 font-display text-2xl text-[var(--bg-cream)] drop-shadow sm:text-3xl">
                  {f.title}
                </p>
                <span className="absolute bottom-3 right-3 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold text-[var(--brand-brown)] ring-1 ring-black/10">
                  {f.price}
                </span>
              </div>
              <p className="p-4 text-sm leading-relaxed text-ink/75 sm:p-5">{f.body}</p>
              {f.pendingNote && (
                <p className="mx-4 mb-4 mt-0 rounded-lg bg-[color-mix(in_oklab,var(--brand-gold)_12%,white)] px-3 py-2 text-[11px] font-medium text-[var(--brand-brown)] sm:mx-5">
                  {f.pendingNote}
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/menu" className="btn-diner-gold min-h-11 px-8">
            View full menu
          </Link>
        </div>
      </section>

      <section
        id="drive-thru"
        className="relative scroll-mt-20 overflow-hidden border-y border-[var(--line-subtle)] bg-[var(--brand-brown)] py-12 text-[var(--bg-cream)] sm:py-16"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30 grain" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-10 md:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand-gold)]">
              Drive-thru &amp; pickup
            </p>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">Swing by the window</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              Grab a cheesesteak, cheese curds, or a frosty root beer float without leaving your car.
              Friendly service, hometown prices.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="/menu"
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10"
              >
                Start order
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur"
              >
                Hours &amp; directions
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-diner">
            <div className="relative aspect-[4/3]">
              <Image
                src={MENU_IMAGES.rootbeerFloat}
                alt="Rootbeer float"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--brand-teal)]/45 via-transparent to-[var(--brand-gold)]/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      <FeatureStrip />
    </>
  );
}
