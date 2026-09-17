import type {
  ExperienceTypeId,
  GroupType,
  PricingMode,
  TierComponent,
  TierKey,
  TourTierComponents,
} from "@/types/destination";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Part of the package, and the traveller may take it out. */
const inc = (value: number, removable = true): TierComponent => ({
  included: true,
  removable,
  value,
});

/** Not part of the package, but can be added for this much. */
const opt = (value: number): TierComponent => ({
  included: false,
  removable: true,
  value,
});

/**
 * The boda itself. Never removable on the Freelance tier — the ride IS the
 * product, so a "self-guided, no transport" option would be meaningless.
 */
const bike = (value: number): TierComponent => inc(value, false);

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Everything operational about a tier: what it can carry, how long it runs,
 * and what each toggleable component is worth. Kept in shillings per person so
 * the pricing engine can add and subtract without re-deriving anything.
 */
export interface TierCommerce {
  durationHours: number;
  maxParty: number;
  components: TourTierComponents;
  excludes: string[];
  badge?: string;
}

export interface DestinationCommerce {
  pricingMode: PricingMode;
  quoteNote?: string;
  district: string;
  experienceTypes: ExperienceTypeId[];
  groupTypes: GroupType[];
  guideIds: string[];
  addOnIds: string[];
  minLeadTimeHours: number;
  /** Keyed by tier, and every destination must define all three. */
  tiers: Record<TierKey, TierCommerce>;
}

/* -------------------------------------------------------------------------- */
/*  Configuration                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Component values are set so that `transport + guide + meals` never exceeds
 * the published price — the remainder is the non-toggleable experience itself
 * (entrance fees, the route, the itinerary). Toggling a component on or off
 * therefore moves the price but can never take it below zero.
 */
