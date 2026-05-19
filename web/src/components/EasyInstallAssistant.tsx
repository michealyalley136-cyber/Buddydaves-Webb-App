"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  copyAppLink,
  detectInstallPlatform,
  dismissInstallForHours,
  isPwaInstalled,
  markInstallCompleted,
  markInstallPromptSeen,
  remindInstallLaterDays,
  shouldShowInstallAssistant,
} from "@/lib/pwa-install";

type ModalView = "none" | "ios-guide" | "in-app" | "desktop-hint";

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v10M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneHomeMockup() {
  return (
    <div className="mx-auto w-24 rounded-2xl border-2 border-[var(--brand-brown)] bg-[var(--bg-cream)] p-2 shadow-md">
      <div className="grid grid-cols-3 gap-1.5 p-1">
        {[0, 1, 2, 3, 4, 5].map((i) =>
          i === 4 ? (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center rounded-md bg-[var(--brand-teal)] p-0.5"
            >
              <Image
                src="/images/buddy-daves-logo.png"
                alt=""
                width={28}
                height={28}
                className="rounded"
              />
              <span className="mt-0.5 text-[6px] font-bold leading-none text-white">Buddy</span>
            </div>
          ) : (
            <div key={i} className="aspect-square rounded-md bg-[var(--line-subtle)]/60" />
          )
        )}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-[var(--brand-gold)] bg-[var(--brand-brown)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h2
            id="install-modal-title"
            className="font-display text-2xl leading-tight text-[var(--bg-cream)] sm:text-3xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-sm font-bold text-white/80 touch-manipulation"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  onCompleted,
  onRemindLater,
  showStaffHelp = true,
}: {
  onClose: () => void;
  onCompleted: () => void;
  onRemindLater: () => void;
  showStaffHelp?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        type="button"
        onClick={onCompleted}
        className="min-h-[52px] rounded-full bg-[var(--brand-teal)] px-6 py-3 text-lg font-bold text-white touch-manipulation"
      >
        I did it
      </button>
      <button
        type="button"
        onClick={onRemindLater}
        className="min-h-[52px] rounded-full bg-[var(--brand-gold)] px-6 py-3 text-lg font-bold text-[var(--brand-brown)] touch-manipulation"
      >
        Remind me later
      </button>
      {showStaffHelp && (
        <Link
          href="/install"
          onClick={onClose}
          className="flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/25 text-base font-bold text-white touch-manipulation"
        >
          Ask staff for help
        </Link>
      )}
      <button
        type="button"
        onClick={onClose}
        className="min-h-[44px] text-base font-semibold text-white/60 underline touch-manipulation"
      >
        Close
      </button>
    </div>
  );
}

function IosGuideModal({
  onClose,
  onCompleted,
  onRemindLater,
}: {
  onClose: () => void;
  onCompleted: () => void;
  onRemindLater: () => void;
}) {
  const steps = [
    {
      n: 1,
      title: "Tap the Share button",
      hint: "At the bottom of Safari",
      icon: <ShareIcon className="mx-auto h-14 w-14 text-[var(--brand-gold)]" />,
    },
    {
      n: 2,
      title: "Tap Add to Home Screen",
      hint: "Scroll down if you need to",
      icon: <PlusAppIcon className="mx-auto h-14 w-14 text-[var(--brand-gold)]" />,
    },
    {
      n: 3,
      title: "Tap Add",
      hint: "Buddy Dave's will appear on your Home Screen",
      icon: <PhoneHomeMockup />,
    },
  ];

  return (
    <ModalShell title="Add Buddy Dave's to your Home Screen" onClose={onClose}>
      <p className="text-center text-lg text-white/90">Follow these 3 easy steps on your iPhone:</p>
      <ol className="mt-6 space-y-4">
        {steps.map((s) => (
          <li
            key={s.n}
            className="rounded-2xl border-2 border-[var(--brand-gold)]/40 bg-black/25 px-4 py-5 text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand-gold)]">
              Step {s.n}
            </p>
            <div className="mt-4 flex justify-center">{s.icon}</div>
            <p className="mt-3 font-display text-2xl text-[var(--bg-cream)]">{s.title}</p>
            <p className="mt-1 text-base text-white/75">{s.hint}</p>
          </li>
        ))}
      </ol>
      <ModalActions onClose={onClose} onCompleted={onCompleted} onRemindLater={onRemindLater} />
    </ModalShell>
  );
}

function InAppBrowserModal({
  onClose,
  onCopied,
  copyOk,
}: {
  onClose: () => void;
  onCopied: () => void;
  copyOk: boolean | null;
}) {
  return (
    <ModalShell title="Open in Safari first" onClose={onClose}>
      <p className="text-center text-lg leading-relaxed text-white/90">
        To add Buddy Dave&apos;s to your Home Screen, open this link in{" "}
        <strong className="text-[var(--brand-gold)]">Safari</strong>.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onCopied}
          className="min-h-[52px] rounded-full bg-[var(--brand-gold)] px-6 py-3 text-base font-bold text-[var(--brand-brown)] touch-manipulation"
        >
          Copy App Link
        </button>
        {copyOk === true && (
          <p className="text-center text-sm font-semibold text-[var(--brand-teal)]">Link copied!</p>
        )}
        {copyOk === false && (
          <p className="text-center text-sm text-[#ffb4a8]">
            Could not copy — try selecting the address bar.
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="min-h-[52px] rounded-full border-2 border-white/25 px-6 py-3 text-base font-bold text-white touch-manipulation"
        >
          I opened Safari
        </button>
        <Link
          href="/install"
          className="text-center text-sm font-semibold text-[var(--brand-gold)] underline"
          onClick={onClose}
        >
          Ask staff for help
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] text-sm font-semibold text-white/60 underline touch-manipulation"
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
}

function DesktopHintModal({
  onClose,
  onCompleted,
  onRemindLater,
}: {
  onClose: () => void;
  onCompleted: () => void;
  onRemindLater: () => void;
}) {
  return (
    <ModalShell title="Install Buddy Dave's" onClose={onClose}>
      <p className="text-center text-lg text-white/90">
        Look for the <strong className="text-[var(--brand-gold)]">install icon</strong> in your
        browser address bar, or open the browser menu and choose{" "}
        <strong className="text-[var(--brand-gold)]">Install app</strong>.
      </p>
      <ModalActions onClose={onClose} onCompleted={onCompleted} onRemindLater={onRemindLater} />
    </ModalShell>
  );
}

export function EasyInstallAssistant() {
  const pathname = usePathname() ?? "/";
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modal, setModal] = useState<ModalView>("none");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [copyOk, setCopyOk] = useState<boolean | null>(null);

  const refreshVisibility = useCallback(() => {
    setBannerVisible(shouldShowInstallAssistant(pathname));
  }, [pathname]);

  useEffect(() => {
    refreshVisibility();
  }, [refreshVisibility]);

  useEffect(() => {
    if (isPwaInstalled()) {
      setBannerVisible(false);
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      refreshVisibility();
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [refreshVisibility]);

  const hideBanner = useCallback(() => {
    dismissInstallForHours(24);
    setBannerVisible(false);
  }, []);

  const handleRemindLater = useCallback(() => {
    remindInstallLaterDays(7);
    setModal("none");
    setBannerVisible(false);
  }, []);

  const handleCompleted = useCallback(() => {
    markInstallCompleted();
    setModal("none");
    setBannerVisible(false);
  }, []);

  const closeModalDismiss = useCallback(() => {
    dismissInstallForHours(24);
    setModal("none");
  }, []);

  const handleInstallClick = useCallback(async () => {
    markInstallPromptSeen();
    const p = detectInstallPlatform();

    if (p === "in-app") {
      setModal("in-app");
      return;
    }

    if (p === "ios-safari" || p === "ios-other") {
      setModal("ios-guide");
      return;
    }

    if (deferredPrompt && (p === "android-chrome" || p === "desktop-chrome")) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        if (choice.outcome === "accepted") {
          markInstallCompleted();
          setBannerVisible(false);
        } else {
          dismissInstallForHours(24);
          setBannerVisible(false);
        }
      } catch {
        dismissInstallForHours(24);
      }
      return;
    }

    if (p === "desktop-chrome") {
      setModal("desktop-hint");
      return;
    }

    if (p === "android-chrome") {
      setModal("desktop-hint");
      return;
    }

    setModal("ios-guide");
  }, [deferredPrompt]);

  const handleCopyLink = useCallback(async () => {
    setCopyOk(await copyAppLink());
  }, []);

  if (!bannerVisible && modal === "none") return null;

  return (
    <>
      {bannerVisible && modal === "none" && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[var(--brand-gold)] bg-[var(--brand-brown)] px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.25)] pb-[max(1rem,env(safe-area-inset-bottom))]"
          role="region"
          aria-label="Install Buddy Dave's app"
        >
          <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl text-[var(--bg-cream)]">
                Add Buddy Dave&apos;s to My Phone
              </p>
              <p className="mt-0.5 text-sm text-white/80">
                Open Buddy Dave&apos;s like an app for faster ordering.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => void handleInstallClick()}
                className="min-h-[48px] flex-1 rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown)] touch-manipulation sm:flex-none"
              >
                Install App
              </button>
              <button
                type="button"
                onClick={hideBanner}
                className="min-h-[48px] rounded-full border border-white/25 px-4 py-3 text-xs font-bold uppercase text-white/75 touch-manipulation"
                aria-label="Not now"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "ios-guide" && (
        <IosGuideModal
          onClose={closeModalDismiss}
          onCompleted={handleCompleted}
          onRemindLater={handleRemindLater}
        />
      )}

      {modal === "in-app" && (
        <InAppBrowserModal
          onClose={closeModalDismiss}
          onCopied={() => void handleCopyLink()}
          copyOk={copyOk}
        />
      )}

      {modal === "desktop-hint" && (
        <DesktopHintModal
          onClose={closeModalDismiss}
          onCompleted={handleCompleted}
          onRemindLater={handleRemindLater}
        />
      )}
    </>
  );
}
