"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

// Drop real photos at these paths in /public/gallery to replace the placeholders.
const GALLERY: string[] = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
  "/gallery/6.jpg",
  "/gallery/7.jpg",
  "/gallery/8.jpg",
];

function GalleryTile({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-taupe bg-surface">
      <div className="absolute inset-0 flex items-center justify-center text-taupe">
        <ImageIcon size={26} strokeWidth={1.25} />
      </div>
      {!failed && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setFailed(true)}
          className="relative object-cover transition-transform duration-700 ease-premium hover:scale-[1.04]"
        />
      )}
    </div>
  );
}

export default function AboutGallery() {
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
          {GALLERY.map((src) => (
            <GalleryTile key={src} src={src} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
