import type { Destination, TierComponent, TierKey, TourTier } from "@/types/destination";
import type {
  AddOnSelection,
  Party,
  Quote,
  QuoteLine,
} from "@/types/marketplace";

/* -------------------------------------------------------------------------- */
/*  Rules                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every number the quote depends on, in one place, so the booking summary can
 * show a traveller exactly why the total moved.
 */
export const PRICING_RULES = {
  /** Under-12s ride at half the adult rate. */
  childRate: 0.5,
  /** A single traveller pays for the empty second seat on the bike. */
  privateRideSupplement: 0.25,
  /** Party size (adult-equivalents) at which the group rate kicks in. */
  groupDiscountMinAdults: 5,
  groupDiscountRate: 0.1,
  /** Passengers per boda. Drives how many bikes a party needs. */
  bodaCapacity: 2,
  /** Uganda VAT, already inside the published price. Shown for transparency. */
  vatRate: 0.18,
} as const;

export const PRICING_EXPLAINERS = {
  child: "Children under 12 ride at half rate.",
  solo: "Solo riders pay a 25% private-ride supplement — you are covering the empty second seat.",
  group: "Parties of five or more adults get 10% off the package.",
  componentOn: "Added because you asked for it and this tier does not include it.",
  componentOff: "Credited back because this tier includes it and you do not need it.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Party maths                                                                */
/* -------------------------------------------------------------------------- */

export function passengerCount(party: Party): number {
  return party.adults + party.children;
}

/** Children count as half a fare for both capacity and discount maths. */
export function adultEquivalent(party: Party): number {
  return party.adults + party.children * PRICING_RULES.childRate;
}

export function bodasRequired(party: Party): number {
  return Math.max(1, Math.ceil(passengerCount(party) / PRICING_RULES.bodaCapacity));
}

export function isSoloRider(party: Party): boolean {
  return party.adults === 1 && party.children === 0;
}

export function qualifiesForGroupRate(party: Party): boolean {
  return adultEquivalent(party) >= PRICING_RULES.groupDiscountMinAdults;
}

/* -------------------------------------------------------------------------- */
/*  Component toggles                                                          */
/* -------------------------------------------------------------------------- */

export type ComponentKey = "transport" | "guide" | "meals";

export interface Requirements {
  transport: boolean;
  guide: boolean;
  meals: boolean;
}

export const DEFAULT_REQUIREMENTS: Requirements = {
  transport: true,
  guide: false,
  meals: false,
};

export const COMPONENT_LABELS: Record<ComponentKey, string> = {
  transport: "Boda transport",
  guide: "Licensed guide",
  meals: "Meals",
};

export const COMPONENT_ORDER: ComponentKey[] = ["transport", "guide", "meals"];

/** Requirements implied by a tier, so the form starts in a sensible place. */
export function requirementsForTier(tier: TourTier): Requirements {
  return {
    transport: tier.components.transport.included,
    guide: tier.components.guide.included,
    meals: tier.components.meals.included,
  };
}

/**
 * A toggle can only be switched off when the tier marks the component
 * removable. The ride itself is never removable.
 */
export function canToggleOff(tier: TourTier, key: ComponentKey): boolean {
  const component = tier.components[key];
  return component.included && component.removable;
}

/** True when the traveller wants something this tier does not include. */
export function isUpsell(tier: TourTier, key: ComponentKey): boolean {
  return !tier.components[key].included;
}

/* -------------------------------------------------------------------------- */
/*  Quote                                                                      */
/* -------------------------------------------------------------------------- */

export interface QuoteInput {
  destination: Destination;
  tier: TourTier;
  party: Party;
  requirements: Requirements;
  addOns?: AddOnSelection[];
}

function componentDelta(
  key: ComponentKey,
  component: TierComponent,
  wanted: boolean,
  multiplier: number,
): number {
  if (component.included && !wanted && component.removable) {
    return -component.value * multiplier;
  }
  if (!component.included && wanted) {
    return component.value * multiplier;
  }
  return 0;
}

export function addOnAmount(selection: AddOnSelection, party: Party): number {
  switch (selection.unit) {
    case "per-person":
      return selection.unitPrice * adultEquivalent(party) * selection.quantity;
    case "per-day":
      return selection.unitPrice * selection.quantity;
    case "per-group":
    default:
      return selection.unitPrice * selection.quantity;
  }
}

export function addOnDetail(selection: AddOnSelection, party: Party): string {
  switch (selection.unit) {
    case "per-person": {
      const people = adultEquivalent(party);
      const peopleLabel = Number.isInteger(people) ? String(people) : people.toFixed(1);
      return selection.quantity > 1
        ? `×${selection.quantity} · ${peopleLabel} people`
        : `${peopleLabel} people`;
    }
    case "per-day":
      return selection.quantity === 1 ? "1 day" : `${selection.quantity} days`;
    case "per-group":
    default:
      return selection.quantity === 1 ? "for the group" : `×${selection.quantity}`;
  }
}

/**
 * Build a full, itemised quote.
 *
 * The tier price is the package for one adult-equivalent at the standard
 * party of two. Party size, the solo supplement and the group rate scale that
 * package; the transport / guide / meals toggles then add or credit the value
 * of each component. The result is clamped at zero, and `assertCommerceIntegrity`
 * guarantees the clamp is never actually load-bearing.
 */
export function buildQuote({
  destination,
  tier,
  party,
  requirements,
  addOns = [],
}: QuoteInput): Quote {
  const multiplier = adultEquivalent(party);
  const lines: QuoteLine[] = [];

  const solo = isSoloRider(party);
  const groupRate = qualifiesForGroupRate(party);

  // Base package, before supplements. The solo supplement and the group rate
  // are then listed as their own lines rather than folded into a multiplier,
  // because the summary has to show the traveller why the number moved.
  // They are mutually exclusive (a solo rider is never a group), so listing
  // them separately composes to exactly the same total.
  const packageTotal = tier.price * multiplier;

  lines.push({
    label: `${tier.name} — package`,
    detail:
      multiplier === 1
        ? "1 adult-equivalent"
        : `${round1(multiplier)} adult-equivalents`,
    amount: packageTotal,
  });

  let partyAdjustment = 0;

  if (solo) {
    const supplement = packageTotal * PRICING_RULES.privateRideSupplement;
    partyAdjustment += supplement;
    lines.push({
      label: "Private-ride supplement",
      detail: `+${Math.round(PRICING_RULES.privateRideSupplement * 100)}% · ${PRICING_EXPLAINERS.solo}`,
      amount: supplement,
    });
  }

  if (groupRate) {
    const discount = -packageTotal * PRICING_RULES.groupDiscountRate;
    partyAdjustment += discount;
    lines.push({
      label: "Group rate",
      detail: `−${Math.round(PRICING_RULES.groupDiscountRate * 100)}% · ${PRICING_EXPLAINERS.group}`,
      amount: discount,
      credit: true,
    });
  }

  let componentTotal = 0;
  for (const key of COMPONENT_ORDER) {
    const delta = componentDelta(key, tier.components[key], requirements[key], multiplier);
    if (delta === 0) continue;
    componentTotal += delta;

    const adding = delta > 0;
    lines.push({
      label: adding
        ? `${COMPONENT_LABELS[key]} added`
        : `${COMPONENT_LABELS[key]} removed`,
      detail: adding
        ? PRICING_EXPLAINERS.componentOn
        : PRICING_EXPLAINERS.componentOff,
      amount: delta,
      credit: delta < 0,
    });
  }

  const addOnTotal = addOns.reduce(
    (sum, selection) => sum + addOnAmount(selection, party),
    0,
  );

  for (const selection of addOns) {
    lines.push({
      label: selection.name,
      detail: addOnDetail(selection, party),
      amount: addOnAmount(selection, party),
    });
  }

  const subtotal = Math.max(0, packageTotal + partyAdjustment + componentTotal);
  const total = Math.max(0, subtotal + addOnTotal);
  const people = passengerCount(party);

  return {
    destinationSlug: destination.slug,
    tierKey: tier.key,
    party,
    lines,
    subtotal: Math.round(subtotal),
    addOnTotal: Math.round(addOnTotal),
    total: Math.round(total),
    perPerson: people > 0 ? Math.round(total / people) : Math.round(total),
    // Prices are VAT inclusive, so the tax portion is extracted, never added.
    vatIncluded: Math.round(total - total / (1 + PRICING_RULES.vatRate)),
    passengers: people,
    bodas: bodasRequired(party),
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/* -------------------------------------------------------------------------- */
/*  Integrity                                                                  */
/* -------------------------------------------------------------------------- */

export interface PricingViolation {
  slug: string;
  tier: TierKey;
  reason: string;
}

/**
 * Confirms that no combination of party and toggles can drive a quote below
 * zero. Run from `scripts/verify-marketplace.ts`, so a bad commerce edit fails
 * a check rather than producing a nonsense price in front of an investor.
 */
export function findPricingViolations(
  all: Destination[],
): PricingViolation[] {
  const violations: PricingViolation[] = [];
  const worstFactor =
    1 - PRICING_RULES.groupDiscountRate; // 0.9, applied on top of price × ae

  for (const destination of all) {
    for (const tier of destination.tiers) {
      const included = COMPONENT_ORDER.reduce(
        (sum, key) =>
          sum + (tier.components[key].included ? tier.components[key].value : 0),
        0,
      );
      if (included > tier.price * worstFactor) {
        violations.push({
          slug: destination.slug,
          tier: tier.key,
          reason:
            `included components total ${included}, which exceeds ` +
            `${Math.round(tier.price * worstFactor)} — the worst-case ` +
            `discounted package. Waiving every component could reach zero.`,
        });
      }
      // Removing everything the tier includes must still leave a positive price.
      const floor = tier.price * worstFactor - included;
      if (floor <= 0) {
        violations.push({
          slug: destination.slug,
          tier: tier.key,
          reason: `floor price is ${Math.round(floor)}; it must stay above zero.`,
        });
      }
    }
  }

  return violations;
}
