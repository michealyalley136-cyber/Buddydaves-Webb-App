"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 mx-auto mb-[env(safe-area-inset-bottom)] max-w-md rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4 shadow-diner md:left-auto md:right-6">
      <p className="text-sm font-semibold text-[var(--brand-brown)]">Add Buddy Dave&apos;s to your home screen</p>
      <p className="mt-1 text-xs text-ink/65">Quick ordering, offline-friendly loading, diner vibes on tap.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-full bg-[var(--brand-teal)] py-2 text-xs font-bold uppercase tracking-wide text-white"
          onClick={async () => {
            await deferred.prompt();
            setVisible(false);
            setDeferred(null);
          }}
        >
          Install
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--line-subtle)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink/70"
          onClick={() => setVisible(false)}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
