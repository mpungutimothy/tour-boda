"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function FAQSection({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl font-semibold">Questions & Answers</h2>
      </div>
      <div className="divide-y divide-border/60 rounded-lg border border-border bg-card shadow-warm-sm">
        {destination.faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-sans text-sm font-medium text-ink transition-colors hover:text-primary"
              >
                {faq.question}
                <span
                  className="ml-3 shrink-0 text-primary transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 font-sans text-sm leading-relaxed text-muted-foreground">
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
