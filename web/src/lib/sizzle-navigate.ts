import type { MouseEvent } from "react";

/** Total sizzle → rootbeer → navigate timing (ms). Tune in one place. */
export const SIZZLE_DURATION_MS = 580;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function runSizzleTransition(
  el: HTMLElement | null,
  navigate: () => void,
  duration = SIZZLE_DURATION_MS
): void {
  if (prefersReducedMotion()) {
    navigate();
    return;
  }

  if (!el) {
    navigate();
    return;
  }

  el.classList.add("sizzle-link--active");

  window.setTimeout(() => {
    navigate();
    window.setTimeout(() => {
      el.classList.remove("sizzle-link--active");
    }, 80);
  }, duration);
}

export function shouldSkipSizzleNavigation(
  href: string,
  pathname: string,
  e: MouseEvent
): boolean {
  if (e.defaultPrevented) return true;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return true;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return true;
  }

  const hashIdx = href.indexOf("#");
  if (hashIdx >= 0) {
    const pathPart = href.slice(0, hashIdx) || pathname;
    const samePath = pathPart === pathname || pathPart === "";
    if (samePath && hashIdx < href.length - 1) return true;
  }

  const pathOnly = href.split("?")[0].split("#")[0] || "/";
  if (pathOnly === pathname) return true;

  return false;
}
