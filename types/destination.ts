/* -------------------------------------------------------------------------- */
/*  Marketplace domain model                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The three service levels from the concept note. `freelance` is the entry
 * product (the ride itself), `guided` adds a licensed guide, `experience` is
 * the full package. Order matters: index 0 is the cheapest.
 */
export type TierKey = "freelance" | "guided" | "experience";

/** How a destination is sold. `quotation` means "request a price". */
export type PricingMode = "fixed" | "quotation";

/** Traveller party shape, used both as a filter and as a booking default. */
export type GroupType = "solo" | "couple" | "family" | "group";

/** Experience categories. Ids are filter values; labels are display strings. */
export type ExperienceTypeId =
  | "city-heritage"
  | "nature-waterfalls"
  | "lake-river"
  | "wildlife"
  | "community"
  | "food-market"
  | "mountains-hiking"
  | "custom";

export interface KeyFact {
  label: string;
  value: string;
}

export interface DestinationLocation {
  lat: number;
  lng: number;
  region: string;
  /** District or city used by the "where I am" filter. */
  district: string;
}

export interface DestinationImage {
  /** Local path under `/images/`. */
  url: string;
  caption: string;
  /**
   * Optional: when absent, the credit is looked up from the generated
   * `data/photo-credits.ts`, which is populated from the source file's own
   * licence metadata. Prefer the lookup — a hand-typed credit is a credit that
   * eventually goes stale or wrong.
   */
  credit?: string;
}

export interface DestinationAuthor {
  name: string;
  bio: string;
  /** Links the narrative voice to a guide profile. */
  guideId: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

/* -------------------------------------------------------------------------- */
/*  Tier components — what the toggles actually switch                          */
/* -------------------------------------------------------------------------- */

/**
 * One toggleable part of a package.
 *
 * `value` is the UGX worth of this component *per person*. The pricing engine
 * adds it when a traveller requires something the tier omits, and subtracts it
 * when a traveller waives something the tier includes — which is why a single
 * number covers both directions.
 *
 * `removable` is false when the component IS the product: you cannot buy a
 * "Boda Freelance" ride with the boda taken out.
 */
export interface TierComponent {
  included: boolean;
  removable: boolean;
  value: number;
}

export interface TourTierComponents {
  transport: TierComponent;
  guide: TierComponent;
  meals: TierComponent;
}

export interface TourTier {
  key: TierKey;
  name: string;
  /** Per-person price in UGX for a party of two, VAT inclusive. */
  price: number;
  duration: string;
  durationHours: number;
  /** Largest party this tier can carry, given boda capacity. */
  maxParty: number;
  inclusions: string[];
  excludes: string[];
  bestFor: string;
  /** Optional merchandising flag, e.g. "Most booked". */
  badge?: string;
  components: TourTierComponents;
}

/* -------------------------------------------------------------------------- */
/*  Add-ons                                                                    */
/* -------------------------------------------------------------------------- */

export type AddOnUnit = "per-person" | "per-group" | "per-day";

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: AddOnUnit;
  /** Restrict to certain tiers. Omit to offer on every tier. */
  tiers?: TierKey[];
}

/* -------------------------------------------------------------------------- */
/*  Destination                                                                */
/* -------------------------------------------------------------------------- */

export interface Destination {
  id: string;
  slug: string;
  name: string;
  /** Display label, e.g. "City & Heritage". */
  category: string;
  /** Filter values. A destination can belong to more than one. */
  experienceTypes: ExperienceTypeId[];
  narrative: string;
  keyFacts: KeyFact[];
  location: DestinationLocation;
  images: DestinationImage[];
  author: DestinationAuthor;
  faqs: FAQ[];
  tiers: TourTier[];
  /** `quotation` destinations hide prices and route to a quote request. */
  pricingMode: PricingMode;
  /** Guides who can lead this destination, by guide id. */
  guideIds: string[];
  /** Add-ons offered on this destination, by add-on id. */
  addOnIds: string[];
  /** Party shapes this destination is pitched at. */
  groupTypes: GroupType[];
  /** Minimum hours between booking and departure. */
  minLeadTimeHours: number;
  /** Set when a destination has no fixed prices. */
  quoteNote?: string;
}

/** A grouping used by the tier UI, keyed by tier. */
export interface TierMeta {
  key: TierKey;
  name: string;
  tagline: string;
  shortLabel: string;
}
