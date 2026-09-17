"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Telemetry count-up. Animates from 0 to `value` the first time it scrolls into
 * view, so stat rows read as live data rather than static labels.
 *
 * Reduced motion renders the final value immediately. The digits are padded and
 * tabular so the element never reflows mid-count.
 */
export function CountUp({
  value,
  durationMs = 1100,
  pad = 2,
  className,
}: {
  value: number;
  durationMs?: number;
  /** Zero-pad width, matching the "03" treatment used elsewhere. */
  pad?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "-40px 0px", threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const start = performance.now();
    // easeOutExpo — fast out of the gate, settles precisely.
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(ease(t) * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, durationMs]);

  const text = String(display).padStart(pad, "0");

  return (
    <span ref={ref} className={className} data-readout>
      <span className="sr-only">{value}</span>
      <span aria-hidden>{text}</span>
    </span>
  );
}

/**
 * Same treatment for a number that needs thousands separators and a prefix,
 * e.g. "From 60,000 UGX" in the hero stat row.
 */
export function CountUpCurrency({
  value,
  prefix,
  className,
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "-40px 0px", threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const start = performance.now();
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      // Round to the nearest 500 so the digits don't jitter on a long count.
      setDisplay(Math.round((ease(t) * value) / 500) * 500);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref} className={className} data-readout>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-UG")}
      </span>
      <span aria-hidden>
        {prefix}
        {display.toLocaleString("en-UG")}
      </span>
    </span>
  );
}
