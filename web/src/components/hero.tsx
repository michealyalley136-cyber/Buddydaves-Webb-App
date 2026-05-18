"use client";



import Link from "next/link";

import Image from "next/image";

import { MENU_IMAGES } from "@/lib/menu-images";

import { LogoMark } from "@/components/logo-mark";



export function Hero() {

  return (

    <section className="relative w-full overflow-hidden border-b border-[var(--line-subtle)]/80 bg-[color-mix(in_oklab,var(--bg-cream)_92%,white)] px-4 pb-12 pt-4 sm:pb-16 sm:pt-6 md:pb-20">

      <div className="pointer-events-none absolute inset-0 grain opacity-60" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12 md:px-6">

        <div className="relative z-10 rounded-[1.5rem] border border-[var(--line-subtle)]/80 bg-[var(--card-bg)]/90 p-5 shadow-sm backdrop-blur-sm sm:p-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none">

          <div className="flex justify-center md:justify-start">

            <LogoMark size="hero" linked />

          </div>

          <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.35em] text-teal md:text-left">

            Sevierville, Tennessee · Est. local favorite

          </p>

          <h1 className="mt-3 text-center font-display text-4xl leading-[0.92] text-[var(--brand-brown)] sm:text-5xl md:text-left md:text-6xl lg:text-7xl">

            <span className="block">LOCAL EATS</span>

            <span className="block text-teal">FROZEN TREATS</span>

            <span className="block">ROOT BEER</span>

          </h1>

          <p className="mx-auto mt-5 max-w-md text-center text-balance text-base leading-relaxed text-ink/75 md:mx-0 md:text-left md:text-lg">

            A hometown stop for cheesesteaks, cheese curds, and root beer made fresh daily — family-run,

            drive-thru friendly, and ready when you are.

          </p>

          <div className="mt-8 flex flex-col gap-3">

            <Link href="/menu" className="btn-diner-gold min-h-12 w-full justify-center text-sm">

              View Menu &amp; Order

            </Link>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <Link

                href="/menu"

                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-[var(--brand-teal)]/25 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-teal shadow-sm transition hover:border-teal/40"

              >

                Order Pickup

              </Link>

              <Link href="/#drive-thru" scroll className="btn-diner-teal min-h-11 w-full justify-center text-sm">

                Drive-Thru Info

              </Link>

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <Link href="/menu" className="btn-diner-teal min-h-11 w-full justify-center text-sm">

                Start Order

              </Link>

              <Link

                href="/track-order"

                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-[var(--brand-brown)]/20 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-sm transition hover:border-[var(--brand-brown)]/35"

              >

                Track Order

              </Link>

            </div>

          </div>

        </div>



        <div className="relative z-0 mx-auto w-full max-w-md md:max-w-none">

          <div

            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--brand-gold)]/30 via-transparent to-teal/20 blur-xl"

            aria-hidden

          />

          <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-[var(--brand-brown)]/20 bg-[var(--card-bg)] p-1 shadow-diner ring-2 ring-[var(--brand-gold)]/25">

            <div className="relative overflow-hidden rounded-[1.35rem] border border-[var(--line-subtle)]">

              <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-[var(--brand-brown)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bg-cream)] shadow-sm">

                Today&apos;s board

              </div>

              <div className="relative aspect-[4/5] w-full md:aspect-square">

                <Image

                  src={MENU_IMAGES.phillyCheesesteak}

                  alt="Philly cheesesteak with peppers and onions"

                  fill

                  priority

                  className="object-cover"

                  sizes="(max-width: 768px) 100vw, 50vw"

                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand-brown)]/60 via-[var(--brand-brown)]/10 to-transparent" />

                <div className="pointer-events-none absolute bottom-4 left-4 right-4">

                  <p className="font-display text-2xl text-[var(--bg-cream)] drop-shadow sm:text-3xl">

                    Philly Cheesesteak

                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--brand-gold)]">$7.99 · On the menu now</p>

                </div>

              </div>

            </div>

            <div className="pointer-events-none absolute -bottom-3 -right-3 z-10 h-24 w-24 overflow-hidden rounded-2xl border-[3px] border-[var(--card-bg)] shadow-diner sm:h-28 sm:w-28 md:h-32 md:w-32">

              <Image

                src={MENU_IMAGES.rootbeerFloat}

                alt="Rootbeer float"

                fill

                className="object-cover"

                sizes="128px"

              />

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}


