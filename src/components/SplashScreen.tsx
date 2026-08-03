"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

/**
 * Brief branded splash on a full page load — the rising-logo loader over the
 * background, which fades out once the page is ready. Only mounts once per full
 * load (the root layout persists across client navigations, where app/loading
 * handles transitions instead). Excluded from the utilitarian /admin tool.
 */
export default function SplashScreen() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const MIN_MS = 550;
    const start = performance.now();
    let fadeTimer = 0;
    let goneTimer = 0;
    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      fadeTimer = window.setTimeout(() => {
        setHidden(true);
        goneTimer = window.setTimeout(() => setGone(true), 500);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(goneTimer);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (gone || pathname?.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <LoadingScreen />
    </div>
  );
}
