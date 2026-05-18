import { SiteShell } from "@/components/site-shell";
import { InstallPrompt } from "@/components/install-prompt";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteShell>{children}</SiteShell>
      <InstallPrompt />
    </>
  );
}
