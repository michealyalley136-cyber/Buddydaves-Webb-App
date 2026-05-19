import { SiteShell } from "@/components/site-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { DevRuntimeNotice } from "@/components/dev-runtime-notice";
import { WelcomeIntroModal } from "@/components/welcome-intro-modal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WelcomeIntroModal />
      <DevRuntimeNotice />
      <SiteShell>{children}</SiteShell>
      <InstallPrompt />
    </>
  );
}
