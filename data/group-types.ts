import type { GroupType } from "@/types/destination";
import type { Party } from "@/types/marketplace";

export interface GroupTypeMeta {
  id: GroupType;
  label: string;
  /** Party the search bar seeds the booking flow with. */
  defaultParty: Party;
  hint: string;
}

/**
 * Group shape. This is both a search facet and the seed for the booking
 * flow's party size, so the two can never disagree.
 */
export const GROUP_TYPES: GroupTypeMeta[] = [
  {
    id: "solo",
    label: "Solo",
    defaultParty: { adults: 1, children: 0 },
    hint: "One rider. Private-ride supplement applies.",
  },
  {
    id: "couple",
    label: "Couple",
    defaultParty: { adults: 2, children: 0 },
    hint: "Two riders, one boda. The baseline price.",
  },
  {
    id: "family",
    label: "Family",
    defaultParty: { adults: 2, children: 2 },
    hint: "Children under 12 ride at half rate.",
  },
  {
    id: "group",
    label: "Group",
    defaultParty: { adults: 6, children: 0 },
    hint: "Five or more adults get 10% off.",
  },
];

const BY_ID = new Map(GROUP_TYPES.map((group) => [group.id, group]));

export function groupTypeMeta(id: GroupType): GroupTypeMeta | undefined {
  return BY_ID.get(id);
}

export function groupTypeLabel(id: GroupType | ""): string {
  if (!id) return "Any group";
  return BY_ID.get(id)?.label ?? id;
}

/** Total passengers in a party. */
export function partySize(party: Party): number {
  return party.adults + party.children;
}

/** Children count as half a fare for capacity and discount maths. */
export function adultEquivalent(party: Party): number {
  return party.adults + party.children * 0.5;
}
