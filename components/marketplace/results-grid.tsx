"use client";

import type { SortKey } from "@/types/marketplace";
import { destinations } from "@/data/destinations";
import { useSearch } from "@/components/marketplace/search-provider";
import { DestinationCard } from "@/components/marketplace/destination-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RotateCcw, SearchX } from "lucide-react";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "duration-asc", label: "Shortest first" },
];

export function SortControl({ className }: { className?: string }) {
  const { sort, setSort } = useSearch();
  const current = SORTS.find((option) => option.value === sort) ?? SORTS[0];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label
        htmlFor="sort-routes"
        className="telemetry whitespace-nowrap text-muted-foreground"
      >
        Sort
      </Label>
      <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
        <SelectTrigger id="sort-routes" className="h-8 w-[11rem] text-xs">
          {/* Passed as a child rather than relying on the placeholder: Radix
              cannot resolve the selected item's text on the server, which
              renders the closed trigger completely blank. */}
          <SelectValue>{current.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORTS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Live results.
 *
 * Reads the derived outcome from the search context, so the count here and the
 * count in the filter bar are always the same number from the same computation.
 */
export function ResultsGrid({
  columns = 3,
  showSort = true,
  className,
}: {
  columns?: 2 | 3;
  showSort?: boolean;
  className?: string;
}) {
  const { outcome, activeCount, reset } = useSearch();
  const { matches, excluded } = outcome;

  // Group the reasons so the empty state can explain itself rather than
  // leaving the traveller guessing which control to loosen.
  const reasons = excluded.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className={className}>
      {showSort ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span data-readout className="text-base font-semibold text-primary">
              {String(matches.length).padStart(2, "0")}
            </span>{" "}
            of {String(destinations.length).padStart(2, "0")} routes
            {activeCount > 0 ? " match your filters" : " available"}
          </p>
          <SortControl />
        </div>
      ) : null}

      {matches.length > 0 ? (
        <div
          className={cn(
            "grid gap-6",
            columns === 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {matches.map((match, index) => (
            <DestinationCard
              key={`${match.destination.slug}-${match.tier.key}`}
              match={match}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="plate rounded-lg p-10 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-hairline">
            <SearchX className="h-5 w-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-5 font-display text-xl font-semibold tracking-display">
            Nothing matches every filter
          </p>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            {Object.keys(reasons).length > 0 ? (
              <>
                {Object.entries(reasons)
                  .map(([reason, count]) => `${count} route${count === 1 ? "" : "s"} excluded — ${reason}`)
                  .join(". ")}
                .
              </>
            ) : (
              "Try widening the budget or clearing a requirement."
            )}
          </p>
          <Button variant="outline" className="mt-6" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
