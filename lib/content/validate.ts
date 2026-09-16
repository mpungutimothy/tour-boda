import { BANNED_PHRASES } from "./voice";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ContentType = "destination" | "tour" | "guide" | "general";

export type RequiredElementKey =
  | "namedPerson"
  | "sensoryDetail"
  | "concreteNumber"
  | "localTerm"
  | "honestNote";

export interface RequiredElement {
  key: RequiredElementKey;
  /** Short human-readable name, safe to render in the admin UI. */
  label: string;
  /** One-line prompt telling the writer what to add. */
  hint: string;
  /** Detection pattern. Must not carry the `g` flag (shared instance state). */
  pattern: RegExp;
}

export interface BannedPhraseHit {
  phrase: string;
  count: number;
  /** Character offsets of each occurrence, ascending. */
  indices: number[];
  /** Short excerpt around each occurrence, for review in the admin UI. */
  contexts: string[];
}

export interface MissingElement {
  key: RequiredElementKey;
  label: string;
  hint: string;
}

export interface ValidationResult {
  passed: boolean;
  bannedPhrases: BannedPhraseHit[];
  missingRequiredElements: MissingElement[];
}

/* -------------------------------------------------------------------------- */
/*  Banned phrase matching                                                     */
/* -------------------------------------------------------------------------- */

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * One banned entry becomes one case-insensitive pattern:
 *
 *  - interior whitespace is flexible, and hyphens also match spaces, so
 *    "once-in-a-lifetime" is caught in "once in a lifetime" too;
 *  - a single-word entry matches its whole family ("empower" catches
 *    "empowers", "empowering", "empowerment"), because banning the stem but
 *    allowing the inflection would leave the obvious hole open;
 *  - a multi-word or hyphenated entry matches literally.
 */
function buildPhrasePattern(phrase: string): RegExp {
  const normalised = phrase.trim().toLowerCase().replace(/\s+/g, " ");
  const isSingleWord = /^[a-z]+$/.test(normalised);

  const body = escapeRegExp(normalised)
    .split(" ")
    .join("\\s+")
    .split("-")
    .join("[\\s-]+");

  return new RegExp(`\\b${body}${isSingleWord ? "[a-z]*" : ""}\\b`, "gi");
}

const CONTEXT_WINDOW = 45;

