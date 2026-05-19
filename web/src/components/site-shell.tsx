"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

/** Reset scroll lock if a prior session left the mobile menu open. */
function ResetPageScrollLock() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "";
    document.body.classList.remove("bd-kitchen-mode", "bd-staff-alert-pulse", "bd-staff-alert-pulse-strong");
  }, [pathname]);

  return null;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <ResetPageScrollLock />
      <Header />
      <main className="relative isolate z-10 flex w-full min-h-0 flex-1 flex-col pointer-events-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
