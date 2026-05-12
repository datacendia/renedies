/**
 * Drug → herb-interaction mapping.
 *
 * Each drug class carries:
 *   - a display label
 *   - the set of herb-interaction tags it amplifies / conflicts with
 *     (these align with `HerbTag` in `interactions.ts`)
 *   - optional explicit herb keywords to call out by name
 *
 * Kept at drug-CLASS level (not individual molecules) so a user can say
 * "I take an SSRI" rather than pick Fluoxetine vs Sertraline. A simple
 * alias list handles common brand/generic names.
 *
 * Scope boundary: this is an OTC-level clinical screen, not a substitute
 * for a pharmacist. Where evidence is uncertain we lean conservative.
 */
import type { HerbTag, Severity } from "./interactions";

export type DrugClass =
  | "ssri"
  | "maoi"
  | "tricyclic"
  | "benzodiazepine"
  | "opioid"
  | "sedative-hypnotic"
  | "stimulant-rx"
  | "warfarin"
  | "antiplatelet"
  | "doac"
  | "nsaid"
  | "acetaminophen"
  | "antihypertensive"
  | "diuretic-loop"
  | "diuretic-potassium-sparing"
  | "digoxin"
  | "statin"
  | "antidiabetic"
  | "insulin"
  | "levothyroxine"
  | "oral-contraceptive"
  | "immunosuppressant"
  | "chemotherapy"
  | "antiepileptic"
  | "lithium"
  | "triptan"
  | "antibiotic-macrolide"
  | "antifungal-azole"
  | "hiv-antiretroviral"
  | "transplant-ciclosporin"
  ;

export interface DrugInfo {
  id: DrugClass;
  label: string;
  /** Example members — used for search/alias matching. */
  examples: string[];
  /** Herb tags this drug amplifies or conflicts with. */
  conflictingTags: HerbTag[];
  /** Additional herb keyword match → specific warning. */
  specific?: Array<{
    herb: string;   // lowercase substring
    severity: Severity;
    note: string;
  }>;
  /** A one-line clinical note to show on top of any tag-based warning. */
  summary: string;
}

