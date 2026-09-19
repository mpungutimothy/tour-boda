/**
 * Verify the marketplace data layer.
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/verify-marketplace.ts
 *
 * Checks the things that would embarrass us in a live demo: a negative quote, a
 * tier with no commerce config, a guide id that points at nobody, an add-on
 * that does not exist, or a narrative that fails the editorial standard.
 */
import { destinations } from "../data/destinations";
import { guides } from "../data/guides";
import { ADD_ONS } from "../data/add-ons";
import { DESTINATION_COMMERCE } from "../data/routes/commerce";
import { EXPERIENCE_TYPES } from "../data/experience-types";
import { TIER_ORDER } from "../data/tiers";
import { PHOTO_CREDITS } from "../data/photo-credits";
import { validateContent } from "../lib/content/validate";
import { findPricingViolations } from "../lib/marketplace/pricing";
import { existsSync } from "node:fs";
import { join } from "node:path";

const problems: string[] = [];
const notes: string[] = [];

function fail(message: string): void {
  problems.push(message);
}

/* --- Commerce coverage ---------------------------------------------------- */

for (const slug of Object.keys(DESTINATION_COMMERCE)) {
  if (!destinations.some((destination) => destination.slug === slug)) {
    fail(`commerce config for "${slug}" matches no destination`);
  }
}

/* --- Per-destination ------------------------------------------------------ */

const addOnIds = new Set(ADD_ONS.map((addOn) => addOn.id));
const guideIds = new Set(guides.map((guide) => guide.id));
const experienceIds = new Set(EXPERIENCE_TYPES.map((type) => type.id));

for (const destination of destinations) {
  const label = destination.slug;

  if (destination.tiers.length !== TIER_ORDER.length) {
    fail(`${label}: ${destination.tiers.length} tiers, expected ${TIER_ORDER.length}`);
  }

  destination.tiers.forEach((tier, index) => {
    if (tier.key !== TIER_ORDER[index]) {
      fail(`${label}: tier ${index} is "${tier.key}", expected "${TIER_ORDER[index]}"`);
    }
    if (tier.price <= 0) fail(`${label}/${tier.key}: price is not positive`);
    if (tier.inclusions.length === 0) fail(`${label}/${tier.key}: no inclusions listed`);
    if (tier.excludes.length === 0) fail(`${label}/${tier.key}: no exclusions listed`);
    if (tier.maxParty < 2) fail(`${label}/${tier.key}: maxParty below 2`);
  });

  const ascending = destination.tiers.every(
    (tier, index) =>
      index === 0 || tier.price > destination.tiers[index - 1].price,
  );
  if (!ascending) fail(`${label}: tiers are not ordered cheapest-first`);

  // Photography is first-party. A route image must exist on disk *and* carry a
  // licence record, because CC BY and CC BY-SA both require attribution and a
  // missing file is a broken card in front of an investor.
  if (destination.images.length < 4) {
    fail(`${label}: only ${destination.images.length} images (want 4 or more)`);
  }
  const seen = new Set<string>();
  for (const image of destination.images) {
    if (!image.url.startsWith("/images/")) {
      fail(`${label}: image "${image.url}" is not a local /images/ path`);
      continue;
    }
    if (seen.has(image.url)) fail(`${label}: duplicate image "${image.url}"`);
    seen.add(image.url);

    const file = image.url.slice("/images/".length);
    if (!existsSync(join(process.cwd(), "public", "images", file))) {
      fail(`${label}: image file missing on disk: public/images/${file}`);
    }
    if (!PHOTO_CREDITS.some((credit) => credit.file === file)) {
      fail(`${label}: no licence record for ${file} — attribution would be lost`);
    }
    if (!image.caption.trim()) fail(`${label}: image "${file}" has no caption`);
  }

  if (destination.faqs.length < 3) fail(`${label}: fewer than 3 FAQs`);

  for (const id of destination.guideIds) {
    if (!guideIds.has(id)) fail(`${label}: guideId "${id}" does not exist`);
  }
  for (const id of destination.addOnIds) {
    if (!addOnIds.has(id)) fail(`${label}: addOnId "${id}" does not exist`);
  }
  for (const type of destination.experienceTypes) {
    if (!experienceIds.has(type)) fail(`${label}: experienceType "${type}" is unknown`);
  }
  if (!destination.author.guideId) fail(`${label}: author has no guideId`);
  else if (!guideIds.has(destination.author.guideId)) {
    fail(`${label}: author guideId "${destination.author.guideId}" does not exist`);
  }

  if (destination.pricingMode === "quotation" && !destination.quoteNote) {
    fail(`${label}: quotation pricing without a quoteNote`);
  }

  // Editorial standard.
  const result = validateContent(destination.narrative, "destination");
  for (const hit of result.bannedPhrases) {
    fail(`${label}: banned phrase "${hit.phrase}" ×${hit.count}`);
  }
  for (const missing of result.missingRequiredElements) {
    fail(`${label}: narrative missing ${missing.label} (${missing.key})`);
  }
}

