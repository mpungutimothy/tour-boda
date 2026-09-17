/**
 * Generate public/llms.txt and public/llms-full.txt from the content data.
 *
 * Both outputs are descriptive only: no install commands, no package names, no
 * executable content. See "The llms.txt file" convention (llmstxt.org) for the
 * shape — a title, a blockquote summary, then H2 sections of descriptive links.
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/build-llms.ts
 */
import { writeFileSync } from "node:fs";
import { destinations } from "../data/destinations";
import { guides } from "../data/guides";
import { destinationToMarkdown } from "../lib/markdown/destination";

const SITE_URL = "https://tour-boda.ug";

/**
 * Curated one-line summaries. Kept here rather than derived from the narrative
 * so the index reads as written copy, not a truncated sentence.
 */
const SUMMARIES: Record<string, string> = {
  "kampala-city-heritage":
    "A 38 km, three-and-a-half-hour boda ride through Kampala with guide Okello Joseph, taking in the old taxi park, Kasubi Tombs, and the Bahai Temple on Kikaya Hill.",
  "jinja-nile":
    "A full-day 168 km round trip from Kampala to Jinja with guide Namugga Florence, covering the Source of the Nile, the Lugazi sugar cane estates, and Jinja's colonial industrial history.",
  "entebbe-cultural":
    "A 22 km, five-to-six-hour ride to Entebbe with guide Ssemwogerere David, covering the Botanical Gardens, the Uganda Wildlife Education Centre, and the Nakiwogo jetty on Lake Victoria.",
  "sipi-falls-mbale":
    "A five-hour walk of the three Sipi falls on the Mount Elgon foothills with guide Wamala Robert, taking in smallholder coffee terraces, a wet mill, and the 95-metre main drop.",
  "kibale-community":
    "A community-hosted walk around the crater lakes outside Fort Portal with guide Kyomuhendo Justus, including a craft cooperative, a bee-hive and tea-boundary walk, and lunch with a host family.",
  "custom-destination-tour":
    "A bespoke route built to the traveller's own itinerary by planner Mbabazi Sarah, quoted line by line within 48 hours. Indicative prices only; every booking is priced by hand.",
};

/**
 * What each destination's FAQ actually covers, written as topics. Deriving this
 * from the question strings produced an unreadable run-on list.
 */
const FAQ_TOPICS: Record<string, string> = {
  "kampala-city-heritage":
    "helmets, paying in dollars, rain delays, travelling with children, and bringing a camera to Kasubi Tombs",
  "jinja-nile":
    "boat safety at the Source of the Nile, white-water rafting, drive times, what lunch is included, and walking in Mabira Forest",
  "entebbe-cultural":
    "visiting the Wildlife Education Centre with children, swimming and bilharzia risk, what to wear in the gardens, airport pickup, and the fried fish lunch",
  "sipi-falls-mbale":
    "how hard the walk is, whether hiking boots are needed, abseiling, buying coffee at the mill, and getting to Mbale",
  "kibale-community":
    "where the money goes, whether the experience is staged, photography and drone rules, travelling with children, and staying overnight in the village",
  "custom-destination-tour":
    "how quoting works, why prices are not final, minimum lead times, running a route nobody has run before, and what happens when a plan changes on the day",
};

/** How each route's three service levels differ, in one line. */
const TIER_NOTES: Record<string, string> = {
  "kampala-city-heritage":
    "the self-guided ride, the guided ride with historical commentary, or a full day adding the Uganda Museum and Namirembe Cathedral",
  "jinja-nile":
    "transport only, transport with a licensed guide and lunch at the Sailing Club, or an overnight package with a Nile sunset cruise and a Mabira Forest walk",
  "entebbe-cultural":
    "transport and entries, a guided version with lunch and a Nile Special at the jetty, or the full afternoon with the fried fish lunch and a sunset boat ride",
  "sipi-falls-mbale":
    "the ride with digital trail notes, a licensed trail guide with a coffee-farm tasting and lunch, or two days with abseiling and a sunrise walk",
  "kibale-community":
    "the crater-lake road, a community-hosted village walk with lunch, or an overnight homestay with a market-to-kitchen cooking session",
  "custom-destination-tour":
    "rider and route notes, a licensed guide holding a multi-stop plan together, or a multi-day itinerary with permits and airport transfers arranged",
};

function humanPrice(price: number): string {
  return `UGX ${price.toLocaleString("en-UG")}`;
}

