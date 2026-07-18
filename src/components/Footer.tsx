"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useScrollTo } from "./SmoothScroll";

type FooterLink = { label: string; href: string; scroll?: boolean };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Client Stories", href: "#about", scroll: true },
      { label: "Careers", href: "mailto:hello@riseupmedia.com?subject=Careers" },
      { label: "Contact", href: "#contact", scroll: true },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web Design & UI/UX", href: "#services", scroll: true },
      { label: "Web Development", href: "#services", scroll: true },
      { label: "E-Commerce", href: "#services", scroll: true },
      { label: "SEO & Performance", href: "#services", scroll: true },
      { label: "Support & Maintenance", href: "#services", scroll: true },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Alpine Ridge Outfitters", href: "#work", scroll: true },
      { label: "Vantage Analytics", href: "#work", scroll: true },
      { label: "Meridian Legal", href: "#work", scroll: true },
      { label: "Bloom & Root", href: "#work", scroll: true },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com/riseupmedia" },
      { label: "LinkedIn", href: "https://linkedin.com/company/riseupmedia" },
      { label: "X / Twitter", href: "https://x.com/riseupmedia" },
      { label: "Dribbble", href: "https://dribbble.com/riseupmedia" },
    ],
  },
];

export default function Footer() {
  const scrollTo = useScrollTo();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Hash links smooth-scroll in place on the homepage and become "/#section"
  // elsewhere; routes ("/about") and external/mailto links are used as-is.
  const hrefFor = (href: string) =>
    href.startsWith("#") ? (isHome ? href : `/${href}`) : href;

  // A hash link is only intercepted for smooth-scroll while on the homepage.
  const intercepts = (link: FooterLink) =>
    Boolean(link.scroll) && link.href.startsWith("#") && isHome;

  return (
    <footer id="insights" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_repeat(4,1fr)] md:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start gap-5">
            <a
              href={isHome ? "#top" : "/"}
              onClick={
                isHome
                  ? (e) => {
                      e.preventDefault();
                      scrollTo("#top");
                    }
                  : undefined
              }
              className="text-[13px] font-black tracking-[0.2em]"
            >
              RISE UP MEDIA<span className="text-accent">.</span>
            </a>
            <p className="max-w-60 text-sm leading-relaxed text-muted">
              A web development agency for businesses that expect their website
              to work as hard as they do.
            </p>
            <a
              href="mailto:hello@riseupmedia.com"
              className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-300 hover:text-accent"
            >
              hello@riseupmedia.com
            </a>
          </div>

          {/* Directory */}
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[11px] font-bold tracking-[0.25em] text-muted uppercase">
                {col.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={hrefFor(link.href)}
                      onClick={
                        intercepts(link)
                          ? (e) => {
                              e.preventDefault();
                              scrollTo(link.href);
                            }
                          : undefined
                      }
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm text-foreground/70 transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-5 border-t border-border pt-7 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Rise Up Media. All rights reserved.
          </p>
          <p className="hidden text-xs font-semibold tracking-[0.2em] text-muted uppercase sm:block">
            Built to convert<span className="text-accent">.</span>
          </p>
          <button
            type="button"
            onClick={() => scrollTo("#top")}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
