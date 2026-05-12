import type { Remedy } from "./content";

/**
 * Energetics & taste classification for the taste/energetics compass.
 *
 * These axes are cross-cultural approximations (Ayurveda's rasas/virya,
 * TCM's four natures & five flavours, Kampo's ki/blood/fluid, and Western
 * temperature theory). For remedies whose taste/energetics are not already
 * flagged in source data, we fall back to a keyword heuristic that reads
 * the name + benefit + recipe.
 *
 * The heuristic is DELIBERATELY conservative — if we can't detect a quality
 * with confidence, we omit it rather than mislabel.
 */

export const TASTES = ["sweet", "sour", "salty", "bitter", "pungent", "astringent"] as const;
export type Taste = typeof TASTES[number];

export const ENERGETICS = ["warming", "cooling", "neutral", "drying", "moistening"] as const;
export type Energetic = typeof ENERGETICS[number];

/**
 * Keyword → taste. Each keyword is matched as a whole word (with optional
 * plural/participle suffix) against lowercased `${name} ${latin} ${benefit}
 * ${recipe}`. Whole-word matching is load-bearing: substring matching caused
 * "sour" to tag any remedy whose benefit said "source of …", "plum" to tag
 * anything with the Latin genus "Plumbago", etc.
 */
const TASTE_KEYWORDS: Record<Taste, string[]> = {
  sweet: [
    "sweet", "honey", "madhura", "licorice", "jujube", "date", "maple", "dulce", "figs", "raisin",
    "ghee", "milk", "rose", "amazake", "rice koji", "fermented rice", "sesame", "nutty", "sugar",
    // TCM / Kampo tonics (almost all classified as sweet in materia medica)
    "ginseng", "ren shen", "dang shen", "codonopsis", "astragalus", "huang qi", "shan yao",
    "chinese yam", "dioscorea", "longan", "long yan", "da zao", "gou qi", "goji", "wolfberry",
    "lycium", "peony root", "bai shao", "dang gui", "reishi", "ling zhi", "fu ling", "poria",
    "bai zhu", "atractylodes", "ophiopogon", "mai men dong", "glycyrrhiza", "gan cao",
    "sheng di huang", "shu di huang", "rehmannia", "tian men dong", "asparagus root",
    "huang jing", "polygonatum", "bai he", "lily bulb", "lian zi", "lotus seed",
    "mulberry fruit", "sang shen", "taiso", "ninjin", "shakuyaku", "kanzo", "ougi",
    "qi tonic", "blood tonic", "yin tonic", "yang tonic"
  ],
  sour: [
    "sour", "soursop", "lemon", "tamarind", "tamarindo", "amla", "amalaki", "vinegar",
    "hibiscus", "pomegranate", "cranberry", "plum", "umeboshi", "yoghurt", "yogurt", "kefir",
    "kombucha", "yuzu", "citrus", "acidic", "tart", "fermented plum",
    // TCM / Kampo
    "hawthorn", "shan zha", "schisandra", "wu wei zi", "wu mei", "mume fruit",
    "shan zhu yu", "cornus", "dogwood fruit", "mu gua", "chaenomeles"
  ],
  salty: [
    "salt", "sea vegetable", "kelp", "seaweed", "kombu", "miso", "wakame", "rock salt",
    "saindhava", "nori", "hijiki", "fermented soy", "shoyu", "soy sauce", "brine", "mineral",
    "iodine",
    // TCM mineral/shell substances (classified salty)
    "oyster shell", "mu li", "mother of pearl", "zhen zhu mu", "abalone shell", "shi jue ming",
    "magnetite", "ci shi", "haliotis", "dragon bone", "long gu"
  ],
  bitter: [
    "bitter", "neem", "andrographis", "gentian", "wormwood", "dandelion", "chiretta", "aloe",
    "goldenseal", "artichoke", "burdock", "chamomile", "coptis", "scutellaria", "skullcap",
    "green tea", "matcha", "hojicha", "tea", "roasted tea", "catechins",
    // TCM heat-clearing & damp-draining bitters
    "huang lian", "huang qin", "huang bai", "phellodendron", "ku shen", "sophora", "long dan",
    "lian qiao", "forsythia", "jin yin hua", "honeysuckle", "ban xia", "pinellia",
    "yi yi ren", "coix", "da huang", "rhubarb root", "qing hao", "sweet wormwood",
    "chuan xin lian", "bitter melon", "ku gua", "lotus leaf", "he ye", "zhi zi", "gardenia",
    "chai hu", "bupleurum", "saiko", "ogon", "chen pi", "tangerine peel", "ze xie", "alisma"
  ],
  pungent: [
    "pungent", "ginger", "pepper", "chilli", "chili", "mustard", "cayenne", "horseradish",
    "wasabi", "garlic", "onion", "clove", "cinnamon", "cardamom", "long pepper", "pippali",
    "asafoetida", "hing", "galangal", "shoga", "shoyu", "radish", "daikon", "spicy", "hot",
    // TCM / Kampo warming acrids & wind-releasers
    "sheng jiang", "gan jiang", "shokyo", "dry ginger", "gui zhi", "cinnamon twig", "rou gui",
    "keishi", "ma huang", "ephedra", "zi su", "perilla", "bo he", "chinese mint",
    "fang feng", "siler", "bai zhi", "angelica dahurica", "chuan xiong", "ligusticum",
    "xi xin", "asarum", "ding xiang", "fennel", "xiao hui xiang", "star anise", "ba jiao",
    "sichuan pepper", "hua jiao", "cao dou kou", "galangal", "gao liang jiang"
  ],
  astringent: [
    "astringent", "haritaki", "bibhitaki", "triphala", "witch hazel", "myrrh", "oak bark",
    "shepherd", "yarrow", "acorn", "green tea", "pomegranate rind", "sumac", "raspberry leaf",
    "kuzu", "starch", "binding",
    // TCM astringents / essence-securers
    "schisandra", "wu wei zi", "shan zhu yu", "cornus", "wu bei zi", "rose hip", "jin ying zi",
    "lian zi", "lotus seed", "qian shi", "gorgon", "euryale", "fu xiao mai", "lotus stamen",
    "lian xu", "yuan zhi"
  ]
};

