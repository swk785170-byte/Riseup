"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useLenis, useScrollTo } from "./SmoothScroll";
import { EASE_PREMIUM } from "@/lib/motion";

type MockVariant = "landing" | "dashboard" | "commerce" | "editorial";

type Tint = { bg: string; deep: string; soft: string };

type Project = {
  slug: string;
  name: string;
  client: string;
  category: string;
  year: string;
  tint: Tint;
  mock: MockVariant;
  secondaryMock: MockVariant;
  summary: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    slug: "alpine-ridge",
    name: "Alpine Ridge Outfitters",
    client: "Alpine Ridge",
    category: "E-Commerce",
    year: "2025",
    tint: { bg: "#e7e0d2", deep: "#3e4a3d", soft: "#c6bba4" },
    mock: "commerce",
    secondaryMock: "landing",
    summary: "A headless storefront for a heritage outdoor gear brand.",
    challenge:
      "Alpine Ridge was selling premium gear through a sluggish template store — 6-second loads, a 78% cart abandonment rate and a mobile experience that buried their best products.",
    solution:
      "We rebuilt the store as a headless commerce experience on Next.js: sub-second page loads, an edge-cached catalogue, one-page checkout and merchandising blocks the team edits without a developer.",
    results: [
      { value: "+212%", label: "Online revenue in 6 months" },
      { value: "0.9s", label: "Largest Contentful Paint" },
      { value: "+38%", label: "Average order value" },
    ],
    tags: ["Headless Commerce", "Next.js", "CRO", "Art Direction"],
  },
  {
    slug: "vantage-analytics",
    name: "Vantage Analytics",
    client: "Vantage",
    category: "SaaS",
    year: "2025",
    tint: { bg: "#dde3ea", deep: "#1f2a44", soft: "#b7c3d4" },
    mock: "dashboard",
    secondaryMock: "landing",
    summary: "A marketing site that finally matched the product's ambition.",
    challenge:
      "A category-leading analytics product was losing demos to competitors with sharper stories. The old site explained features; it never sold outcomes — and bounce rates showed it.",
    solution:
      "We rewrote the narrative around customer outcomes, designed an interactive product tour and shipped a CMS-driven site the marketing team iterates on weekly, with A/B testing wired in from day one.",
    results: [
      { value: "+64%", label: "Demo bookings" },
      { value: "-41%", label: "Bounce rate" },
      { value: "12", label: "Keywords ranked #1" },
    ],
    tags: ["Brand Narrative", "Webflow → Next.js", "A/B Testing", "SEO"],
  },
  {
    slug: "meridian-legal",
    name: "Meridian Legal",
    client: "Meridian",
    category: "Corporate",
    year: "2024",
    tint: { bg: "#e9e2dc", deep: "#4a3a33", soft: "#cdbfb3" },
    mock: "editorial",
    secondaryMock: "landing",
    summary: "Quiet authority for a boutique commercial law firm.",
    challenge:
      "Meridian's referrals were strong, but their site read like a directory listing. High-value clients researching the firm found nothing that justified premium fees.",
    solution:
      "An editorial redesign built on typography and case results: practice-area landing pages engineered for search intent, attorney profiles that convert, and a publishing pipeline for insights that compound authority.",
    results: [
      { value: "+148%", label: "Qualified enquiries" },
      { value: "3×", label: "Organic traffic in a year" },
      { value: "100", label: "Lighthouse performance" },
    ],
    tags: ["Editorial Design", "Technical SEO", "CMS", "Accessibility"],
  },
  {
    slug: "bloom-root",
    name: "Bloom & Root",
    client: "Bloom & Root",
    category: "D2C Brand",
    year: "2024",
    tint: { bg: "#e2e8de", deep: "#39503c", soft: "#d9c3b4" },
    mock: "landing",
    secondaryMock: "commerce",
    summary: "A subscription experience that made plant care feel effortless.",
    challenge:
      "Bloom & Root's plant subscription had loyal customers but a leaky funnel — a five-step signup, no way to pause deliveries and a brand that photographed beautifully yet converted poorly online.",
    solution:
      "We collapsed signup to ninety seconds, built a self-serve subscription portal with pause-and-swap, and rebuilt the brand system around lush photography with performance budgets that kept it fast.",
    results: [
      { value: "+87%", label: "Subscription starts" },
      { value: "52%", label: "Repeat purchase rate" },
      { value: "1.2s", label: "Time to interactive" },
    ],
    tags: ["Subscriptions", "Brand System", "Next.js", "Performance"],
  },
];

/* ------------------------------------------------------------------ */
/*  Pure-CSS website mockup used as project artwork                    */
/* ------------------------------------------------------------------ */