function buildContext(text: string, index: number, length: number): string {
  const start = Math.max(0, index - CONTEXT_WINDOW);
  const end = Math.min(text.length, index + length + CONTEXT_WINDOW);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end).replace(/\s+/g, " ").trim()}${suffix}`;
}

function findBannedPhrases(text: string): BannedPhraseHit[] {
  const hits: BannedPhraseHit[] = [];

  for (const phrase of BANNED_PHRASES) {
    const pattern = buildPhrasePattern(phrase);
    const indices: number[] = [];
    const contexts: string[] = [];

    // `exec` rather than `matchAll` — tsconfig targets es5, where spreading an
    // IterableIterator is an error.
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const index = match.index;
      indices.push(index);
      contexts.push(buildContext(text, index, match[0].length));
      // Zero-length matches can't occur here, but guard against a stuck loop.
      if (match[0].length === 0) pattern.lastIndex += 1;
    }

    if (indices.length > 0) {
      hits.push({ phrase, count: indices.length, indices, contexts });
    }
  }

  return hits.sort(
    (a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase),
  );
}

/* -------------------------------------------------------------------------- */
/*  Required elements (destination narratives)                                 */
/* -------------------------------------------------------------------------- */

/**
 * Local-language and locally specific vocabulary. The narrative has to reach
 * for at least one of these rather than staying in generic travel English.
 */
export const LOCAL_TERMS: string[] = [
  // transport & daily life
  "boda",
  "boda-boda",
  "rolex",
  "kikomando",
  "matoke",
  "matooke",
  "chapati",
  "posho",
  "luwombo",
  "malewa",
  "nsenene",
  "mukene",
  // languages
  "luganda",
  "lusoga",
  "runyankole",
  "acholi",
  "ateso",
  "kiswahili",
  // honorifics & kinship
  "ssalongo",
  "maama",
  "nalongo",
  "jjajja",
  "mzungu",
  "sebo",
  "nyabo",
];

const LOCAL_TERM_PATTERN = new RegExp(
  `\\b(?:${LOCAL_TERMS.map(escapeRegExp).join("|")})\\b`,
  "i",
);

const NUMBER_WORDS =
  "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion";

const UNITS =
  "km|kilometres?|kilometers?|miles?|metres?|meters?|m\\b|hours?|hrs?|minutes?|mins?|days?|weeks?|months?|years?|shillings?|ugx|acres?|hectares?|species|boats?|animals?|kings?|people|passengers?|percent";

/**
 * Requirements every destination narrative must satisfy. Detection is
 * deliberately generous — these are prompts for a human editor, not a proof.
 */
export const DESTINATION_REQUIREMENTS: RequiredElement[] = [
  {
    key: "namedPerson",
    label: "Named person",
    hint: 'Name a real person — a guide, vendor, elder or boat operator. "Locals" and "the staff" do not count.',
    pattern:
      /\b(?:named|called)\s+[A-Z][\w'’\-]+(?:\s+[A-Z][\w'’\-]+)?|\bname is\s+[A-Z][\w'’\-]+|\b(?:guide|rider|driver|operator|elder|vendor|owner|host|cook|boatman|fisherman|craftsman|woman|man|aunt|grandmother)\b[,\s]+[A-Z][a-z’'\-]{2,}(?:\s+[A-Z][a-z’'\-]{2,})?|\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\s+(?:has|have|had|will|knows|knew|carries|carried|starts|started|grew|grows|studied|studies|points|pointed|tells|told|runs|ran|rows|rowed|rides|rode)\b/,
  },
  {
    key: "sensoryDetail",
    label: "Sensory detail",
    hint: "At least one line the reader can smell, taste, hear or feel — not just see.",
    pattern:
      /\b(?:smell|smells|smelled|smelling|scent|scents|aroma|aromas|stench|fragran\w*|reek\w*|taste|tastes|tasted|tasting|flavour|flavor|sound|sounds|noise|noisy|hum|hums|roar\w*|sizzl\w*|crunch\w*|squelch\w*|smoke|smoky|smokey|dust|dusty|mud|muddy|damp|humid|sticky|gritty|glare|blistering|chilly|warmth|cold|heat)\b/i,
  },
  {
    key: "concreteNumber",
    label: "Concrete number",
    hint: "A verifiable figure — distance, price, duration, acreage, headcount — instead of \"a while\" or \"affordable\".",
    pattern: new RegExp(
      `\\b\\d[\\d,]*(?:\\.\\d+)?\\b|\\b(?:${NUMBER_WORDS})\\s+(?:${UNITS})\\b`,
      "i",
    ),
  },
  {
    key: "localTerm",
    label: "Local term",
    hint: "Use the local word for something — boda, rolex, matoke, Luganda — so the place sounds like itself.",
    pattern: LOCAL_TERM_PATTERN,
  },
  {
    key: "honestNote",
    label: "Honest note",
    hint: "Admit one drawback — mud, crowds, a submerged waterfall — so the reader trusts the rest.",
    pattern:
      /\b(?:honest note|honest\w*|to be honest|full disclosure|in fairness|be aware|be warned|caveat|downside|manage your expectations|worth noting|one caveat)\b/i,
  },
];

const REQUIREMENTS_BY_TYPE: Record<ContentType, RequiredElement[]> = {
  destination: DESTINATION_REQUIREMENTS,
  tour: DESTINATION_REQUIREMENTS,
  guide: [],
  general: [],
};

export const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "destination", label: "Destination narrative" },
  { value: "tour", label: "Tour description" },
  { value: "guide", label: "Guide / blog post" },
  { value: "general", label: "General copy" },
];

export function requiredElementsFor(contentType: ContentType): RequiredElement[] {
  return REQUIREMENTS_BY_TYPE[contentType] ?? [];
}

/* -------------------------------------------------------------------------- */
/*  Entry point                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Check a piece of copy against the editorial guide.
 *
 * @param text        The copy to check.
 * @param contentType Which requirement set to apply. Defaults to `general`,
 *                    which only runs the banned-phrase scan.
 */
export function validateContent(
  text: string,
  contentType: ContentType = "general",
): ValidationResult {
  const source = typeof text === "string" ? text : "";
  const bannedPhrases = findBannedPhrases(source);

  const requirements = requiredElementsFor(contentType);
  const missingRequiredElements: MissingElement[] = requirements
    .filter((requirement) => !requirement.pattern.test(source))
    .map(({ key, label, hint }) => ({ key, label, hint }));

  return {
    passed: bannedPhrases.length === 0 && missingRequiredElements.length === 0,
    bannedPhrases,
    missingRequiredElements,
  };
}
