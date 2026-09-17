import type { Destination, TierKey, TourTier } from "@/types/destination";
import type { Party, Quote, SearchFilters, SortKey } from "@/types/marketplace";
import { BUDGET_UNLIMITED } from "@/types/marketplace";
import { groupTypeMeta, partySize } from "@/data/group-types";
import {
  COMPONENT_ORDER,
  buildQuote,
  passengerCount,
  type ComponentKey,
  type Requirements,
} from "@/lib/marketplace/pricing";

/* -------------------------------------------------------------------------- */
/*  Matching                                                                   */
/* -------------------------------------------------------------------------- */

export interface DestinationMatch {
  destination: Destination;
  /** The tier that best satisfies the request. */
  tier: TourTier;
  quote: Quote;
  /** True when the cheapest tier was ruled out by the stated requirements. */
  upgradedForRequirements: boolean;
  /** True when the cheapest tier could not carry this party size. */
  upgradedForCapacity: boolean;
  party: Party;
}

/** Party implied by the selected group type, or a couple by default. */
export function partyForFilters(filters: SearchFilters): Party {
  const meta = filters.groupType ? groupTypeMeta(filters.groupType) : undefined;
  return meta?.defaultParty ?? { adults: 2, children: 0 };
}

export function requirementsFromFilters(filters: SearchFilters): Requirements {
  return {
    transport: filters.requireTransport,
    guide: filters.requireGuide,
    meals: filters.requireMeals,
  };
}

/** Components the traveller has explicitly asked for. */
function requiredComponents(requirements: Requirements): ComponentKey[] {
  return COMPONENT_ORDER.filter((key) => requirements[key]);
}

function tierIncludesAll(tier: TourTier, keys: ComponentKey[]): boolean {
  return keys.every((key) => tier.components[key].included);
}

/**
 * Pick the tier to quote against.
 *
 * A tier is a candidate when it can physically carry the party. Among those,
 * prefer the cheapest tier that *includes* everything the traveller asked for,
 * because "I need a licensed guide" means the guided product, not the cheapest
 * product with a guide bolted on. If no tier includes it — which the current
 * catalogue never does, but a future one might — fall back to the cheapest
 * candidate and let the pricing engine add the component.
 */
