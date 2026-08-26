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

  /*
   * Previously this waited for `window.load`, which fires only after EVERY
   * subresource — images, fonts, the lot — has finished. On a media-heavy page
   * that held the splash over an already-interactive site for seconds.
   *
   * This effect runs once React has hydrated, i.e. the page is interactive, so
   * the brand moment now lasts a predictable ~550ms instead of however long
   * the slowest image takes.
   */
  useEffect(() => {
    const MIN_MS = 550;
    let goneTimer = 0;
    const fadeTimer = window.setTimeout(() => {
      setHidden(true);
      goneTimer = window.setTimeout(() => setGone(true), 500);
    }, MIN_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(goneTimer);
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
