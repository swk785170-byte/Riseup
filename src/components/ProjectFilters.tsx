"use client";

import { PROJECT_FILTERS, type FilterKey } from "@/lib/projects";

export default function ProjectFilters({
  active,
  onChange,
}: {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background/90 backdrop-blur-md md:top-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div
          className="no-scrollbar flex gap-3 overflow-x-auto py-4"
          role="tablist"
          aria-label="Filter projects by discipline"
        >
          {PROJECT_FILTERS.map((filter) => {
            const isActive = filter.key === active;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(filter.key)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-[12px] font-bold tracking-[0.14em] uppercase transition-all duration-300 ease-premium ${
                  isActive
                    ? "border-transparent bg-foreground text-background"
                    : "border-taupe text-foreground/70 hover:border-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
