import type { AddOn } from "@/types/destination";

/**
 * Bookable extras. `per-person` lines scale with the adult-equivalent count,
 * `per-group` lines are charged once, `per-day` scales with trip days.
 */
export const ADD_ONS: AddOn[] = [
  {
    id: "airport-pickup",
    name: "Airport pickup or drop-off",
    description:
      "Meet at Entebbe arrivals and start the tour from the terminal. Roughly 40 km of riding before the route begins.",
    price: 45000,
    unit: "per-group",
  },
  {
    id: "second-boda",
    name: "Second boda for luggage or a third rider",
    description:
      "One extra bike and rider travelling with you, for bags, camera kit or an odd-numbered group.",
    price: 60000,
    unit: "per-group",
    tiers: ["freelance", "guided", "experience"],
  },
  {
    id: "photo-set",
    name: "Rider-photographer for the day",
    description:
      "A second rider shooting stills and short video on the move. Roughly 120 edited frames delivered within 48 hours.",
    price: 120000,
    unit: "per-group",
  },
  {
    id: "interpreter",
    name: "French, German or Mandarin interpreter",
    description:
      "A second guide riding alongside, interpreting at each stop. Booked at least 72 hours ahead.",
    price: 90000,
    unit: "per-group",
  },
  {
    id: "sunset-extension",
    name: "Sunset extension",
    description:
      "Two extra hours on the road ending at a viewpoint for golden hour, with a cold drink at the last stop.",
    price: 55000,
    unit: "per-person",
  },
  {
    id: "market-cooking",
    name: "Market-to-kitchen cooking session",
    description:
      "Buy the ingredients at a working market with your guide, then cook and eat them. Three hours, hosted by a local cook.",
    price: 75000,
    unit: "per-person",
  },
  {
    id: "travel-cover",
    name: "Day travel cover",
    description:
      "Passenger accident cover for the day, arranged at booking. Underwritten locally, certificate issued by email.",
    price: 15000,
    unit: "per-person",
  },
  {
    id: "sim-data",
    name: "Local SIM with 10GB data",
    description:
      "Registered SIM waiting at your first stop, so you have maps and a local number for the whole trip.",
    price: 25000,
    unit: "per-group",
  },
  {
    id: "extra-day",
    name: "Extra riding day",
    description:
      "Add a further day on the same route with the same rider. Guide and transport included, accommodation excluded.",
    price: 180000,
    unit: "per-day",
    tiers: ["guided", "experience"],
  },
];

const BY_ID = new Map(ADD_ONS.map((addOn) => [addOn.id, addOn]));

export function addOnById(id: string): AddOn | undefined {
  return BY_ID.get(id);
}

/** Add-ons offered for a given tier, in catalogue order. */
export function addOnsForTier(tier: string): AddOn[] {
  return ADD_ONS.filter((addOn) => !addOn.tiers || addOn.tiers.includes(tier as never));
}
