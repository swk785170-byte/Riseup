"use client";

import { motion } from "framer-motion";

/**
 * Editorial "Load More" control. Renders nothing once every project in the
 * current filter is visible — so it can stay mounted as the archive grows.
 */
export default function ProjectsPagination({
  hasMore,
  remaining,
  onLoadMore,
}: {
  hasMore: boolean;
  remaining: number;
  onLoadMore: () => void;
}) {
  if (!hasMore) return null;

  return (
    <motion.div layout className="mt-16 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onLoadMore}
        className="rounded-full border border-charcoal px-9 py-4 text-[12px] font-bold tracking-[0.18em] text-foreground uppercase transition-colors duration-300 hover:bg-foreground hover:text-background"
      >
        Load More Projects
      </button>
      <p className="text-xs text-muted">
        {remaining} more {remaining === 1 ? "project" : "projects"}
      </p>
    </motion.div>
  );
}
