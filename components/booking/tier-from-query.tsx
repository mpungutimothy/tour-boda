"use client";

import { useSearchParams } from "next/navigation";
import type { Destination, TierKey } from "@/types/destination";
import { TIER_ORDER } from "@/data/tiers";
import { BookingFlow } from "@/components/booking/booking-flow";

/**
 * Resolves the `?tier=` query parameter on the client.
 *
 * Reading it from the page's `searchParams` prop instead would force the route
 * to render on a server at request time, which makes `output: "export"`
 * impossible — Next bails out with "Page with `dynamic = \"error\"` couldn't be
 * rendered statically". Reading it here keeps `/book/[slug]` fully static while
 * behaving identically: the card's Book button still deep-links to a tier.
 *
 * Must be wrapped in <Suspense>, which Next requires for `useSearchParams`
 * during prerendering. That boundary's fallback is the full booking flow at the
 * default tier, not a skeleton, so the prerendered HTML has real content.
 */
export function TierFromQuery({
  destination,
  fallbackTier = "guided",
}: {
  destination: Destination;
  fallbackTier?: TierKey;
}) {
  const searchParams = useSearchParams();

  // Validate rather than trust the query string, so a hand-edited URL cannot
  // select a tier that does not exist.
  const requested = searchParams.get("tier");
  const initialTier: TierKey =
    requested && (TIER_ORDER as string[]).includes(requested)
      ? (requested as TierKey)
      : fallbackTier;

  // Remount when the resolved tier differs from the prerendered default, so
  // BookingFlow's internal state starts from the requested tier rather than
  // ignoring the parameter.
  return (
    <BookingFlow
      key={initialTier}
      destination={destination}
      initialTier={initialTier}
    />
  );
}
