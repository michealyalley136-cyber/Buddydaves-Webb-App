"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { startTransition } from "react";
import clsx from "clsx";
import {
  SIZZLE_DURATION_MS,
  runSizzleTransition,
  shouldSkipSizzleNavigation,
} from "@/lib/sizzle-navigate";

export type SizzleLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  href: string;
  /** `button` = full pour overlay; `text` = lighter effect for inline links */
  variant?: "button" | "text";
  onNavigate?: () => void;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function SizzleEffects() {
  return (
    <span className="sizzle-fx" aria-hidden>
      <span className="sizzle-flame" />
      <span className="sizzle-smoke" />
      <span className="rootbeer-pour">
        <span className="rootbeer-bubble rootbeer-bubble--1" />
        <span className="rootbeer-bubble rootbeer-bubble--2" />
        <span className="rootbeer-bubble rootbeer-bubble--3" />
      </span>
    </span>
  );
}

export function SizzleLink({
  href,
  children,
  className,
  variant = "button",
  onNavigate,
  onClick,
  replace,
  scroll,
  prefetch,
  ...rest
}: SizzleLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (!mounted || shouldSkipSizzleNavigation(href, pathname, e)) return;

      e.preventDefault();
      onNavigate?.();

      const targetPath = href.split("?")[0].split("#")[0] || "/";

      runSizzleTransition(anchorRef.current, () => {
        startTransition(() => {
          if (replace) router.replace(href);
          else router.push(href);
        });
      });

      // If client navigation stalls (chunk error, etc.), fall back to full load
      window.setTimeout(() => {
        const current = window.location.pathname;
        if (current !== targetPath && !current.startsWith(targetPath + "/")) {
          window.location.assign(href);
        }
      }, SIZZLE_DURATION_MS + 400);
    },
    [href, pathname, onClick, onNavigate, replace, router, mounted]
  );

  return (
    <Link
      ref={anchorRef}
      href={href}
      onClick={handleClick}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch ?? true}
      className={clsx("sizzle-link", variant === "text" && "sizzle-link--text", className)}
      {...rest}
    >
      <span className="sizzle-link__inner">{children}</span>
      {mounted ? <SizzleEffects /> : null}
    </Link>
  );
}
