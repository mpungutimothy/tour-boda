/**
 * How money moves through one booking.
 *
 * The split is taken from the concept note: on every package sold, the boda
 * operator and the guide share 60%, the destination or experience provider
 * receives 25%, and the platform retains 15%. The traveller pays one price —
 * the 15% is a commission taken out of that price, NOT a fee added on top.
 * That distinction is the reason the site can honestly claim a zero booking
 * fee for travellers while still earning a margin.
 */

export type RevenuePartyId = "operator" | "provider" | "platform";

export interface RevenueParty {
  id: RevenuePartyId;
  label: string;
  /** Shorter label for chart legends on narrow screens. */
  shortLabel: string;
  share: number;
  description: string;
}

export const REVENUE_SPLIT: RevenueParty[] = [
  {
    id: "operator",
    label: "Boda operator + guide",
    shortLabel: "Operator & guide",
    share: 0.6,
    description:
      "Paid to the rider who owns the bike and, on guided tiers, the licensed guide riding with them. Settled by mobile money within 24 hours of the trip ending.",
  },
  {
    id: "provider",
    label: "Destination / experience provider",
    shortLabel: "Provider",
    share: 0.25,
    description:
      "Entrance fees, host payments, meals and activity costs paid to the site, community group or restaurant that delivers that part of the day.",
  },
  {
    id: "platform",
    label: "Platform",
    shortLabel: "Platform",
    share: 0.15,
    description:
      "Tour-Boda's margin. Covers payment processing, guide vetting and re-verification, insurance administration, and the booking system itself.",
  },
];

export interface RevenueShare extends RevenueParty {
  amount: number;
}

/** Split a package total into the three shares. Rounded to whole shillings. */
export function splitRevenue(total: number): RevenueShare[] {
  return REVENUE_SPLIT.map((party) => ({
    ...party,
    amount: Math.round(total * party.share),
  }));
}

/**
 * The band the concept note quotes for a boda operator's own day rate, used as
 * a sanity check against the 60% share on the entry tier.
 */
export const OPERATOR_DAY_RATE_BAND = {
  min: 20000,
  max: 40000,
  label: "UGX 20,000 – 40,000",
  note: "The concept note's operator day-rate band. On the entry tiers the 60% share lands inside it; on the premium tiers it sits well above, which is the point of the tier structure.",
};

/** Traveller-facing fees. Kept explicit so the claim stays auditable. */
export const TRAVELLER_FEES = {
  bookingFee: 0,
  currency: "UGX",
  note: "No booking fee is added to the traveller's price. The platform is paid out of the package, not on top of it.",
};
