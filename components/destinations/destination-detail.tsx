"use client";

import { TierSelectionProvider } from "@/components/destinations/tier-selection-context";
import { DestinationHero } from "@/components/destinations/destination-hero";
import { NarrativeSection } from "@/components/destinations/narrative-section";
import { ImageGallery } from "@/components/destinations/image-gallery";
import { TierSelector } from "@/components/destinations/tier-selector";
import { FAQSection } from "@/components/destinations/faq-section";
import { RelatedDestinations } from "@/components/destinations/related-destinations";
import { BookingWidget } from "@/components/destinations/booking-widget";
import type { Destination } from "@/types/destination";

export function DestinationDetail({ destination, allDestinations }: { destination: Destination; allDestinations: Destination[] }) {
  return (
    <TierSelectionProvider initialIndex={0}>
      <DestinationHero destination={destination} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:py-8">
          {/*
            The reading stretch. The sidebar stays
            on the night road, so instrument and reading surfaces sit side by
            side. Section ids are the Trip Rail's waypoints.
          */}
          <div className="min-w-0 rounded-lg bg-background text-foreground">
            <div id="log">
              <NarrativeSection destination={destination} />
            </div>
            <div id="gallery" className="defer-render">
              <ImageGallery destination={destination} />
            </div>
            <div id="packages">
              <TierSelector destination={destination} />
            </div>
            <div id="faq">
              <FAQSection destination={destination} />
            </div>
          </div>

          {/* Sticky booking sidebar (desktop only) */}
          <BookingWidget destination={destination} />
        </div>
      </div>

      <RelatedDestinations destinations={allDestinations} currentId={destination.id} />

      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </TierSelectionProvider>
  );
}