/* --- Guides --------------------------------------------------------------- */

const slugs = new Set(destinations.map((destination) => destination.slug));

for (const guide of guides) {
  if (guide.rating < 1 || guide.rating > 5) {
    fail(`guide ${guide.id}: rating ${guide.rating} outside 1–5`);
  }
  if (!guide.licence.number.trim()) fail(`guide ${guide.id}: no licence number`);
  if (!guide.vetted.method.trim()) fail(`guide ${guide.id}: no vetting method`);
  if (guide.languages.length === 0) fail(`guide ${guide.id}: no languages`);
  if (guide.tierKeys.length === 0) fail(`guide ${guide.id}: cleared for no tiers`);
  for (const slug of guide.destinationSlugs) {
    if (!slugs.has(slug)) fail(`guide ${guide.id}: unknown destination "${slug}"`);
  }
  // Guides with no photograph must be intentional, not a typo.
  if (!guide.photo) {
    notes.push(`guide ${guide.id} (${guide.name}) has no photo — monogram tile`);
  }

  // Every guide carries a district photograph, so no card is left image-less.
  for (const [kind, path] of [
    ["regionImage", guide.regionImage],
    ...(guide.photo ? [["photo", guide.photo] as const] : []),
  ] as const) {
    if (!path.startsWith("/images/")) {
      fail(`guide ${guide.id}: ${kind} "${path}" is not a local /images/ path`);
      continue;
    }
    const file = path.slice("/images/".length);
    if (!existsSync(join(process.cwd(), "public", "images", file))) {
      fail(`guide ${guide.id}: ${kind} missing on disk: public/images/${file}`);
    }
    if (!PHOTO_CREDITS.some((credit) => credit.file === file)) {
      fail(`guide ${guide.id}: no licence record for ${file}`);
    }
  }

  if (guide.tripsLed === 0 && guide.tierKeys.some((key) => key === "freelance")) {
    fail(`guide ${guide.id}: leads the freelance tier but has led no trips`);
  }
}

/* --- Experience tiles ----------------------------------------------------- */

for (const type of EXPERIENCE_TYPES) {
  const file = type.image.slice("/images/".length);
  if (!existsSync(join(process.cwd(), "public", "images", file))) {
    fail(`experience type ${type.id}: tile image missing on disk: ${file}`);
  }
  if (!PHOTO_CREDITS.some((credit) => credit.file === file)) {
    fail(`experience type ${type.id}: no licence record for ${file}`);
  }
  const tagged = destinations.filter((destination) =>
    destination.experienceTypes.includes(type.id),
  );
  if (tagged.length === 0) {
    notes.push(`experience type ${type.id} (${type.label}) matches no route`);
  }
}

/* --- Pricing floors ------------------------------------------------------- */

for (const violation of findPricingViolations(destinations)) {
  fail(`pricing: ${violation.slug}/${violation.tier}: ${violation.reason}`);
}

/* --- Report --------------------------------------------------------------- */

const tierCount = destinations.reduce((sum, d) => sum + d.tiers.length, 0);
const cheapest = Math.min(...destinations.flatMap((d) => d.tiers.map((t) => t.price)));
const dearest = Math.max(...destinations.flatMap((d) => d.tiers.map((t) => t.price)));

console.log("");
console.log("Marketplace verification");
console.log("─".repeat(64));
console.log(`destinations : ${destinations.length}`);
console.log(`tiers        : ${tierCount}`);
console.log(`guides       : ${guides.length}`);
console.log(`add-ons      : ${ADD_ONS.length}`);
console.log(`price range  : UGX ${cheapest.toLocaleString("en-UG")} – ${dearest.toLocaleString("en-UG")}`);

if (notes.length > 0) {
  console.log("");
  for (const note of notes) console.log(`note: ${note}`);
}

console.log("");
if (problems.length === 0) {
  console.log("PASS — no problems found.");
} else {
  console.log(`FAIL — ${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  • ${problem}`);
  process.exitCode = 1;
}
console.log("");
