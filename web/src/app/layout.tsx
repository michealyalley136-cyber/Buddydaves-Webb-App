import type { Metadata, Viewport } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const display = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Buddy Dave's",
  title: {
    default: "Buddy Dave's — Local Eats • Frozen Treats • Root Beer",
    template: "%s | Buddy Dave's",
  },
  description:
    "Locally-owned diner in Sevierville, Tennessee. Sandwiches, sides, frozen treats, and fresh root beer. Pickup & drive-thru.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Buddy Dave's",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/images/buddy-daves-logo.png",
    apple: "/images/buddy-daves-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f6c74",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${bodyFont.variable}`}>
      <body className={`${display.variable} ${bodyFont.variable} min-h-screen bg-cream font-body text-ink antialiased`}>
        <noscript>
          <div
            style={{
              padding: "1rem",
              background: "#4a2f22",
              color: "#f6f1e7",
              textAlign: "center",
              fontFamily: "system-ui,sans-serif",
            }}
          >
            Buddy Dave&apos;s needs JavaScript enabled. Please enable it to order online.
          </div>
        </noscript>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
