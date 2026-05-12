/**
 * Infer preparation type from a recipe string and return a standard-dose
 * hint. Used to backfill entries whose recipe text is terse ("Infusion of
 * dried leaves") without concrete numbers.
 *
 * The full conventions table also lives here and is rendered verbatim on
 * the `/conventions` page and in the PDF front matter.
 */

export type PrepKind =
  | "infusion"
  | "decoction"
  | "cold-infusion"
  | "powder"
  | "tincture"
  | "glycerite"
  | "capsule"
  | "granule"
  | "syrup"
  | "essential-oil"
  | "poultice"
  | "food";

export interface PrepConvention {
  kind: PrepKind;
  label: string;
  description: string;
  /** Compact one-line dose summary for inline hints. */
  shortDose: string;
}

export const PREP_CONVENTIONS: PrepConvention[] = [
  {
    kind: "infusion",
    label: "Infusion (tea)",
    description: "Leaves, flowers, soft aerials. Pour just-off-the-boil water, cover, steep.",
    shortDose: "1 tbsp dried (~3 g) per 240 ml just-off-boil water, covered 8–10 min · 1–3 cups/day"
  },
  {
    kind: "decoction",
    label: "Decoction",
    description: "Roots, bark, seeds, tough material. Cover cold water, simmer, strain.",
    shortDose: "1 tsp dried (~3–5 g) per 240 ml water, simmered 15–30 min · 1–2 cups/day"
  },
  {
    kind: "cold-infusion",
    label: "Cold infusion",
    description: "Mucilaginous or aromatic herbs (marshmallow, lemon balm).",
    shortDose: "1 tbsp per 250 ml cold water, 4–8 hr, then strain"
  },
  {
    kind: "powder",
    label: "Powder (churna)",
    description: "Ground herb mixed into warm water, milk, ghee, or honey.",
    shortDose: "¼–½ tsp (~1–3 g) in warm water/milk/honey · 1–3× daily"
  },
  {
    kind: "tincture",
    label: "Tincture",
    description: "Alcohol extract (typically 1:5 in 40% alcohol).",
    shortDose: "2–4 ml (~40–80 drops) diluted in water · 2–3× daily"
  },
  {
    kind: "glycerite",
    label: "Glycerite",
    description: "Alcohol-free vegetable-glycerine extract.",
    shortDose: "2.5–5 ml · 2–3× daily"
  },
  {
    kind: "capsule",
    label: "Capsule / tablet",
    description: "Pre-measured standardized or whole-herb capsules.",
    shortDose: "Follow label · typically 300–1000 mg dried herb per capsule · 1–3× daily with food"
  },
  {
    kind: "granule",
    label: "Granule sachet (Kampo / TCM)",
    description: "Spray-dried concentrated decoction in sachet form.",
    shortDose: "One sachet (~2.5–3 g) in warm water · 2–3× daily before meals"
  },
  {
    kind: "syrup",
    label: "Syrup / honey preparation",
    description: "Herb infused into honey or simple syrup.",
    shortDose: "1 tsp (5 ml) · 1–3× daily · refrigerate, use within 4–6 weeks"
  },
  {
    kind: "essential-oil",
    label: "Essential oil",
    description: "Concentrated volatile-oil distillate — topical only by default.",
    shortDose: "Topical: 1–3 drops per 5 ml carrier (2–6% dilution) · skin-test first · do not ingest without professional guidance"
  },
  {
    kind: "poultice",
    label: "Poultice / compress",
    description: "Fresh or rehydrated herb applied directly to skin.",
    shortDose: "Crushed herb applied to clean skin 15–30 min · 1–3× daily"
  },
  {
    kind: "food",
    label: "Food-as-medicine",
    description: "Culinary amounts — therapeutic effect is cumulative and mild.",
    shortDose: "Normal kitchen quantities (~5–15 g fresh / 1–3 g dried per serving)"
  }
];

const PREP_BY_KIND: Record<PrepKind, PrepConvention> = Object.fromEntries(
  PREP_CONVENTIONS.map(p => [p.kind, p])
) as Record<PrepKind, PrepConvention>;

