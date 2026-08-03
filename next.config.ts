import type { NextConfig } from "next";

/**
 * Allowlist the Supabase Storage host so admin-uploaded images can also be
 * rendered through `next/image`. Without this Next blocks external hosts
 * silently (broken image, no build error) — a common cause of "upload worked,
 * image never appears". Derived from the env var so it follows the project.
 */
const supabaseHostname = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // A stray lockfile exists in the user directory above this project;
  // pin the workspace root so Turbopack doesn't infer the wrong one.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
