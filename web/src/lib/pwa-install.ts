/** localStorage keys for the install assistant */
export const INSTALL_STORAGE = {
  completed: "buddy_install_completed",
  dismissedUntil: "buddy_install_dismissed_until",
  remindAfter: "buddy_install_remind_after",
  promptSeen: "buddy_install_prompt_seen",
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export type InstallPlatform =
  | "ios-safari"
  | "ios-other"
  | "android-chrome"
  | "desktop-chrome"
  | "in-app"
  | "other";

export function isPwaInstalled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).standalone === true) return true;
  return false;
}

export function getUserAgent(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent || "";
}

export function isIosDevice(ua = getUserAgent()): boolean {
  return /iPhone|iPad|iPod/i.test(ua) || (/\bMacintosh\b/i.test(ua) && /\bMobile\b/i.test(ua));
}

export function isAndroidDevice(ua = getUserAgent()): boolean {
  return /Android/i.test(ua);
}

export function isInAppBrowser(ua = getUserAgent()): boolean {
  return (
    /\bFBAN\b/i.test(ua) ||
    /\bFBAV\b/i.test(ua) ||
    /\bInstagram\b/i.test(ua) ||
    /\bMessenger\b/i.test(ua) ||
    /\bLine\b/i.test(ua) ||
    /\bTwitter\b/i.test(ua) ||
    /\bLinkedInApp\b/i.test(ua)
  );
}

export function isSafariOnIos(ua = getUserAgent()): boolean {
  if (!isIosDevice(ua)) return false;
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua);
  return !isOtherBrowser && /Safari/i.test(ua);
}

export function isChromeAndroid(ua = getUserAgent()): boolean {
  return isAndroidDevice(ua) && /Chrome/i.test(ua) && !/EdgA|OPR|SamsungBrowser/i.test(ua);
}

export function isDesktopInstallableBrowser(ua = getUserAgent()): boolean {
  if (isIosDevice(ua) || isAndroidDevice(ua)) return false;
  return /Chrome|Edg|Chromium/i.test(ua) && !/Mobile/i.test(ua);
}

export function detectInstallPlatform(): InstallPlatform {
  const ua = getUserAgent();
  if (isInAppBrowser(ua)) return "in-app";
  if (isSafariOnIos(ua)) return "ios-safari";
  if (isIosDevice(ua)) return "ios-other";
  if (isChromeAndroid(ua)) return "android-chrome";
  if (isDesktopInstallableBrowser(ua)) return "desktop-chrome";
  return "other";
}

/** Customer routes where the install banner may appear softly */
export function isInstallAssistantAllowedPath(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/staff")) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/order/confirmation")) return false;
  if (pathname === "/checkout") return false;
  const allowed =
    pathname === "/" ||
    pathname === "/menu" ||
    pathname === "/cart" ||
    pathname.startsWith("/track-order") ||
    pathname === "/our-story" ||
    pathname === "/contact" ||
    pathname === "/install";
  return allowed;
}

export function readInstallDismissedUntil(): number | null {
  try {
    const raw = localStorage.getItem(INSTALL_STORAGE.dismissedUntil);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function readInstallRemindAfter(): number | null {
  try {
    const raw = localStorage.getItem(INSTALL_STORAGE.remindAfter);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function isInstallCompleted(): boolean {
  try {
    return localStorage.getItem(INSTALL_STORAGE.completed) === "1";
  } catch {
    return false;
  }
}

export function markInstallPromptSeen(): void {
  try {
    localStorage.setItem(INSTALL_STORAGE.promptSeen, "1");
  } catch {
    /* ignore */
  }
}

export function markInstallCompleted(): void {
  try {
    localStorage.setItem(INSTALL_STORAGE.completed, "1");
    localStorage.removeItem(INSTALL_STORAGE.dismissedUntil);
    localStorage.removeItem(INSTALL_STORAGE.remindAfter);
  } catch {
    /* ignore */
  }
}

export function dismissInstallForHours(hours: number): void {
  try {
    localStorage.setItem(
      INSTALL_STORAGE.dismissedUntil,
      String(Date.now() + hours * 60 * 60 * 1000)
    );
  } catch {
    /* ignore */
  }
}

export function remindInstallLaterDays(days: number): void {
  try {
    localStorage.setItem(INSTALL_STORAGE.remindAfter, String(Date.now() + days * DAY_MS));
  } catch {
    /* ignore */
  }
}

export function shouldShowInstallAssistant(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  if (isPwaInstalled()) return false;
  if (isInstallCompleted()) return false;
  if (!isInstallAssistantAllowedPath(pathname)) return false;

  const dismissedUntil = readInstallDismissedUntil();
  if (dismissedUntil != null && Date.now() < dismissedUntil) return false;

  const remindAfter = readInstallRemindAfter();
  if (remindAfter != null && Date.now() < remindAfter) return false;

  return true;
}

export async function copyAppLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}