/** Keyword → kind, tried in order (most specific first). */
const KEYWORD_MAP: Array<{ kind: PrepKind; keywords: RegExp[] }> = [
  { kind: "essential-oil", keywords: [/\bessential oil\b/i, /\baromatherapy\b/i, /\b(diffuse|diffuser)\b/i] },
  { kind: "glycerite",     keywords: [/\bglycerite\b/i, /\bglycerine\b/i, /\bglycerin\b/i] },
  { kind: "tincture",      keywords: [/\btincture\b/i, /\bliquid extract\b/i, /\bdrops\b/i] },
  { kind: "granule",       keywords: [/\bgranule/i, /\bsachet/i, /tsumura/i, /\bkracie\b/i] },
  { kind: "capsule",       keywords: [/\bcapsule/i, /\btablet/i, /\bpill/i, /\bvati\b/i, /\bchurna tablets?\b/i] },
  { kind: "syrup",         keywords: [/\bsyrup\b/i, /\bhoney\b.*(preserve|maceration|syrup|overnight)/i, /\bjam\b/i] },
  { kind: "poultice",      keywords: [/\bpoultice\b/i, /\bcompress\b/i, /\btopical/i, /\bointment\b/i, /\bliniment\b/i, /\bpaste\b.*\bskin\b/i, /\bapplied/i] },
  { kind: "cold-infusion", keywords: [/\bcold[- ]?(brew|infus|soak|steep)/i, /\bovernight.*water\b/i] },
  { kind: "decoction",     keywords: [/\bdecoction\b/i, /\bkwath\b/i, /\bkashaya\b/i, /\bsimmer/i, /\bboil/i, /\bdouble[- ]?boil/i, /\btang\b|\b\u6c64\b/i] },
  { kind: "infusion",      keywords: [/\binfusion\b/i, /\btea\b/i, /\bsteep\b/i, /\binfuse/i, /\bbrew\b/i, /\b(hot|warm) water\b/i] },
  { kind: "powder",        keywords: [/\bpowder\b/i, /\bchurna\b/i, /\bground\b/i, /\bgrated\b/i] },
  { kind: "food",          keywords: [/\bover rice\b/i, /\bin soup\b/i, /\bstir[- ]?fry/i, /\bin food\b/i, /\bsashimi\b/i, /\bmochi\b/i, /\bsalad\b/i, /\bseasoning\b/i, /\bchew\b/i, /\beaten?\b/i] }
];

/**
 * Infer the preparation kind from free-text recipe. Returns null only when
 * the string is empty — otherwise falls back to `food` as the mildest guess.
 */
export function inferPreparation(recipe?: string): PrepConvention | null {
  if (!recipe || !recipe.trim()) return null;
  for (const row of KEYWORD_MAP) {
    if (row.keywords.some(rx => rx.test(recipe))) {
      return PREP_BY_KIND[row.kind];
    }
  }
  return PREP_BY_KIND.food;
}

/**
 * True when the recipe text already contains a concrete measurement
 * (number + unit, or a kitchen quantifier). If false, the standard-dose
 * hint is most useful.
 */
const NUMERIC_RE = /\d/;
const UNIT_RE = /\b(tsp|tbsp|cup|ml|oz|g|mg|gram|grams|drop|drops|sachet|clove|cloves|pinch|pinches|handful|sprig|capsule|tablet)\b/i;
const TIME_RE = /\b(min|minute|minutes|hr|hour|hours|sec|second|seconds|overnight)\b/i;

export function hasConcreteDose(recipe?: string): boolean {
  if (!recipe) return false;
  if (NUMERIC_RE.test(recipe) && (UNIT_RE.test(recipe) || TIME_RE.test(recipe))) return true;
  // Spelled-out half/quarter with a unit still counts.
  if (/\b(half|quarter|one|two|three)\b.{0,12}\b(tsp|tbsp|cup|clove)\b/i.test(recipe)) return true;
  return false;
}
