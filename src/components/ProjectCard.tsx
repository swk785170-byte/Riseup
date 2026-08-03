"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrowserMock } from "./ProjectMock";
import type { Project } from "@/lib/projects";

/**
 * Shared project thumbnail card — width-agnostic so it works in the homepage's
 * horizontal scroll row and the /projects grid alike. Fills its container.
 */
export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  // Uploaded thumbnail wins; if it's missing or fails to load we fall back to
  // the CSS browser mock rather than showing a broken image.
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(project.thumbnailUrl) && !imageFailed;

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name} case study`}
      className="group block w-full text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
        <div className="h-full w-full grayscale-[0.35] transition-all duration-700 ease-premium group-hover:scale-[1.04] group-hover:grayscale-0">
          {showImage && project.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt={project.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <BrowserMock tint={project.tint} variant={project.mock} />
          )}
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
  );
}
