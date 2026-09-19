"use client";

import { destinations } from "@/data/destinations";
import { EXPERIENCE_TYPES } from "@/data/experience-types";
import { useSearch } from "@/components/marketplace/search-provider";
import { altFor, asset } from "@/lib/photos";
import { Check } from "lucide-react";

/** How many routes are tagged with each experience type. */
const COUNTS = new Map(
  EXPERIENCE_TYPES.map((type) => [
    type.id,
    destinations.filter((destination) =>
      destination.experienceTypes.includes(type.id),
    ).length,
  ]),
);

/**
 * Browse by experience.
 *
 * Eight photographs, one per experience type, which do the job a list of
 * checkboxes cannot: show a traveller what "community & village" or "lake &
 * river" actually looks like before they commit to filtering for it.
 *
 * The tiles are real controls, not decoration. Selecting one sets the same
 * filter the search bar exposes and moves the traveller to the results, so the
 * taxonomy is a shortcut into the catalogue rather than a dead end.
 */
export function ExperienceGrid({ className }: { className?: string }) {
  const { filters, update } = useSearch();
  const selected = filters.experienceTypes;

  function choose(id: (typeof EXPERIENCE_TYPES)[number]["id"]) {
    const alreadyOnly =
      selected.length === 1 && selected[0] === id;
    update({ experienceTypes: alreadyOnly ? [] : [id] });
    document
      .getElementById("results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <ul
      className={
        className ??
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
      }
    >
      {EXPERIENCE_TYPES.map((type) => {
        const isActive = selected.includes(type.id);
        const count = COUNTS.get(type.id) ?? 0;

        return (
          <li key={type.id}>
            <button
              type="button"
              onClick={() => choose(type.id)}
              aria-pressed={isActive}
              className={[
                "group relative block w-full overflow-hidden rounded-lg border text-left",
                "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-primary shadow-glow-sm"
                  : "border-hairline hover:border-primary/50",
              ].join(" ")}
            >
              <span className="relative block aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(type.image)}
                  alt={altFor(type.image, type.label)}
                  loading="lazy"
                  className="duotone h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/[0.35] to-transparent"
                />

                {isActive ? (
                  <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                ) : null}

                <span className="absolute inset-x-3 bottom-2.5">
                  <span className="block font-display text-sm font-semibold leading-tight tracking-display text-on-scrim sm:text-base">
                    {type.label}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-on-scrim/70">
                    <span data-readout>{count}</span>
                    {count === 1 ? "route" : "routes"}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
