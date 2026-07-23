"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import CaseStudyModal from "./CaseStudyModal";
import { type Project } from "@/lib/projects";
import { EASE_PREMIUM } from "@/lib/motion";

export default function LMSCustomers({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="customers" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="Customers"
          title={
            <>
              Institutions running{" "}
              <span className="accent-underline">on Rise Up</span>
            </>
          }
          sub="Schools and institutes already managing thousands of students on the platform. Open a card for the full case study."
        />

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_PREMIUM }}
            >
              <ProjectCard project={project} onOpen={setActive} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <CaseStudyModal project={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
