/**
 * Pricing engine assertions.
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/verify-pricing.ts
 *
 * These are hand-computed expectations, not a snapshot of whatever the engine
 * currently returns, so a change in behaviour fails the check instead of being
 * silently blessed.
 */
import { getDestination, getTier } from "../data/destinations";
import type { Party } from "../types/marketplace";
import {
  PRICING_RULES,
  buildQuote,
  type Requirements,
} from "../lib/marketplace/pricing";
import { selectTier } from "../lib/marketplace/filter";
import { DEFAULT_FILTERS } from "../types/marketplace";

let failures = 0;
let checks = 0;

function expect(label: string, actual: number, wanted: number): void {
  checks += 1;
  const ok = actual === wanted;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${label.padEnd(56)} ${actual.toLocaleString("en-UG").padStart(10)}  ${
      ok ? "" : `expected ${wanted.toLocaleString("en-UG")}`
    }`,
  );
}

function expectEqual(label: string, actual: unknown, wanted: unknown): void {
  checks += 1;
  const ok = actual === wanted;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${label.padEnd(56)} ${String(actual).padStart(10)}  ${
      ok ? "" : `expected ${String(wanted)}`
    }`,
  );
}

const kampala = getDestination("kampala-city-heritage");
if (!kampala) throw new Error("kampala-city-heritage missing");
const guided = getTier(kampala, "guided");
const freelance = getTier(kampala, "freelance");
const experience = getTier(kampala, "experience");
if (!guided || !freelance || !experience) throw new Error("tiers missing");

const ALL_ON: Requirements = { transport: true, guide: true, meals: true };
const TIER_DEFAULTS = (tier: typeof guided): Requirements => ({
  transport: tier.components.transport.included,
  guide: tier.components.guide.included,
  meals: tier.components.meals.included,
});

const quote = (tier: typeof guided, party: Party, requirements: Requirements) =>
  buildQuote({ destination: kampala, tier, party, requirements });

const COUPLE: Party = { adults: 2, children: 0 };
const SOLO: Party = { adults: 1, children: 0 };
const FAMILY: Party = { adults: 2, children: 2 };
const GROUP: Party = { adults: 6, children: 0 };

console.log(`\nPricing engine — Kampala City Heritage (guided = UGX 150,000)\n${"─".repeat(78)}`);
console.log("\nParty maths");
expect("couple, all included  (150,000 × 2)", quote(guided, COUPLE, TIER_DEFAULTS(guided)).total, 300000);
expect("solo, all included  (+25% private ride)", quote(guided, SOLO, TIER_DEFAULTS(guided)).total, 187500);
expect("family 2+2  (2 + 2×0.5 = 3 adult-equivalents)", quote(guided, FAMILY, TIER_DEFAULTS(guided)).total, 450000);
expect("group of 6  (900,000 − 10% group rate)", quote(guided, GROUP, TIER_DEFAULTS(guided)).total, 810000);

console.log("\nComponent toggles (couple, so each 1,000 of value moves 2,000)");
expect("guided, meals waived  (−15,000 × 2)", quote(guided, COUPLE, { ...ALL_ON, meals: false }).total, 270000);
expect("guided, transport waived  (−45,000 × 2)", quote(guided, COUPLE, { ...ALL_ON, transport: false }).total, 210000);
expect("guided, guide waived  (−55,000 × 2)", quote(guided, COUPLE, { ...ALL_ON, guide: false }).total, 190000);
expect("guided, all three waived  (−115,000 × 2)", quote(guided, COUPLE, { transport: false, guide: false, meals: false }).total, 70000);
expect("freelance, as sold  (85,000 × 2)", quote(freelance, COUPLE, TIER_DEFAULTS(freelance)).total, 170000);
expect("freelance + guide  (+40,000 × 2)", quote(freelance, COUPLE, { transport: true, guide: true, meals: false }).total, 250000);
expect("freelance + guide + meals  (+40,000 +15,000, ×2)", quote(freelance, COUPLE, ALL_ON).total, 280000);

console.log("\nAdd-ons");
expect(
  "per-person add-on (travel cover 15,000 × 2)",
  buildQuote({
    destination: kampala,
    tier: guided,
    party: COUPLE,
    requirements: TIER_DEFAULTS(guided),
    addOns: [{ id: "travel-cover", name: "Day travel cover", unit: "per-person", unitPrice: 15000, quantity: 1 }],
  }).total,
  330000,
);
expect(
  "per-group add-on (airport pickup 45,000 once)",
  buildQuote({
    destination: kampala,
    tier: guided,
    party: COUPLE,
    requirements: TIER_DEFAULTS(guided),
    addOns: [{ id: "airport-pickup", name: "Airport pickup", unit: "per-group", unitPrice: 45000, quantity: 1 }],
  }).total,
  345000,
);

console.log("\nDerived figures");
const coupleQuote = quote(guided, COUPLE, TIER_DEFAULTS(guided));
expect("per person on a couple", coupleQuote.perPerson, 150000);
expect("passengers", coupleQuote.passengers, 2);
expect("bodas required for 2", coupleQuote.bodas, 1);
expectEqual("VAT extracted, not added (300,000 incl. 18%)", coupleQuote.vatIncluded, Math.round(300000 - 300000 / (1 + PRICING_RULES.vatRate)));
expect("group of 6 needs 3 bodas", quote(guided, GROUP, TIER_DEFAULTS(guided)).bodas, 3);
expect("family of 4 needs 2 bodas", quote(guided, FAMILY, TIER_DEFAULTS(guided)).bodas, 2);

console.log("\nTier selection from the filter bar");
expectEqual(
  "require guide -> guided tier, not freelance + add-on",
  selectTier(kampala, { ...DEFAULT_FILTERS, requireGuide: true }, COUPLE).tier.key,
  "guided",
);
expectEqual(
  "no requirements -> cheapest tier",
  selectTier(kampala, { ...DEFAULT_FILTERS }, COUPLE).tier.key,
  "freelance",
);
expectEqual(
  "party of 6 on freelance (max 2) -> falls through to a bigger tier",
  selectTier(kampala, { ...DEFAULT_FILTERS }, GROUP).tier.key,
  "guided",
);
expectEqual(
  "capacity fall-through is reported",
  selectTier(kampala, { ...DEFAULT_FILTERS }, { adults: 2, children: 0 }).upgradedForCapacity,
  false,
);

console.log("\nFloor: no combination of toggles can produce a negative or zero total");
let worst = Number.POSITIVE_INFINITY;
for (const tier of kampala.tiers) {
  const negative = buildQuote({
    destination: kampala,
    tier,
    party: COUPLE,
    requirements: { transport: false, guide: false, meals: false },
  }).total;
  worst = Math.min(worst, negative);
}
expect("worst case across all three tiers stays positive", worst > 0 ? 1 : 0, 1);

console.log(`\n${"─".repeat(78)}`);
console.log(`${checks - failures}/${checks} assertions passed.`);
if (failures > 0) {
  console.log(`${failures} FAILED`);
  process.exitCode = 1;
}
console.log("");
