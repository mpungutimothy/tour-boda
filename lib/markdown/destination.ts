import type { Destination } from "@/types/destination";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { creditLine } from "@/lib/photos";

export function destinationToMarkdown(destination: Destination): string {
  const lines: string[] = [];

  lines.push(`# ${destination.name}`);
  lines.push("");
  lines.push(`> ${destination.category} · ${destination.location.region}`);
  lines.push("");
  if (destination.pricingMode === "quotation" && destination.quoteNote) {
    lines.push(`**Pricing:** ${destination.quoteNote}`);
    lines.push("");
  }

  lines.push("## Quick Facts");
  lines.push("");
  for (const fact of destination.keyFacts) {
    lines.push(`- **${fact.label}:** ${fact.value}`);
  }
  lines.push("");

  lines.push("## The Tour");
  lines.push("");
  const paragraphs = destination.narrative.split(/(?<=\.)\s+/);
  for (const para of paragraphs) {
    lines.push(para);
    lines.push("");
  }

  lines.push("## Packages");
  lines.push("");
  lines.push(
    "Three service levels are published for this route. Prices are per person in Ugandan shillings (UGX), VAT inclusive, for a party of two.",
  );
  lines.push("");
  for (const tier of destination.tiers) {
    lines.push(`### ${tier.name}`);
    lines.push("");
    lines.push(`- **Price:** UGX ${tier.price.toLocaleString("en-UG")} per person`);
    lines.push(`- **Duration:** ${tier.duration}`);
    lines.push(`- **Capacity:** up to ${tier.maxParty} riders`);
    lines.push(
      `- **Boda transport:** ${
        tier.components.transport.included
          ? "included"
          : `not included — add for UGX ${tier.components.transport.value.toLocaleString("en-UG")} per person`
      }`,
    );
    lines.push(
      `- **Licensed guide:** ${
        tier.components.guide.included
          ? "included"
          : `not included — add for UGX ${tier.components.guide.value.toLocaleString("en-UG")} per person`
      }`,
    );
    lines.push(
      `- **Meals:** ${
        tier.components.meals.included
          ? "included"
          : `not included — add for UGX ${tier.components.meals.value.toLocaleString("en-UG")} per person`
      }`,
    );
    lines.push(`- **Best for:** ${tier.bestFor}`);
    lines.push("- **Inclusions:**");
    for (const inc of tier.inclusions) {
      lines.push(`  - ${inc}`);
    }
    lines.push("- **Not included:**");
    for (const exc of tier.excludes) {
      lines.push(`  - ${exc}`);
    }
    lines.push(
      `- **Book this level:** ${SITE_URL}/book/${destination.slug}?tier=${tier.key}`,
    );
    lines.push("");
  }

  lines.push("## Frequently Asked Questions");
  lines.push("");
  for (const faq of destination.faqs) {
    lines.push(`### ${faq.question}`);
    lines.push("");
    lines.push(faq.answer);
    lines.push("");
  }

  lines.push("## Images");
  lines.push("");
  for (const img of destination.images) {
    // Absolute, and credited from the licence table: a markdown mirror is read
    // out of page context, where a relative path and a bare caption are useless.
    lines.push(`![${img.caption}](${absoluteUrl(img.url)})`);
    lines.push("");
    lines.push(`*${img.caption}* — ${creditLine(img.url) ?? img.credit ?? ""}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(`**Guide:** ${destination.author.name}`);
  lines.push("");
  lines.push(destination.author.bio);
  lines.push("");
  lines.push(`[View this tour on Tour-Boda Uganda](${SITE_URL}/destinations/${destination.slug})`);
  lines.push("");

  return lines.join("\n");
}
