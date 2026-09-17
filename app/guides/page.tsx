import type { Metadata } from "next";
import Link from "next/link";
import { guides, averageRating, totalTripsLed } from "@/data/guides";
import { destinations } from "@/data/destinations";
import { GuideCard } from "@/components/marketplace/guide-card";
import { Reveal } from "@/components/motion/reveal";
import { PartnerRail } from "@/components/marketplace/partners-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Riders</span>
      </div>

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
            Your guide
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            The person who actually rides with you. Every guide is licensed,
            vetted in person, and local to the road they ride.
          </p>
        </div>

        <dl className="flex shrink-0 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
          <div className="bg-card px-5 py-3">
            <dt className="telemetry text-muted-foreground">Guides</dt>
            <dd
              data-readout
              className="mt-1 font-mono text-2xl font-semibold leading-none text-primary"
            >
              {String(guides.length).padStart(2, "0")}
            </dd>
          </div>
          <div className="bg-card px-5 py-3">
            <dt className="telemetry text-muted-foreground">Districts</dt>
            <dd
              data-readout
              className="mt-1 font-mono text-2xl font-semibold leading-none text-foreground"
            >
              {String(districtCount).padStart(2, "0")}
            </dd>
          </div>
          <div className="bg-card px-5 py-3">
            <dt className="telemetry text-muted-foreground">Avg rating</dt>
            <dd
              data-readout
              className="mt-1 font-mono text-2xl font-semibold leading-none text-foreground"
            >
              {averageRating().toFixed(1)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Reveal key={guide.id} delay={index * 60} className="h-full">
            <GuideCard guide={guide} />
          </Reveal>
        ))}
      </div>

      {/* ---- How vetting works ---- */}
      <section className="mt-16 border-t border-hairline pt-12" aria-labelledby="vetting-heading">
        <div className="mb-3 flex items-center gap-3">
          <span className="telemetry text-primary">02</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="telemetry text-muted-foreground">Vetting</span>
        </div>
        <h2
          id="vetting-heading"
          className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
        >
          What &ldquo;licensed and vetted&rdquo; actually means here
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
          Four checks, and the date each one was last run is published on the
          guide&apos;s profile. If a licence lapses, the profile comes down.
        </p>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
          {VETTING_STEPS.map((step) => (
            <li key={step.index} className="bg-background p-6">
              <div className="flex items-center gap-3">
                <span className="telemetry text-primary">{step.index}</span>
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-display">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-lg border border-hairline bg-background/60 p-5">
          <p className="font-sans text-xs leading-relaxed text-muted-foreground">
            <span className="text-foreground">Prototype note.</span> The ratings,
            review counts, licence numbers and vetting dates shown above are
            sample data for an investor demonstration, not records. Three
            profiles carry stock portraits; three deliberately show a monogram
            instead, because publishing an identifiable person&apos;s face
            against an invented name and licence number would be a
            misrepresentation. Real profiles will use consented photography.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/tours">
              See which guides lead which route
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/how-it-works#partners">
              Guide associations we work with
            </Link>
          </Button>
        </div>
      </section>

      {/* ---- Association rail ---- */}
      <section className="mt-14 border-t border-hairline pt-10">
        <p className="telemetry mb-4 text-muted-foreground">
          Vetting is aligned with
        </p>
        <PartnerRail />
        <p className="mt-4 font-sans text-xs text-muted-foreground">
          {destinations.length} routes across Uganda, each staffed by a guide
          cleared for that specific service level.
        </p>
      </section>
    </div>
  );
}
