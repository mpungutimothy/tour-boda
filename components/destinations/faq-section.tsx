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
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:text-primary-ink"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[0.6875rem] tabular-nums text-primary-ink"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-base font-semibold leading-snug">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-lg leading-none text-primary-ink transition-transform duration-200"
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
