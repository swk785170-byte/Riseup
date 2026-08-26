"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/** Smooth-scrolls to a CSS selector target, falling back to native scroll. */
export function useScrollTo(): (target: string) => void {
  const lenis = useLenis();
  return useCallback(
    (target: string) => {
      // Nothing to scroll to on this page (e.g. a homepage anchor on /about)
      if (typeof document !== "undefined" && !document.querySelector(target)) {
        return;
      }
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.4,
          force: true,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        document
          .querySelector(target)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  /*
   * Loaded on demand rather than imported at the top of the file.
   *
   * This component lives in the root layout, so a static import would put
   * gsap + ScrollTrigger + lenis into the shared bundle that EVERY page
   * downloads before it can render — including pages with no animation at
   * all. Importing inside the effect keeps them off the critical path and
   * out of the first load entirely.
   */
  useEffect(() => {
    if (isAdmin) return; // the admin tool uses native scrolling

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    void (async () => {
      const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      // Unmounted (or navigated to /admin) while the chunk was in flight.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const instance = new LenisCtor({ lerp: 0.05 });
      instance.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      setLenis(instance);

      cleanup = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        setLenis(null);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [isAdmin]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
