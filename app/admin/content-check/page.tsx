"use client";

import { useCallback, useMemo, useState } from "react";
import {
  validateContent,
  CONTENT_TYPES,
  LOCAL_TERMS,
  requiredElementsFor,
  type ContentType,
  type ValidationResult,
} from "@/lib/content/validate";
import { BANNED_PHRASES } from "@/lib/content/voice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardPaste,
  FileWarning,
  RotateCcw,
  ScanText,
  XCircle,
} from "lucide-react";

const SAMPLE = `Nestled in the heart of Uganda, Jinja is a hidden gem with vibrant culture and breathtaking views. Immerse yourself in an unforgettable experience that offers something for everyone.`;

export default function ContentCheckPage() {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState<ContentType>("destination");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const wordCount = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).length : 0),
    [text],
  );

  const handleCheck = useCallback(() => {
    setResult(validateContent(text, contentType));
  }, [text, contentType]);

  const handleClear = useCallback(() => {
    setText("");
    setResult(null);
  }, []);

  const handleSample = useCallback(() => {
    setText(SAMPLE);
    setResult(null);
  }, []);

  const bannedCount = result?.bannedPhrases.length ?? 0;
  const missingCount = result?.missingRequiredElements.length ?? 0;
  const totalMatches =
    result?.bannedPhrases.reduce((sum, hit) => sum + hit.count, 0) ?? 0;

  const detectedElements = useMemo(() => {
    if (!result || result.missingRequiredElements.length === 0) return [];
    const missingKeys = new Set(
      result.missingRequiredElements.map((element) => element.key),
    );
    return requiredElementsFor(contentType).filter(
      (element) => !missingKeys.has(element.key),
    );
  }, [result, contentType]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink">
          Content Quality Check
        </h1>
        <p className="mt-3 max-w-2xl font-sans text-lg text-muted-foreground">
          Paste your copy below to scan it against the Tour-Boda editorial
          guide. Banned phrases are flagged, and destination narratives are also
          checked for the five elements every entry must contain.
        </p>
      </div>

      {/* Content type */}
      <div className="mb-6 space-y-2">
        <Label>Content type</Label>
        <div
          role="radiogroup"
          aria-label="Content type"
          className="flex flex-wrap gap-2"
        >
          {CONTENT_TYPES.map((type) => {
            const active = type.value === contentType;
            return (
              <button
                key={type.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setContentType(type.value);
                  setResult(null);
                }}
                className={`rounded-full border px-4 py-1.5 font-sans text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-ink"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="mb-6 space-y-2">
        <Label htmlFor="content-input">Your copy</Label>
        <textarea
          id="content-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder="Paste tour descriptions, destination narratives, blog posts…"
          className="flex min-h-[220px] w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="font-mono text-xs text-muted-foreground">
          {text.length} characters · {wordCount} words
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button onClick={handleCheck} disabled={!text.trim()}>
          <ScanText className="mr-2 h-4 w-4" />
          Check Content
        </Button>
        <Button variant="outline" onClick={handleSample}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Load Failing Sample
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={!text && !result}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div
            className={`flex items-start gap-3 rounded-lg border p-5 shadow-warm-sm ${
              result.passed
                ? "border-success/30 bg-success/5"
                : "border-error/30 bg-error/5"
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-error" />
            )}
            <div>
              <p className="font-serif text-xl font-semibold">
                {result.passed
                  ? "All clear — this copy passes the editorial check"
                  : "This copy needs work"}
              </p>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {result.passed
                  ? "No banned phrases and every required element is present."
                  : [
                      bannedCount > 0
                        ? `${totalMatches} banned phrase${totalMatches === 1 ? "" : "s"} across ${bannedCount} unique term${bannedCount === 1 ? "" : "s"}`
                        : null,
                      missingCount > 0
                        ? `${missingCount} required element${missingCount === 1 ? "" : "s"} missing`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
            </div>
          </div>

          {/* Banned phrases */}
          {bannedCount > 0 && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
              <h2 className="mb-1 font-serif text-lg font-semibold">
                Banned phrases
              </h2>
              <p className="mb-4 font-sans text-sm text-muted-foreground">
                Rewrite each one with a specific, grounded detail.
              </p>
              <ul className="space-y-3">
                {result.bannedPhrases.map((hit) => (
                  <li
                    key={hit.phrase}
                    className="rounded-md border border-border/60 bg-surface p-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-accent" />
                        <span className="font-mono text-sm font-medium text-ink">
                          &ldquo;{hit.phrase}&rdquo;
                        </span>
                      </div>
                      <Badge variant="destructive">
                        {hit.count} {hit.count === 1 ? "occurrence" : "occurrences"}
                      </Badge>
                    </div>
                    <ul className="mt-2 space-y-1 pl-7">
                      {hit.contexts.map((context, i) => (
                        <li
                          key={`${hit.phrase}-${hit.indices[i]}`}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {context}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing required elements */}
          {missingCount > 0 && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
              <h2 className="mb-1 font-serif text-lg font-semibold">
                Missing required elements
              </h2>
              <p className="mb-4 font-sans text-sm text-muted-foreground">
                Destination narratives must contain all five of these.
              </p>
              <ul className="space-y-3">
                {result.missingRequiredElements.map((element) => (
                  <li
                    key={element.key}
                    className="flex items-start gap-3 rounded-md border border-border/60 bg-surface p-3"
                  >
                    <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">
                        {element.label}
                      </p>
                      <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                        {element.hint}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Present elements, when a partial failure leaves some detected */}
          {missingCount > 0 && detectedElements.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
              <h2 className="mb-1 font-serif text-lg font-semibold">
                Elements detected
              </h2>
              <p className="mb-4 font-sans text-sm text-muted-foreground">
                These are present in the copy.
              </p>
              <div className="flex flex-wrap gap-2">
                {detectedElements.map((element) => (
                  <span
                    key={element.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1 font-sans text-xs text-ink"
                  >
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    {element.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reference */}
      {!result && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
            <h2 className="mb-2 font-serif text-lg font-semibold">
              Banned phrases reference
            </h2>
            <p className="mb-4 font-sans text-sm text-muted-foreground">
              The scanner checks for {BANNED_PHRASES.length} phrases that
              don&rsquo;t match the Tour-Boda voice.
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

          <div className="rounded-lg border border-border bg-card p-6 shadow-warm-sm">
            <h2 className="mb-2 font-serif text-lg font-semibold">
              Local terms the scanner accepts
            </h2>
            <p className="mb-4 font-sans text-sm text-muted-foreground">
              A destination narrative needs at least one of these.
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCAL_TERMS.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-border/60 bg-surface px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
