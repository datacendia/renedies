/**
 * Herb–herb & herb–drug interaction engine.
 *
 * Three layers of analysis, all run against the current blend:
 *
 *   1. Pair / trio rules  — specific published interactions.
 *   2. Cumulative stacking — N+ herbs sharing a pharmacological tag
 *      (sedative, anticoagulant, hepatotoxic, etc.) compound their effect.
 *   3. safety.json lookup — any herb flagged `avoid` in pregnancy / lactation
 *      is auto-surfaced without needing a dedicated rule.
 *
 * All matches use **lowercased substring** comparison on the ingredient name,
 * so "Ashwagandha (Withania somnifera)" matches the keyword "ashwagandha".
 * Kept intentionally conservative: flag only what has credible evidence.
 */

import { safetyFor } from "./safety";
import type { DrugClass } from "./drugs";
import { getDrug } from "./drugs";

export type Severity = "info" | "caution" | "danger";

export interface InteractionRule {
  id: string;
  herbs: string[];     // keywords that must ALL be present
  severity: Severity;
  title: string;
  detail: string;
}

export interface InteractionHit extends InteractionRule {
  /** Names of the ingredients in the current blend that triggered this hit. */
  triggeredBy: string[];
}

/* ─────────── Pair / trio specific rules ─────────── */

export const HERB_INTERACTIONS: InteractionRule[] = [
  // ── single-herb "major" flags ──────────────────────────────────────────
  { id: "st-johns-ssri", herbs: ["st john"], severity: "danger",
    title: "Major drug interactions",
    detail: "St John's Wort induces CYP3A4 and risks serotonin syndrome with SSRIs, MAOIs, tramadol, triptans. Also reduces effectiveness of oral contraceptives, warfarin, ciclosporin, and many HIV/cancer drugs. Do not combine with pharmaceuticals." },
  { id: "ephedra-flag", herbs: ["ma huang"], severity: "danger",
    title: "Regulated herb — cardiac risk",
    detail: "Ephedra / Ma Huang is restricted in many jurisdictions. Contraindicated with cardiac conditions, hypertension, thyroid disease, MAOIs, or any stimulant." },
  { id: "pennyroyal-flag", herbs: ["pennyroyal"], severity: "danger",
    title: "Hepatotoxic — internal use not advised",
    detail: "Pulegone is acutely hepatotoxic and abortifacient. Essential oil has caused fatalities. Internal use strongly discouraged at any dose." },
  { id: "comfrey-flag", herbs: ["comfrey"], severity: "danger",
    title: "Pyrrolizidine alkaloids — liver toxicity",
    detail: "Contains hepatotoxic and carcinogenic PAs. Internal use banned in several countries. Use topically only on intact skin, short term." },
  { id: "chaparral-flag", herbs: ["chaparral"], severity: "danger",
    title: "Hepatotoxicity reports",
    detail: "Chaparral (Larrea) has been linked to acute hepatitis and liver failure. FDA warning in effect since 1992." },
  { id: "yohimbe-flag", herbs: ["yohimbe"], severity: "danger",
    title: "Cardiovascular & MAOI risk",
    detail: "Yohimbine is an α2-antagonist — raises blood pressure, can trigger panic attacks, contraindicated with MAOIs, SSRIs, stimulants, and in hypertension." },
  { id: "blue-cohosh", herbs: ["blue cohosh"], severity: "danger",
    title: "Cardiotoxic in pregnancy",
    detail: "Contains N-methylcytisine; has caused neonatal cardiac injury and stroke when used to induce labour. Not for home use." },
  { id: "kava-liver", herbs: ["kava"], severity: "caution",
    title: "Liver strain",
    detail: "Rare but documented hepatotoxicity — magnified by alcohol, acetaminophen, and other hepatotoxic herbs. Use water-based preparations; limit to 1–3 months." },
  { id: "licorice-bp", herbs: ["licorice"], severity: "caution",
    title: "Blood pressure & potassium",
    detail: "Glycyrrhizin (non-DGL licorice) raises BP and lowers potassium. Avoid if hypertensive, pregnant, or on diuretics/digoxin. Limit to 4–6 weeks." },
  { id: "ginseng-warfarin", herbs: ["ginseng"], severity: "caution",
    title: "May interact with anticoagulants",
    detail: "Ginseng can potentiate or blunt warfarin/antiplatelets depending on species. Avoid combining with blood thinners without practitioner guidance." },
  { id: "goldenseal-cyp", herbs: ["goldenseal"], severity: "caution",
    title: "CYP3A4 / P-glycoprotein inhibition",
    detail: "Berberine-containing herbs inhibit key drug-metabolising enzymes and can raise blood levels of many prescription drugs." },
  { id: "ashwa-pregnancy", herbs: ["ashwagandha"], severity: "caution",
    title: "Pregnancy caution",
    detail: "Traditional texts contraindicate ashwagandha in pregnancy. Modern evidence is limited; avoid without practitioner supervision." },

  // ── specific pair / trio interactions ──────────────────────────────────
  { id: "licorice-diuretic", herbs: ["licorice", "dandelion"], severity: "caution",
    title: "Electrolyte disruption",
    detail: "Licorice retains sodium; dandelion is a mild diuretic. The combination can disrupt potassium balance." },
  { id: "ashwa-ginseng", herbs: ["ashwagandha", "ginseng"], severity: "info",
    title: "Two strong adaptogens",
    detail: "Traditionally not combined — each is a complete adaptogenic system. Stacking may over-stimulate." },
  { id: "warming-stack", herbs: ["ginger", "cinnamon", "clove"], severity: "info",
    title: "Very warming combination",
    detail: "Excellent in winter; may be excessive in summer or for those with heat signs (flushing, reflux, irritability)." },
  { id: "stjohns-ginkgo", herbs: ["st john", "ginkgo"], severity: "caution",
    title: "Bleeding + serotonergic",
    detail: "St John's Wort + Ginkgo compounds both serotonin and platelet effects. Avoid if on SSRIs or anticoagulants." },
  { id: "kava-valerian", herbs: ["kava", "valerian"], severity: "caution",
    title: "Heavy CNS sedation",
    detail: "Both strongly sedating — avoid before driving or with alcohol, benzodiazepines, opioids." },
];

