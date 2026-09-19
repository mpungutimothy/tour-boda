"use client";

import Link from "next/link";
import { TierSelectionProvider } from "@/components/destinations/tier-selection-context";
import { DestinationHero } from "@/components/destinations/destination-hero";
import { NarrativeSection } from "@/components/destinations/narrative-section";
import { ImageGallery } from "@/components/destinations/image-gallery";
import { TierSelector } from "@/components/destinations/tier-selector";
import { FAQSection } from "@/components/destinations/faq-section";
import { RelatedDestinations } from "@/components/destinations/related-destinations";
import { BookingWidget } from "@/components/destinations/booking-widget";
import { RatingStars } from "@/components/marketplace/guide-card";
import { guidesForDestination } from "@/data/guides";
import type { Destination } from "@/types/destination";
import { BadgeCheck, ShieldCheck } from "lucide-react";

export function DestinationDetail({
  destination,
  allDestinations,
}: {
  destination: Destination;
  allDestinations: Destination[];
}) {
  const guides = guidesForDestination(destination.slug);

  return (
    <TierSelectionProvider initialIndex={0}>
      <DestinationHero destination={destination} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:py-8">
          {/*
            The reading stretch. The sidebar stays on the dark surface, so the
            booking panel and the reading column sit side by side. Section ids
            are the Trip Rail's waypoints.
          */}
          <div className="min-w-0">
            <div id="log">
              <NarrativeSection destination={destination} />
            </div>
            <div id="gallery" className="defer-render">
              <ImageGallery destination={destination} />
            </div>
            <div id="packages">
              <TierSelector destination={destination} />
            </div>

            {/* Named guides for this route — the "your boda guide" half of the
                promise, attached to the route rather than only to /guides. */}
            {guides.length > 0 ? (
              <section
                id="guides"
                className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8"
                aria-labelledby="route-guides-heading"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="telemetry text-primary-ink">05</span>
                  <span className="h-px flex-1 bg-hairline" />
                  <span className="telemetry text-muted-foreground">
                    Your guide
                  </span>
                </div>

                <h2
                  id="route-guides-heading"
                  className="mb-6 font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl"
                >
                  Who leads this route
                </h2>

                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {guides.map((guide) => (
                    <li
                      key={guide.id}
                      className="flex gap-4 rounded-lg border border-hairline bg-card p-5"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface font-display text-lg font-bold text-primary-ink">
                        {guide.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part.charAt(0))
                          .join("")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="font-display text-base font-semibold tracking-display">
                            {guide.name}
                          </h3>
                          <RatingStars rating={guide.rating} />
                          <span
                            data-readout
                            className="font-mono text-[0.625rem] text-muted-foreground"
                          >
                            {guide.rating.toFixed(1)} · {guide.reviewCount} reviews
                          </span>
                        </div>

                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em]">
                          <span className="inline-flex items-center gap-1.5 text-success">
                            <ShieldCheck className="h-3 w-3" aria-hidden />
                            Licensed · {guide.licence.authority}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-primary-ink">
                            <BadgeCheck className="h-3 w-3" aria-hidden />
                            Vetted {guide.vetted.verifiedOn}
                          </span>
                        </p>

                        <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
                          {guide.bio}
                        </p>

                        <Link
                          href="/guides"
                          className="mt-3 inline-block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary-ink transition-opacity hover:opacity-80"
                        >
                          Full profile
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div id="faq">
              <FAQSection destination={destination} />
            </div>
          </div>

          {/* Sticky booking sidebar (desktop only) */}
          <BookingWidget destination={destination} />
        </div>
      </div>

      <RelatedDestinations
        destinations={allDestinations}
        currentId={destination.id}
      />

      {/* Spacer for the mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </TierSelectionProvider>
  );
}
