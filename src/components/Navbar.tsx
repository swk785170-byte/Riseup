"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { EASE_PREMIUM } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Work", target: "#work" },
  { label: "Services", target: "#services" },
  { label: "About", target: "/about" },
  { label: "Insights", target: "#insights" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Hash links smooth-scroll in place on the homepage and become "/#section"
  // elsewhere so the browser returns to the homepage anchor. Absolute routes
  // (e.g. "/about") are always used as-is.
  const hrefFor = (target: string) => {
    if (!target.startsWith("#")) return target;
    return isHome ? target : `/${target}`;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Freeze the page behind the full-screen menu
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    return () => lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (
    event: React.MouseEvent<HTMLElement>,
    target: string,
  ) => {
    setOpen(false);
    // Only intercept in-page hash links on the homepage; let the browser
    // handle route links ("/about") and off-home anchors normally.
    if (!target.startsWith("#") || !isHome) return;
    event.preventDefault();
    scrollTo(target);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-premium ${
          scrolled && !open
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
          {/* Wordmark */}
          <a
            href={isHome ? "#top" : "/"}
            onClick={(e) => handleNav(e, "#top")}
            className="text-[13px] font-black tracking-[0.2em] whitespace-nowrap"
          >
            RISE UP MEDIA<span className="text-accent">.</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={hrefFor(link.target)}
                  onClick={(e) => handleNav(e, link.target)}
                  className="group relative py-2 text-[12px] font-semibold tracking-[0.18em] text-foreground/80 uppercase transition-colors duration-300 hover:text-foreground"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-accent transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* CTA pill */}
            <a
              href={hrefFor("#contact")}
              onClick={(e) => handleNav(e, "#contact")}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal sm:inline-flex"
            >
              Let&rsquo;s Talk
            </a>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span
                className={`absolute h-[2px] w-6 bg-foreground transition-all duration-400 ease-premium ${
                  open ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-[2px] w-6 bg-foreground transition-all duration-400 ease-premium ${
                  open ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-background px-6 pt-28 pb-10 md:hidden"
          >
            <nav>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.12 + i * 0.07,
                      ease: EASE_PREMIUM,
                    }}
                  >
                    <a
                      href={hrefFor(link.target)}
                      onClick={(e) => handleNav(e, link.target)}
                      className="group flex items-baseline gap-4 py-3"
                    >
                      <span className="text-[11px] font-bold tracking-[0.2em] text-accent">
                        0{i + 1}
                      </span>
                      <span className="text-5xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-muted">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE_PREMIUM }}
              className="flex flex-col gap-5 border-t border-border pt-6"
            >
              <a
                href="mailto:hello@riseupmedia.com"
                className="text-sm text-muted"
              >
                hello@riseupmedia.com
              </a>
              <a
                href={hrefFor("#contact")}
                onClick={(e) => handleNav(e, "#contact")}
                className="inline-flex w-fit rounded-full bg-accent px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-background uppercase"
              >
                Let&rsquo;s Talk
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
