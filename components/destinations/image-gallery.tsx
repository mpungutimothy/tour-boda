"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Destination } from "@/types/destination";

export function ImageGallery({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-data">03</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Sights</span>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold uppercase leading-tight tracking-[0.01em] sm:text-3xl">
        On the road
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {destination.images.map((image, i) => (
          <motion.figure
            key={image.url}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
            className={`overflow-hidden rounded-lg border border-hairline ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.caption}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-hairline bg-card px-4 py-3">
              <p className="max-w-[52ch] font-sans text-sm">{image.caption}</p>
              <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                {image.credit}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
