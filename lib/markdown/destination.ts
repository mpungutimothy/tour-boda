import type { Destination } from "@/types/destination";

const SITE_URL = "https://tour-boda.ug";

export function destinationToMarkdown(destination: Destination): string {
  const lines: string[] = [];

  lines.push(`# ${destination.name}`);
  lines.push("");
  lines.push(`> ${destination.category} · ${destination.location.region}`);
  lines.push("");

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
  for (const tier of destination.tiers) {
    lines.push(`### ${tier.name}`);
    lines.push("");
    lines.push(`- **Price:** UGX ${tier.price.toLocaleString("en-UG")}`);
    lines.push(`- **Duration:** ${tier.duration}`);
    lines.push(`- **Best for:** ${tier.bestFor}`);
    lines.push("- **Inclusions:**");
    for (const inc of tier.inclusions) {
      lines.push(`  - ${inc}`);
    }
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
    lines.push(`![${img.caption}](${img.url})`);
    lines.push("");
    lines.push(`*${img.caption}* — © ${img.credit}`);
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
