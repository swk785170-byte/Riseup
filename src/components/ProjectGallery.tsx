"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Horizontal travel (px) that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 50;

/**
 * Case-study gallery: a thumbnail grid that opens a full-screen lightbox.
 *
 * Two different cropping rules apply on purpose. Thumbnails are `object-cover`
 * so the grid stays a tidy set of equal tiles; the lightbox is `object-contain`
 * so the image is shown whole and uncropped, which is the rule that matters
 * for actually looking at the work.
 */
export default function ProjectGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const previous = useCallback(
    () =>
      setIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        /*
         * The case-study modal also closes on Escape from a window listener.
         * Capture phase + stopImmediatePropagation means the first Escape
         * closes only the lightbox, leaving the modal open behind it.
         */
        event.stopImmediatePropagation();
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [index, close, next, previous]);

  if (images.length === 0) return null;

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {images.map((url, i) => (
          <li key={url}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open image ${i + 1} of ${images.length}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Image
                src={url}
                alt={`${name} — screen ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current !== null && index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — image ${index + 1} of ${images.length}`}
            // Above the case-study modal (z-[80]).
            className="fixed inset-0 z-[120] flex flex-col bg-foreground/95 backdrop-blur-sm"
            onPointerDown={(event) => {
              touchStartX.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const start = touchStartX.current;
              touchStartX.current = null;
              if (start === null) return;
              const delta = event.clientX - start;
              if (Math.abs(delta) < SWIPE_THRESHOLD) return;
              if (delta < 0) next();
              else previous();
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-background md:px-8">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-70">
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close image"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-background/25 transition-colors duration-300 hover:bg-background hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* The image itself — uncropped. */}
            <div className="relative flex-1 select-none">
              <Image
                key={current}
                src={current}
                alt={`${name} — screen ${index + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-contain p-4 md:p-10"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-4 px-5 py-6">
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous image"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-background/25 text-background transition-colors duration-300 hover:bg-background hover:text-foreground"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-background/25 text-background transition-colors duration-300 hover:bg-background hover:text-foreground"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
