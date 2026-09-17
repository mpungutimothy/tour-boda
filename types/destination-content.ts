import type {
  DestinationAuthor,
  DestinationImage,
  DestinationLocation,
  FAQ,
  KeyFact,
} from "@/types/destination";

/**
 * The editorial layer.
 *
 * These are the records a writer or guide produces: the narrative, the facts,
 * the photos, the FAQs, and the three published price points. Everything that
 * is operational rather than editorial — how much of a price is transport,
 * how many people a tier can carry, which experiences a traveller can filter
 * by — lives in `data/routes/commerce.ts` and is merged in at read time.
 *
 * Keeping the two apart means the commerce model can be re-tuned without
 * touching a single line of published copy.
 */

export interface ContentTier {
  name: string;
  price: number;
  duration: string;
  inclusions: string[];
  bestFor: string;
}

export type ContentLocation = Omit<DestinationLocation, "district">;

export interface DestinationContent {
  id: string;
  slug: string;
  name: string;
  category: string;
  narrative: string;
  keyFacts: KeyFact[];
  location: ContentLocation;
  images: DestinationImage[];
  author: Omit<DestinationAuthor, "guideId">;
  faqs: FAQ[];
  /**
   * Exactly three tiers, cheapest first:
   * 0 = Boda Freelance, 1 = Guided Tour, 2 = Experience Tour.
   */
  tiers: ContentTier[];
}
