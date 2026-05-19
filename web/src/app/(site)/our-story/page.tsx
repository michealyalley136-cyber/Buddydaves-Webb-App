import Image from "next/image";
import Link from "next/link";
import { FeatureStrip } from "@/components/feature-strip";
import { MENU_IMAGES } from "@/lib/menu-images";

export default function OurStoryPage() {
  return (
    <div className="pb-16">
      <div className="layout-page !pb-10">
        <p className="eyebrow">Our story</p>
        <h1 className="page-title max-w-3xl">Family-run in Sevierville</h1>
        <p className="page-lead max-w-2xl">
          Buddy Dave&apos;s is a locally owned restaurant serving classic sandwiches, sides, and
          fresh-made root beer — with pickup and drive-thru service built for everyday life in East
          Tennessee.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/menu" className="btn-primary">
            View menu
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact us
          </Link>
        </div>
      </div>

      <div className="layout-page !pt-0 grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--line-subtle)] shadow-[var(--shadow-card)]">
          <Image
            src={MENU_IMAGES.phillyCheesesteak}
            alt="Philly cheesesteak sandwich"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-[var(--text-muted)] leading-relaxed">
          <p>
            We focus on consistent quality, fair portions, and service you can count on — whether
            you&apos;re grabbing lunch on the go or picking up dinner for the family.
          </p>
          <p>
            From cheesesteaks and cheese curds to root beer floats, our menu reflects what guests
            order most and what we&apos;re proud to serve every day.
          </p>
          <p className="rounded-lg border border-[var(--line-subtle)] bg-white px-5 py-4 text-sm font-medium text-[var(--brand-brown)]">
            Locally owned. Drive-thru friendly. Ready when you are.
          </p>
        </div>
      </div>

      <FeatureStrip />
    </div>
  );
}
