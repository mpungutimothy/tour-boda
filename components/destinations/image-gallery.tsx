"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { creditLine } from "@/lib/photos";
import type { Destination } from "@/types/destination";
import { Camera } from "lucide-react";

/**
 * Route gallery.
 *
 * Laid out as a mosaic rather than a uniform grid: the lead frame runs full
 * width at a cinematic ratio, and the rest fall into a two-column block under
 * it. A flat grid of equal tiles reads as a photo dump; a lead frame gives the
 * page a hierarchy, which is what makes a route feel like a product rather than
 * a listing.
 *
 * Attribution is rendered from the generated credit table, not from the route
 * data, so it cannot fall out of sync with the photograph it labels.
 */
export function ImageGallery({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const [lead, ...rest] = destination.images;

  if (!lead) return null;

  const reveal = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: reduced ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">03</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">
          {destination.images.length} photographs
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
          On the road
        </h2>
        <p className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          <Camera className="h-3 w-3" aria-hidden />
          Every frame shot on location
        </p>
      </div>

      {/* Lead frame */}
      <motion.figure
        {...reveal(0)}
        className="overflow-hidden rounded-lg border border-hairline bg-card"
      >
        <div className="relative aspect-[21/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lead.url}
            alt={lead.caption}
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/70 via-transparent to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="max-w-[62ch] font-sans text-sm leading-snug text-on-scrim sm:text-base">
              {lead.caption}
            </p>
            <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim/60">
              {creditLine(lead.url) ?? lead.credit}
            </p>
          </figcaption>
        </div>
      </motion.figure>

      {/* Supporting frames */}
      {rest.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rest.map((image, index) => (
            <motion.figure
              key={image.url}
              {...reveal(0.08 * (index + 1))}
              className="group overflow-hidden rounded-lg border border-hairline bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-hairline px-4 py-3">
                <p className="min-w-0 max-w-[46ch] font-sans text-sm leading-snug">
                  {image.caption}
                </p>
                {/* No `shrink-0` here. An attribution such as
                    "Christopher Liberty · CC BY-SA 4.0 · Wikimedia Commons" is
                    ~400px wide in this small-caps mono treatment, and shrink-0
                    forbade it from wrapping, which pushed the caption — and the
                    figure it sits in — past the card edge. `min-w-0` plus
                    `break-words` lets it take as many lines as it needs. */}
                <span className="min-w-0 break-words font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {creditLine(image.url) ?? image.credit}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
