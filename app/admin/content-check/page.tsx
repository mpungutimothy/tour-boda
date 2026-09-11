"use client";

import { useState, useCallback } from "react";
import { validateContent, type ValidationResult } from "@/lib/content/validate";
import { BANNED_PHRASES } from "@/lib/content/voice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, ScanText, RotateCcw } from "lucide-react";

export default function ContentCheckPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleCheck = useCallback(() => {
    setResult(validateContent(text));
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
    setResult(null);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink">Content Quality Check</h1>
        <p className="mt-3 max-w-2xl font-sans text-lg text-muted-foreground">
          Paste your copy below to scan it against the Tour-Boda voice guide.
          Any banned phrases will be flagged so you can rewrite them in our
          authentic, grounded tone.
        </p>
      </div>

      {/* Input */}
      <div className="mb-6 space-y-2">
        <Label htmlFor="content-input">Your copy</Label>
        <textarea
          id="content-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste tour descriptions, blog posts, marketing copy..."
          className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="font-mono text-xs text-muted-foreground">
          {text.length} characters · {text.trim() ? text.trim().split(/\s+/).length : 0} words
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8 flex gap-3">
        <Button onClick={handleCheck} disabled={!text.trim()}>
          <ScanText className="mr-2 h-4 w-4" />
          Check Content
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Pass/fail banner */}
          <div
            className={`flex items-center gap-3 rounded-lg border p-5 shadow-warm-sm ${
              result.passed
                ? "border-success/30 bg-success/5"
                : "border-error/30 bg-error/5"
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
            ) : (
              <XCircle className="h-6 w-6 shrink-0 text-error" />
            )}
            <div>
              <p className="font-serif text-xl font-semibold">
                {result.passed
                  ? "All clear — this copy passes the voice check"
                  : `${result.totalMatches} banned phrase${result.totalMatches > 1 ? "s" : ""} found across ${result.violations.length} unique term${result.violations.length > 1 ? "s" : ""}`}
              </p>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {result.passed
                  ? "The text is free of clichés and marketing fluff. You're good to publish."
                  : "Rewrite the flagged phrases using specific, grounded language instead."}
              </p>
            </div>
          </div>

          {/* Violation list */}
          {!result.passed && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
              <h2 className="mb-4 font-serif text-lg font-semibold">Flagged Phrases</h2>
              <div className="space-y-3">
                {result.violations.map((v) => (
                  <div
                    key={v.phrase}
                    className="flex items-center justify-between gap-4 rounded-md border border-border/60 bg-surface p-3"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-accent" />
                      <span className="font-mono text-sm font-medium text-ink">
                        &ldquo;{v.phrase}&rdquo;
                      </span>
                    </div>
                    <Badge variant="destructive">
                      {v.count} {v.count > 1 ? "occurrences" : "occurrence"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reference: banned phrases list */}
      {!result && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
          <h2 className="mb-2 font-serif text-lg font-semibold">
            Banned Phrases Reference
          </h2>
          <p className="mb-4 font-sans text-sm text-muted-foreground">
            The scanner checks for {BANNED_PHRASES.length} phrases that don&rsquo;t
            match the Tour-Boda voice. Write with specifics instead of clichés.
          </p>
          <div className="flex flex-wrap gap-2">
            {BANNED_PHRASES.map((phrase) => (
              <span
                key={phrase}
                className="rounded-full border border-border/60 bg-surface px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
