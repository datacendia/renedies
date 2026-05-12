import fs from "node:fs";
import path from "node:path";

/**
 * Parses the 5 regional markdown files (01–05) into structured entries.
 * Also exposes the raw markdown for the deep-dive / symptom index pages.
 */

export type Region = "India" | "Peru/Andes/Spanish" | "China" | "Japan" | "Global";

/** Per-locale override bundle for a remedy. All fields optional — missing
 *  fields fall back to the English (source) value. Latin binomials and slugs
 *  are intentionally NOT localised (they're botanical identifiers and URL
 *  keys respectively). */
export interface RemedyI18n {
  name?: string;
  benefit?: string;
  recipe?: string;
  sourcing?: string;
  attribution?: string;
}

export interface Remedy {
  slug: string;
  number: number;
  region: Region;
  name: string;
  latin?: string;
  benefit?: string;
  recipe?: string;
  sourcing?: string;
  extras?: string[]; // e.g. Caution lines
  raw: string;       // full markdown block

  /** Data-quality marker for UI filtering. */
  confidence?: "verified" | "traditional" | "preliminary";
  /** Data source citation (e.g. 'USDA GRIN', 'Kew POWO', 'NCCIH monograph'). */
  attribution?: string;
  /** Pre-computed symptom tags (falls back to regex scan). */
  tags?: string[];

  /** Optional per-locale translations. Keyed by 2-letter locale code
   *  matching `i18n/config.ts`. Loaded from
   *  `site/data/extended/<region>.<locale>.json` where present. */
  i18n?: Record<string, RemedyI18n>;
}

export interface Article {
  slug: string;
  title: string;
  markdown: string;
}

/**
 * Markdown content is mirrored into `site/content/markdown/` by
 * `scripts/sync-content.mjs` (runs as `predev`/`prebuild`). This ensures
 * Vercel deploys — which set the project root to `site/` — can still find
 * the files at build time. We prefer the mirrored copy and fall back to the
 * repo-root for loose local runs.
 */
const SITE_CONTENT_DIR = path.resolve(process.cwd(), "content", "markdown");
const REPO_ROOT_FALLBACK = path.resolve(process.cwd(), "..");

function resolveMarkdown(filename: string): string {
  const primary = path.join(SITE_CONTENT_DIR, filename);
  if (fs.existsSync(primary)) return primary;
  const fallback = path.join(REPO_ROOT_FALLBACK, filename);
  if (fs.existsSync(fallback)) return fallback;
  throw new Error(
    `[content] markdown file not found: ${filename} (looked in ${SITE_CONTENT_DIR} and ${REPO_ROOT_FALLBACK}). Run \`npm run sync-content\`.`
  );
}

const REGIONAL_FILES: { file: string; region: Region }[] = [
  { file: "01_Indian_Ayurvedic.md",          region: "India" },
  { file: "02_Peruvian_Andean_Spanish.md",   region: "Peru/Andes/Spanish" },
  { file: "03_Chinese_TCM.md",               region: "China" },
  { file: "04_Japanese_Kampo.md",            region: "Japan" },
  { file: "05_Other_Global.md",              region: "Global" }
];

