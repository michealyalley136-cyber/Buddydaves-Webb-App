"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiSend } from "@/lib/api";
import { useStaffAuth, type AuthUser } from "@/context/staff-auth-context";
import { LogoMark } from "@/components/logo-mark";

type LoginResponse = { token: string; user: AuthUser };

export default function StaffLoginPage() {
  const router = useRouter();
  const { setSession, token, user, authReady } = useStaffAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!authReady || !token || !user) return;
    router.replace(user.role === "admin" ? "/admin" : "/staff/dashboard");
  }, [authReady, token, user, router]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await apiSend<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(res.token, res.user);
      router.push(res.user.role === "admin" ? "/admin" : "/staff/dashboard");
    } catch {
      setError("Those credentials didn’t match our kitchen roster.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-brown)] text-[var(--bg-cream)]">
      <div className="pointer-events-none absolute inset-0 opacity-40 grain" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#1b1f24] p-8 shadow-diner">
          <div className="flex justify-center">
            <LogoMark size="hero" linked={false} fallbackClassName="text-[var(--bg-cream)]" />
          </div>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-gold)]">
            Staff access
          </p>
          <h1 className="mt-2 text-center font-display text-4xl">Buddy Dave&apos;s</h1>
          <p className="mt-2 text-center text-sm text-white/65">Sign in to manage the line.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-white/55">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none ring-[var(--brand-gold)]/40 focus:ring-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-white/55">
              Password
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none ring-[var(--brand-gold)]/40 focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error && <p className="text-sm text-[#ffb4a8]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-[var(--brand-teal)] py-3 text-sm font-bold uppercase tracking-wide text-white ring-1 ring-white/10 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <Link href="/" className="mt-6 block text-center text-sm text-white/60 hover:text-white">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