export const DRUGS: DrugInfo[] = [
  {
    id: "ssri",
    label: "SSRI antidepressant",
    examples: ["fluoxetine", "sertraline", "citalopram", "escitalopram", "paroxetine", "prozac", "zoloft", "lexapro", "celexa", "paxil"],
    conflictingTags: ["serotonergic"],
    specific: [
      { herb: "st john", severity: "danger", note: "Do not combine SSRIs with St John's Wort — serotonin-syndrome risk." },
      { herb: "5-htp", severity: "danger", note: "5-HTP + SSRI is a classic serotonin-syndrome combination." },
      { herb: "rhodiola", severity: "caution", note: "Rhodiola is mildly serotonergic — limit dose on SSRIs." }
    ],
    summary: "SSRIs increase synaptic serotonin. Stack with other serotonergic herbs and serotonin syndrome (confusion, tremor, hyperthermia) becomes a real risk."
  },
  {
    id: "maoi",
    label: "MAOI",
    examples: ["phenelzine", "tranylcypromine", "selegiline", "moclobemide", "nardil", "parnate"],
    conflictingTags: ["serotonergic", "stimulant", "hypertensive"],
    specific: [
      { herb: "yohimbe", severity: "danger", note: "Yohimbe + MAOI is a hypertensive-crisis risk." },
      { herb: "ma huang", severity: "danger", note: "Ephedra + MAOI: severe hypertensive crisis risk." },
      { herb: "st john", severity: "danger", note: "SJW + MAOI: serotonin syndrome risk." }
    ],
    summary: "MAOIs dangerously amplify anything sympathomimetic or serotonergic. Hypertensive and serotonergic crises have caused deaths."
  },
  {
    id: "tricyclic",
    label: "Tricyclic antidepressant",
    examples: ["amitriptyline", "nortriptyline", "clomipramine", "imipramine", "doxepin"],
    conflictingTags: ["serotonergic", "sedative-cns", "anticoagulant"],
    summary: "TCAs are serotonergic and sedating; combining with sedative herbs or St John's Wort increases both CNS depression and serotonin load."
  },
  {
    id: "benzodiazepine",
    label: "Benzodiazepine",
    examples: ["diazepam", "lorazepam", "alprazolam", "clonazepam", "temazepam", "valium", "ativan", "xanax", "klonopin"],
    conflictingTags: ["sedative-cns"],
    summary: "Benzodiazepines are strong CNS depressants. Stacking with sedative herbs markedly increases drowsiness, ataxia, and respiratory depression."
  },
  {
    id: "opioid",
    label: "Opioid analgesic",
    examples: ["oxycodone", "hydrocodone", "morphine", "fentanyl", "codeine", "tramadol", "buprenorphine", "methadone", "percocet", "vicodin"],
    conflictingTags: ["sedative-cns", "serotonergic"],
    specific: [
      { herb: "kratom", severity: "danger", note: "Opioids + kratom: additive respiratory depression; a recognised cause of overdose deaths." }
    ],
    summary: "Opioids depress breathing. Sedative herbs add to that depression. Tramadol and methadone are additionally serotonergic."
  },
  {
    id: "sedative-hypnotic",
    label: "Sleep medication (Z-drug / barbiturate)",
    examples: ["zolpidem", "eszopiclone", "zaleplon", "ambien", "lunesta", "phenobarbital"],
    conflictingTags: ["sedative-cns"],
    summary: "Sedative-hypnotics stack heavily with sedative herbs and alcohol — respiratory depression risk."
  },
  {
    id: "stimulant-rx",
    label: "Prescription stimulant (ADHD)",
    examples: ["methylphenidate", "amphetamine", "lisdexamfetamine", "dexmethylphenidate", "adderall", "ritalin", "vyvanse", "concerta"],
    conflictingTags: ["stimulant", "hypertensive"],
    summary: "Amphetamines and methylphenidate raise BP and heart rate. Stacking with ephedra, yohimbe, or caffeine herbs risks arrhythmia and hypertensive spikes."
  },
  {
    id: "warfarin",
    label: "Warfarin",
    examples: ["warfarin", "coumadin"],
    conflictingTags: ["anticoagulant"],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW induces CYP2C9 → reduces warfarin levels → clot risk." },
      { herb: "ginseng", severity: "caution", note: "Ginseng may raise or lower INR unpredictably." },
      { herb: "dong quai", severity: "caution", note: "Dong quai strongly potentiates warfarin (contains coumarins)." }
    ],
    summary: "Warfarin has a narrow therapeutic window. Many herbs shift INR — any blend needs INR monitoring if warfarin is active."
  },
  {
    id: "antiplatelet",
    label: "Antiplatelet (aspirin / clopidogrel)",
    examples: ["aspirin", "clopidogrel", "ticagrelor", "prasugrel", "plavix", "brilinta"],
    conflictingTags: ["anticoagulant"],
    summary: "Antiplatelets + anticoagulant herbs (ginkgo, garlic, ginger, feverfew, turmeric) raise bleeding risk, especially pre-surgery."
  },
  {
    id: "doac",
    label: "DOAC (apixaban / rivaroxaban / dabigatran)",
    examples: ["apixaban", "rivaroxaban", "dabigatran", "edoxaban", "eliquis", "xarelto", "pradaxa"],
    conflictingTags: ["anticoagulant"],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW reduces DOAC levels — stroke/clot risk." }
    ],
    summary: "DOAC levels are CYP3A4/P-gp dependent — SJW and some other inducers drop drug levels; anticoagulant herbs raise bleeding risk."
  },
  {
    id: "nsaid",
    label: "NSAID (ibuprofen, naproxen, etc.)",
    examples: ["ibuprofen", "naproxen", "diclofenac", "celecoxib", "meloxicam", "advil", "aleve"],
    conflictingTags: ["anticoagulant"],
    summary: "NSAIDs add to bleeding risk and GI injury when stacked with antiplatelet herbs or licorice."
  },
  {
    id: "acetaminophen",
    label: "Acetaminophen / paracetamol",
    examples: ["acetaminophen", "paracetamol", "tylenol", "panadol"],
    conflictingTags: ["hepatotoxic"],
    summary: "Acetaminophen is metabolised to hepatotoxic NAPQI. Combining with hepatotoxic herbs (kava, comfrey, chaparral) magnifies liver injury risk."
  },
  {
    id: "antihypertensive",
    label: "Blood-pressure medication",
    examples: ["lisinopril", "amlodipine", "losartan", "atenolol", "metoprolol", "ramipril", "valsartan", "enalapril"],
    conflictingTags: ["hypotensive", "hypertensive"],
    specific: [
      { herb: "licorice", severity: "danger", note: "Licorice opposes antihypertensives and raises BP — avoid." }
    ],
    summary: "Hypotensive herbs can cause excessive BP drop; hypertensive herbs (licorice, ephedra) undermine the drug entirely."
  },
  {
    id: "diuretic-loop",
    label: "Loop / thiazide diuretic",
    examples: ["furosemide", "hydrochlorothiazide", "bumetanide", "lasix", "hctz"],
    conflictingTags: ["hypotensive", "hypertensive"],
    specific: [
      { herb: "licorice", severity: "danger", note: "Licorice + loop/thiazide diuretic = severe hypokalemia risk." }
    ],
    summary: "Diuretic herbs stack; licorice with any potassium-wasting diuretic is a dangerous combination."
  },
  {
    id: "diuretic-potassium-sparing",
    label: "Potassium-sparing diuretic",
    examples: ["spironolactone", "eplerenone", "amiloride"],
    conflictingTags: ["hypotensive"],
    summary: "Potassium-sparing diuretics + high-potassium herbs or ACE inhibitor-like actions can cause hyperkalemia."
  },
  {
    id: "digoxin",
    label: "Digoxin",
    examples: ["digoxin", "lanoxin"],
    conflictingTags: ["hypertensive"],
    specific: [
      { herb: "licorice", severity: "danger", note: "Licorice-induced hypokalemia increases digoxin toxicity." },
      { herb: "st john", severity: "danger", note: "SJW lowers digoxin levels — loss of effect." },
      { herb: "hawthorn", severity: "caution", note: "Hawthorn shares some digoxin-like actions; combining is not recommended without monitoring." }
    ],
    summary: "Digoxin has a very narrow window and many herb interactions — almost any herbal cardiotonic or licorice is a problem."
  },
  {
    id: "statin",
    label: "Statin (cholesterol)",
    examples: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lipitor", "crestor"],
    conflictingTags: ["hepatotoxic"],
    specific: [
      { herb: "red yeast rice", severity: "danger", note: "Red yeast rice contains natural statins — additive statin dose." },
      { herb: "st john", severity: "caution", note: "SJW induces CYP3A4 — may reduce simvastatin/atorvastatin levels." }
    ],
    summary: "Statin myopathy and hepatotoxicity can be amplified by hepatotoxic herbs and compounded by red yeast rice."
  },
  {
    id: "antidiabetic",
    label: "Oral antidiabetic",
    examples: ["metformin", "glipizide", "glyburide", "sitagliptin", "empagliflozin", "januvia", "jardiance"],
    conflictingTags: ["hypoglycemic"],
    summary: "Several herbs lower blood sugar (cinnamon, fenugreek, bitter melon, gymnema, berberine). Stacking with oral antidiabetics risks hypoglycemia — monitor glucose."
  },
  {
    id: "insulin",
    label: "Insulin",
    examples: ["insulin", "lantus", "humalog", "novolog", "levemir", "tresiba"],
    conflictingTags: ["hypoglycemic"],
    summary: "On insulin, hypoglycemic herbs can cause severe low blood sugar. Any dosing change needs medical supervision."
  },
  {
    id: "levothyroxine",
    label: "Levothyroxine (thyroid)",
    examples: ["levothyroxine", "synthroid", "levoxyl", "eltroxin"],
    conflictingTags: [],
    specific: [
      { herb: "ashwagandha", severity: "caution", note: "Ashwagandha can raise thyroid hormone levels — monitor TSH on levothyroxine." },
      { herb: "soy", severity: "caution", note: "Soy reduces levothyroxine absorption — separate by 4 hr." },
      { herb: "bladderwrack", severity: "caution", note: "Kelp / bladderwrack iodine intake can destabilise thyroid dosing." }
    ],
    summary: "Several herbs perturb thyroid hormone levels or absorption — have TSH rechecked if you start ashwagandha or add soy/kelp."
  },
  {
    id: "oral-contraceptive",
    label: "Oral contraceptive / hormonal birth control",
    examples: ["ethinyl estradiol", "drospirenone", "levonorgestrel", "yaz", "yasmin", "microgynon"],
    conflictingTags: [],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW induces CYP3A4 → reduces OC levels → contraceptive failure." }
    ],
    summary: "St John's Wort is a well-documented cause of oral-contraceptive failure. A few other CYP3A4-inducing herbs (rifampin-adjacent) also matter."
  },
  {
    id: "immunosuppressant",
    label: "Immunosuppressant",
    examples: ["tacrolimus", "mycophenolate", "azathioprine", "prograf", "cellcept"],
    conflictingTags: [],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW drops tacrolimus/ciclosporin levels — documented graft rejection." },
      { herb: "echinacea", severity: "caution", note: "Echinacea is immunostimulant — counterproductive with immunosuppression." }
    ],
    summary: "Transplant recipients should assume every herb needs pharmacist sign-off; CYP3A4 inducers have caused graft loss."
  },
  {
    id: "chemotherapy",
    label: "Chemotherapy",
    examples: ["cisplatin", "carboplatin", "doxorubicin", "paclitaxel", "cyclophosphamide", "tamoxifen"],
    conflictingTags: ["anticoagulant", "hepatotoxic"],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW induces CYP3A4 — lowers levels of many chemo agents (irinotecan, imatinib, docetaxel)." },
      { herb: "grapefruit", severity: "caution", note: "Grapefruit inhibits CYP3A4 — opposite problem; raises levels of the same drugs." }
    ],
    summary: "Chemotherapy regimens are narrow-window and highly CYP3A4-dependent. Any herb should be cleared with the oncology pharmacist first."
  },
  {
    id: "antiepileptic",
    label: "Antiepileptic",
    examples: ["phenytoin", "carbamazepine", "valproate", "lamotrigine", "levetiracetam", "keppra"],
    conflictingTags: ["sedative-cns", "hepatotoxic"],
    specific: [
      { herb: "evening primrose", severity: "caution", note: "Evening primrose may lower seizure threshold." },
      { herb: "ginkgo", severity: "caution", note: "Ginkgo has been linked to rare seizure reports at high doses." }
    ],
    summary: "AED levels are narrow-window; several herbs induce or inhibit their metabolism, and a few are epileptogenic."
  },
  {
    id: "lithium",
    label: "Lithium",
    examples: ["lithium", "lithobid"],
    conflictingTags: ["hypotensive"],
    specific: [
      { herb: "psyllium", severity: "caution", note: "Psyllium may reduce lithium absorption." }
    ],
    summary: "Lithium clearance depends on renal sodium handling. Diuretic and BP-affecting herbs can shift levels into toxicity."
  },
  {
    id: "triptan",
    label: "Triptan (migraine)",
    examples: ["sumatriptan", "rizatriptan", "zolmitriptan", "imitrex", "maxalt"],
    conflictingTags: ["serotonergic"],
    summary: "Triptans are 5-HT agonists. Combining with serotonergic herbs or SSRIs risks serotonin syndrome."
  },
  {
    id: "antibiotic-macrolide",
    label: "Macrolide antibiotic",
    examples: ["erythromycin", "clarithromycin", "azithromycin", "biaxin", "zithromax"],
    conflictingTags: [],
    specific: [
      { herb: "grapefruit", severity: "caution", note: "Grapefruit + erythromycin/clarithromycin raises drug levels and QT risk." }
    ],
    summary: "Macrolides prolong QT and inhibit CYP3A4. Grapefruit and a few herbs stack with both effects."
  },
  {
    id: "antifungal-azole",
    label: "Azole antifungal",
    examples: ["ketoconazole", "itraconazole", "fluconazole", "voriconazole", "diflucan"],
    conflictingTags: ["hepatotoxic"],
    summary: "Azoles are hepatotoxic and strong CYP3A4 inhibitors — combining with hepatotoxic herbs is risky; they also amplify statins and benzodiazepines."
  },
  {
    id: "hiv-antiretroviral",
    label: "HIV antiretroviral",
    examples: ["tenofovir", "emtricitabine", "dolutegravir", "efavirenz", "biktarvy", "truvada"],
    conflictingTags: [],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW drops antiretroviral levels dramatically — documented treatment failure and resistance." },
      { herb: "african potato", severity: "caution", note: "Hypoxis / African potato may interact with ARVs (mixed evidence)." }
    ],
    summary: "ART regimens need rock-steady drug levels. CYP-inducing herbs have caused treatment failure. Consult an HIV pharmacist."
  },
  {
    id: "transplant-ciclosporin",
    label: "Ciclosporin",
    examples: ["ciclosporin", "cyclosporine", "neoral", "sandimmune"],
    conflictingTags: [],
    specific: [
      { herb: "st john", severity: "danger", note: "SJW + ciclosporin is a classic cause of graft rejection." },
      { herb: "grapefruit", severity: "caution", note: "Grapefruit raises ciclosporin levels — toxicity risk." }
    ],
    summary: "Ciclosporin is the textbook CYP3A4 substrate. Any inducer (SJW) or inhibitor (grapefruit, azoles) matters."
  }
];

const DRUG_BY_ID: Record<DrugClass, DrugInfo> = Object.fromEntries(
  DRUGS.map(d => [d.id, d])
) as Record<DrugClass, DrugInfo>;

export function getDrug(id: DrugClass): DrugInfo {
  return DRUG_BY_ID[id];
}

/**
 * Resolve a free-text drug query (brand or generic) to a DrugClass, if
 * we recognise it. Used by the "add medication" search input.
 */
export function resolveDrugQuery(q: string): DrugInfo[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return DRUGS;
  return DRUGS.filter(d =>
    d.label.toLowerCase().includes(needle) ||
    d.examples.some(e => e.toLowerCase().includes(needle))
  );
}
