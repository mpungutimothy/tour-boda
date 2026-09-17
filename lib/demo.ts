/**
 * Prototype disclosure.
 *
 * The marketplace is real software, but it is not connected to live inventory,
 * payments or reviews. Every figure a visitor might mistake for a real-world
 * claim — ratings, availability, partner agreements — is flagged from one
 * place so the disclosure cannot drift out of sync with the data.
 */

export const IS_PROTOTYPE = true;

export const PROTOTYPE_NOTICE = {
  short: "Prototype",
  label: "Pitch prototype — sample data",
  detail:
    "Routes, prices, guide ratings and partner marks on this site are sample data for an investor demonstration. Payments are simulated and no booking is dispatched to a rider.",
} as const;
