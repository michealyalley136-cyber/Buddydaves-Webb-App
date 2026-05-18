"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Suspense, useEffect, useState } from "react";
import { useStaffAuth } from "@/context/staff-auth-context";
import { StaffAlertsProvider } from "@/context/staff-alerts-context";
import { LogoMark } from "@/components/logo-mark";

const links = [
  { href: "/staff/dashboard", label: "Orders", key: "orders" as const },
  { href: "/staff/dashboard?view=completed", label: "Completed", key: "completed" as const },
  { href: "/staff/dashboard?view=settings", label: "Settings", key: "settings" as const },
  { href: "/staff/dashboard?view=audit", label: "Daily Audit", key: "audit" as const },
];

export function StaffShell({ children }: { children: React.ReactNode }) {
  return <StaffShellGate>{children}</StaffShellGate>;
}

/** Auth gate — no useSearchParams here (avoids Suspense blocking hydration). */
function StaffShellGate({ children }: { children: React.ReactNode }) {
  const { token, user, authReady, logout } = useStaffAuth();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const signedIn = Boolean(token && user);

  useEffect(() => {
    if (!authReady) {
      const t = window.setTimeout(() => setShowHelp(true), 2000);
      return () => window.clearTimeout(t);
    }
    setShowHelp(false);
  }, [authReady]);

  useEffect(() => {
    if (!authReady || signedIn) return;
    router.replace("/staff/login");
    const fallback = window.setTimeout(() => {
      if (window.location.pathname.startsWith("/staff/dashboard")) {
        window.location.href = "/staff/login";
      }
    }, 1200);
    return () => window.clearTimeout(fallback);
  }, [authReady, signedIn, router]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#121518] px-6 text-center text-sm text-white/70">
        <p>Loading dashboard…</p>
        {showHelp && (
          <Link
            href="/staff/login"
            className="rounded-full bg-[var(--brand-gold)] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)]"
          >
            Go to sign in
          </Link>
        )}
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#121518] px-6 text-center text-sm text-white/70">
        <p>Redirecting to sign in…</p>
        <Link
          href="/staff/login"
          className="rounded-full bg-[var(--brand-gold)] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)]"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <StaffAlertsProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#121518] text-sm text-white/70">
            Loading…
          </div>
        }
      >
        <StaffShellLayout user={user} logout={logout}>
          {children}
        </StaffShellLayout>
      </Suspense>
    </StaffAlertsProvider>
  );
}

function StaffShellLayout({
  children,
  user,
  logout,
}: {
  children: React.ReactNode;
  user: { name: string; role: string };
  logout: () => void;
}) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const tab =
    view === "completed"
      ? "completed"
      : view === "audit"
        ? "audit"
        : view === "settings"
          ? "settings"
          : "orders";

  return (
    <div className="min-h-screen bg-[#121518] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[var(--brand-teal)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <LogoMark size="sm" linked={false} fallbackClassName="text-[var(--bg-cream)]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/75">Buddy Dave&apos;s</p>
              <p className="font-display text-2xl tracking-wide">Line dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="hidden rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/20 sm:inline-flex"
              >
                Admin
              </Link>
            )}
            <div className="text-right text-xs text-white/80">
              <p className="font-semibold">{user.name}</p>
              <button type="button" onClick={logout} className="text-white/70 underline">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-56 shrink-0 self-start rounded-2xl border border-white/10 bg-[#1b1f24] p-3 md:block">
          <nav className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                  tab === l.key ? "bg-white/10 text-[var(--brand-gold)]" : "text-white/70 hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-wrap gap-2 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ring-1 ring-white/10",
                  tab === l.key ? "bg-[var(--brand-gold)] text-[var(--brand-brown)]" : "bg-white/5 text-white/80"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
