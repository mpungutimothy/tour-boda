"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatUGX } from "@/lib/motion";
import { MapPin, Star, ArrowRight, Filter, RotateCcw } from "lucide-react";

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
  const tiers = d.tiers;
  const allDurations = tiers.map((t) => t.duration.toLowerCase());
  if (allDurations.some((dur) => dur.includes("2 days"))) return 48;
  const maxHours = Math.max(
    ...allDurations.map((dur) => {
      const match = dur.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*hours?/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : start;
        return Math.max(start, end);
      }
      const singleMatch = dur.match(/(\d+)\s*hours?/);
      return singleMatch ? parseInt(singleMatch[1], 10) : 0;
    })
  );
  return maxHours;
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

  const hasActiveFilters = category !== "all" || priceBand !== 0 || duration !== "all";

  const clearFilters = () => {
    setCategory("all");
    setPriceBand(0);
    setDuration("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">All Tours</h1>
        <p className="mt-3 max-w-2xl font-sans text-lg text-muted-foreground">
          Three guided rides across Uganda, each led by a local boda driver who knows the road.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8 rounded-lg border border-border bg-card p-5 shadow-warm-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-serif text-sm font-semibold text-ink">Filter Tours</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Price Range</Label>
            <Select value={String(priceBand)} onValueChange={(v) => setPriceBand(parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceBands.map((band, i) => (
                  <SelectItem key={i} value={String(i)}>{band.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>{dur.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-sans text-sm text-muted-foreground">
              {filtered.length} tour{filtered.length !== 1 ? "s" : ""} match your filters
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Tour grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-warm-sm transition-shadow hover:shadow-warm-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.images[0]?.url}
                  alt={d.images[0]?.caption ?? d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <Badge variant="secondary" className="shadow-warm-sm">
                    {d.category}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-ink">{d.name}</h3>
                <div className="mt-2 flex items-center gap-4 font-sans text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {d.location.region}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="font-mono text-xs font-medium text-ink">4.8</span>
                  <span className="font-sans text-xs text-muted-foreground">· 12 reviews</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="font-mono text-sm font-semibold text-primary">
                    From {formatUGX(Math.min(...d.tiers.map((t) => t.price)))}
                  </span>
                  <span className="flex items-center gap-1 font-sans text-sm text-primary transition-all group-hover:gap-2">
                    View Tour
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-12 text-center shadow-warm-sm">
          <p className="font-serif text-lg font-semibold text-ink">No tours match those filters</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Try widening your price range or choosing a different category.
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
