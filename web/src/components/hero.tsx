import Link from "next/link";
import Image from "next/image";
import { MENU_IMAGES } from "@/lib/menu-images";
import { LogoMark } from "@/components/logo-mark";

export function Hero() {
  return (
    <section className="border-b border-[var(--line-subtle)] bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div>
          <LogoMark size="hero" linked className="mb-6" />
          <p className="eyebrow">Sevierville, Tennessee</p>
          <h1 className="mt-3 font-display text-[1.75rem] font-normal leading-snug text-[var(--brand-brown)] sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Fresh Local Eats, Root Beer &amp; Drive-Thru Favorites
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            A locally owned Sevierville stop for classic sandwiches, sides, and fresh-made root beer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/menu" className="btn-primary min-h-11 px-8 text-center">
              View Menu
            </Link>
            <Link href="/menu" className="btn-secondary min-h-11 px-8 text-center">
              Start Pickup Order
            </Link>
          </div>
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            Pickup and drive-thru · Pay in store when you arrive
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] shadow-[var(--shadow-card)]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={MENU_IMAGES.phillyCheesesteak}
                alt="Philly cheesesteak with peppers and onions"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