/** Keyword → energetic. Same whole-word matching rules as TASTE_KEYWORDS. */
const ENERGETIC_KEYWORDS: Record<Energetic, string[]> = {
  warming: [
    "warming", "warm", "hot", "pungent", "ginger", "cinnamon", "pepper", "clove", "cardamom",
    "mustard", "chilli", "chili", "garlic", "galangal", "nutmeg", "ajwain", "fenugreek",
    "wormwood", "dry ginger", "sheng jiang", "gan jiang", "shokyo",
    // TCM / Kampo warming acrids, yang tonics, circulation movers
    "gui zhi", "rou gui", "keishi", "ma huang", "ephedra", "zi su", "perilla", "fang feng",
    "bai zhi", "chuan xiong", "xi xin", "asarum", "ding xiang", "star anise", "ba jiao",
    "sichuan pepper", "hua jiao", "fu zi", "aconite", "rou cong rong", "cistanche",
    "lu rong", "deer antler", "yin yang huo", "epimedium", "tu si zi", "cuscuta",
    "dang gui", "yang tonic", "yang-warming", "warms the middle", "warms yang", "dispel cold"
  ],
  cooling: [
    "cooling", "cool", "cold", "mint", "coriander", "cucumber", "rose", "sandalwood", "vetiver",
    "aloe", "hibiscus", "amla", "shatavari", "licorice", "chrysanthemum", "moringa", "burdock",
    "dandelion", "gentian",
    // TCM / Kampo heat-clearing
    "bo he", "chinese mint", "ju hua", "chrysanthemum", "jin yin hua", "honeysuckle",
    "lian qiao", "forsythia", "huang lian", "huang qin", "huang bai", "zhi zi", "gardenia",
    "shi gao", "gypsum", "zhi mu", "anemarrhena", "sheng di", "xuan shen", "scrophularia",
    "mu dan pi", "moutan", "chai hu", "bupleurum", "bamboo leaf", "zhu ye",
    "clears heat", "heat-clearing", "cools the blood", "wind-heat"
  ],
  neutral: ["neutral", "balanced"],
  drying: [
    "drying", "astringent", "diuretic", "decongest", "bitter", "tannin", "triphala", "haritaki",
    // TCM damp-resolvers
    "fu ling", "poria", "bai zhu", "atractylodes", "yi yi ren", "coix", "ze xie", "alisma",
    "chen pi", "tangerine peel", "ban xia", "pinellia", "cang zhu",
    "resolve damp", "drain damp", "dries damp", "phlegm-resolving", "resolves phlegm"
  ],
  moistening: [
    "moistening", "demulcent", "mucilage", "marshmallow", "slippery elm", "fenugreek mucilage",
    "okra", "aloe", "shatavari", "honey", "ghee", "lotus seed", "psyllium",
    // TCM yin tonics & fluid-generators
    "mai men dong", "ophiopogon", "tian men dong", "asparagus root", "sha shen", "glehnia",
    "bai he", "lily bulb", "shi hu", "dendrobium", "yu zhu", "polygonatum odoratum",
    "huang jing", "sesame", "hei zhi ma", "black sesame", "gui ban", "bie jia",
    "yin tonic", "nourishes yin", "generates fluids", "moistens lung", "moistens dryness"
  ]
};

