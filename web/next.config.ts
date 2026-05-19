import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root (parent of `web/`) so tracing & inference match this project, not a stray lockfile. */
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  async redirects() {
    return [
      {
        source: "/training/buddy-daves-owner-training-guide.html",
        destination: "/owner-guide",
        permanent: true,
      },
    ];
  },
  /**
   * Proxy `/api/*` to Express. Local default: localhost:4000.
   * Railway: set API_PROXY_TARGET to your server service URL before `npm run build`.
   */
  async rewrites() {
    const api =
      process.env.API_PROXY_TARGET?.trim() ||
      process.env.API_URL?.trim() ||
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      "http://localhost:4000";
    const base = api.replace(/\/$/, "");
    console.log(`[web] Rewrite proxy target: ${base}`);
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
