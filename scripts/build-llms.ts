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
    "> Tour-Boda Uganda is a tour operator in Uganda. It pairs travellers with licensed local boda-boda (motorcycle taxi) guides for heritage, city, and nature tours in Kampala, Jinja, and Entebbe. Every tour is led by a named guide who lives on the roads they ride. Prices are quoted in Ugandan shillings (UGX).",
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
    "Canonical tour pages. Each carries a full narrative, key facts, tier pricing, and a set of frequently asked questions.",
  );
  lines.push("");
  for (const destination of destinations) {
    const priceRange = destination.tiers.map((tier) => tier.price);
    const summary = SUMMARIES[destination.slug] ?? destination.category;
    lines.push(
      `- [${destination.name}](${SITE_URL}/destinations/${destination.slug}): ${summary} Packages from ${humanPrice(Math.min(...priceRange))} to ${humanPrice(Math.max(...priceRange))}.`,
    );
    lines.push(`  - Markdown mirror: ${SITE_URL}/md/${destination.slug}`);
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
    `- [Guides](${SITE_URL}/guides): Profiles of the individual guides, including the languages they speak, their years on the road, and their specialties.`,
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
  lines.push(`- [Guide profiles](${SITE_URL}/guides): Short written profiles of the three guides, including background, languages, and specialties.`);
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
    "> The complete text of every published tour narrative, key facts, pricing tiers, and frequently asked questions from Tour-Boda Uganda, a boda-boda tour operator working in Kampala, Jinja, and Entebbe.",
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
    "Every Tour-Boda guide is licensed and travels the roads they grew up on.",
  );
  lines.push("");
  for (const guide of guides) {
    lines.push(`## ${guide.name}`);
    lines.push("");
    lines.push(
      `- **Region:** ${guide.region}`,
      `- **Languages:** ${guide.languages.join(", ")}`,
      `- **Experience:** ${guide.yearsExperience} years`,
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
