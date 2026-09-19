import Link from "next/link";
import type { Destination } from "@/types/destination";
import type { Guide } from "@/data/guides";
import { getDestination } from "@/data/destinations";
import { tierMeta } from "@/data/tiers";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { altFor, asset, creditForPath } from "@/lib/photos";
import { CardImage } from "@/components/visual/card-image";
import {
  BadgeCheck,
  Bike,
  Clock,
  Languages,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * A guide profile.
 *
 * Led by a photograph of the guide's district, with the identity mark sitting
 * over the corner behind a green verification ring. That ordering is
 * deliberate: a profile with no consented portrait still reads as a finished
 * card rather than a missing one, and the visual weight stays on real,
 * checkable scenery instead of on a face we would be attaching to an invented
 * name, licence number and rating.
 *
 * Green is used here and nowhere else on a card. On this site green means
 * "verified", so spending it on decoration elsewhere would dilute the one
 * signal a traveller is scanning for.
 */
export function GuideCard({ guide }: { guide: Guide }) {
  const routes = guide.destinationSlugs
    .map((slug) => getDestination(slug))
    .filter(
      (destination): destination is Destination => destination !== undefined,
    );

  const regionCredit = creditForPath(guide.regionImage);
  const firstName = guide.name.split(/\s+/).slice(-1)[0];

  return (
    <article className="card-lift card-lift-guide group flex h-full flex-col overflow-hidden rounded-b-lg border border-hairline bg-card">
      {/* ---- District photograph ---- */}
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CardImage
            src={guide.regionImage}
            alt={altFor(guide.regionImage, `Scenery around ${guide.region}`)}
            className="group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-scrim/[0.85] via-scrim/[0.15] to-scrim/40"
          />

          {/* Verified badge — the green signal the brief asks for. */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-success-foreground">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            Verified
          </span>

          {/* Rating + trip count */}
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-scrim/75 px-2.5 py-1 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
            <span className="font-sans text-[0.8125rem] font-bold leading-none text-on-scrim">
              {guide.rating.toFixed(1)}
            </span>
            <span className="font-sans text-[0.6875rem] leading-none text-on-scrim/75">
              · {formatNumber(guide.tripsLed)} trips
            </span>
          </span>

          {/* Photograph provenance, bottom right */}
          <span className="absolute bottom-2 right-3 font-sans text-[0.5625rem] uppercase tracking-[0.12em] text-on-scrim/60">
            {regionCredit?.artist ?? "Wikimedia Commons"}
          </span>
        </div>

        {/* ---- Identity mark, behind a green verification ring ---- */}
        <div className="absolute -bottom-8 left-5 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full bg-card ring-2 ring-success ring-offset-2 ring-offset-card">
          {guide.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={asset(guide.photo)}
              alt={`${guide.name}, Tour-Boda guide`}
              loading="lazy"
              className="grade-portrait h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-full w-full items-center justify-center bg-field font-display text-2xl font-semibold tracking-display text-primary-ink"
            >
              {initialsOf(guide.name)}
            </span>
          )}
        </div>
      </div>

      {/* ---- Name block ---- */}
      <div className="px-5 pb-1 pt-11">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-display">
          {guide.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 font-sans text-[0.75rem] font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {guide.region}
        </p>
        {!guide.photo ? (
          <p className="mt-2 font-sans text-[0.6875rem] leading-snug text-muted-foreground">
            Awaiting a consented portrait. The photograph above is the
            guide&apos;s own district.
          </p>
        ) : null}
      </div>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        {/* Stat row */}
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-hairline bg-hairline">
          {[
            { label: "Years", value: String(guide.yearsExperience) },
            { label: "Trips", value: formatNumber(guide.tripsLed) },
            { label: "Reviews", value: formatNumber(guide.reviewCount) },
          ].map((stat) => (
            <div key={stat.label} className="bg-card px-3 py-2.5">
              <dt className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </dt>
              <dd
                data-readout
                className="mt-1 font-mono text-sm font-semibold text-foreground"
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Licence — the checkable trust detail */}
        <div className="mt-4 rounded-md border border-hairline bg-field/60 p-3">
          <p className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Licence
          </p>
          <p className="mt-1.5 font-sans text-xs leading-snug text-foreground">
            {guide.licence.authority}
          </p>
          <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
            {guide.licence.number}
          </p>
          <p className="mt-1.5 font-sans text-[0.6875rem] leading-snug text-muted-foreground">
            Vetted {guide.vetted.verifiedOn}. {guide.vetted.method}.
          </p>
        </div>

        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Languages className="h-3.5 w-3.5" aria-hidden />
            Speaks
          </span>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {guide.languages.map((language) => (
              <li
                key={language}
                className="rounded-full border border-hairline px-2.5 py-1 font-sans text-[0.6875rem] text-muted-foreground"
              >
                {language}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Specialties
          </span>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {guide.specialties.map((specialty) => (
              <li
                key={specialty}
                className="rounded-full border border-primary/30 bg-primary/[0.07] px-2.5 py-1 font-sans text-[0.6875rem] text-primary-ink"
              >
                {specialty}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 border-t border-hairline pt-4 font-sans text-sm leading-relaxed text-muted-foreground">
          {guide.bio}
        </p>

        <div className="mt-4 space-y-2 font-sans text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Bike
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-ink"
              aria-hidden
            />
            {guide.vehicle}
          </p>
          <p className="flex items-start gap-2">
            <Clock
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-ink"
              aria-hidden
            />
            Cleared to lead{" "}
            {guide.tierKeys.map((key) => tierMeta(key).shortLabel).join(", ")}
          </p>
        </div>

        {/* ---- Route chips ---- */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-4">
          {routes.map((destination) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="rounded-md border border-hairline px-2.5 py-1.5 font-sans text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-ink"
            >
              {destination.location.district}
            </Link>
          ))}
        </div>

        {/* ---- Message CTA ---- */}
        <div className="mt-auto pt-5">
          <Link
            href="/contact"
            title="Opens the enquiry form — not wired to a mailbox in this prototype"
            className="sheen inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-sans text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Message {firstName}
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Star row used in dense contexts such as the booking step. */
export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          aria-hidden
          className={cn(
            "h-3 w-3",
            step <= rounded ? "fill-primary text-primary" : "text-hairline",
          )}
        />
      ))}
    </span>
  );
}
