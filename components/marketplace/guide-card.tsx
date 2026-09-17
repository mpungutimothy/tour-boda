import Link from "next/link";
import type { Destination } from "@/types/destination";
import type { Guide } from "@/data/guides";
import { getDestination } from "@/data/destinations";
import { tierMeta } from "@/data/tiers";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  BadgeCheck,
  Bike,
  Clock,
  Languages,
  MapPin,
  ShieldCheck,
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
 * Where no photograph exists the card renders a monogram identity tile rather
 * than borrowing a stock face. Attaching a real stranger's likeness to an
 * invented name, licence number and rating is the kind of thing that gets a
 * tourism platform into trouble, so the design supports both states on purpose.
 */
export function GuideCard({ guide }: { guide: Guide }) {
  const routes = guide.destinationSlugs
    .map((slug) => getDestination(slug))
    .filter(
      (destination): destination is Destination => destination !== undefined,
    );

  return (
    <article className="group card-glow glass flex flex-col overflow-hidden rounded-lg">
      {/* ---- Portrait or identity tile ---- */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {guide.photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guide.photo}
              alt={`${guide.name}, Tour-Boda guide`}
              loading="lazy"
              className="grade-portrait h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-scrim to-transparent" />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-surface via-card to-background"
            />
            <div
              aria-hidden
              className="grid-plate absolute inset-0 opacity-50"
            />
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="font-display text-[5.5rem] font-bold leading-none tracking-display text-primary/20">
                {initialsOf(guide.name)}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-scrim/95 to-transparent" />
          </>
        )}

        {/* Rating plate */}
        <div className="absolute right-3 top-3 rounded-md border border-on-scrim/25 bg-scrim/75 px-2.5 py-1.5 text-right backdrop-blur-sm">
          <div className="flex items-center justify-end gap-1">
            <Star
              className="h-3 w-3 fill-primary text-primary"
              aria-hidden
            />
            <span className="font-mono text-sm font-bold leading-none text-on-scrim">
              {guide.rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-on-scrim/70">
            {guide.reviewCount} reviews
          </div>
        </div>

        {/* Licence plate — the trust signal the brief asks for. */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/50 bg-scrim/75 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-success backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Licensed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-scrim/75 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary backdrop-blur-sm">
            <BadgeCheck className="h-3 w-3" aria-hidden />
            Vetted
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="font-display text-2xl font-bold leading-none tracking-display text-on-scrim">
            {guide.name}
          </h2>
          <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim/75">
            <MapPin className="h-3 w-3" aria-hidden />
            {guide.region}
          </p>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col p-5">
        {/* Stat row */}
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-hairline bg-hairline">
          <div className="bg-card px-3 py-2.5">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
              Years
            </dt>
            <dd
              data-readout
              className="mt-1 font-mono text-sm font-semibold text-primary"
            >
              {guide.yearsExperience}
            </dd>
          </div>
          <div className="bg-card px-3 py-2.5">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
              Trips
            </dt>
            <dd
              data-readout
              className="mt-1 font-mono text-sm font-semibold text-foreground"
            >
              {formatNumber(guide.tripsLed)}
            </dd>
          </div>
          <div className="bg-card px-3 py-2.5">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
              Replies
            </dt>
            <dd
              data-readout
              className="mt-1 font-mono text-sm font-semibold text-foreground"
            >
              {guide.responseMinutes}m
            </dd>
          </div>
        </dl>

        {/* Licence detail */}
        <div className="mt-4 rounded-md border border-hairline bg-background/60 p-3">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
            Licence
          </p>
          <p className="mt-1.5 font-sans text-xs leading-snug text-foreground">
            {guide.licence.authority}
          </p>
          <p className="mt-1 font-mono text-[0.625rem] text-muted-foreground">
            {guide.licence.number}
          </p>
          <p className="mt-1.5 font-sans text-[0.6875rem] leading-snug text-muted-foreground">
            Vetted {guide.vetted.verifiedOn}. {guide.vetted.method}.
          </p>
        </div>

        <div className="mt-4">
          <span className="telemetry text-muted-foreground">
            <Languages className="mr-1 inline h-3 w-3" aria-hidden />
            Speaks
          </span>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {guide.languages.map((language) => (
              <li
                key={language}
                className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
              >
                {language}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <span className="telemetry text-muted-foreground">Specialties</span>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {guide.specialties.map((specialty) => (
              <li
                key={specialty}
                className="rounded-full border border-primary/25 bg-primary/[0.07] px-2.5 py-1 font-sans text-[0.6875rem] text-primary"
              >
                {specialty}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 border-t border-hairline pt-4 font-sans text-sm leading-relaxed text-muted-foreground">
          {guide.bio}
        </p>

        {/* ---- Fleet + clearance + routes ---- */}
        <div className="mt-4 space-y-2 font-sans text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Bike className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            {guide.vehicle}
          </p>
          <p className="flex items-start gap-2">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            Cleared to lead{" "}
            {guide.tierKeys.map((key) => tierMeta(key).shortLabel).join(", ")}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-4">
          {routes.map((destination) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="rounded-md border border-hairline px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {destination.location.district}
            </Link>
          ))}
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
