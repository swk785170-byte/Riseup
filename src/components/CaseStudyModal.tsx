"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { BrowserMock } from "./ProjectMock";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { EASE_PREMIUM } from "@/lib/motion";
import type { Project } from "@/lib/projects";

/**
 * Slide-up case-study overlay. Locks background scroll while mounted and
 * routes its CTA to the homepage contact section from any page.
 */
export default function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Freeze background scroll while the modal is mounted
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClose();
    if (isHome) {
      e.preventDefault();
      scrollTo("#contact");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close case study"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 w-full cursor-pointer bg-foreground/45 backdrop-blur-sm"
      />

      {/* Panel sliding up from the bottom */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.75, ease: EASE_PREMIUM }}
        className="absolute inset-x-0 top-[5vh] bottom-0 overflow-hidden rounded-t-3xl bg-background shadow-[0_-24px_80px_-20px_rgba(10,10,10,0.5)] md:top-[7vh]"
      >
        <span className="absolute top-3 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-border" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-colors duration-300 hover:bg-accent hover:text-background"
        >
          <X size={18} />
        </button>

        <div
          data-lenis-prevent
          className="h-full overflow-y-auto overscroll-contain px-5 pt-14 pb-16 md:px-12"
        >
          <div className="mx-auto max-w-5xl">
            <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-accent uppercase">
              {project.category} — {project.year}
            </p>
            <h3 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">
              {project.name}
            </h3>
            <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">
              {project.summary}
            </p>

            {/* Hero mock */}
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <BrowserMock tint={project.tint} variant={project.mock} />
            </div>

            <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
              <div className="flex flex-col gap-10">
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                    The Challenge
                  </h4>
                  <p className="mt-4 leading-relaxed text-foreground/85">
                    {project.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                    The Solution
                  </h4>
                  <p className="mt-4 leading-relaxed text-foreground/85">
                    {project.solution}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wider text-foreground/70 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                  The Results
                </h4>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {project.results.map((r) => (
                    <li key={r.label} className="flex items-baseline gap-4 py-5">
                      <span className="min-w-24 text-3xl font-medium tracking-tight text-accent">
                        {r.value}
                      </span>
                      <span className="text-sm text-muted">{r.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Secondary screens */}
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                <BrowserMock tint={project.tint} variant={project.secondaryMock} />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                <BrowserMock
                  tint={project.tint}
                  variant={project.mock === "landing" ? "editorial" : "landing"}
                />
              </div>
            </div>

            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl bg-surface/70 p-8 sm:flex-row sm:items-center md:p-10">
              <p className="max-w-md text-lg font-medium tracking-tight">
                Want results like {project.client}&rsquo;s? Let&rsquo;s talk
                about your project.
              </p>
              <a
                href={isHome ? "#contact" : "/#contact"}
                onClick={handleCta}
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
              >
                Start Your Project
                <ArrowRight size={15} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
