"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import CaseStudyModal from "./CaseStudyModal";
import { EASE_PREMIUM } from "@/lib/motion";
import { getFeaturedProjects, type Project } from "@/lib/projects";

const FEATURED = getFeaturedProjects();

export default function FeaturedWork() {
  const [active, setActive] = useState<Project | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

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
          {FEATURED.map((project) => (
            <div
              key={project.slug}
              data-work-card
              className="w-[82vw] shrink-0 snap-start sm:w-[420px] lg:w-[460px]"
            >
              <ProjectCard project={project} onOpen={openProject} />
            </div>
          ))}

          {/* End cap — the full archive */}
          <a
            href="/projects"
            className="group flex w-[70vw] shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-foreground/20 text-center transition-colors duration-500 hover:border-accent sm:w-[340px]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
              <ArrowUpRight size={22} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              View All Projects
            </span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
              50+ launches — see the archive
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
