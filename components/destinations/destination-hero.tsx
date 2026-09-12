"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { MapPin, PenLine } from "lucide-react";

export function DestinationHero({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const heroImage = destination.images[0]?.url;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      <div className="absolute inset-0">
        {heroImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt={destination.images[0]?.caption ?? destination.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div
          variants={fadeUp}
          initial={reduced ? false : "hidden"}
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <span className="inline-block rounded-full bg-primary/90 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {destination.category}
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight text-surface sm:text-5xl lg:text-6xl">
            {destination.name}
          </h1>
          <div className="flex flex-col gap-2 font-sans text-surface/80 sm:flex-row sm:items-center sm:gap-6">
            <span className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4" />
              {destination.location.region}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <PenLine className="h-4 w-4" />
              Written by {destination.author.name}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
