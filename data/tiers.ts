import type { TierKey, TierMeta } from "@/types/destination";

export const TIER_ORDER: TierKey[] = ["freelance", "guided", "experience"];

export interface TierMetaFull extends TierMeta {
  /** One-line explanation used in the comparison table header. */
  summary: string;
  /** Tailwind-free tone name; resolves to --tier-N via [data-tier]. */
  tone: TierKey;
}

export const TIER_META: Record<TierKey, TierMetaFull> = {
  freelance: {
    key: "freelance",
    name: "Boda Freelance Tour",
    shortLabel: "Freelance",
    tagline: "The ride, self-guided",
    summary:
      "A vetted rider, a helmet and the route. Digital route notes on your phone. No guide, no meals.",
    tone: "freelance",
  },
  guided: {
    key: "guided",
    name: "Guided Tour",
    shortLabel: "Guided",
    tagline: "Rider plus licensed guide",
    summary:
      "A licensed guide who rides with you and talks you through every stop, plus a meal on the road.",
    tone: "guided",
  },
  experience: {
    key: "experience",
    name: "Experience Tour",
    shortLabel: "Experience",
    tagline: "The full package",
    summary:
      "Guide, transport, activities, meals and extras. The long version of the day, with nothing to arrange.",
    tone: "experience",
  },
};

export function tierMeta(key: TierKey): TierMetaFull {
  return TIER_META[key];
}

export function tierName(key: TierKey): string {
  return TIER_META[key]?.name ?? key;
}
