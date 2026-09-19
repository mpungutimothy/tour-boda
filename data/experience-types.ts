import type { ExperienceTypeId } from "@/types/destination";

export interface ExperienceTypeMeta {
  id: ExperienceTypeId;
  label: string;
  /** Short line used in the filter panel. */
  hint: string;
  /**
   * Representative photograph, as a file in `public/images/`. Used for the
   * browse-by-experience tiles, so the taxonomy is something a traveller can
   * look at rather than a list of words they have to parse.
   */
  image: string;
}

/**
 * The "destination / experience type" facet. Ids are stable filter values —
 * renaming a label must never change an id.
 */
export const EXPERIENCE_TYPES: ExperienceTypeMeta[] = [
  {
    id: "city-heritage",
    label: "City & heritage",
    hint: "Tombs, cathedrals, old quarters, museums",
    image: "/images/exp-city-heritage.jpg",
  },
  {
    id: "nature-waterfalls",
    label: "Nature & waterfalls",
    hint: "Falls, forest walks, escarpment views",
    image: "/images/exp-nature-waterfalls.jpg",
  },
  {
    id: "lake-river",
    label: "Lake & river",
    hint: "Boat rides, jetties, riverbanks",
    image: "/images/exp-lake-river.jpg",
  },
  {
    id: "wildlife",
    label: "Wildlife",
    hint: "Rescued animals and sanctuaries",
    image: "/images/exp-wildlife.jpg",
  },
  {
    id: "community",
    label: "Community & village",
    hint: "Hosted by the people who live there",
    image: "/images/exp-community.jpg",
  },
  {
    id: "food-market",
    label: "Food & markets",
    hint: "Market junctions, street kitchens, coffee",
    image: "/images/exp-food-market.jpg",
  },
  {
    id: "mountains-hiking",
    label: "Mountains & hiking",
    hint: "Elgon foothills, crater rims, viewpoint climbs",
    image: "/images/exp-mountains-hiking.jpg",
  },
  {
    id: "custom",
    label: "Custom & bespoke",
    hint: "Build the route, priced on quotation",
    image: "/images/exp-custom.jpg",
  },
];

const BY_ID = new Map(EXPERIENCE_TYPES.map((type) => [type.id, type]));

export function experienceTypeLabel(id: ExperienceTypeId): string {
  return BY_ID.get(id)?.label ?? id;
}

export function experienceTypeImage(id: ExperienceTypeId): string | undefined {
  return BY_ID.get(id)?.image;
}
