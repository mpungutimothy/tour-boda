"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface TierSelectionState {
  selectedIndex: number;
  selectTier: (index: number) => void;
}

const TierSelectionContext = createContext<TierSelectionState | null>(null);

export function TierSelectionProvider({ children, initialIndex = 0 }: { children: ReactNode; initialIndex?: number }) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const selectTier = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <TierSelectionContext.Provider value={{ selectedIndex, selectTier }}>
      {children}
    </TierSelectionContext.Provider>
  );
}

export function useTierSelection(): TierSelectionState {
  const ctx = useContext(TierSelectionContext);
  if (!ctx) {
    throw new Error("useTierSelection must be used within a TierSelectionProvider");
  }
  return ctx;
}
