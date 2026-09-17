import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { destinations, getDestination } from "@/data/destinations";
import { TIER_ORDER } from "@/data/tiers";
import { BookingFlow } from "@/components/booking/booking-flow";
import type { TierKey } from "@/types/destination";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const destination = getDestination(params.slug);
  if (!destination) return {};
  return {
    title: `Book ${destination.name}`,
    description: `Choose a service level, date and party size for ${destination.name}, and see the full price before you pay.`,
  };
}

export default function BookPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { tier?: string };
}) {
  const destination = getDestination(params.slug);
  if (!destination) notFound();

  // The tier arrives from the card or the detail page. Validate it rather than
  // trusting the query string, so a hand-edited URL cannot select a tier that
  // does not exist and crash the quote.
  const requested = searchParams?.tier;
  const initialTier: TierKey =
    requested && (TIER_ORDER as string[]).includes(requested)
      ? (requested as TierKey)
      : "guided";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/destinations/${destination.slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Back to {destination.name}
      </Link>

      <div className="mt-6 mb-9">
        <div className="mb-3 flex items-center gap-3">
          <span className="telemetry text-primary">Booking</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="telemetry text-muted-foreground">
            {destination.location.district}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl">
          Book your ride
        </h1>
      </div>

      <BookingFlow destination={destination} initialTier={initialTier} />
    </div>
  );
}