export const DESTINATION_COMMERCE: Record<string, DestinationCommerce> = {
  "kampala-city-heritage": {
    pricingMode: "fixed",
    district: "Kampala",
    experienceTypes: ["city-heritage", "food-market", "community"],
    groupTypes: ["solo", "couple", "family", "group"],
    guideIds: ["okello-joseph"],
    addOnIds: [
      "airport-pickup",
      "market-cooking",
      "photo-set",
      "travel-cover",
      "sim-data",
    ],
    minLeadTimeHours: 12,
    tiers: {
      freelance: {
        durationHours: 3.5,
        maxParty: 2,
        components: {
          transport: bike(45000),
          guide: opt(40000),
          meals: opt(15000),
        },
        excludes: ["Licensed guide", "Meals and drinks", "Uganda Museum entry"],
      },
      guided: {
        durationHours: 3.5,
        maxParty: 6,
        components: {
          transport: inc(45000),
          guide: inc(55000),
          meals: inc(15000),
        },
        excludes: ["Lunch", "Uganda Museum entry", "Afternoon tea"],
        badge: "Most booked",
      },
      experience: {
        durationHours: 7,
        maxParty: 8,
        components: {
          transport: inc(45000),
          guide: inc(55000),
          meals: inc(45000),
        },
        excludes: ["Alcohol", "Souvenirs"],
      },
    },
  },

  "jinja-nile": {
    pricingMode: "fixed",
    district: "Jinja",
    experienceTypes: ["lake-river", "city-heritage", "nature-waterfalls"],
    groupTypes: ["solo", "couple", "family", "group"],
    guideIds: ["namugga-florence"],
    addOnIds: ["photo-set", "interpreter", "extra-day", "travel-cover", "sim-data"],
    minLeadTimeHours: 24,
    tiers: {
      freelance: {
        durationHours: 9,
        maxParty: 2,
        components: {
          transport: bike(120000),
          guide: opt(70000),
          meals: opt(25000),
        },
        excludes: [
          "Licensed guide",
          "Lunch at the Sailing Club",
          "Mabira Forest walk",
        ],
      },
      guided: {
        durationHours: 10,
        maxParty: 6,
        components: {
          transport: inc(120000),
          guide: inc(70000),
          meals: inc(25000),
        },
        excludes: ["Lodge accommodation", "Forest walk", "Sunset river cruise"],
        badge: "Most booked",
      },
      experience: {
        // Two days, so elapsed hours are what the duration filter compares.
        durationHours: 48,
        maxParty: 8,
        components: {
          transport: inc(140000),
          guide: inc(110000),
          meals: inc(60000),
        },
        excludes: ["Alcohol", "Personal shopping"],
      },
    },
  },

  "entebbe-cultural": {
    pricingMode: "fixed",
    district: "Entebbe",
    experienceTypes: ["lake-river", "wildlife", "nature-waterfalls", "food-market"],
    groupTypes: ["solo", "couple", "family", "group"],
    guideIds: ["ssemwogerere-david"],
    addOnIds: ["airport-pickup", "sunset-extension", "travel-cover", "sim-data"],
    minLeadTimeHours: 8,
    tiers: {
      freelance: {
        durationHours: 6,
        maxParty: 2,
        components: {
          transport: bike(30000),
          guide: opt(25000),
          meals: opt(12000),
        },
        excludes: ["Licensed guide", "Lunch", "Sunset boat ride"],
      },
      guided: {
        durationHours: 6,
        maxParty: 6,
        components: {
          transport: inc(30000),
          guide: inc(35000),
          meals: inc(12000),
        },
        excludes: [
          "Fried fish lunch at Maama Nalongo's",
          "Sunset boat ride",
          "Golf club terrace",
        ],
        badge: "Most booked",
      },
      experience: {
        durationHours: 8,
        maxParty: 8,
        components: {
          transport: inc(35000),
          guide: inc(35000),
          meals: inc(30000),
        },
        excludes: ["Alcohol", "Airport hotel transfer"],
      },
    },
  },

  "sipi-falls-mbale": {
    pricingMode: "fixed",
    district: "Mbale",
    experienceTypes: [
      "nature-waterfalls",
      "mountains-hiking",
      "food-market",
      "community",
    ],
    // The final descent to Sipi Three is steep red clay — not a route to put a
    // small child on, so Family is deliberately absent from this one.
    groupTypes: ["solo", "couple", "group"],
    guideIds: ["wamala-robert"],
    addOnIds: ["second-boda", "market-cooking", "extra-day", "travel-cover", "photo-set"],
    minLeadTimeHours: 48,
    tiers: {
      freelance: {
        durationHours: 5,
        maxParty: 2,
        components: {
          transport: bike(70000),
          guide: opt(60000),
          meals: opt(20000),
        },
        excludes: [
          "Licensed trail guide",
          "Coffee-farm tasting",
          "Lunch at the banda",
        ],
      },
      guided: {
        durationHours: 6,
        maxParty: 6,
        components: {
          transport: inc(70000),
          guide: inc(70000),
          meals: inc(20000),
        },
        excludes: ["Abseiling at Sipi Three", "Lodge accommodation"],
        badge: "Most booked",
      },
      experience: {
        // Overnight in Mbale, so two days of elapsed time.
        durationHours: 30,
        maxParty: 8,
        components: {
          transport: inc(90000),
          guide: inc(90000),
          meals: inc(45000),
        },
        excludes: ["Alcohol", "Abseiling equipment hire"],
      },
    },
  },

  "kibale-community": {
    pricingMode: "fixed",
    district: "Fort Portal",
    experienceTypes: ["community", "lake-river", "nature-waterfalls", "food-market"],
    groupTypes: ["solo", "couple", "family", "group"],
    guideIds: ["kyomuhendo-justus"],
    addOnIds: ["market-cooking", "second-boda", "extra-day", "travel-cover", "sim-data"],
    minLeadTimeHours: 48,
    tiers: {
      freelance: {
        durationHours: 4,
        maxParty: 2,
        components: {
          transport: bike(50000),
          guide: opt(50000),
          meals: opt(18000),
        },
        excludes: ["Community host", "Cooking session", "Craft cooperative visit"],
      },
      guided: {
        durationHours: 5,
        maxParty: 6,
        components: {
          transport: inc(50000),
          guide: inc(60000),
          meals: inc(18000),
        },
        excludes: ["Bee-hive visit", "Extra crater lake"],
        badge: "Community-owned",
      },
      experience: {
        durationHours: 26,
        maxParty: 8,
        components: {
          transport: inc(65000),
          guide: inc(70000),
          meals: inc(35000),
        },
        excludes: ["Alcohol", "Homestay night (quoted separately)"],
      },
    },
  },

  "custom-destination-tour": {
    pricingMode: "quotation",
    quoteNote:
      "Indicative pricing only. Every custom route is quoted by hand within 48 hours, itemised line by line, and confirmed before any payment is taken.",
    district: "Anywhere in Uganda",
    experienceTypes: ["custom"],
    groupTypes: ["solo", "couple", "family", "group"],
    guideIds: ["mbabazi-sarah", "okello-joseph"],
    addOnIds: [
      "airport-pickup",
      "second-boda",
      "photo-set",
      "interpreter",
      "extra-day",
      "sunset-extension",
      "market-cooking",
      "travel-cover",
      "sim-data",
    ],
    minLeadTimeHours: 72,
    tiers: {
      freelance: {
        durationHours: 6,
        maxParty: 2,
        components: {
          transport: bike(80000),
          guide: opt(70000),
          meals: opt(25000),
        },
        excludes: ["Licensed guide", "Accommodation", "Park entry fees"],
      },
      guided: {
        durationHours: 10,
        maxParty: 6,
        components: {
          transport: inc(80000),
          guide: inc(90000),
          meals: inc(25000),
        },
        excludes: ["Accommodation", "Park entry fees", "Domestic flights"],
        badge: "Quoted",
      },
      experience: {
        durationHours: 48,
        maxParty: 8,
        components: {
          transport: inc(110000),
          guide: inc(120000),
          meals: inc(60000),
        },
        excludes: ["International flights", "Travel insurance"],
      },
    },
  },
};

/**
 * Sanity check: the components a traveller can *deduct* must not exceed the
 * price, or waiving them all would drive the quote to nothing. Only the
 * components the tier actually includes count toward that ceiling — an
 * optional component's value is simply what it costs to add, and may exceed a
 * cheap tier's base price without anything being wrong.
 *
 * Checked at module load so a bad edit fails loudly in development rather than
 * producing a nonsense quote in front of an investor.
 */
export function assertCommerceIntegrity(
  slug: string,
  price: number,
  tier: TierKey,
  components: TourTierComponents,
): void {
  const deducible =
    (components.transport.included ? components.transport.value : 0) +
    (components.guide.included ? components.guide.value : 0) +
    (components.meals.included ? components.meals.value : 0);

  if (deducible > price) {
    fail(
      `[commerce] ${slug}/${tier}: deducible components total ${deducible}, ` +
        `which exceeds the ${price} price`,
    );
  }
  for (const key of ["transport", "guide", "meals"] as const) {
    const component = components[key];
    if (component.removable === false && component.included === false) {
      fail(
        `[commerce] ${slug}/${tier}/${key}: a component that is not included ` +
          `cannot be marked non-removable`,
      );
    }
  }
}

function fail(message: string): void {
  throw new Error(message);
}
