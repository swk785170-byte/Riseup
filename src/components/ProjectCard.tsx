"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrowserMock } from "./ProjectMock";
import BrowserMockup from "./BrowserMockup";
import type { Project } from "@/lib/projects";

/**
 * Shared project card — width-agnostic so it works in the homepage's horizontal
 * scroll row and the /projects grid alike, which keeps the two from drifting.
 *
 * There is no outer card box: the browser mockup (chrome, frame, shadow) IS the
 * card, sitting directly on the section background with no outline or fill.
 *
 * Preview source order: the curated `cardPreviewUrl` crop wins; otherwise the
 * full `thumbnailUrl`; otherwise the CSS browser mock — so projects render
 * cleanly before the team backfills curated crops.
 *
 * Note this is the CARD treatment only — the case-study modal still shows every
 * gallery image uncropped via object-contain.
 */
export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const preview = project.cardPreviewUrl || project.thumbnailUrl || null;
  const showImage = Boolean(preview) && !imageFailed;

  // Lives inside the frame so it tilts and clips with the mockup.
  const hoverOverlay = (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/15">
      <span className="flex translate-y-3 items-center gap-2 rounded-full bg-background px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase opacity-0 shadow-lg transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
        View Project
        <ArrowUpRight size={14} strokeWidth={2.5} />
      </span>
    </div>
  );

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name} case study`}
      className="group block w-full text-left"
    >
      {showImage && preview ? (
        <BrowserMockup
          bare
          src={preview}
          alt={project.name}
          onImageError={() => setImageFailed(true)}
          overlay={hoverOverlay}
        />
      ) : (
        <BrowserMockup bare alt={project.name} overlay={hoverOverlay}>
          <BrowserMock tint={project.tint} variant={project.mock} />
        </BrowserMockup>
      )}

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
