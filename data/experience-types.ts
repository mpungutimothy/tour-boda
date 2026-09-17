import type { ExperienceTypeId } from "@/types/destination";

export interface ExperienceTypeMeta {
  id: ExperienceTypeId;
  label: string;
  /** Short line used in the filter panel. */
  hint: string;
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
  },
  {
    id: "nature-waterfalls",
    label: "Nature & waterfalls",
    hint: "Falls, forest walks, escarpment views",
  },
  {
    id: "lake-river",
    label: "Lake & river",
    hint: "Boat rides, jetties, riverbanks",
  },
  {
    id: "wildlife",
    label: "Wildlife",
    hint: "Rescued animals and sanctuaries",
  },
  {
    id: "community",
    label: "Community & village",
    hint: "Hosted by the people who live there",
  },
  {
    id: "food-market",
    label: "Food & markets",
    hint: "Market junctions, street kitchens, coffee",
  },
  {
    id: "mountains-hiking",
    label: "Mountains & hiking",
    hint: "Elgon foothills, crater rims, viewpoint climbs",
  },
  {
    id: "custom",
    label: "Custom & bespoke",
    hint: "Build the route, priced on quotation",
  },
];

const BY_ID = new Map(EXPERIENCE_TYPES.map((type) => [type.id, type]));

export function experienceTypeLabel(id: ExperienceTypeId): string {
  return BY_ID.get(id)?.label ?? id;
}