export function selectTier(
  destination: Destination,
  filters: SearchFilters,
  party: Party,
): { tier: TourTier; upgradedForRequirements: boolean; upgradedForCapacity: boolean } {
  const people = passengerCount(party);
  const byCapacity = destination.tiers.filter((tier) => tier.maxParty >= people);
  const candidates = byCapacity.length > 0 ? byCapacity : destination.tiers;

  const wanted = requiredComponents(requirementsFromFilters(filters));
  const including = candidates.filter((tier) => tierIncludesAll(tier, wanted));

  const pool = including.length > 0 ? including : candidates;
  const cheapest = [...pool].sort((a, b) => a.price - b.price)[0];

  const absoluteCheapest = [...destination.tiers].sort(
    (a, b) => a.price - b.price,
  )[0];

  return {
    tier: cheapest,
    upgradedForRequirements: cheapest.key !== absoluteCheapest.key && wanted.length > 0,
    upgradedForCapacity: byCapacity.length === 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export interface FilterOutcome {
  matches: DestinationMatch[];
  /** How many routes were excluded, and by what. Used by the empty state. */
  excluded: { slug: string; reason: string }[];
}

function matchesLocation(destination: Destination, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    destination.location.district.toLowerCase().includes(needle) ||
    destination.location.region.toLowerCase().includes(needle) ||
    destination.name.toLowerCase().includes(needle) ||
    destination.category.toLowerCase().includes(needle)
  );
}

function matchesExperienceTypes(
  destination: Destination,
  selected: SearchFilters["experienceTypes"],
): boolean {
  if (selected.length === 0) return true;
  return selected.some((type) => destination.experienceTypes.includes(type));
}

function matchesGroup(destination: Destination, filters: SearchFilters): boolean {
  if (!filters.groupType) return true;
  return destination.groupTypes.includes(filters.groupType);
}

function matchesBudget(match: DestinationMatch, filters: SearchFilters): boolean {
  return match.quote.perPerson <= filters.maxBudget;
}

/**
 * Run the full filter set and return ordered matches.
 *
 * Order of operations mirrors what a traveller expects: hard constraints
 * (place, experience, group fit) remove routes outright; the budget then
 * removes on price; the requirements and party size decide which tier is
 * quoted; sorting happens last.
 */
export function filterDestinations(
  all: Destination[],
  filters: SearchFilters,
  sort: SortKey = "recommended",
): FilterOutcome {
  const party = partyForFilters(filters);
  const matches: DestinationMatch[] = [];
  const excluded: { slug: string; reason: string }[] = [];

  for (const destination of all) {
    if (!matchesLocation(destination, filters.location)) {
      excluded.push({ slug: destination.slug, reason: "outside your search area" });
      continue;
    }
    if (!matchesExperienceTypes(destination, filters.experienceTypes)) {
      excluded.push({ slug: destination.slug, reason: "different experience type" });
      continue;
    }
    if (!matchesGroup(destination, filters)) {
      excluded.push({
        slug: destination.slug,
        reason: `not set up for ${filters.groupType} groups`,
      });
      continue;
    }

    const selection = selectTier(destination, filters, party);
    const quote = buildQuote({
      destination,
      tier: selection.tier,
      party,
      requirements: requirementsFromFilters(filters),
    });

    const match: DestinationMatch = {
      destination,
      tier: selection.tier,
      quote,
      upgradedForRequirements: selection.upgradedForRequirements,
      upgradedForCapacity: selection.upgradedForCapacity,
      party,
    };

    if (!matchesBudget(match, filters)) {
      excluded.push({
        slug: destination.slug,
        reason: `over ${filters.maxBudget.toLocaleString("en-UG")} per person`,
      });
      continue;
    }

    matches.push(match);
  }

  return { matches: sortMatches(matches, sort), excluded };
}

export function sortMatches(
  matches: DestinationMatch[],
  sort: SortKey,
): DestinationMatch[] {
  const copy = [...matches];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.quote.perPerson - b.quote.perPerson);
    case "price-desc":
      return copy.sort((a, b) => b.quote.perPerson - a.quote.perPerson);
    case "duration-asc":
      return copy.sort((a, b) => a.tier.durationHours - b.tier.durationHours);
    case "recommended":
    default:
      // A route that needed no upgrade is a better fit than one that did.
      return copy.sort((a, b) => {
        const aPenalty = Number(a.upgradedForRequirements) + Number(a.upgradedForCapacity);
        const bPenalty = Number(b.upgradedForRequirements) + Number(b.upgradedForCapacity);
        if (aPenalty !== bPenalty) return aPenalty - bPenalty;
        return a.quote.perPerson - b.quote.perPerson;
      });
  }
}

/* -------------------------------------------------------------------------- */
/*  Filter bookkeeping                                                         */
/* -------------------------------------------------------------------------- */

export function activeFilterCount(filters: SearchFilters): number {
  let count = 0;
  if (filters.location.trim()) count += 1;
  count += filters.experienceTypes.length;
  if (filters.date) count += 1;
  if (filters.groupType) count += 1;
  if (filters.maxBudget < BUDGET_UNLIMITED) count += 1;
  if (filters.requireTransport) count += 1;
  if (filters.requireGuide) count += 1;
  if (filters.requireMeals) count += 1;
  return count;
}

/** Cheapest per-person price currently achievable, for the budget slider. */
export function priceBounds(all: Destination[]): { min: number; max: number } {
  const prices = all.flatMap((destination) =>
    destination.tiers.map((tier) => tier.price),
  );
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/** Party size a tier can carry, exposed for the card's capacity note. */
export function tierCapacityLabel(tier: TourTier): string {
  if (tier.maxParty <= 2) return "1–2 riders, one boda";
  return `3–${tier.maxParty} riders, multiple bodas`;
}

export function tierKeyLabel(key: TierKey): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export { partySize };
