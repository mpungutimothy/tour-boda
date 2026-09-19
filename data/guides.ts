import type { TierKey } from "@/types/destination";

/**
 * Guide profiles.
 *
 * ⚠️  PROTOTYPE DATA. Ratings, review counts, licence numbers and vetting
 * dates are sample values, not records.
 *
 * Portraits: three founding profiles carry stock portraits; the three newer
 * profiles deliberately have none, and fall back to a monogram identity mark.
 * Attaching a real stranger's face to an invented name, licence number and
 * rating is misrepresentation, so the design supports both states on purpose.
 * Replace both with consented operator photography before this goes in front
 * of the public.
 *
 * Every profile does carry a `regionImage` — a real photograph of the district
 * that guide works in — so no card is left without imagery while we wait on
 * consented portraits.
 */

export interface GuideLicence {
  authority: string;
  number: string;
  validUntil: string;
}

export interface GuideVetting {
  verifiedOn: string;
  method: string;
}

export interface Guide {
  id: string;
  name: string;
  /**
   * Optional by design. When absent the card renders a monogram identity mark
   * instead of a photograph.
   */
  photo?: string;
  /**
   * Photograph of the guide's own district, shown as the card's lead image.
   *
   * This carries the visual weight of the card so that a profile without a
   * consented portrait still reads as complete. It is a real photograph of the
   * place the guide actually works — never a stand-in face.
   */
  regionImage: string;
  region: string;
  /** Matches `Destination.location.district`, so guides and routes align. */
  district: string;
  languages: string[];
  yearsExperience: number;
  specialties: string[];
  bio: string;
  /** Prototype rating. See the warning above. */
  rating: number;
  reviewCount: number;
  tripsLed: number;
  licence: GuideLicence;
  vetted: GuideVetting;
  /** Tiers this guide is cleared to lead. */
  tierKeys: TierKey[];
  destinationSlugs: string[];
  vehicle: string;
  /** Median first reply time, in minutes. */
  responseMinutes: number;
}

