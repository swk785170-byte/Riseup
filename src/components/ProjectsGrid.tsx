"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { EASE_PREMIUM } from "@/lib/motion";
import type { Project } from "@/lib/projects";

// Staggered entrance per batch of 6 (initial load + each "Load More").
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_PREMIUM, delay: (i % 6) * 0.06 },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.35, ease: EASE_PREMIUM },
  },
};

export default function ProjectsGrid({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (project: Project) => void;
}) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            layout
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <ProjectCard project={project} onOpen={onOpen} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