function MockBlocks({ variant, tint }: { variant: MockVariant; tint: Tint }) {
  if (variant === "commerce") {
    return (
      <div className="grid flex-1 grid-cols-3 gap-[4%] p-[6%]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-[8%]">
            <div
              className="w-full flex-1 rounded-[4px]"
              style={{ background: i % 2 === 0 ? tint.soft : tint.bg }}
            />
            <div
              className="h-[7%] w-4/5 rounded-full"
              style={{ background: tint.deep, opacity: 0.55 }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="flex flex-1 gap-[4%] p-[6%]">
        <div
          className="h-full w-[22%] rounded-[4px]"
          style={{ background: tint.deep, opacity: 0.85 }}
        />
        <div className="flex flex-1 flex-col justify-end gap-[6%]">
          <div className="flex flex-1 items-end gap-[5%]">
            {[38, 62, 46, 82, 58, 95, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{
                  height: `${h}%`,
                  background: i === 5 ? tint.deep : tint.soft,
                }}
              />
            ))}
          </div>
          <div
            className="h-[9%] w-2/3 rounded-full"
            style={{ background: tint.deep, opacity: 0.5 }}
          />
        </div>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div className="flex flex-1 flex-col gap-[5%] p-[7%]">
        <div
          className="h-[16%] w-3/4 rounded-[3px]"
          style={{ background: tint.deep, opacity: 0.8 }}
        />
        <div
          className="h-[6%] w-1/2 rounded-full"
          style={{ background: tint.deep, opacity: 0.35 }}
        />
        <div className="mt-auto flex h-[46%] gap-[4%]">
          <div
            className="h-full flex-1 rounded-[4px]"
            style={{ background: tint.soft }}
          />
          <div className="flex h-full flex-1 flex-col gap-[8%]">
            {[0.5, 0.38, 0.44, 0.3].map((o, i) => (
              <div
                key={i}
                className="h-[12%] w-full rounded-full"
                style={{ background: tint.deep, opacity: o }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // landing
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[5%] p-[7%]">
      <div
        className="h-[14%] w-4/5 rounded-[3px]"
        style={{ background: tint.deep, opacity: 0.8 }}
      />
      <div
        className="h-[14%] w-3/5 rounded-[3px]"
        style={{ background: tint.deep, opacity: 0.8 }}
      />
      <div
        className="h-[6%] w-2/5 rounded-full"
        style={{ background: tint.deep, opacity: 0.35 }}
      />
      <div className="h-[11%] w-[26%] rounded-full bg-foreground" />
      <div className="mt-[3%] flex h-[22%] w-full gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-full flex-1 rounded-[4px]"
            style={{ background: i === 1 ? tint.soft : tint.bg }}
          />
        ))}
      </div>
    </div>
  );
}

function BrowserMock({
  tint,
  variant,
  className = "",
}: {
  tint: Tint;
  variant: MockVariant;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(150deg, ${tint.bg} 0%, ${tint.soft} 130%)`,
      }}
    >
      <div className="absolute inset-x-[9%] top-[10%] bottom-0 flex flex-col overflow-hidden rounded-t-lg bg-[#fbfaf8] shadow-[0_18px_44px_-18px_rgba(10,10,10,0.4)]">
        {/* Browser chrome */}
        <div className="flex h-[8%] min-h-6 items-center gap-1.5 border-b border-black/5 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          <span className="ml-2 h-2 w-2/5 rounded-full bg-black/[0.06]" />
        </div>
        <MockBlocks variant={variant} tint={tint} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Case-study modal                                                   */
/* ------------------------------------------------------------------ */

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  scrollTo("#contact");
                }}
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

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function FeaturedWork() {
  const [active, setActive] = useState<Project | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const lenis = useLenis();

  // Freeze background scroll while the case study is open
  useEffect(() => {
    if (active) lenis?.stop();
    else lenis?.start();
    return () => lenis?.start();
  }, [active, lenis]);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-work-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Mouse drag-to-scroll (touch uses native scrolling)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = () => {
    drag.current.down = false;
  };

  const openProject = (project: Project) => {
    if (drag.current.moved) return;
    setActive(project);
  };

  return (
    <section id="work" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Selected Work"
            title={
              <>
                Recent projects,{" "}
                <span className="accent-underline">real results</span>
              </>
            }
            sub="Every engagement ships with numbers attached. Drag through a few favourites — click any project for the full case study."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScroll.left}
              aria-label="Previous projects"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScroll.right}
              aria-label="Next projects"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal row — full-bleed, draggable */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1, ease: EASE_PREMIUM }}
      >
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-24 select-none active:cursor-grabbing md:px-10 md:pb-32"
        >
          {PROJECTS.map((project) => (
            <button
              key={project.slug}
              type="button"
              data-work-card
              onClick={() => openProject(project)}
              aria-label={`Open ${project.name} case study`}
              className="group w-[82vw] shrink-0 snap-start text-left sm:w-[420px] lg:w-[460px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                <div className="h-full w-full grayscale-[0.35] transition-all duration-700 ease-premium group-hover:scale-[1.04] group-hover:grayscale-0">
                  <BrowserMock tint={project.tint} variant={project.mock} />
                </div>
                {/* Hover veil + view pill */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/15">
                  <span className="flex translate-y-3 items-center gap-2 rounded-full bg-background px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase opacity-0 shadow-lg transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                    View Project
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4 px-1">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.client} — {project.category}
                  </p>
                </div>
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </button>
          ))}

          {/* End cap — view all */}
          <a
            href="mailto:hello@riseupmedia.com?subject=Portfolio%20request"
            className="group flex w-[70vw] shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-foreground/20 text-center transition-colors duration-500 hover:border-accent sm:w-[340px]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
              <ArrowUpRight size={22} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              View All Projects
            </span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
              50+ launches — request the deck
            </span>
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {active && (
          <CaseStudyModal project={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
