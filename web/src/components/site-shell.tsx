"use client";

import { Header } from "./header";
import { Footer } from "./footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <Header />
      <main className="relative isolate z-10 flex w-full min-h-0 flex-1 flex-col pointer-events-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
