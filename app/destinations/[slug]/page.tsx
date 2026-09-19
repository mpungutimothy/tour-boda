import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { DestinationDetail } from "@/components/destinations/destination-detail";
import { TripRail } from "@/components/instrument/trip-rail";
import { generateDestinationSchema } from "@/lib/schema/destination";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const destination = destinations.find((d) => d.slug === params.slug);
  if (!destination) return {};

  const description = destination.narrative.slice(0, 160) + "...";

  return {
    title: destination.name,
    description,
    openGraph: {
      title: destination.name,
      description,
      type: "article",
      // Photography is local, so it must be made absolute for crawlers — a
      // relative /images/ path means nothing to a social card scraper.
      images: destination.images.map((img) => ({
        url: absoluteUrl(img.url),
        alt: img.caption,
      })),
    },
  };
}

/**
 * Waypoints for the Trip Rail, anchored to real sections of this page. These
 * are document positions, not geographic stops — the rail reports where the
 * reader is, and never invents stop distances.
 */
const WAYPOINTS = [
  { id: "log", label: "Road log" },
  { id: "gallery", label: "Sights" },
  { id: "packages", label: "Packages" },
  { id: "guides", label: "Guide" },
  { id: "faq", label: "Q&A" },
];

/** Pull the leading number out of a key fact such as "168 km round trip". */
function routeKm(distance: string | undefined): number {
  if (!distance) return 0;
  const match = distance.match(/[\d.,]+/);
  if (!match) return 0;
  const value = Number.parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = destinations.find((d) => d.slug === params.slug);

  if (!destination) {
    notFound();
  }

  const schema = generateDestinationSchema(destination);
  const km = routeKm(
    destination.keyFacts.find(
      (f) => f.label.toLowerCase() === "total distance",
    )?.value,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Only shown when the route publishes a real distance. */}
      {km > 0 ? <TripRail totalKm={km} waypoints={WAYPOINTS} /> : null}
      <DestinationDetail destination={destination} allDestinations={destinations} />
    </>
  );
}
