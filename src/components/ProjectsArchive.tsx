"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProjectFilters from "./ProjectFilters";
import ProjectsGrid from "./ProjectsGrid";
import ProjectsPagination from "./ProjectsPagination";
import CaseStudyModal from "./CaseStudyModal";
import { filterProjects, type FilterKey, type Project } from "@/lib/projects";

const PAGE_SIZE = 6;

/**
 * Stateful composer for the archive: owns the active filter, the visible
 * count (Load More), and the open case study. Keeps the three presentational
 * children (filters / grid / pagination) in sync.
 */
export default function ProjectsArchive() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState<Project | null>(null);

  const filtered = useMemo(() => filterProjects(filter), [filter]);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const changeFilter = (key: FilterKey) => {
    setFilter(key);
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      <ProjectFilters active={filter} onChange={changeFilter} />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <ProjectsGrid projects={shown} onOpen={setActive} />
        <ProjectsPagination
          hasMore={hasMore}
          remaining={filtered.length - visible}
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
