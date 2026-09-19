"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { useState } from "react";

export function FAQSection({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">05</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Questions</span>
      </div>

      <h2 className="font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
        Questions &amp; answers
      </h2>

      <div className="mt-6 divide-y divide-hairline border-y border-hairline">
        {destination.faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          const buttonId = `faq-button-${i}`;
          const panelId = `faq-panel-${i}`;

          return (
            <div key={faq.question}>
              <h3>
                {/* `pr-1.5` on the button reserves the room the rotation needs.
                    Rotating a 20px box by 45 degrees grows its bounding box to
                    28px, so the open-state "×" was reaching about 4px past the
                    button's right edge — measured scrollWidth 317 against
                    clientWidth 311. Six pixels of right padding keeps it inside
                    without visibly moving it. */}
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 py-4 pr-1.5 text-left transition-colors hover:text-primary-ink"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[0.6875rem] tabular-nums text-primary-ink"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* `min-w-0` on the question is what lets the row actually
                      fit. Without it the flex item kept its content-based
                      minimum, so the question did not shrink quite enough and
                      pushed the "+" about 5px past the button's right edge —
                      measured scrollWidth 318 against clientWidth 311. */}
                  <span className="min-w-0 flex-1 font-display text-base font-semibold leading-snug">
                    {faq.question}
                  </span>
                  {/* Fixed square so the 45-degree rotation of the open state
                      stays inside its own box instead of growing the row. */}
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center font-mono text-lg leading-none text-primary-ink transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={panelId}
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[65ch] pb-5 pl-8 font-sans text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
