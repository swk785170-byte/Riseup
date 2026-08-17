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
 * Preview source order: the curated `cardPreviewUrl` crop wins; otherwise the
 * full `thumbnailUrl`; otherwise the CSS browser mock. So projects render
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

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name} case study`}
      className="group block w-full text-left"
    >
      {/* Full-bleed: the accent backdrop fills the card area edge-to-edge and
          shares its radius — no gap or inner padding around the artwork. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border transition-shadow duration-500 ease-premium group-hover:shadow-[0_24px_50px_-24px_rgba(11,11,11,0.3)]">
        {showImage && preview ? (
          <BrowserMockup
            src={preview}
            alt={project.name}
            accentBg={project.accentBg}
            onImageError={() => setImageFailed(true)}
          />
        ) : (
          <BrowserMockup alt={project.name} accentBg={project.accentBg}>
            <BrowserMock tint={project.tint} variant={project.mock} />
          </BrowserMockup>
        )}

        {/* Hover veil + view pill */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/15">
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