/* -------------------------------------------------------------------------- */
/*  llms.txt                                                                   */
/* -------------------------------------------------------------------------- */

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Tour-Boda Uganda");
  lines.push("");
  lines.push(
    "> Tour-Boda Uganda is a travel marketplace for boda-boda (motorcycle taxi) tours. It pairs travellers with licensed local riders and guides for heritage, city, nature and community experiences in Kampala, Jinja, Entebbe, Mbale and Fort Portal, plus bespoke routes quoted on request. Every published route sells at three service levels: a self-guided Boda Freelance ride, a Guided Tour with a licensed guide, and a full Experience Tour package. Prices are quoted in Ugandan shillings (UGX), VAT inclusive, and the platform adds no booking fee to the traveller.",
  );
  lines.push("");
  lines.push(
    "This file is a descriptive index of published content for AI assistants and search crawlers. Every link below points to a canonical page on this site. Markdown mirrors of the destination pages are listed where they exist.",
  );
  lines.push("");

  // --- Destinations ---
  lines.push("## Destinations");
  lines.push("");
  lines.push(
    "Canonical route pages. Each carries a full narrative, key facts, three service levels with prices, and a set of frequently asked questions.",
  );
  lines.push("");
  for (const destination of destinations) {
    const priceRange = destination.tiers.map((tier) => tier.price);
    const summary = SUMMARIES[destination.slug] ?? destination.category;
    const tiers = TIER_NOTES[destination.slug];
    lines.push(
      `- [${destination.name}](${SITE_URL}/destinations/${destination.slug}): ${summary} Packages from ${humanPrice(Math.min(...priceRange))} to ${humanPrice(Math.max(...priceRange))} per person.`,
    );
    if (tiers) {
      lines.push(`  - Service levels: ${tiers}.`);
    }
    if (destination.pricingMode === "quotation") {
      lines.push(
        `  - Pricing is by quotation. The published figures are indicative starting points, not firm offers.`,
      );
    }
    lines.push(`  - Markdown mirror: ${SITE_URL}/md/${destination.slug}`);
    lines.push(
      `  - Book: ${SITE_URL}/book/${destination.slug}?tier=guided`,
    );
  }
  lines.push("");

  // --- About ---
  lines.push("## About");
  lines.push("");
  lines.push(
    "Background on the company, how the tours are structured, and how to get in touch.",
  );
  lines.push("");
  lines.push(
    `- [About Tour-Boda Uganda](${SITE_URL}/about): Who runs the tours, how the boda-boda guide model works, and what the company is trying to do differently.`,
  );
  lines.push(
    `- [Tours overview](${SITE_URL}/tours): The full list of published tours with starting prices, grouped by region and theme.`,
  );
  lines.push(
    `- [Guides](${SITE_URL}/guides): Profiles of all ${guides.length} guides, including the languages they speak, their years on the road, the authority that issued their licence, and the service levels they are cleared to lead.`,
  );
  lines.push(
    `- [How the platform works](${SITE_URL}/how-it-works): How a booking is priced, how the revenue is split between the boda operator, the destination and the platform, and the institutional partnerships behind it.`,
  );
  lines.push(
    `- [Contact](${SITE_URL}/contact): How to reach the team to ask a question or arrange a booking.`,
  );
  lines.push("");

  // --- FAQ ---
  lines.push("## FAQ");
  lines.push("");
  lines.push(
    "There is no single FAQ page. Questions are answered at the bottom of each destination page, where the answers are specific to that tour.",
  );
  lines.push("");
  for (const destination of destinations) {
    const topics = FAQ_TOPICS[destination.slug];
    lines.push(
      `- [${destination.name} — questions](${SITE_URL}/destinations/${destination.slug}): ${destination.faqs.length} answers on ${topics}.`,
    );
    lines.push(`  - Markdown mirror: ${SITE_URL}/md/${destination.slug}`);
  }
  lines.push("");

  // --- Blog ---
  lines.push("## Blog");
  lines.push("");
  lines.push(
    "No blog, news feed, or article archive is published on this site yet, so there are no post URLs to list here. Rather than invent links, this section is intentionally empty and will be filled in when articles exist. The guide profiles are the closest thing to long-form editorial content at present.",
  );
  lines.push("");
  lines.push(`- [Guide profiles](${SITE_URL}/guides): Short written profiles of all ${guides.length} guides, including background, languages, licence authority and specialties.`);
  lines.push("");

  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/*  llms-full.txt                                                              */
/* -------------------------------------------------------------------------- */

function buildLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push("# Tour-Boda Uganda — Full Content");
  lines.push("");
  lines.push(
    "> The complete text of every published route narrative, key facts, all three service levels with prices, and frequently asked questions from Tour-Boda Uganda, a boda-boda tour marketplace working in Kampala, Jinja, Entebbe, Mbale and Fort Portal.",
  );
  lines.push("");
  lines.push(
    `This file expands on ${SITE_URL}/llms.txt by including the full destination copy rather than one-line summaries. Content is reproduced from the canonical pages listed at the top of each section.`,
  );
  lines.push("");

  lines.push("## Contents");
  lines.push("");
  for (const destination of destinations) {
    lines.push(
      `- ${destination.name} — ${SITE_URL}/destinations/${destination.slug}`,
    );
  }
  lines.push(`- Guides — ${SITE_URL}/guides`);
  lines.push("");

  for (const destination of destinations) {
    lines.push("---");
    lines.push("");
    lines.push(`Source: ${SITE_URL}/destinations/${destination.slug}`);
    lines.push("");
    lines.push(destinationToMarkdown(destination));
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(`Source: ${SITE_URL}/guides`);
  lines.push("");
  lines.push("# Guides");
  lines.push("");
  lines.push(
    "Every Tour-Boda guide holds a licence from a named authority and is vetted in person before being listed.",
  );
  lines.push("");
  for (const guide of guides) {
    lines.push(`## ${guide.name}`);
    lines.push("");
    lines.push(
      `- **Region:** ${guide.region}`,
      `- **Languages:** ${guide.languages.join(", ")}`,
      `- **Experience:** ${guide.yearsExperience} years`,
      `- **Licence:** ${guide.licence.authority}, ${guide.licence.number}`,
      `- **Cleared to lead:** ${guide.tierKeys.join(", ")}`,
      `- **Vehicle:** ${guide.vehicle}`,
      `- **Specialties:** ${guide.specialties.join("; ")}`,
    );
    lines.push("");
    lines.push(guide.bio);
    lines.push("");
  }

  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */

const llms = buildLlmsTxt();
const llmsFull = buildLlmsFullTxt();

writeFileSync("public/llms.txt", llms, "utf8");
writeFileSync("public/llms-full.txt", llmsFull, "utf8");

console.log(`public/llms.txt      ${llms.length} chars, ${llms.split("\n").length} lines`);
console.log(`public/llms-full.txt ${llmsFull.length} chars, ${llmsFull.split("\n").length} lines`);
