import { BANNED_PHRASES } from "./voice";

export interface Violation {
  phrase: string;
  count: number;
  indices: number[];
}

export interface ValidationResult {
  passed: boolean;
  violations: Violation[];
  totalMatches: number;
}

export function validateContent(text: string): ValidationResult {
  const lowerText = text.toLowerCase();
  const violations: Violation[] = [];

  for (const phrase of BANNED_PHRASES) {
    const indices: number[] = [];
    let searchFrom = 0;

    while (true) {
      const idx = lowerText.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      indices.push(idx);
      searchFrom = idx + phrase.length;
    }

    if (indices.length > 0) {
      violations.push({ phrase, count: indices.length, indices });
    }
  }

  violations.sort((a, b) => b.count - a.count);

  const totalMatches = violations.reduce((sum, v) => sum + v.count, 0);

  return {
    passed: violations.length === 0,
    violations,
    totalMatches,
  };
}
