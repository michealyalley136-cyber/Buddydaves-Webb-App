"use client";

import { useEffect } from "react";

const RELOAD_KEY = "bd-chunk-reload";

function isChunkLoadFailure(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";
  return /ChunkLoadError|Loading chunk .* failed/i.test(message);
}

/**
 * Dev/stale-tab recovery: one automatic hard reload when a JS chunk fails to load.
 */
export function ChunkErrorRecovery() {
  useEffect(() => {
    const reloadOnce = (reason: unknown) => {
      if (!isChunkLoadFailure(reason)) return;
      try {
        if (sessionStorage.getItem(RELOAD_KEY) === "1") return;
        sessionStorage.setItem(RELOAD_KEY, "1");
      } catch {
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.set("_cb", String(Date.now()));
      window.location.replace(url.toString());
    };

    const onError = (event: ErrorEvent) => {
      reloadOnce(event.error ?? event.message);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      reloadOnce(event.reason);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
