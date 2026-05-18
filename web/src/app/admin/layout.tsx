"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar, AdminMobileNav } from "@/components/admin-nav";
import { LogoMark } from "@/components/logo-mark";
import { useStaffAuth } from "@/context/staff-auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, user, authReady, logout } = useStaffAuth();
  const router = useRouter();

  const signedIn = Boolean(token && user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!authReady) return;
    if (!signedIn) {
      router.replace("/staff/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/staff/dashboard");
    }
  }, [authReady, signedIn, isAdmin, router]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-cream)] text-sm text-ink/60">
        Loading…
      </div>
    );
  }

  if (!signedIn || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-cream)] text-sm text-ink/60">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-cream)]">
      <header className="border-b border-[var(--line-subtle)] bg-[var(--card-bg)]">
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-4 py-4 md:gap-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark size="sm" linked={false} fallbackClassName="text-[var(--brand-brown)]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal">Administration</p>
              <p className="font-display text-3xl text-[var(--brand-brown)]">Buddy Dave&apos;s</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3 text-sm">
            <Link href="/staff/dashboard" className="font-semibold text-teal hover:underline">
              Staff view
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-[var(--line-subtle)] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/70"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <AdminMobileNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-0 md:flex-row md:gap-8 md:px-6">
        <AdminSidebar />
        <div className="min-w-0 flex-1 px-4 py-6 md:px-0 md:py-8">{children}</div>
      </div>
    </div>
  );
}
