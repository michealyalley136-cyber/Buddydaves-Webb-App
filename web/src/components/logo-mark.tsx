"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { OFFICIAL_LOGO_PATH } from "@/lib/brand-logo";

type LogoSize = "sm" | "nav" | "footer" | "hero";

const dimensions: Record<LogoSize, { box: string; px: number }> = {
  sm: { box: "h-11 w-11", px: 44 },
  nav: { box: "h-12 w-12 sm:h-14 sm:w-14", px: 56 },
  footer: { box: "h-20 w-20 sm:h-24 sm:w-24", px: 96 },
  hero: { box: "h-28 w-28 sm:h-36 sm:w-36", px: 144 },
};

function LogoTextFallback({
  size,
  className,
}: {
  size: LogoSize;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "flex flex-col items-center justify-center text-center font-display font-bold leading-none tracking-wide",
        size === "hero" && "text-xl sm:text-2xl",
        size === "footer" && "text-base sm:text-lg",
        size === "nav" && "text-sm",
        size === "sm" && "text-xs",
        className
      )}
      aria-hidden
    >
      <span>Buddy</span>
      <span>Dave&apos;s</span>
    </span>
  );
}

/**
 * Official logo from `/public/images/buddy-daves-logo.png`.
 * Falls back to text if the PNG is missing.
 */
export function LogoMark({
  className = "",
  size = "nav",
  linked = true,
  fallbackClassName = "text-[var(--brand-brown)]",
}: {
  className?: string;
  size?: LogoSize;
  linked?: boolean;
  fallbackClassName?: string;
}) {
  const { box, px } = dimensions[size];
  const [useFallback, setUseFallback] = useState(false);

  const mark = (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center",
        box,
        className
      )}
    >
      {useFallback ? (
        <LogoTextFallback size={size} className={fallbackClassName} />
      ) : (
        <Image
          src={OFFICIAL_LOGO_PATH}
          alt="Buddy Dave's"
          width={px}
          height={px}
          priority={size === "nav" || size === "hero"}
          className="h-full w-full object-contain drop-shadow-sm"
          sizes={`${px}px`}
          onError={() => setUseFallback(true)}
        />
      )}
    </span>
  );

  if (!linked) return mark;

  return (
    <Link
      href="/"
      title="Buddy Dave's — Local Eats • Frozen Treats • Root Beer"
      className="inline-flex min-w-0 shrink-0 items-center rounded-full transition hover:opacity-90"
    >
      {mark}
    </Link>
  );
}
