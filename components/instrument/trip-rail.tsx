"use client";

import { useEffect, useRef, useState } from "react";

export interface TripWaypoint {
  /** id of the section element this waypoint marks. */
  id: string;
  label: string;
}

interface TripRailProps {
  /** Real round-trip distance for this route, in kilometres. */
  totalKm: number;
  /**
   * Waypoints anchored to real sections on the page. Positions are measured
   * from the DOM, never invented — the rail reports where the reader actually
   * is, it does not invent stop distances.
   */
  waypoints?: TripWaypoint[];
}

interface PlacedWaypoint extends TripWaypoint {
  /** 0–1 position along the document. */
  ratio: number;
}

/**
 * The Trip Rail — the site's signature device.
 *
 * Scrolling the page advances an odometer: scroll progress is mapped onto the
 * route's real distance, so reading the page is travelling it. Purely
 * decorative and additive (`aria-hidden`, `pointer-events-none`); every word
 * and number it shows also exists in the document text, so assistive tech and
 * no-JS users lose nothing.
 */
export function TripRail({ totalKm, waypoints = [] }: TripRailProps) {
  const [progress, setProgress] = useState(0);
  const [placed, setPlaced] = useState<PlacedWaypoint[]>([]);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;

      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);

      const total = doc.scrollHeight;
      setPlaced(
        waypoints
          .map((waypoint) => {
            const el = document.getElementById(waypoint.id);
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            const centre = rect.top + window.scrollY + rect.height / 2;
            return { ...waypoint, ratio: total > 0 ? Math.min(1, centre / total) : 0 };
          })
          .filter((w): w is PlacedWaypoint => w !== null),
      );
    };

    const schedule = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
    // waypoints is a stable literal per page; re-measuring on identity change is
    // cheap and keeps this correct if a page swaps routes without unmounting.
  }, [waypoints]);

  const kmTravelled = progress * totalKm;

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* Mobile: hairline directly under the sticky header (h-14). */}
      <div className="fixed inset-x-0 top-14 z-40 h-px bg-border lg:hidden">
        <div
          className="h-full origin-left bg-data"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Desktop: the rail proper. */}
      <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-center gap-3">
          <span className="telemetry text-data">
            {kmTravelled.toFixed(1)}
            <span className="text-muted-foreground">/{totalKm}</span>
          </span>

          <div className="relative h-[52vh] w-px bg-border">
            {/* Distance travelled. */}
            <div
              className="absolute inset-x-0 top-0 origin-top bg-data"
              style={{ height: `${progress * 100}%` }}
            />

            {/* 5 km ticks, decorative. */}
            {Array.from({ length: Math.max(0, Math.floor(totalKm / 5)) }, (_, i) => {
              const ratio = ((i + 1) * 5) / totalKm;
              if (ratio >= 1) return null;
              return (
                <span
                  key={i}
                  className="absolute -left-1 h-px w-2 bg-hairline"
                  style={{ top: `${ratio * 100}%` }}
                />
              );
            })}

            {/* Waypoints, measured from the real sections. */}
            {placed.map((waypoint) => {
              const passed = progress >= waypoint.ratio - 0.01;
              return (
                <span
                  key={waypoint.id}
                  className="absolute -left-[3px] flex items-center gap-2"
                  style={{ top: `${waypoint.ratio * 100}%` }}
                >
                  <span
                    className={`h-[7px] w-[7px] rounded-full border ${
                      passed
                        ? "border-data bg-data"
                        : "border-hairline bg-background"
                    }`}
                  />
                  <span
                    className={`telemetry whitespace-nowrap transition-opacity ${
                      passed ? "text-foreground opacity-100" : "text-muted-foreground opacity-50"
                    }`}
                  >
                    {waypoint.label}
                  </span>
                </span>
              );
            })}
          </div>

          <span className="telemetry text-muted-foreground">KM</span>
        </div>
      </div>
    </div>
  );
}
