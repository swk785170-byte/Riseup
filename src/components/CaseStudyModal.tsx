"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { BrowserMock } from "./ProjectMock";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { EASE_PREMIUM } from "@/lib/motion";
import type { MockVariant, Project, Tint } from "@/lib/projects";

/**
 * An uploaded screenshot when one exists, otherwise the CSS browser mock —
 * also falling back if the image URL fails to load, so the modal never shows a
 * broken image.
 */
function ProjectMedia({
  src,
  alt,
  tint,
  variant,
}: {
  src?: string | null;
  alt: string;
  tint: Tint;
  variant: MockVariant;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    );
  }
  return <BrowserMock tint={tint} variant={variant} />;
}

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
  const gallery = project.galleryUrls ?? [];

  /*
   * Every one of these is optional in the admin form, so a project can be
   * saved with any of them blank. Render a section only when it has content —
   * otherwise the heading (and, for results, its bordered list rule) shows up
   * over an empty space. Rows are guarded too, in case one was saved empty.
   */
  const summary = project.summary.trim();
  const challenge = project.challenge.trim();
  const solution = project.solution.trim();
  const tags = project.tags.filter((tag) => tag.trim().length > 0);
  const results = project.results.filter(
    (r) => r.value.trim().length > 0 && r.label.trim().length > 0,
  );
  const hasDetail = Boolean(challenge || solution || tags.length > 0);
  const hasResults = results.length > 0;

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
            {summary && (
              <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">
                {summary}
              </p>
            )}

            {/* Hero artwork — uploaded thumbnail, else the CSS mock.
                Letterboxed so the whole image is visible, never cropped. */}
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface">
              <ProjectMedia
                src={project.thumbnailUrl}
                alt={project.name}
                tint={project.tint}
                variant={project.mock}
              />
            </div>

            {(hasDetail || hasResults) && (
              <div
                /* Drop to one column when only one side has content, so the
                   remaining copy isn't squeezed into a narrow column beside a
                   gap where the other section would have been. */
                className={`mt-12 grid gap-12 md:gap-16 ${
                  hasDetail && hasResults ? "md:grid-cols-[1.4fr_1fr]" : ""
                }`}
              >
                {hasDetail && (
                  <div className="flex flex-col gap-10">
                    {challenge && (
                      <div>
                        <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                          The Challenge
                        </h4>
                        <p className="mt-4 leading-relaxed text-foreground/85">
                          {challenge}
                        </p>
                      </div>
                    )}
                    {solution && (
                      <div>
                        <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                          The Solution
                        </h4>
                        <p className="mt-4 leading-relaxed text-foreground/85">
                          {solution}
                        </p>
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wider text-foreground/70 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {hasResults && (
                  <div>
                    <h4 className="text-[12px] font-bold tracking-[0.25em] text-muted uppercase">
                      The Results
                    </h4>
                    <ul className="mt-4 divide-y divide-border border-y border-border">
                      {results.map((r, i) => (
                        <li
                          key={`${r.label}-${i}`}
                          className="flex items-baseline gap-4 py-5"
                        >
                          <span className="min-w-24 text-3xl font-medium tracking-tight text-accent">
                            {r.value}
                          </span>
                          <span className="text-sm text-muted">{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Every uploaded gallery image, uncropped. Omitted entirely when
                the project has no gallery beyond its thumbnail. */}
            {gallery.length > 0 && (
              <div className="mt-14 grid gap-5 sm:grid-cols-2">
                {gallery.map((url, i) => (
                  <div
                    key={url}
                    className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface"
                  >
                    <ProjectMedia
                      src={url}
                      alt={`${project.name} — screen ${i + 1}`}
                      tint={project.tint}
                      variant={project.secondaryMock}
                    />
                  </div>
                ))}
              </div>
            )}

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