/** Escape regex metacharacters in a literal keyword. */
function escapeRx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word match: the keyword must start on a word boundary and be followed
 * by a word boundary or a common inflection ("s", "es", "ing", "ed", "er", "y").
 * "sour" matches "sour", "sours", "souring" — not "source", "resource".
 * Multi-word keywords ("long pepper") are matched as-is with boundaries at
 * their start and end.
 */
function matchAny(hay: string, list: string[]): boolean {
  for (const w of list) {
    const re = /\s/.test(w)
      ? new RegExp(`\\b${escapeRx(w)}\\b`, "i")
      : new RegExp(`\\b${escapeRx(w)}(?:s|es|ing|ed|er|y)?\\b`, "i");
    if (re.test(hay)) return true;
  }
  return false;
}

/** Count the number of distinct keywords from `list` that match `hay`. */
function countMatches(hay: string, list: string[]): number {
  let n = 0;
  for (const w of list) {
    const re = /\s/.test(w)
      ? new RegExp(`\\b${escapeRx(w)}\\b`, "i")
      : new RegExp(`\\b${escapeRx(w)}(?:s|es|ing|ed|er|y)?\\b`, "i");
    if (re.test(hay)) n++;
  }
  return n;
}

export function inferTastes(r: Remedy): Taste[] {
  const hay = `${r.name} ${r.latin ?? ""} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
  const hits: Taste[] = [];
  for (const t of TASTES) {
    if (matchAny(hay, TASTE_KEYWORDS[t])) hits.push(t);
  }
  return hits;
}

/**
 * Weighted taste counts: how many distinct keywords matched per taste.
 * Used to derive percentages that reflect relative prominence rather than
 * a flat 1/N split.
 */
export function inferTasteWeights(r: Remedy): Record<Taste, number> {
  const hay = `${r.name} ${r.latin ?? ""} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
  const out = {} as Record<Taste, number>;
  for (const t of TASTES) out[t] = countMatches(hay, TASTE_KEYWORDS[t]);
  return out;
}

/**
 * Convert a weight map to integer percentages that sum to exactly 100
 * using the largest-remainder method. Empty / all-zero input → all zeros.
 */
