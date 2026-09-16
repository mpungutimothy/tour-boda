"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatUGX } from "@/lib/motion";
import { MapPin, ArrowRight, RotateCcw } from "lucide-react";

const categories = Array.from(new Set(destinations.map((d) => d.category))).sort();

const priceBands = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under UGX 100k", min: 0, max: 100000 },
  { label: "UGX 100k – 250k", min: 100000, max: 250000 },
  { label: "Over UGX 250k", min: 250000, max: Infinity },
];

const durations = [
  { label: "Any duration", value: "all" },
  { label: "Half day (under 8h)", value: "half" },
  { label: "Full day (8–14h)", value: "full" },
  { label: "Overnight (2 days)", value: "overnight" },
];

function getMinPrice(d: (typeof destinations)[number]) {
  return Math.min(...d.tiers.map((t) => t.price));
}

function getDurationHours(d: (typeof destinations)[number]) {
  const allDurations = d.tiers.map((t) => t.duration.toLowerCase());
  if (allDurations.some((dur) => dur.includes("2 days"))) return 48;
  return Math.max(
    ...allDurations.map((dur) => {
      const range = dur.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*hours?/);
      if (range) {
        const start = parseInt(range[1], 10);
        const end = range[2] ? parseInt(range[2], 10) : start;
        return Math.max(start, end);
      }
      const single = dur.match(/(\d+)\s*hours?/);
      return single ? parseInt(single[1], 10) : 0;
    }),
  );
}

function factOf(d: (typeof destinations)[number], label: string) {
  return d.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;
}

export default function ToursPage() {
  const [category, setCategory] = useState<string>("all");
  const [priceBand, setPriceBand] = useState<number>(0);
  const [duration, setDuration] = useState<string>("all");

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      const min = getMinPrice(d);
      const band = priceBands[priceBand];
      if (min < band.min || min > band.max) return false;
      if (duration !== "all") {
        const hours = getDurationHours(d);
        if (duration === "half" && hours >= 8) return false;
        if (duration === "full" && (hours < 8 || hours >= 48)) return false;
        if (duration === "overnight" && hours < 48) return false;
      }
      return true;
    });
  }, [category, priceBand, duration]);

  const hasActiveFilters =
    category !== "all" || priceBand !== 0 || duration !== "all";

  const clearFilters = () => {
    setCategory("all");
    setPriceBand(0);
    setDuration("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-data">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Route index</span>
      </div>

      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-[0.01em] sm:text-5xl">
            All routes
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            Guided rides across Uganda, each led by a local boda driver who knows
            the road.
          </p>
        </div>

        {/* Live result count — the instrument readout for this page. */}
        <div className="shrink-0 rounded-lg border border-hairline px-5 py-3">
          <div className="telemetry text-muted-foreground">Showing</div>
          <div
            data-readout
            className="mt-1 font-mono text-2xl font-semibold leading-none text-data"
          >
            {String(filtered.length).padStart(2, "0")}
            <span className="ml-1 text-xs text-muted-foreground">
              / {String(destinations.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter panel — an instrument control plate, not a soft card. */}
      <div className="mb-10 rounded-lg border border-hairline bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
          <span className="telemetry text-muted-foreground">Filter routes</span>
          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 font-mono text-[0.625rem] uppercase tracking-[0.14em]"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Reset
            </Button>
          ) : null}
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="filter-category"
              className="telemetry text-muted-foreground"
            >
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-price" className="telemetry text-muted-foreground">
              Price range
            </Label>
            <Select
              value={String(priceBand)}
              onValueChange={(v) => setPriceBand(parseInt(v, 10))}
            >
              <SelectTrigger id="filter-price">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceBands.map((band, i) => (
                  <SelectItem key={band.label} value={String(i)}>
                    {band.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="filter-duration"
              className="telemetry text-muted-foreground"
            >
              Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="filter-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-card transition-colors hover:border-data/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.images[0]?.url}
                  alt={d.images[0]?.caption ?? d.name}
                  loading={i < 3 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-scrim/90 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-on-scrim/30 bg-scrim/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim backdrop-blur-sm">
                  {d.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-xl font-semibold uppercase leading-tight tracking-[0.01em]">
                  {d.name}
                </h2>

                <p className="mt-2 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {d.location.region}
                </p>

                {/* Real route figures, in place of the invented rating. */}
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-4">
                  <div>
                    <dt className="telemetry text-muted-foreground">Distance</dt>
                    <dd data-readout className="mt-1 font-mono text-sm text-data">
                      {factOf(d, "Total distance") ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="telemetry text-muted-foreground">Duration</dt>
                    <dd data-readout className="mt-1 font-mono text-sm">
                      {factOf(d, "Duration") ?? "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4">
                  <span data-readout className="font-mono text-sm font-semibold text-primary">
                    From {formatUGX(getMinPrice(d))}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-all group-hover:gap-1.5 group-hover:text-data">
                    Open
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-hairline bg-card p-12 text-center">
          <span className="telemetry text-muted-foreground">No results</span>
          <p className="mt-3 font-display text-xl font-semibold uppercase tracking-[0.02em]">
            Nothing matches those filters
          </p>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            Try widening the price range, or clearing the category and duration.
          </p>
          <Button variant="outline" className="mt-6" onClick={clearFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
