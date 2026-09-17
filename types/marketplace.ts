import type {
  AddOnUnit,
  ExperienceTypeId,
  GroupType,
  TierKey,
} from "@/types/destination";

/* -------------------------------------------------------------------------- */
/*  Search / filter state                                                      */
/* -------------------------------------------------------------------------- */

export type SortKey = "recommended" | "price-asc" | "price-desc" | "duration-asc";

/**
 * Budget slider bounds, in UGX per person. The top of the range means "no
 * limit" rather than a real ceiling, so a traveller who never touches the
 * slider is not silently filtered by it.
 */
export const BUDGET_BOUNDS = { min: 50000, max: 700000, step: 10000 } as const;

export const BUDGET_UNLIMITED = BUDGET_BOUNDS.max;

export interface SearchFilters {
  /** Free text over district and destination name. Empty means "anywhere". */
  location: string;
  /** Empty array means "all experience types". */
  experienceTypes: ExperienceTypeId[];
  /** ISO date (yyyy-mm-dd) or empty. */
  date: string;
  /** HH:mm or empty. Carried into the booking flow; not yet a hard filter. */
  time: string;
  /** Empty means "any group". */
  groupType: GroupType | "";
  /** Upper bound in UGX, per person. */
  maxBudget: number;
  requireTransport: boolean;
  requireGuide: boolean;
  requireMeals: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
  location: "",
  experienceTypes: [],
  date: "",
  time: "",
  groupType: "",
  maxBudget: BUDGET_UNLIMITED,
  requireTransport: false,
  requireGuide: false,
  requireMeals: false,
};

/* -------------------------------------------------------------------------- */
/*  Party and quote                                                            */
/* -------------------------------------------------------------------------- */

export interface Party {
  adults: number;
  children: number;
}

export interface QuoteLine {
  label: string;
  /** Human-readable quantity, e.g. "2 adults" or "×1". */
  detail: string;
  amount: number;
  /** True when this line reduces the total. */
  credit?: boolean;
  /** True when the line is informational and not added to the total. */
  informational?: boolean;
}

export interface Quote {
  destinationSlug: string;
  tierKey: TierKey;
  party: Party;
  lines: QuoteLine[];
  subtotal: number;
  addOnTotal: number;
  total: number;
  /** Per-person effective price, for the "from" badge. */
  perPerson: number;
  /** Portion of `total` that is VAT, for display only. */
  vatIncluded: number;
  /** Total passengers across adults and children. */
  passengers: number;
  /** Boda-bikes required at the stated capacity. */
  bodas: number;
}

/* -------------------------------------------------------------------------- */
/*  Add-on selections                                                          */
/* -------------------------------------------------------------------------- */

export interface AddOnSelection {
  id: string;
  name: string;
  unit: AddOnUnit;
  unitPrice: number;
  quantity: number;
}

/* -------------------------------------------------------------------------- */
/*  Booking flow                                                               */
/* -------------------------------------------------------------------------- */

export type BookingStep =
  | "tier"
  | "details"
  | "summary"
  | "payment"
  | "confirmed";

export type PaymentMethod = "mtn" | "airtel" | "card";

export interface PaymentMethodMeta {
  id: PaymentMethod;
  label: string;
  /** Short line shown under the label. */
  hint: string;
  kind: "mobile-money" | "card";
}

export interface BookingDraft {
  destinationSlug: string;
  tierKey: TierKey;
  date: string;
  time: string;
  groupType: GroupType | "";
  party: Party;
  addOns: AddOnSelection[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  requireTransport: boolean;
  requireGuide: boolean;
  requireMeals: boolean;
  notes: string;
}

export interface BookingReference {
  /** Prototype reference, e.g. TB-4F9K2A. */
  code: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  /** Mobile-money number or masked card, per method. */
  paymentDetail: string;
  total: number;
}
