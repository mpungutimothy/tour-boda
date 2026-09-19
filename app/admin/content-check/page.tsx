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
import { SectionMark } from "@/components/instrument/readouts";
import { AlertTriangle, Check, RotateCcw, ScanText, X } from "lucide-react";

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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">00</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Internal</span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display">
        Content check
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
        Scan copy against the editorial guide. Banned phrases are flagged, and
        destination narratives are checked for the five elements every entry must
        contain.
      </p>

      {/* Content type */}
      <div className="mt-10">
        <Label className="telemetry text-muted-foreground">Content type</Label>
        <div
          role="radiogroup"
          aria-label="Content type"
          className="mt-2 flex flex-wrap gap-2"
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
                className={`rounded-full border px-4 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-hairline text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="mt-8">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <Label htmlFor="content-input" className="telemetry text-muted-foreground">
            Copy
          </Label>
          <span
            data-readout
            className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground"
          >
            {text.length} chars · {wordCount} words
          </span>
        </div>
        <textarea
          id="content-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder="Paste tour descriptions, destination narratives, blog posts…"
          className="flex min-h-[220px] w-full rounded-md border border-input bg-background px-3 py-3 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleCheck} disabled={!text.trim()}>
          <ScanText className="mr-2 h-4 w-4" />
          Check content
        </Button>
        <Button variant="outline" onClick={handleSample}>
          Load failing sample
        </Button>
        <Button variant="ghost" onClick={handleClear} disabled={!text && !result}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Results */}
      {result ? (
        <div className="mt-10 space-y-8">
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 rounded-lg border p-5 ${
              result.passed
                ? "border-success/40 bg-success/5"
                : "border-error/40 bg-error/5"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                result.passed ? "bg-success/15" : "bg-error/15"
              }`}
            >
              {result.passed ? (
                <Check className="h-4 w-4 text-success" aria-hidden />
              ) : (
                <X className="h-4 w-4 text-error" aria-hidden />
              )}
            </span>
            <div>
              <p className="font-display text-xl font-bold uppercase tracking-[0.02em]">
                {result.passed ? "Passes the editorial check" : "Needs work"}
              </p>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {result.passed
                  ? "No banned phrases, and every required element is present."
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

          {bannedCount > 0 ? (
            <section>
              <SectionMark index="01">Banned phrases</SectionMark>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {result.bannedPhrases.map((hit) => (
                  <li key={hit.phrase} className="py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3">
                        <AlertTriangle
                          className="h-4 w-4 shrink-0 text-primary-ink"
                          aria-hidden
                        />
                        <span className="font-mono text-sm text-foreground">
                          {hit.phrase}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full border border-error/40 px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-error">
                        {hit.count}×
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 pl-7">
                      {hit.contexts.map((context, i) => (
                        <li
                          key={`${hit.phrase}-${hit.indices[i]}`}
                          className="font-mono text-xs leading-relaxed text-muted-foreground"
                        >
                          {context}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {missingCount > 0 ? (
            <section>
              <SectionMark index="02">Missing required elements</SectionMark>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {result.missingRequiredElements.map((element) => (
                  <li key={element.key} className="flex items-start gap-3 py-3">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden />
                    <div>
                      <p className="font-display text-sm font-semibold uppercase tracking-[0.02em]">
                        {element.label}
                      </p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
                        {element.hint}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {missingCount > 0 && detectedElements.length > 0 ? (
            <section>
              <SectionMark index="03">Detected</SectionMark>
              <ul className="flex flex-wrap gap-2">
                {detectedElements.map((element) => (
                  <li
                    key={element.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-success/40 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-success"
                  >
                    <Check className="h-3 w-3" aria-hidden />
                    {element.label}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="mt-12 space-y-8">
          <section>
            <SectionMark index="01">Banned phrases</SectionMark>
            <p className="mb-4 font-sans text-sm text-muted-foreground">
              The scanner checks for {BANNED_PHRASES.length} phrases that
              don&rsquo;t match the voice.
            </p>
            <ul className="flex flex-wrap gap-2">
              {BANNED_PHRASES.map((phrase) => (
                <li
                  key={phrase}
                  className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {phrase}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionMark index="02">Accepted local terms</SectionMark>
            <p className="mb-4 font-sans text-sm text-muted-foreground">
              A destination narrative needs at least one of these.
            </p>
            <ul className="flex flex-wrap gap-2">
              {LOCAL_TERMS.map((term) => (
                <li
                  key={term}
                  className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {term}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
