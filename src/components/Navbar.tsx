"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { useSiteSettings } from "./SettingsProvider";
import Logo from "./Logo";
import { EASE_PREMIUM } from "@/lib/motion";

type NavChild = { label: string; target: string };
type NavItem =
  | { label: string; target: string; children?: undefined }
  | { label: string; target?: undefined; children: NavChild[] };

const NAV_LINKS: NavItem[] = [
  { label: "Work", target: "#work" },
  { label: "About", target: "/about" },
  {
    label: "Industries",
    children: [
      { label: "LMS", target: "/services/lms" },
      { label: "Smart Systems", target: "/services/smart-systems" },
    ],
  },
  { label: "Pricing", target: "/pricing" },
  { label: "Blog", target: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const settings = useSiteSettings();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Hash links smooth-scroll in place on the homepage and become "/#section"
  // elsewhere so the browser returns to the homepage anchor. Absolute routes
  // (e.g. "/about", "/services/lms") are always used as-is.
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
          {/* Logo */}
          <Link
            href="/"
            aria-label="Rise Up Media — home"
            onClick={() => setOpen(false)}
            className="shrink-0"
          >
            <Logo className="text-[26px] md:text-[32px]" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    className="flex items-center gap-1.5 py-2 text-[12px] font-semibold tracking-[0.18em] text-foreground/80 uppercase transition-colors duration-300 group-hover:text-foreground"
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 ease-premium group-hover:rotate-180"
                    />
                  </button>

                  {/* Minimal fade/slide-down panel (hover + keyboard focus) */}
                  <div className="invisible absolute top-full left-1/2 z-50 w-52 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-300 ease-premium group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-border bg-background/95 p-1.5 backdrop-blur-md">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.target}
                          className="block rounded-lg px-4 py-2.5 text-[12px] font-semibold tracking-[0.14em] text-foreground/70 uppercase transition-colors duration-200 hover:bg-surface hover:text-foreground"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={hrefFor(item.target)}
                    onClick={(e) => handleNav(e, item.target)}
                    className="group relative py-2 text-[12px] font-semibold tracking-[0.18em] text-foreground/80 uppercase transition-colors duration-300 hover:text-foreground"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-accent transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ),
            )}
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
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-background px-6 pt-28 pb-10 md:hidden"
          >
            <nav>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.12 + i * 0.07,
                      ease: EASE_PREMIUM,
                    }}
                  >
                    {item.children ? (
                      <div className="py-3">
                        <div className="flex items-baseline gap-4">
                          <span className="text-[11px] font-bold tracking-[0.2em] text-accent">
                            0{i + 1}
                          </span>
                          <span className="text-5xl font-medium tracking-tight text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <div className="mt-4 ml-9 flex flex-col gap-3">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.target}
                              onClick={() => setOpen(false)}
                              className="text-xl font-medium text-muted transition-colors duration-300 hover:text-foreground"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={hrefFor(item.target)}
                        onClick={(e) => handleNav(e, item.target)}
                        className="group flex items-baseline gap-4 py-3"
                      >
                        <span className="text-[11px] font-bold tracking-[0.2em] text-accent">
                          0{i + 1}
                        </span>
                        <span className="text-5xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-muted">
                          {item.label}
                        </span>
                      </a>
                    )}
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
                href={`mailto:${settings.email}`}
                className="text-sm text-muted"
              >
                {settings.email}
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