const ARTICLE_FILES: { file: string; slug: string; title: string }[] = [
  { file: "06_Symptom_Index.md",              slug: "symptom-index",          title: "Symptom Index (Cross-Cultural)" },
  { file: "07_Ayurvedic_DeepDive_150_More.md", slug: "ayurveda-deep-dive",    title: "Ayurvedic Deep Dive (150 More)" },
  { file: "08_Kampo_Full_Formulary.md",       slug: "kampo-formulary",        title: "Kampo Full Formulary" },
  { file: "A1_Triphala_Home_Recipe.md",       slug: "triphala-home-recipe",   title: "Triphala — Detailed Home Recipe" },
  { file: "A2_Ashwagandha_Safety.md",         slug: "ashwagandha-safety",     title: "Ashwagandha — Safety & Interactions" }
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseEntry(raw: string, region: Region): Remedy | null {
  // Heading like: "## 12. Name / Alt (Latin)" or "### 57. Name (*Latin*)"
  const m = raw.match(/^#{2,3}\s+(\d+)\.\s+(.+?)\s*$/m);
  if (!m) return null;
  const number = parseInt(m[1], 10);
  let title = m[2].trim();
  let latin: string | undefined;
  const latinMatch = title.match(/\(\*?([^()*]+?)\*?\)\s*$/);
  if (latinMatch) {
    latin = latinMatch[1].trim();
    title = title.slice(0, latinMatch.index).trim();
  }
  const benefit  = raw.match(/\*\*Benefit:?\*\*\s*([^\n]+)/i)?.[1]?.trim();
  const recipe   = raw.match(/\*\*(?:Recipe|Preparation|Use|Method)[^*]*:?\*\*\s*([^\n]+)/i)?.[1]?.trim();
  const sourcing = raw.match(/\*\*Sourcing[^*]*:?\*\*\s*([^\n]+)/i)?.[1]?.trim();

  // Capture multi-line cautions: everything between the Caution label and the
  // next bold field or blank line. Split bullet/newline-separated items.
  const cautionBlock = raw.match(
    /\*\*Caution[^*]*:?\*\*\s*([\s\S]*?)(?=\n\s*\*\*[A-Z]|\n\s*\n|\n#{2,}|$)/i
  )?.[1]?.trim();
  const cautions: string[] = [];
  if (cautionBlock) {
    for (const raw of cautionBlock.split(/\n+/)) {
      const line = raw.replace(/^[-*•]\s*/, "").trim();
      if (line) cautions.push(line);
    }
  }

  return {
    slug: `${region.split("/")[0].toLowerCase().replace(/\s+/g, "-")}-${number}-${slugify(title)}`,
    number, region, name: title, latin,
    benefit, recipe, sourcing,
    extras: cautions.map(c => `Caution: ${c}`),
    raw
  };
}

interface ExtendedEntry {
  name: string;
  latin?: string;
  benefit?: string;
  recipe?: string;
  sourcing?: string;
  tags?: string[];
  confidence?: "verified" | "traditional" | "preliminary";
  attribution?: string;
}

const EXTENDED_DATA_DIR = path.resolve(process.cwd(), "data", "extended");
const EXTENDED_FILES: { file: string; region: Region }[] = [
  { file: "ayurveda.json", region: "India" },
  { file: "tcm.json",      region: "China" },
  { file: "kampo.json",    region: "Japan" },
  { file: "andean.json",   region: "Peru/Andes/Spanish" },
  { file: "global.json",   region: "Global" }
];

/** Loads `<base>.<locale>.json` sidecar files for this region and returns a
 *  lookup keyed by lowercased English `name`. Missing files are silently
 *  skipped — translation is opt-in per locale.
 *
 *  Expected sidecar format: the same array shape as the English source,
 *  with each entry providing at minimum `{ name: <english name> }` plus
 *  any translated fields. Example:
 *      [{"name":"Ashwagandha","benefit":"…en español…","recipe":"…"}]
 */
function loadLocaleSidecars(baseFile: string): Record<string, Record<string, RemedyI18n>> {
  const byName: Record<string, Record<string, RemedyI18n>> = {};
  if (!fs.existsSync(EXTENDED_DATA_DIR)) return byName;

  // e.g. ayurveda.json -> ayurveda
  const stem = baseFile.replace(/\.json$/, "");
  const re = new RegExp(`^${stem}\\.([a-z]{2})\\.json$`);

  for (const f of fs.readdirSync(EXTENDED_DATA_DIR)) {
    const m = f.match(re);
    if (!m) continue;
    const locale = m[1];
    try {
      const entries = JSON.parse(
        fs.readFileSync(path.join(EXTENDED_DATA_DIR, f), "utf8")
      ) as Array<{ name?: string } & RemedyI18n>;
      for (const e of entries) {
        if (!e.name) continue;
        const k = e.name.toLowerCase().trim();
        if (!byName[k]) byName[k] = {};
        byName[k][locale] = {
          name: e.name !== undefined ? (e as RemedyI18n).name : undefined,
          benefit: e.benefit,
          recipe: e.recipe,
          sourcing: e.sourcing,
          attribution: e.attribution
        };
      }
    } catch {
      // Silently ignore malformed sidecar; English fallback still works.
    }
  }
  return byName;
}

function loadExtendedForRegion(region: Region, offset: number): Remedy[] {
  const meta = EXTENDED_FILES.find(f => f.region === region);
  if (!meta) return [];
  const p = path.join(EXTENDED_DATA_DIR, meta.file);
  if (!fs.existsSync(p)) return [];
  const entries = JSON.parse(fs.readFileSync(p, "utf8")) as ExtendedEntry[];
  const i18nByName = loadLocaleSidecars(meta.file);
  return entries.map((e, i) => {
    const key = e.name.toLowerCase().trim();
    const i18n = i18nByName[key];
    return {
      slug: `${region.split("/")[0].toLowerCase().replace(/\s+/g, "-")}-ext-${slugify(e.name)}`,
      number: offset + i + 1,
      region,
      name: e.name,
      latin: e.latin,
      benefit: e.benefit,
      recipe: e.recipe,
      sourcing: e.sourcing,
      extras: [],
      raw: "",
      confidence: e.confidence ?? "traditional",
      attribution: e.attribution,
      tags: e.tags,
      ...(i18n ? { i18n } : {})
    };
  });
}

let _cache: Remedy[] | null = null;

/**
 * Clear the in-memory remedy cache. Call this after content updates
 * or use with Next.js revalidate patterns for ISR.
 */
export function clearRemedyCache(): void {
  _cache = null;
}

export function getAllRemedies(): Remedy[] {
  if (_cache) return _cache;
  const out: Remedy[] = [];
  // 1. Markdown-sourced entries (verified, hand-curated source)
  for (const { file, region } of REGIONAL_FILES) {
    const full = fs.readFileSync(resolveMarkdown(file), "utf8");
    const parts = full.split(/\n(?=##\s+\d+\.)/g);
    for (const part of parts) {
      const entry = parseEntry(part, region);
      if (entry) {
        // Markdown-sourced entries are hand-curated from canonical tradition
        // texts but not individually cited against modern studies — mark them
        // as "traditional". Only entries with explicit attribution metadata
        // earn the "verified" badge (set in the extended JSON sources).
        entry.confidence = "traditional";
        out.push(entry);
      }
    }
  }
  // 2. Extended JSON datasets (by region), de-duped against markdown entries by name
  const existingNames = new Set(out.map(r => r.name.toLowerCase().trim()));
  for (const { region } of EXTENDED_FILES) {
    const offset = out.filter(r => r.region === region).length;
    for (const r of loadExtendedForRegion(region, offset)) {
      if (existingNames.has(r.name.toLowerCase().trim())) continue;
      existingNames.add(r.name.toLowerCase().trim());
      out.push(r);
    }
  }
  _cache = out;
  return out;
}

export function getRemedyBySlug(slug: string): Remedy | undefined {
  return getAllRemedies().find(r => r.slug === slug);
}

export function getRemediesByRegion(region: Region): Remedy[] {
  return getAllRemedies().filter(r => r.region === region);
}

/**
 * Returns a Remedy with `name` / `benefit` / `recipe` / `sourcing` /
 * `attribution` replaced by the matching locale's translation when present,
 * falling back to the English source for any missing field.
 *
 * This is the canonical way to render a remedy in locale-aware UI. The
 * original `Remedy` object (English) stays immutable.
 *
 *   import { getLocale } from "next-intl/server";
 *   const remedy = localizeRemedy(r, await getLocale());
 *
 * Latin binomial and slug are NEVER localised — they're botanical /
 * URL identifiers.
 */
export function localizeRemedy(r: Remedy, locale: string): Remedy {
  if (!locale || locale === "en") return r;
  const override = r.i18n?.[locale];
  if (!override) return r;
  return {
    ...r,
    name:        override.name        ?? r.name,
    benefit:     override.benefit     ?? r.benefit,
    recipe:      override.recipe      ?? r.recipe,
    sourcing:    override.sourcing    ?? r.sourcing,
    attribution: override.attribution ?? r.attribution
  };
}

/** Convenience wrapper: localise an array in one call. */
export function localizeRemedies(rs: Remedy[], locale: string): Remedy[] {
  if (!locale || locale === "en") return rs;
  return rs.map(r => localizeRemedy(r, locale));
}

export const REGIONS: Region[] = ["India", "Peru/Andes/Spanish", "China", "Japan", "Global"];

export function getArticle(slug: string): Article | undefined {
  const meta = ARTICLE_FILES.find(a => a.slug === slug);
  if (!meta) return undefined;
  const markdown = fs.readFileSync(resolveMarkdown(meta.file), "utf8");
  return { slug: meta.slug, title: meta.title, markdown };
}

export function getAllArticles(): Article[] {
  return ARTICLE_FILES.map(a => getArticle(a.slug)!).filter(Boolean);
}

/** Derived symptom tags from simple keyword scan of name + benefit. */
const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  "Sleep & Anxiety":      ["sleep", "insomnia", "anxiety", "stress", "calm", "sedative"],
  "Cough & Respiratory":  ["cough", "bronch", "respirat", "asthma", "lung", "throat", "sinus", "cold", "flu"],
  "Digestion":            ["digest", "bloat", "gas", "appetite", "nausea", "ibs", "diarr", "constip", "reflux", "ulcer"],
  "Joints & Pain":        ["joint", "arthrit", "pain", "back", "muscle", "rheum"],
  "Immunity & Fatigue":   ["immun", "fatigue", "energy", "adaptogen", "rasayana", "adrenal"],
  "Women's Health":       ["menstrual", "menopause", "pms", "uterine", "lactation", "fertil", "pregnan"],
  "Men's Vitality":       ["libido", "male", "prostate", "testoster", "sperm"],
  "Skin":                 ["skin", "eczema", "acne", "psoria", "wound", "burn"],
  "Heart & BP":           ["heart", "blood pressure", "cardiac", "cholesterol"],
  "Liver & Detox":        ["liver", "detox", "hepatit", "jaundice"],
  "Blood Sugar":          ["sugar", "diabet", "glycem"]
};

export function symptomsOf(r: Remedy): string[] {
  if (r.tags?.length) return r.tags;
  const hay = `${r.name} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
  const hits: string[] = [];
  for (const [tag, words] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (words.some(w => hay.includes(w))) hits.push(tag);
  }
  return hits;
}

export function getAllSymptoms(): string[] {
  return Object.keys(SYMPTOM_KEYWORDS);
}

/** URL slug for a symptom label. */
export function symptomSlug(label: string): string {
  return label.toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function symptomFromSlug(slug: string): string | undefined {
  return getAllSymptoms().find(s => symptomSlug(s) === slug);
}

/**
 * Rank remedies for a given symptom label. Ranking combines (in order):
 *   1. Confidence tier (verified > traditional > preliminary)
 *   2. Whether the symptom is a primary concern (heuristic: it's the
 *      first matching tag in `symptomsOf`, suggesting the name/benefit
 *      leans into it)
 *   3. Presence of a recipe (a treatable entry beats a name-only stub)
 */
export function remediesForSymptom(symptom: string): Remedy[] {
  const all = getAllRemedies();
  return all
    .map(r => ({ r, score: scoreForSymptom(r, symptom) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.r);
}

function scoreForSymptom(r: Remedy, symptom: string): number {
  const tags = symptomsOf(r);
  if (!tags.includes(symptom)) return 0;
  let score = 10;
  if (tags[0] === symptom) score += 5;          // primary concern
  if (r.confidence === "verified") score += 4;
  else if (r.confidence === "traditional") score += 1;
  if (r.recipe) score += 2;
  if (r.benefit) score += 1;
  return score;
}

export interface SymptomSummary {
  label: string;
  slug: string;
  count: number;
  byRegion: Partial<Record<Region, number>>;
}

export function getSymptomSummaries(): SymptomSummary[] {
  const all = getAllRemedies();
  return getAllSymptoms().map(label => {
    const matched = all.filter(r => symptomsOf(r).includes(label));
    const byRegion: Partial<Record<Region, number>> = {};
    for (const r of matched) byRegion[r.region] = (byRegion[r.region] ?? 0) + 1;
    return { label, slug: symptomSlug(label), count: matched.length, byRegion };
  }).sort((a, b) => b.count - a.count);
}

/** First N remedies marked as free preview (balanced across regions). */
export function getPreviewRemedies(n = 20): Remedy[] {
  const all = getAllRemedies();
  const byRegion: Record<string, Remedy[]> = {};
  for (const r of all) (byRegion[r.region] ||= []).push(r);
  const out: Remedy[] = [];
  const perRegion = Math.ceil(n / REGIONS.length);
  for (const region of REGIONS) {
    out.push(...(byRegion[region] ?? []).slice(0, perRegion));
  }
  return out.slice(0, n);
}
