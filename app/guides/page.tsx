import type { Metadata } from "next";
import Link from "next/link";
import { guides, averageRating, totalTripsLed } from "@/data/guides";
import { destinations } from "@/data/destinations";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { GuideCard } from "@/components/marketplace/guide-card";
import { PhotoBand } from "@/components/visual/photo-band";
import { PartnerRail } from "@/components/marketplace/partners-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Meet the local boda-boda guides who lead Tour-Boda Uganda rides. Each one is licensed, vetted in person, and cleared for specific service levels.",
};

const VETTING_STEPS = [
  {
    index: "01",
    title: "Licence check at source",
    body: "We verify the rider's permit against the issuing authority record — Kampala Capital City Authority, the district local government, or the Uganda Tourism Board for planners. The number on this page is the number we checked.",
  },
  {
    index: "02",
    title: "In-person interview",
    body: "Every guide is met face to face before they are listed. We ask about the roads, the stops and what they would refuse to do. Anybody who promises a perfect trip every time does not get listed.",
  },
  {
    index: "03",
    title: "Route ride-along",
    body: "We ride the route with them once, as a passenger, before it goes live. That is where we find out whether the timings hold and whether the honest note on the route page is actually honest.",
  },
  {
    index: "04",
    title: "Re-verification",
    body: "Licences expire, and so does a vetting. Guides are re-checked at least annually, and immediately if a licence lapses. The date on each profile is the last time we confirmed it.",
  },
];

export default function GuidesPage() {
  const districtCount = new Set(guides.map((guide) => guide.district)).size;
  const rating = averageRating();
  const trips = totalTripsLed();

  return (
    <div>
      <PageHeader
        eyebrow="The riders"
        title="Your guide"
        lead="The person who actually rides with you. Every guide is licensed by a district or city authority, vetted in person, and local to the road they ride."
        aside={
          <dl className="flex gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            <div className="bg-card px-5 py-3.5">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Guides
              </dt>
              <dd
                data-readout
                className="mt-1.5 font-display text-2xl font-semibold leading-none text-foreground"
              >
                {String(guides.length).padStart(2, "0")}
              </dd>
            </div>
            <div className="bg-card px-5 py-3.5">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Districts
              </dt>
              <dd
                data-readout
                className="mt-1.5 font-display text-2xl font-semibold leading-none text-foreground"
              >
                {String(districtCount).padStart(2, "0")}
              </dd>
            </div>
            <div className="bg-card px-5 py-3.5">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Avg rating
              </dt>
              <dd
                data-readout
                className="mt-1.5 font-display text-2xl font-semibold leading-none text-primary-ink"
              >
                {rating.toFixed(1)}
              </dd>
            </div>
          </dl>
        }
      />

      {/* ---- The guides ---- */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className="font-display text-2xl font-semibold tracking-display">
            {guides.length} guides, {districtCount} districts
          </h2>
          <p className="font-sans text-sm text-muted-foreground">
            <span className="numeric-emphasis">{rating.toFixed(1)}</span> average
            rating across{" "}
            <span className="numeric-emphasis">
              {trips.toLocaleString("en-UG")}
            </span>{" "}
            completed trips
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>

      {/* ---- How vetting works, on cream ---- */}
      <section
        className="band-cream border-y border-hairline"
        aria-labelledby="vetting-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            id="vetting-heading"
            eyebrow="Vetting"
            title="What “licensed and vetted” actually means here"
            lead="Four checks, and the date each one was last run is published on the guide's profile. If a licence lapses, the profile comes down."
          />

          <ol className="grid gap-6 sm:grid-cols-2">
            {VETTING_STEPS.map((step) => (
              <li
                key={step.index}
                className="rounded-lg border border-hairline bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />
                  </span>
                  <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step {step.index}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-display">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-lg border border-hairline bg-card p-5">
            <p className="font-sans text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Prototype note.
              </span>{" "}
              The ratings, review counts, licence numbers and vetting dates shown
              above are sample data for an investor demonstration, not records.
              Each card is led by a photograph of the guide&apos;s own district.
              Three profiles carry a stock portrait in the identity badge; three
              deliberately show a monogram instead, because publishing an
              identifiable person&apos;s face against an invented name and
              licence number would be a misrepresentation. Real profiles will use
              consented photography.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tours">
                See which guides lead which route
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/how-it-works#partners">
                Guide associations we work with
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Association rail ---- */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Vetting is aligned with
        </p>
        <PartnerRail />
        <p className="mt-4 font-sans text-xs text-muted-foreground">
          {destinations.length} routes across Uganda, each staffed by a guide
          cleared for that specific service level.
        </p>
      </div>

      <PhotoBand
        image="/images/dest-custom-3.jpg"
        alt="A boda-boda rider on a road between towns in Uganda"
        eyebrow="The person, not the platform"
        title="You are booking a rider, not a seat"
        body="The guide is the product. Everything else — the booking flow, the price breakdown, the revenue split — exists to make hiring that one person straightforward and fair."
        height="short"
      />
    </div>
  );
}
