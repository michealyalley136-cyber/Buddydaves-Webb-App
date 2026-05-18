"use client";

import { CartProvider } from "@/context/cart-context";
import { StaffAuthProvider } from "@/context/staff-auth-context";
import { useEffect } from "react";

const LEGACY_CACHE_PREFIX = "buddy-daves";

/** Unregister SW and remove only our legacy caches (never wipe all Cache Storage). */
function ClearLegacyPwaCaches() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) void reg.unregister();
    });

    if ("caches" in window) {
      void caches.keys().then((keys) => {
        for (const key of keys) {
          if (key.startsWith(LEGACY_CACHE_PREFIX)) void caches.delete(key);
        }
      });
    }
  }, []);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StaffAuthProvider>
      <CartProvider>
        <ClearLegacyPwaCaches />
        {children}
      </CartProvider>
    </StaffAuthProvider>
  );
}