export const guides: Guide[] = [
  {
    id: "okello-joseph",
    name: "Okello Joseph",
    photo: "/images/guide-photo-okello.jpg",
    regionImage: "/images/guide-okello.jpg",
    region: "Central Region, Kampala",
    district: "Kampala",
    languages: ["Luganda", "Acholi", "English"],
    yearsExperience: 14,
    specialties: ["Kampala city rides", "Heritage sites", "Street food tours"],
    bio: "Born in Gulu, moved to Kampala at sixteen. Has been riding boda through the capital since 2011 and knows every shortcut in Nakasero and Nakawa.",
    rating: 4.9,
    reviewCount: 128,
    tripsLed: 940,
    licence: {
      authority: "Kampala Capital City Authority",
      number: "KCCA/BODA/2019/18743",
      validUntil: "2026-12-31",
    },
    vetted: {
      verifiedOn: "2025-11-14",
      method: "In-person interview, route ride-along, and licence check at KCCA offices",
    },
    tierKeys: ["freelance", "guided", "experience"],
    destinationSlugs: ["kampala-city-heritage", "custom-destination-tour"],
    vehicle: "Bajaj Boxer 150, 2021 — serviced monthly, two spare helmets",
    responseMinutes: 12,
  },
  {
    id: "namugga-florence",
    name: "Namugga Florence",
    photo: "/images/guide-photo-florence.jpg",
    regionImage: "/images/guide-florence.jpg",
    region: "Eastern Region, Jinja",
    district: "Jinja",
    languages: ["Luganda", "Lusoga", "English"],
    yearsExperience: 7,
    specialties: ["Jinja heritage tours", "Nile boat trips", "Colonial history"],
    bio: "Tourism graduate of Makerere University. Wrote her thesis on the industrial history of Jinja. Has been guiding the Jinja Road twice a week since 2019.",
    rating: 4.8,
    reviewCount: 96,
    tripsLed: 610,
    licence: {
      authority: "Jinja District Local Government",
      number: "JDLG/TG/2021/04412",
      validUntil: "2026-09-30",
    },
    vetted: {
      verifiedOn: "2025-10-02",
      method: "In-person interview, thesis and qualification check, route ride-along",
    },
    tierKeys: ["freelance", "guided", "experience"],
    destinationSlugs: ["jinja-nile"],
    vehicle: "Honda CG 125, 2022 — first-aid kit and two rain ponchos carried",
    responseMinutes: 25,
  },
  {
    id: "ssemwogerere-david",
    name: "Ssemwogerere David",
    photo: "/images/guide-photo-david.jpg",
    regionImage: "/images/guide-david.jpg",
    region: "Central Region, Entebbe",
    district: "Entebbe",
    languages: ["Luganda", "English", "Kiswahili"],
    yearsExperience: 9,
    specialties: ["Entebbe gardens", "Lake Victoria shore", "Wildlife centre"],
    bio: "Born and raised in Entebbe, two streets from the lake. Former fishing boat hand turned licensed guide. Knows where the fish auction starts at 5 AM.",
    rating: 4.9,
    reviewCount: 74,
    tripsLed: 480,
    licence: {
      authority: "Entebbe Municipal Council",
      number: "EMC/TG/2020/00918",
      validUntil: "2026-11-30",
    },
    vetted: {
      verifiedOn: "2025-12-01",
      method: "In-person interview, boat-operator reference, route ride-along",
    },
    tierKeys: ["freelance", "guided", "experience"],
    destinationSlugs: ["entebbe-cultural"],
    vehicle: "TVS HLX 125, 2020 — machete and first-aid kit in the tool box",
    responseMinutes: 8,
  },
  {
    id: "wamala-robert",
    name: "Wamala Robert",
    regionImage: "/images/guide-robert.jpg",
    region: "Eastern Region, Kapchorwa",
    district: "Mbale",
    languages: ["Luganda", "Lumasaaba", "English"],
    yearsExperience: 13,
    specialties: ["Sipi falls trails", "Coffee farming", "Mount Elgon foothills"],
    bio: "Third-generation coffee farmer on the Sipi slope who started guiding the trail in 2012. Carries a walking stick for every guest and will not let you do the descent without one.",
    rating: 4.9,
    reviewCount: 58,
    tripsLed: 390,
    licence: {
      authority: "Kapchorwa District Local Government",
      number: "KDLG/TG/2018/02207",
      validUntil: "2026-08-31",
    },
    vetted: {
      verifiedOn: "2025-09-19",
      method: "In-person interview, Sipi Guides Association reference, trail walk-through",
    },
    tierKeys: ["freelance", "guided", "experience"],
    destinationSlugs: ["sipi-falls-mbale"],
    vehicle: "Bajaj Boxer 125, 2019 — walking sticks and rain shells carried",
    responseMinutes: 40,
  },
  {
    id: "kyomuhendo-justus",
    name: "Kyomuhendo Justus",
    regionImage: "/images/guide-justus.jpg",
    region: "Western Region, Kabarole",
    district: "Fort Portal",
    languages: ["Rutooro", "Runyankole", "English"],
    yearsExperience: 10,
    specialties: ["Community tourism", "Crater lakes", "Craft cooperatives"],
    bio: "Runs the Nkingo community tourism group outside Fort Portal. Publishes the village's revenue split on a board at the trading centre, which tells you most of what you need to know about how he works.",
    rating: 4.8,
    reviewCount: 41,
    tripsLed: 265,
    licence: {
      authority: "Kabarole District Local Government",
      number: "KDLG/TG/2019/03351",
      validUntil: "2026-07-31",
    },
    vetted: {
      verifiedOn: "2025-08-27",
      method: "In-person interview at the trading centre, cooperative records reviewed",
    },
    tierKeys: ["freelance", "guided", "experience"],
    destinationSlugs: ["kibale-community"],
    vehicle: "Honda ACE 125, 2021 — carried a second helmet before it was required",
    responseMinutes: 55,
  },
  {
    id: "mbabazi-sarah",
    name: "Mbabazi Sarah",
    regionImage: "/images/guide-sarah.jpg",
    region: "Central Region, Kampala",
    district: "Kampala",
    languages: ["Luganda", "English", "Kiswahili"],
    yearsExperience: 8,
    specialties: ["Route planning", "Multi-day itineraries", "Group logistics"],
    bio: "Runs the custom desk. Quotes every route herself and will tell you when an idea does not work — including when the idea is yours and the answer is no.",
    rating: 4.9,
    reviewCount: 33,
    tripsLed: 0,
    licence: {
      authority: "Uganda Tourism Board",
      number: "UTB/TO/2022/07784",
      validUntil: "2026-06-30",
    },
    vetted: {
      verifiedOn: "2025-10-30",
      method: "In-person interview, UTB operator registration verified, three references taken",
    },
    // A planner, not a rider: she scopes and quotes, then hands to a guide.
    tierKeys: ["guided", "experience"],
    destinationSlugs: ["custom-destination-tour"],
    vehicle: "Does not ride — plans and quotes, then assigns a guide",
    responseMinutes: 18,
  },
];

const BY_ID = new Map(guides.map((guide) => [guide.id, guide]));

export function getGuide(id: string): Guide | undefined {
  return BY_ID.get(id);
}

export function guidesForDestination(slug: string): Guide[] {
  return guides.filter((guide) => guide.destinationSlugs.includes(slug));
}

export function guidesForDistrict(district: string): Guide[] {
  return guides.filter((guide) => guide.district === district);
}

/** Guides cleared to lead a given tier. */
export function guidesForTier(tier: TierKey): Guide[] {
  return guides.filter((guide) => guide.tierKeys.includes(tier));
}

/** Weighted mean rating across every profile, for headline stats. */
export function averageRating(): number {
  const totalReviews = guides.reduce((sum, guide) => sum + guide.reviewCount, 0);
  if (totalReviews === 0) return 0;
  const weighted = guides.reduce(
    (sum, guide) => sum + guide.rating * guide.reviewCount,
    0,
  );
  return Math.round((weighted / totalReviews) * 10) / 10;
}

export function totalTripsLed(): number {
  return guides.reduce((sum, guide) => sum + guide.tripsLed, 0);
}
