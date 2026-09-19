import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { destinations, getDestination } from "@/data/destinations";
import { TierFromQuery } from "@/components/booking/tier-from-query";
import { BookingFlow } from "@/components/booking/booking-flow";
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

export default function BookPage({ params }: { params: { slug: string } }) {
  const destination = getDestination(params.slug);
  if (!destination) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/destinations/${destination.slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary-ink"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Back to {destination.name}
      </Link>

      <div className="mt-6 mb-9">
        <div className="mb-3 flex items-center gap-3">
          <span className="telemetry text-primary-ink">Booking</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="telemetry text-muted-foreground">
            {destination.location.district}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl">
          Book your ride
        </h1>
      </div>

      {/* The tier arrives as ?tier=. Resolving it on the client keeps this route
          static, which is what lets the whole site be exported to plain files.

          The fallback is the *whole* booking flow at the default tier rather
          than a spinner: this route is prerendered, so whatever is here is what
          lands in the HTML. A skeleton would mean the booking page had no
          content without JavaScript. Once hydrated, the client swaps in the
          flow at the tier the link asked for. */}
      <Suspense
        fallback={<BookingFlow destination={destination} initialTier="guided" />}
      >
        <TierFromQuery destination={destination} />
      </Suspense>
    </div>
  );
}
