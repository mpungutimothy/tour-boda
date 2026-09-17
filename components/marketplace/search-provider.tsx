"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { destinations } from "@/data/destinations";
import {
  DEFAULT_FILTERS,
  type SearchFilters,
  type SortKey,
} from "@/types/marketplace";
import {
  activeFilterCount,
  filterDestinations,
  type FilterOutcome,
} from "@/lib/marketplace/filter";

/**
 * One source of truth for the search.
 *
 * The result set is derived here rather than in the grid, so the filter bar can
 * show a live count and an "N filters active" badge while the grid renders the
 * same array — the two can never disagree. Filtering runs against the local
 * catalogue, which is what makes the results update as you drag the budget
 * slider rather than after a round trip.
 */

interface SearchState {
  filters: SearchFilters;
  sort: SortKey;
  outcome: FilterOutcome;
  activeCount: number;
  setSort: (sort: SortKey) => void;
  update: (patch: Partial<SearchFilters>) => void;
  toggleExperienceType: (id: SearchFilters["experienceTypes"][number]) => void;
  reset: () => void;
  applyPreset: (preset: PresetId) => void;
}

const SearchContext = createContext<SearchState | null>(null);

export type PresetId = "saturday-50k" | "near-me-20km" | "quiet-half-day";

/** tuesday = 2, so the next Saturday is 5 - day + 7 (mod 7). */
function nextSaturday(): string {
  const now = new Date();
  const delta = (5 - now.getDay() + 7) % 7 || 7;
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + delta);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function SearchProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<SearchFilters>;
}) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...initial,
  });
  const [sort, setSort] = useState<SortKey>("recommended");

  const update = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const toggleExperienceType = useCallback(
    (id: SearchFilters["experienceTypes"][number]) => {
      setFilters((current) => {
        const has = current.experienceTypes.includes(id);
        return {
          ...current,
          experienceTypes: has
            ? current.experienceTypes.filter((entry) => entry !== id)
            : [...current.experienceTypes, id],
        };
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    setSort("recommended");
  }, []);

  const applyPreset = useCallback((preset: PresetId) => {
    setSort("recommended");
    switch (preset) {
      case "saturday-50k":
        setFilters({
          ...DEFAULT_FILTERS,
          date: nextSaturday(),
          maxBudget: 50000,
          groupType: "solo",
        });
        break;
      case "near-me-20km":
        setFilters({ ...DEFAULT_FILTERS, location: "Kampala" });
        break;
      case "quiet-half-day":
        setFilters({
          ...DEFAULT_FILTERS,
          experienceTypes: ["community", "nature-waterfalls"],
          groupType: "couple",
        });
        break;
    }
  }, []);

  const outcome = useMemo(
    () => filterDestinations(destinations, filters, sort),
    [filters, sort],
  );

  const value = useMemo<SearchState>(
    () => ({
      filters,
      sort,
      outcome,
      activeCount: activeFilterCount(filters),
      setSort,
      update,
      toggleExperienceType,
      reset,
      applyPreset,
    }),
    [filters, sort, outcome, update, toggleExperienceType, reset, applyPreset],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchState {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside a <SearchProvider>");
  }
  return context;
}

export { nextSaturday };