/* ─────────── Tag-based cumulative stacking ─────────── */

export type HerbTag =
  | "sedative-cns"      // GABAergic / CNS depressant
  | "anticoagulant"     // platelet or clotting effects
  | "hepatotoxic"       // liver stress (varying severity)
  | "uterine-stim"      // emmenagogue / abortifacient risk
  | "serotonergic"      // serotonin-modulating
  | "stimulant"         // caffeine-like / sympathomimetic
  | "hypotensive"       // lowers blood pressure
  | "hypertensive"      // raises blood pressure
  | "hypoglycemic"      // lowers blood glucose
  | "photosensitizer"   // skin photosensitivity
  | "adaptogen"         // HPA-axis modulators (stack = overstimulation)
  ;

/**
 * Keyword → tags. Keywords are lowercased substrings matched against the
 * ingredient name. Conservative: only herbs with credible documented effects.
 */
export const HERB_TAGS: Array<{ keywords: string[]; tags: HerbTag[] }> = [
  // Sedative / GABAergic
  { keywords: ["valerian"],        tags: ["sedative-cns"] },
  { keywords: ["kava"],            tags: ["sedative-cns", "hepatotoxic"] },
  { keywords: ["passionflower"],   tags: ["sedative-cns"] },
  { keywords: ["hops"],            tags: ["sedative-cns"] },
  { keywords: ["chamomile"],       tags: ["sedative-cns"] },
  { keywords: ["lemon balm", "melissa"], tags: ["sedative-cns"] },
  { keywords: ["skullcap"],        tags: ["sedative-cns"] },
  { keywords: ["california poppy"], tags: ["sedative-cns"] },
  { keywords: ["jujube", "suan zao ren"], tags: ["sedative-cns"] },

  // Anticoagulant / antiplatelet
  { keywords: ["ginkgo"],          tags: ["anticoagulant"] },
  { keywords: ["ginger"],          tags: ["stimulant", "anticoagulant"] },
  { keywords: ["garlic"],          tags: ["anticoagulant", "hypotensive"] },
  { keywords: ["turmeric", "curcumin"], tags: ["anticoagulant"] },
  { keywords: ["feverfew"],        tags: ["anticoagulant"] },
  { keywords: ["dong quai"],       tags: ["anticoagulant", "uterine-stim"] },
  { keywords: ["red clover"],      tags: ["anticoagulant"] },
  { keywords: ["willow"],          tags: ["anticoagulant"] },
  { keywords: ["meadowsweet"],     tags: ["anticoagulant"] },

  // Hepatotoxic
  { keywords: ["comfrey"],         tags: ["hepatotoxic", "uterine-stim"] },
  { keywords: ["chaparral"],       tags: ["hepatotoxic"] },
  { keywords: ["pennyroyal"],      tags: ["hepatotoxic", "uterine-stim"] },
  { keywords: ["coltsfoot"],       tags: ["hepatotoxic"] },
  { keywords: ["germander"],       tags: ["hepatotoxic"] },
  { keywords: ["mistletoe"],       tags: ["hepatotoxic"] },

  // Uterine stimulant / abortifacient risk
  { keywords: ["wormwood"],        tags: ["uterine-stim"] },
  { keywords: ["blue cohosh"],     tags: ["uterine-stim"] },
  { keywords: ["black cohosh"],    tags: ["uterine-stim"] },
  { keywords: ["mugwort"],         tags: ["uterine-stim"] },
  { keywords: ["tansy"],           tags: ["uterine-stim"] },
  { keywords: ["rue"],             tags: ["uterine-stim"] },
  { keywords: ["juniper"],         tags: ["uterine-stim"] },
  { keywords: ["parsley"],         tags: ["uterine-stim"] },
  { keywords: ["angelica"],        tags: ["uterine-stim"] },

  // Serotonergic
  { keywords: ["st john"],         tags: ["serotonergic"] },
  { keywords: ["rhodiola"],        tags: ["serotonergic", "adaptogen", "stimulant"] },
  { keywords: ["saffron"],         tags: ["serotonergic"] },

  // Stimulant
  { keywords: ["ma huang", "ephedra"], tags: ["stimulant", "hypertensive"] },
  { keywords: ["guarana"],         tags: ["stimulant"] },
  { keywords: ["kola", "cola nut"], tags: ["stimulant"] },
  { keywords: ["yerba mate", "mate"], tags: ["stimulant"] },
  { keywords: ["green tea", "matcha"], tags: ["stimulant"] },
  { keywords: ["coffee"],          tags: ["stimulant"] },
  { keywords: ["yohimbe"],         tags: ["stimulant", "hypertensive"] },

  // Hypotensive
  { keywords: ["hawthorn"],        tags: ["hypotensive"] },
  { keywords: ["hibiscus"],        tags: ["hypotensive"] },
  { keywords: ["olive leaf"],      tags: ["hypotensive"] },
  { keywords: ["reishi"],          tags: ["hypotensive"] },

  // Hypertensive
  { keywords: ["licorice"],        tags: ["hypertensive"] },

  // Hypoglycemic
  { keywords: ["cinnamon"],        tags: ["hypoglycemic"] },
  { keywords: ["fenugreek"],       tags: ["hypoglycemic"] },
  { keywords: ["bitter melon"],    tags: ["hypoglycemic"] },
  { keywords: ["gymnema"],         tags: ["hypoglycemic"] },
  { keywords: ["berberine", "goldenseal", "barberry"], tags: ["hypoglycemic"] },

  // Photosensitizer
  { keywords: ["st john"],         tags: ["photosensitizer"] },
  { keywords: ["angelica"],        tags: ["photosensitizer"] },
  { keywords: ["rue"],             tags: ["photosensitizer"] },
  { keywords: ["bergamot"],        tags: ["photosensitizer"] },

  // Adaptogen
  { keywords: ["ashwagandha"],     tags: ["adaptogen"] },
  { keywords: ["ginseng"],         tags: ["adaptogen", "stimulant"] },
  { keywords: ["eleuthero", "siberian ginseng"], tags: ["adaptogen"] },
  { keywords: ["schisandra"],      tags: ["adaptogen"] },
  { keywords: ["holy basil", "tulsi"], tags: ["adaptogen"] },
  { keywords: ["maca"],            tags: ["adaptogen"] },

  // Warming (kept for tradition lens, not safety)
  { keywords: ["clove"],           tags: [] },
  { keywords: ["black pepper"],    tags: [] },
  { keywords: ["long pepper"],     tags: [] },
  { keywords: ["cayenne", "chili"], tags: [] },
  { keywords: ["cardamom"],        tags: [] },
  { keywords: ["nutmeg"],          tags: [] },

  // Cooling (kept for tradition lens, not safety)
  { keywords: ["mint", "peppermint"], tags: [] },
  { keywords: ["coriander"],       tags: [] },
  { keywords: ["fennel"],          tags: [] },
  { keywords: ["rose"],            tags: [] },
  { keywords: ["hibiscus"],        tags: ["hypotensive"] },
  { keywords: ["chrysanthemum"],    tags: [] },

  // Drying (kept for tradition lens, not safety)
  { keywords: ["sage"],            tags: [] },
  { keywords: ["thyme"],           tags: [] },
  { keywords: ["oregano"],         tags: [] },
  { keywords: ["rosemary"],        tags: [] },
  { keywords: ["juniper"],         tags: [] },

  // Moistening (kept for tradition lens, not safety)
  { keywords: ["licorice"],        tags: ["hypertensive"] },
  { keywords: ["marshmallow"],     tags: [] },
  { keywords: ["slippery elm"],    tags: [] },
  { keywords: ["fenugreek"],       tags: ["hypoglycemic"] },
  { keywords: ["flaxseed", "linseed"], tags: [] },
];

