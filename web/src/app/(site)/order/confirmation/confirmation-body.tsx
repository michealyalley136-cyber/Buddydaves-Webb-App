"use client";



import Link from "next/link";

import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { loadLastOrder, type LastOrderSnapshot } from "@/lib/last-order";

import { PickupCodeCallout } from "@/components/pickup-code-callout";



export function ConfirmationBody() {

  const sp = useSearchParams();

  const code = sp.get("code");

  const [order, setOrder] = useState<LastOrderSnapshot | null>(null);



  useEffect(() => {

    setOrder(loadLastOrder());

  }, [code]);



  if (!code) {

    return (

      <div className="layout-page-narrow max-w-2xl">

        <p className="font-display text-4xl text-[var(--brand-brown)]">Missing order code</p>

        <p className="mt-3 text-ink/70">If you just ordered, check your URL or track from the link below.</p>

        <Link href="/track-order" className="mt-6 inline-flex text-sm font-bold text-teal hover:underline">

          Track an order

        </Link>

      </div>

    );

  }



  const items = order?.code === code ? order.items : [];

  const orderType = order?.code === code ? order.orderType : null;



  return (

    <div className="layout-page-narrow max-w-2xl">

      <div className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 text-center shadow-diner sm:p-8">

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Order confirmed</p>

        <h1 className="mt-3 font-display text-4xl text-[var(--brand-brown)] sm:text-5xl">You&apos;re on the board</h1>

        <p className="mt-3 text-balance text-sm text-ink/70 sm:text-base">

          The kitchen has your ticket. Save your code — you&apos;ll need it at pickup or the drive-thru.

        </p>



        <PickupCodeCallout code={code} orderType={orderType} className="mt-8" />



        <div className="mt-6 rounded-2xl border border-[var(--line-subtle)] bg-white/70 px-4 py-4 text-left text-sm text-ink/75">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">What happens next</p>

          <ol className="mt-3 list-decimal space-y-2 pl-5">

            <li>Head to Buddy Dave&apos;s when you&apos;re ready.</li>

            <li>Show your order code at the counter or window.</li>

            <li>Pay in store — cash or card.</li>

            <li>Track your order status anytime with the button below.</li>

          </ol>

        </div>



        {items.length > 0 && (

          <div className="mt-6 rounded-2xl border border-[var(--line-subtle)] bg-white/70 px-4 py-4 text-left">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Your order</p>

            <ul className="mt-3 space-y-2 text-sm">

              {items.map((i) => (

                <li key={i.id} className="flex justify-between gap-3">

                  <span>

                    <span className="font-bold text-[var(--brand-brown)]">{i.quantity}×</span> {i.name}

                  </span>

                  <span className="shrink-0 font-semibold">${(i.price * i.quantity).toFixed(2)}</span>

                </li>

              ))}

            </ul>

            {order && (

              <p className="mt-3 border-t border-[var(--line-subtle)] pt-3 text-right font-display text-2xl text-[var(--brand-brown)]">

                ${order.total.toFixed(2)} due at pickup

              </p>

            )}

          </div>

        )}



        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">

          <Link

            href={`/track-order?code=${encodeURIComponent(code)}`}

            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-diner ring-1 ring-black/10"

          >

            Track order

          </Link>

          <Link

            href="/menu"

            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--line-subtle)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-teal"

          >

            Back to menu

          </Link>

        </div>

      </div>

    </div>

  );

}


