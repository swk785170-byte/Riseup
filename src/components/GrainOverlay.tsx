"use client";

import { usePathname } from "next/navigation";

/** The site-wide grain, hidden inside the utilitarian /admin tool. */
export default function GrainOverlay() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <div aria-hidden className="grain-overlay" />;
}
