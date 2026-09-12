import type { Destination } from "@/types/destination";
import { ClipboardList } from "lucide-react";

export function QuickFacts({ destination }: { destination: Destination }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-grain rounded-lg bg-surface p-6 shadow-warm-sm sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold">Quick Facts</h2>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {destination.keyFacts.map((fact) => (
            <div key={fact.label} className="border-l-2 border-primary/30 pl-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-1 font-sans text-sm font-medium text-ink">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
