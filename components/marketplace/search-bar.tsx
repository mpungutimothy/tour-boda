"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSearch } from "@/components/marketplace/search-provider";
import { EXPERIENCE_TYPES } from "@/data/experience-types";
import { GROUP_TYPES } from "@/data/group-types";
import { districts } from "@/data/destinations";
import { BUDGET_BOUNDS } from "@/types/marketplace";
import { formatUGX } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Bike,
  CalendarDays,
  Clock,
  MapPin,
  RotateCcw,
  Search,
  Users,
  UtensilsCrossed,
  Wallet,
  BadgeCheck,
} from "lucide-react";

/**
 * The marketplace filter bar.
 *
 * Every control writes straight into the search context, and the results grid
 * below re-derives from the same state — which is why dragging the budget
 * slider changes the grid while your finger is still on it.
 */
export function SearchBar({
  showRequirements = true,
  className,
}: {
  showRequirements?: boolean;
  className?: string;
}) {
  const {
    filters,
    update,
    toggleExperienceType,
    reset,
    activeCount,
    outcome,
  } = useSearch();

  const locationListId = useId();
  const dateId = useId();
  const timeId = useId();
  const budgetId = useId();

  const budgetLabel =
    filters.maxBudget >= BUDGET_BOUNDS.max
      ? "Any budget"
      : `Up to ${formatUGX(filters.maxBudget)}`;

  return (
    <form
      className={cn("plate overflow-hidden rounded-lg", className)}
      onSubmit={(event) => event.preventDefault()}
      aria-label="Search tours"
    >
      {/* ---- Plate header: identity + live count + reset ---- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span className="telemetry text-muted-foreground">Find a ride</span>
          {activeCount > 0 ? (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
              {activeCount} active
            </span>
          ) : null}
        </span>

        <span className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span
              data-readout
              className="text-base font-semibold text-primary"
              aria-live="polite"
            >
              {String(outcome.matches.length).padStart(2, "0")}
            </span>{" "}
            routes
          </span>
          {activeCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              className="h-7 font-mono text-[0.625rem] uppercase tracking-[0.14em]"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" aria-hidden />
              Reset
            </Button>
          ) : null}
        </span>
      </div>

      <div className="grid gap-5 p-4 sm:p-5">
        {/* ---- Where, when, who ---- */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1.3fr]">
          <div className="space-y-2">
            <Label htmlFor="search-location" className="telemetry text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" aria-hidden />
              Where I am
            </Label>
            <Input
              id="search-location"
              list={locationListId}
              value={filters.location}
              onChange={(event) => update({ location: event.target.value })}
              placeholder="District or town — try Mbale"
              autoComplete="off"
            />
            <datalist id={locationListId}>
              {districts.map((district) => (
                <option key={district} value={district} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor={dateId} className="telemetry text-muted-foreground">
              <CalendarDays className="mr-1 inline h-3 w-3" aria-hidden />
              When
            </Label>
            <div className="flex gap-2">
              <Input
                id={dateId}
                type="date"
                value={filters.date}
                onChange={(event) => update({ date: event.target.value })}
                className="min-w-0"
              />
              <div className="relative w-[7.5rem] shrink-0">
                <Clock
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id={timeId}
                  type="time"
                  aria-label="Preferred start time"
                  value={filters.time}
                  onChange={(event) => update({ time: event.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="telemetry text-muted-foreground">
              <Users className="mr-1 inline h-3 w-3" aria-hidden />
              Who is riding
            </legend>
            <div className="flex flex-wrap gap-1.5" role="group">
              <GroupChip
                active={filters.groupType === ""}
                onClick={() => update({ groupType: "" })}
                label="Anyone"
              />
              {GROUP_TYPES.map((group) => (
                <GroupChip
                  key={group.id}
                  active={filters.groupType === group.id}
                  onClick={() =>
                    update({
                      groupType: filters.groupType === group.id ? "" : group.id,
                    })
                  }
                  label={group.label}
                  title={group.hint}
                />
              ))}
            </div>
          </fieldset>
        </div>

        {/* ---- Experience type ---- */}
        <fieldset className="space-y-2">
          <legend className="telemetry text-muted-foreground">
            Destination or experience type
          </legend>
          <div className="-mx-1 scroll-x scroll-fade gap-1.5 px-1 pb-1">
            {EXPERIENCE_TYPES.map((type) => {
              const active = filters.experienceTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleExperienceType(type.id)}
                  aria-pressed={active}
                  title={type.hint}
                  className={cn(
                    "shrink-0 snap-start rounded-full border px-3 py-1.5 font-sans text-xs transition-all duration-200",
                    active
                      ? "border-primary bg-primary/15 text-primary shadow-glow-sm"
                      : "border-hairline text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* ---- Budget + requirements ---- */}
        <div
          className={cn(
            "grid gap-5",
            showRequirements ? "lg:grid-cols-[1.3fr_1fr]" : undefined,
          )}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor={budgetId} className="telemetry text-muted-foreground">
                <Wallet className="mr-1 inline h-3 w-3" aria-hidden />
                Budget per person
              </Label>
              <span
                data-readout
                className="font-mono text-sm font-semibold text-primary"
              >
                {budgetLabel}
              </span>
            </div>
            <Slider
              id={budgetId}
              min={BUDGET_BOUNDS.min}
              max={BUDGET_BOUNDS.max}
              step={BUDGET_BOUNDS.step}
              value={[filters.maxBudget]}
              onValueChange={(value) => update({ maxBudget: value[0] ?? BUDGET_BOUNDS.max })}
              aria-label="Maximum budget per person in Ugandan shillings"
            />
            <div className="flex justify-between font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span>{formatUGX(BUDGET_BOUNDS.min)}</span>
              <span>No limit</span>
            </div>
          </div>

          {showRequirements ? (
            <fieldset className="space-y-2.5">
              <legend className="telemetry text-muted-foreground">
                Must include
              </legend>
              <RequirementRow
                id="req-transport"
                icon={Bike}
                label="Boda transport"
                checked={filters.requireTransport}
                onChange={(checked) => update({ requireTransport: checked })}
              />
              <RequirementRow
                id="req-guide"
                icon={BadgeCheck}
                label="Licensed guide"
                checked={filters.requireGuide}
                onChange={(checked) => update({ requireGuide: checked })}
              />
              <RequirementRow
                id="req-meals"
                icon={UtensilsCrossed}
                label="Meals included"
                checked={filters.requireMeals}
                onChange={(checked) => update({ requireMeals: checked })}
              />
            </fieldset>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function GroupChip({
  active,
  onClick,
  label,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={cn(
        "rounded-md border px-3 py-1.5 font-sans text-xs transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-hairline text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function RequirementRow({
  id,
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  id: string;
  icon: typeof Bike;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2 font-sans text-xs font-normal normal-case tracking-normal text-muted-foreground"
      >
        <Icon
          className={cn("h-3.5 w-3.5", checked ? "text-primary" : "text-muted-foreground")}
          aria-hidden
        />
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
