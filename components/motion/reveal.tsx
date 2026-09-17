"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal with optional stagger. Wraps content and fades/slides it up
 * once, when it first enters the viewport.
 *
 * Reduced motion is honoured by rendering the final state immediately — the
 * content is never hidden behind an animation that will not run.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger offset in milliseconds. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    if (query.matches) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "-60px 0px -40px 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown || reduced ? "none" : "translateY(18px)",
        transition: reduced
          ? undefined
          : `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 620ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