export function tastePercentages(weights: Record<Taste, number>): Record<Taste, number> {
  const total = TASTES.reduce((s, t) => s + (weights[t] || 0), 0);
  const out = {} as Record<Taste, number>;
  if (total <= 0) {
    for (const t of TASTES) out[t] = 0;
    return out;
  }
  const raw: Array<{ t: Taste; floor: number; rem: number }> = [];
  let assigned = 0;
  for (const t of TASTES) {
    const exact = ((weights[t] || 0) / total) * 100;
    const floor = Math.floor(exact);
    raw.push({ t, floor, rem: exact - floor });
    out[t] = floor;
    assigned += floor;
  }
  // Distribute remaining points to highest fractional remainders.
  raw.sort((a, b) => b.rem - a.rem);
  let remaining = 100 - assigned;
  for (let i = 0; i < raw.length && remaining > 0; i++) {
    out[raw[i].t]++;
    remaining--;
  }
  return out;
}

export function inferEnergetics(r: Remedy): Energetic[] {
  const hay = `${r.name} ${r.latin ?? ""} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
  const hits: Energetic[] = [];
  for (const e of ENERGETICS) {
    if (matchAny(hay, ENERGETIC_KEYWORDS[e])) hits.push(e);
  }
  // A remedy can't logically be both strongly warming AND cooling — pick the dominant one.
  if (hits.includes("warming") && hits.includes("cooling")) {
    const warmCount = countMatches(hay, ENERGETIC_KEYWORDS.warming);
    const coolCount = countMatches(hay, ENERGETIC_KEYWORDS.cooling);
    return hits.filter(h => h !== (warmCount >= coolCount ? "cooling" : "warming"));
  }
  return hits;
}

/** Combined summary for a remedy. */
export interface EnergeticProfile {
  tastes: Taste[];
  energetics: Energetic[];
  tasteWeights: Record<Taste, number>;
  tastePercentages: Record<Taste, number>;
}

const _cache = new WeakMap<Remedy, EnergeticProfile>();
export function profileOf(r: Remedy): EnergeticProfile {
  const c = _cache.get(r);
  if (c) return c;
  const weights = inferTasteWeights(r);
  const out: EnergeticProfile = {
    tastes: inferTastes(r),
    energetics: inferEnergetics(r),
    tasteWeights: weights,
    tastePercentages: tastePercentages(weights)
  };
  _cache.set(r, out);
  return out;
}

/** Match score: sum of selected-quality hits. */
export function scoreRemedy(
  r: Remedy,
  selected: { tastes: Set<Taste>; energetics: Set<Energetic> }
): number {
  const p = profileOf(r);
  let s = 0;
  for (const t of p.tastes)     if (selected.tastes.has(t))     s += 1;
  for (const e of p.energetics) if (selected.energetics.has(e)) s += 1.2;
  return s;
}

/** Human-readable copy for each quality (used as tooltips & legend). */
export const TASTE_DESC: Record<Taste, { short: string; detail: string; color: string }> = {
  sweet:      { short: "Nourishing, grounding", detail: "Builds tissues, calms the nervous system, in excess can cloud digestion.", color: "#e8b15c" },
  sour:       { short: "Stimulating, tonifying", detail: "Kindles appetite, brightens the senses, sharpens mind.", color: "#f07c5b" },
  salty:      { short: "Hydrating, softening",  detail: "Moistens tissues, eases stiffness, aids mineral balance.", color: "#6cb0b8" },
  bitter:     { short: "Cleansing, clarifying", detail: "Cools heat, clears dampness, lightens the body.", color: "#7a8d52" },
  pungent:    { short: "Warming, moving",       detail: "Breaks stagnation, clears mucus, stokes digestive fire.", color: "#c93e3e" },
  astringent: { short: "Toning, drying",        detail: "Firms tissues, binds fluids, closes and knits wounds.", color: "#7a5aa6" }
};

export const ENERGETIC_DESC: Record<Energetic, { short: string; color: string }> = {
  warming:    { short: "Kindles inner fire",   color: "#d97706" },
  cooling:    { short: "Pacifies heat",        color: "#0891b2" },
  neutral:    { short: "Temperate, balanced",  color: "#6b7280" },
  drying:     { short: "Dispels dampness",     color: "#a16207" },
  moistening: { short: "Replenishes fluids",   color: "#0369a1" }
};
