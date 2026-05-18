import Image from "next/image";
import Link from "next/link";
import { FeatureStrip } from "@/components/feature-strip";
import { MENU_IMAGES } from "@/lib/menu-images";

export default function OurStoryPage() {
  return (
    <div className="pb-20">
      <div className="layout-page !pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Our story</p>
        <h1 className="mt-2 max-w-3xl font-display text-5xl text-[var(--brand-brown)] md:text-6xl">
          Rooted in Sevierville — raised on porch swings &amp; root beer
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
          Buddy Dave&apos;s started as a simple idea: feed folks the way we feed family — honest
          portions, melty sandwiches, and root beer made fresh daily. Today we&apos;re still local,
          still family-run, and still pouring floats like it&apos;s a front-porch Sunday.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/menu" className="btn-diner-gold min-h-11 px-6">
            View menu
          </Link>
          <Link href="/contact" className="btn-diner-teal min-h-11 px-6">
            Contact us
          </Link>
        </div>
      </div>
      <div className="layout-page !pt-0 grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[var(--line-subtle)] shadow-diner">
          <Image
            src={MENU_IMAGES.phillyCheesesteak}
            alt="Philly cheesesteak sandwich"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-ink/75">
          <p>
            We believe Southern hospitality isn&apos;t a slogan — it&apos;s a refill on your tea, a
            remembered name at the window, and a kitchen that doesn&apos;t cut corners.
          </p>
          <p>
            From cheesesteaks to cheese curds and root beer floats, every order is built for the long
            haul: road trips, little league wins, and “let&apos;s just do drive-thru tonight” Tuesdays.
          </p>
          <p className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] px-5 py-4 text-sm font-semibold text-[var(--brand-brown)] shadow-sm">
            “Pull up a stool — even if it&apos;s the driver&apos;s seat.”
          </p>
        </div>
      </div>
      <div className="mt-16">
        <FeatureStrip />
      </div>
    </div>
  );
}