/** Per-tag description for cumulative warnings. */
const TAG_STACKS: Record<HerbTag, { title: string; detail: string; thresholds: { caution: number; danger: number } }> = {
  "sedative-cns": {
    title: "Sedative stack — compounded CNS depression",
    detail: "Multiple GABAergic / CNS-depressant herbs amplify drowsiness, motor impairment, and breathing depression. Do not combine with alcohol, benzodiazepines, or opioids.",
    thresholds: { caution: 2, danger: 3 }
  },
  "anticoagulant": {
    title: "Bleeding risk — anticoagulant stack",
    detail: "Multiple herbs that inhibit platelets or clotting increase bruising and bleeding risk, especially with aspirin, NSAIDs, warfarin, or surgery.",
    thresholds: { caution: 2, danger: 4 }
  },
  "hepatotoxic": {
    title: "Liver stress stack",
    detail: "Combining hepatotoxic herbs sharply raises liver injury risk. Avoid with alcohol, acetaminophen, or pre-existing liver conditions.",
    thresholds: { caution: 2, danger: 2 }
  },
  "uterine-stim": {
    title: "Uterine stimulants — avoid in pregnancy",
    detail: "These herbs promote menstruation or uterine contraction. Contraindicated in pregnancy and when trying to conceive.",
    thresholds: { caution: 1, danger: 2 }
  },
  "serotonergic": {
    title: "Serotonin syndrome risk",
    detail: "Multiple serotonin-modulating herbs can push serotonin into dangerous ranges — especially with SSRIs, MAOIs, triptans, tramadol, or MDMA.",
    thresholds: { caution: 2, danger: 3 }
  },
  "stimulant": {
    title: "Stimulant stack",
    detail: "Cumulative caffeine- or sympathomimetic herbs can cause anxiety, insomnia, palpitations, and raise blood pressure.",
    thresholds: { caution: 3, danger: 4 }
  },
  "hypotensive": {
    title: "Blood-pressure lowering stack",
    detail: "Several BP-lowering herbs together can cause dizziness or hypotension, particularly with antihypertensive medication.",
    thresholds: { caution: 2, danger: 3 }
  },
  "hypertensive": {
    title: "Blood-pressure raising effect",
    detail: "Contains herbs known to raise BP. Avoid if hypertensive or on antihypertensive medication.",
    thresholds: { caution: 1, danger: 2 }
  },
  "hypoglycemic": {
    title: "Blood-sugar lowering stack",
    detail: "Cumulative glucose-lowering herbs can drop blood sugar, especially with diabetes medication. Monitor.",
    thresholds: { caution: 2, danger: 3 }
  },
  "photosensitizer": {
    title: "Photosensitivity",
    detail: "These herbs increase sun sensitivity — use SPF, limit sun, stop before procedures using UV or lasers.",
    thresholds: { caution: 2, danger: 3 }
  },
  "adaptogen": {
    title: "Adaptogen overload",
    detail: "Traditionally a formula leans on one adaptogen. Stacking three or more can over-stimulate the HPA axis — jitters, insomnia, overheated signs.",
    thresholds: { caution: 2, danger: 3 }
  }
};

