"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import { EASE_PREMIUM } from "@/lib/motion";
import type { GalleryImage } from "@/lib/gallery";

export default function AboutGallery({
  images = [],
}: {
  images?: GalleryImage[];
}) {
  // Hide the section entirely until photos are added in the admin panel,
  // rather than showing a grid of empty placeholder tiles.
  if (images.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="Behind the Scenes"
          title="Life at Rise Up"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mt-14 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-taupe bg-surface"
            >
              <SafeImage
                src={image.imageUrl}
                alt={image.alt}
                className="transition-transform duration-700 ease-premium hover:scale-[1.04]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
