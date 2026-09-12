import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { DestinationDetail } from "@/components/destinations/destination-detail";

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
      images: destination.images.map((img) => ({ url: img.url, alt: img.caption })),
    },
  };
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = destinations.find((d) => d.slug === params.slug);

  if (!destination) {
    notFound();
  }

  return <DestinationDetail destination={destination} allDestinations={destinations} />;
}
