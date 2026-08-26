"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProjectsGrid from "./ProjectsGrid";
import ProjectsPagination from "./ProjectsPagination";
import CaseStudyModal from "./CaseStudyModal";
import type { Project } from "@/lib/projects";

const PAGE_SIZE = 6;

/**
 * Stateful composer for the archive: owns the visible count (Load More) and
 * the open case study, and keeps the grid and pagination in sync.
 *
 * Category filtering was removed — every project is listed in one run.
 */
export default function ProjectsArchive({
  projects,
}: {
  projects: Project[];
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState<Project | null>(null);

  const shown = projects.slice(0, visible);
  const hasMore = visible < projects.length;

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <ProjectsGrid projects={shown} onOpen={setActive} />
        <ProjectsPagination
          hasMore={hasMore}
          remaining={projects.length - visible}
          onLoadMore={() => setVisible((v) => v + PAGE_SIZE)}
        />
      </div>

      <AnimatePresence>
        {active && (
          <CaseStudyModal project={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
