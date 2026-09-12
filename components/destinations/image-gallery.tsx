"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { Camera } from "lucide-react";

export function ImageGallery({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl font-semibold">Gallery</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {destination.images.map((image, i) => (
          <motion.figure
            key={i}
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            className={i === 0 ? "sm:col-span-2 overflow-hidden rounded-lg shadow-warm-md" : "overflow-hidden rounded-lg shadow-warm-md"}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.caption}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <figcaption className="flex items-start justify-between gap-3 bg-card px-4 py-3">
              <p className="font-sans text-sm text-ink">{image.caption}</p>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                &copy; {image.credit}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
