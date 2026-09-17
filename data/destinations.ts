import { coreDestinations } from "./routes/core";
import { extraDestinations } from "./routes/extra";
import {
  DESTINATION_COMMERCE,
  assertCommerceIntegrity,
  type DestinationCommerce,
} from "./routes/commerce";
import { TIER_ORDER } from "./tiers";
import type { Destination, TierKey, TourTier } from "@/types/destination";
import type { DestinationContent, ContentTier } from "@/types/destination-content";

/**
 * The public destination module.
 *
 * Editorial content lives in `./routes/core.ts` and `./routes/extra.ts`.
 * Commercial configuration lives in `./routes/commerce.ts`. This file joins the
 * two, so every consumer gets one fully-formed `Destination` while writers and
 * operators can keep editing their own half without touching the other.
 */

function commerceFor(slug: string): DestinationCommerce {
  const commerce = DESTINATION_COMMERCE[slug];
  if (!commerce) {
    throw new Error(
      `[destinations] no commerce configuration for "${slug}". Add it to data/routes/commerce.ts.`,
    );
  }
  return commerce;
}

function buildTier(
  slug: string,
  content: ContentTier,
  index: number,
  commerce: DestinationCommerce,
): TourTier {
  const key = TIER_ORDER[index];
  if (!key) {
    throw new Error(
      `[destinations] ${slug}: more tiers than the fixed order allows. ` +
        `Tier order is: ${TIER_ORDER.join(" -> ")}.`,
    );
  }

  const tierCommerce = commerce.tiers[key];
  if (!tierCommerce) {
    throw new Error(`[destinations] ${slug}/${key}: tier commerce is missing.`);
  }

  assertCommerceIntegrity(slug, content.price, key, tierCommerce.components);

  return {
    key,
    name: content.name,
    price: content.price,
    duration: content.duration,
    durationHours: tierCommerce.durationHours,
    maxParty: tierCommerce.maxParty,
    inclusions: content.inclusions,
    excludes: tierCommerce.excludes,
    bestFor: content.bestFor,
    badge: tierCommerce.badge,
    components: tierCommerce.components,
  };
}

function buildDestination(content: DestinationContent): Destination {
  const commerce = commerceFor(content.slug);

  if (content.tiers.length !== TIER_ORDER.length) {
    throw new Error(
      `[destinations] ${content.slug}: expected ${TIER_ORDER.length} tiers ` +
        `(${TIER_ORDER.join(", ")}), found ${content.tiers.length}.`,
    );
  }

  return {
    id: content.id,
    slug: content.slug,
    name: content.name,
    category: content.category,
    experienceTypes: commerce.experienceTypes,
    narrative: content.narrative,
    keyFacts: content.keyFacts,
    location: { ...content.location, district: commerce.district },
    images: content.images,
    author: { ...content.author, guideId: commerce.guideIds[0] ?? "" },
    faqs: content.faqs,
    tiers: content.tiers.map((tier, index) =>
      buildTier(content.slug, tier, index, commerce),
    ),
    pricingMode: commerce.pricingMode,
    quoteNote: commerce.quoteNote,
    guideIds: commerce.guideIds,
    addOnIds: commerce.addOnIds,
    groupTypes: commerce.groupTypes,
    minLeadTimeHours: commerce.minLeadTimeHours,
  };
}

const CONTENT: DestinationContent[] = [...coreDestinations, ...extraDestinations];

export const destinations: Destination[] = CONTENT.map(buildDestination);

/* -------------------------------------------------------------------------- */
/*  Accessors                                                                  */
/* -------------------------------------------------------------------------- */

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}

export function getTier(
  destination: Destination,
  key: TierKey,
): TourTier | undefined {
  return destination.tiers.find((tier) => tier.key === key);
}

/** Cheapest per-person price across the destination's three tiers. */
export function fromPrice(destination: Destination): number {
  return Math.min(...destination.tiers.map((tier) => tier.price));
}

/** Districts that actually have a route, for the "where I am" filter. */
export const districts: string[] = Array.from(
  new Set(destinations.map((destination) => destination.location.district)),
).sort((a, b) => a.localeCompare(b));
