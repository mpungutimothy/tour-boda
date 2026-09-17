"use client";

import { useSearch, type PresetId } from "@/components/marketplace/search-provider";
import { cn } from "@/lib/utils";
import { Heart, Locate, Wallet } from "lucide-react";

/**
 * One-tap starting points.
 *
 * Each one writes a complete filter set, so a traveller who does not want to
 * fill in a form still sees the marketplace respond — which is also the fastest
 * way to show a pitch panel that the filters are load-bearing.
 */
const PRESETS: {
  id: PresetId;
  icon: typeof Wallet;
  question: string;
  result: string;
}[] = [
  {
    id: "saturday-50k",
    icon: Wallet,
    question: "What can I do this Saturday with UGX 50,000?",
    result: "Solo, next Saturday, under UGX 50,000",
  },
  {
    id: "near-me-20km",
    icon: Locate,
    question: "Somewhere within 20 km of me",
    result: "Kampala rides only",
  },
  {
    id: "quiet-half-day",
    icon: Heart,
    question: "A quiet half-day, no crowds",
    result: "Community and nature, for two",
  },
];

export function QuickPicks({ className }: { className?: string }) {
  const { applyPreset } = useSearch();

  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => applyPreset(preset.id)}
          className={cn(
            "group flex items-start gap-3.5 rounded-lg border border-hairline bg-card p-4 text-left",
            "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow-sm",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <preset.icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-semibold leading-snug tracking-display">
              {preset.question}
            </span>
            <span className="mt-1.5 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-primary">
              {preset.result}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
