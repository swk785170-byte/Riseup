"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { EASE_PREMIUM } from "@/lib/motion";

type NavLink = { label: string; href: string; scroll?: boolean };

// Only the pages the site actually has (About + Projects are routes;
// Services + Contact are homepage sections).
const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "#services", scroll: true },
  { label: "Contact", href: "#contact", scroll: true },
];

// Inline brand glyphs (Lucide removed its brand icons in recent versions).
const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/riseupmedia",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/riseupmedia",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/riseupmedia",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@riseupmedia",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
];

export default function Footer() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Hash links scroll in place on the homepage and become "/#section"
  // elsewhere; routes and external links are used as-is.
  const hrefFor = (href: string) =>
    href.startsWith("#") ? (isHome ? href : `/${href}`) : href;

  const intercepts = (link: NavLink) =>
    Boolean(link.scroll) && link.href.startsWith("#") && isHome;

  const toTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      id="insights"
      className="relative border-t border-border bg-background"
    >
      {/* Repeating bold solid-chevron (>>>>) row behind all footer content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='96' viewBox='0 0 72 96'%3E%3Cpath d='M14 14 L54 48 L14 82 L14 56 L34 48 L14 40 Z' fill='%230B0B0B'/%3E%3C/svg%3E\")",
          backgroundSize: "72px 96px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE_PREMIUM }}
        className="relative z-10 mx-auto max-w-7xl px-5 pt-20 pb-10 md:px-10 md:pt-24"
      >
        {/* Top row — nav links + socials */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={hrefFor(link.href)}
                onClick={
                  intercepts(link)
                    ? (e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }
                    : undefined
                }
                className="group relative text-sm font-semibold text-foreground/80 transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-foreground transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-taupe text-foreground transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[17px] w-[17px]"
                  aria-hidden
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Center — email */}
        <div className="mt-12 text-center">
          <a
            href="mailto:hello@riseupmedia.com"
            className="text-base text-charcoal underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline md:text-lg"
          >
            hello@riseupmedia.com
          </a>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-taupe" />

        {/* Bottom row — copyright + legal */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted">
            © 2026 Rise Up Media. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-muted underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>

      {/* Back-to-top — pinned to the footer's top-right, straddling the edge */}
      <div className="absolute top-0 right-5 z-20 -translate-y-1/2 md:right-10">
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-[0_12px_28px_-10px_rgba(11,11,11,0.5)]"
        >
          <ArrowUp size={18} />
        </motion.button>
      </div>
    </footer>
  );
}