/* ─────────── Matcher ─────────── */

export function tagsForIngredient(name: string): HerbTag[] {
  const n = name.toLowerCase();
  const out = new Set<HerbTag>();
  for (const row of HERB_TAGS) {
    if (row.keywords.some(k => n.includes(k))) {
      row.tags.forEach(t => out.add(t));
    }
  }
  return [...out];
}

export interface Ingredient { name: string; latin?: string }

/**
 * Run all interaction layers against the current blend. Returns an ordered
 * list (danger → caution → info) of interaction hits.
 *
 * Layers:
 *   1. Explicit pair / trio rules
 *   2. Tag-based herb-herb cumulative stacking
 *   3. safety.json pregnancy / lactation auto-flag
 *   4. Drug-herb interactions (when `medications` is provided)
 */
export function analyzeBlend(
  ingredients: Ingredient[],
  medications: DrugClass[] = []
): InteractionHit[] {
  const names = ingredients.map(i => i.name);
  const hay = names.map(n => n.toLowerCase());
  const hits: InteractionHit[] = [];

  // Layer 1 — explicit pair / trio rules.
  for (const rule of HERB_INTERACTIONS) {
    const triggeredBy: string[] = [];
    const matchedAll = rule.herbs.every(kw => {
      const match = names.find((_, i) => hay[i].includes(kw));
      if (match) triggeredBy.push(match);
      return !!match;
    });
    if (matchedAll) hits.push({ ...rule, triggeredBy });
  }

  // Layer 2 — tag stacking.
  const byTag = new Map<HerbTag, string[]>();
  for (const ing of ingredients) {
    for (const tag of tagsForIngredient(ing.name)) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag)!.push(ing.name);
    }
  }
  for (const [tag, members] of byTag.entries()) {
    const spec = TAG_STACKS[tag];
    const n = members.length;
    if (n < spec.thresholds.caution) continue;
    const severity: Severity = n >= spec.thresholds.danger ? "danger" : "caution";
    hits.push({
      id: `stack-${tag}`,
      herbs: members,
      severity,
      title: `${spec.title} (${n})`,
      detail: spec.detail,
      triggeredBy: members
    });
  }

  // Layer 3 — safety.json pregnancy/lactation auto-flag.
  const avoidPreg: string[] = [];
  const avoidLact: string[] = [];
  for (const ing of ingredients) {
    const s = safetyFor({ name: ing.name, latin: ing.latin });
    if (!s) continue;
    if (s.pregnancy === "avoid") avoidPreg.push(ing.name);
    if (s.lactation === "avoid") avoidLact.push(ing.name);
  }
  if (avoidPreg.length) {
    hits.push({
      id: "auto-preg-avoid",
      herbs: avoidPreg,
      severity: "danger",
      title: `Avoid in pregnancy: ${avoidPreg.join(", ")}`,
      detail: "Curated safety data flags these ingredients as contraindicated in pregnancy. If you are or may become pregnant, remove them from the blend.",
      triggeredBy: avoidPreg
    });
  }
  if (avoidLact.length) {
    hits.push({
      id: "auto-lact-avoid",
      herbs: avoidLact,
      severity: "caution",
      title: `Avoid while breastfeeding: ${avoidLact.join(", ")}`,
      detail: "Curated safety data flags these ingredients as contraindicated during lactation.",
      triggeredBy: avoidLact
    });
  }

  // Layer 4 — drug-herb interactions.
  if (medications.length) {
    // Pre-compute herb-tags per ingredient for quick drug lookups.
    const ingTags = ingredients.map(i => ({
      name: i.name,
      tags: new Set(tagsForIngredient(i.name))
    }));
    for (const drugId of medications) {
      const drug = getDrug(drugId);
      if (!drug) continue;

      // 4a — tag-based: any herb carrying a conflicting tag.
      const tagMatches: Array<{ herb: string; tag: HerbTag }> = [];
      for (const it of ingTags) {
        for (const tag of drug.conflictingTags) {
          if (it.tags.has(tag)) tagMatches.push({ herb: it.name, tag });
        }
      }
      if (tagMatches.length) {
        const uniqueHerbs = [...new Set(tagMatches.map(m => m.herb))];
        hits.push({
          id: `drug-tag-${drugId}`,
          herbs: uniqueHerbs,
          severity: "caution",
          title: `${drug.label} + ${uniqueHerbs.join(", ")}`,
          detail: drug.summary,
          triggeredBy: uniqueHerbs
        });
      }

      // 4b — specific herb keyword matches (can override to danger).
      for (const spec of drug.specific ?? []) {
        const match = names.find(n => n.toLowerCase().includes(spec.herb));
        if (!match) continue;
        hits.push({
          id: `drug-specific-${drugId}-${spec.herb}`,
          herbs: [match],
          severity: spec.severity,
          title: `${drug.label} + ${match}`,
          detail: spec.note,
          triggeredBy: [match]
        });
      }
    }
  }

  // Dedup by id, keep highest severity.
  const rank: Record<Severity, number> = { info: 0, caution: 1, danger: 2 };
  const byId = new Map<string, InteractionHit>();
  for (const h of hits) {
    const prev = byId.get(h.id);
    if (!prev || rank[h.severity] > rank[prev.severity]) byId.set(h.id, h);
  }
  return [...byId.values()].sort((a, b) => rank[b.severity] - rank[a.severity]);
}

/**
 * Legacy shim — keeps RecipeBuilder's existing call site working while the
 * rename propagates. Accepts just names for backward compatibility.
 */
export function matchInteractions(selected: string[] | Ingredient[]): InteractionHit[] {
  const ings: Ingredient[] = selected.map(s =>
    typeof s === "string" ? { name: s } : s
  );
  return analyzeBlend(ings);
}

export const SEVERITY_STYLE: Record<Severity, { bg: string; fg: string; border: string; label: string }> = {
  info:    { bg: "rgb(14 165 233 / 0.08)",  fg: "#0ea5e9", border: "rgb(14 165 233 / 0.35)",  label: "Good to know" },
  caution: { bg: "rgb(217 119 6 / 0.10)",   fg: "#d97706", border: "rgb(217 119 6 / 0.35)",   label: "Caution" },
  danger:  { bg: "rgb(220 38 38 / 0.10)",   fg: "#dc2626", border: "rgb(220 38 38 / 0.35)",   label: "Warning" }
};
