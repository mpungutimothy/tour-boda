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
  /**
   * Photography provenance, stated plainly.
   *
   * Every image is licensed Uganda-specific stock, stored locally and credited
   * on /credits — nothing is hotlinked and nothing is unlicensed. It is still
   * not *commissioned* photography of these specific operators, so it must be
   * replaced before launch. Saying that here stops the pitch from implying
   * otherwise.
   */
  photography:
    "Destination and guide photography is licensed Uganda-specific stock, credited on the photography page. It is not commissioned photography of these specific operators and should be replaced with original or UTB-sourced imagery before launch.",
  socials:
    "Social handles and partner marks are placeholders; no accounts are live and no institutional marks are used pending permission.",
} as const;
