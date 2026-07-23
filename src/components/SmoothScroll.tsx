"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  useEffect(() => {
    if (isAdmin) return; // the admin tool uses native scrolling
    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({ lerp: 0.05 });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [isAdmin]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
