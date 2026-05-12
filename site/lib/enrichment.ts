/**
 * Knowledge-enrichment tables that add "who / why / when / warnings / interactions /
 * affiliate" context to each remedy by matching on name.  This lets us surface
 * member-only detail without editing every markdown file.
 *
 * Extend this file over time; keys are matched case-insensitively against the
 * primary English name.
 */

export interface Enrichment {
  who?: string[];          // indications — people who benefit
  whoNot?: string[];       // contraindications
  why?: string;            // plain-language mechanism
  when?: string;           // timing / duration / season
  warnings?: string[];
  interactions?: string[];
  pairings?: string[];     // herbs that combine well
  constituents?: string[]; // active compounds (short list)
  partsUsed?: string[];
  taste?: string;          // Ayurvedic rasa / TCM flavor
  energetics?: string;     // warming / cooling / drying / moistening
  references?: string[];   // useful URLs
  affiliates?: {           // where to buy online
    label: string;
    url: string;          // full URL with ?tag= / ref= already embedded
    region?: string;
  }[];
}

/** Default affiliate suppliers by region — used when a remedy has no explicit affiliates. */
export const DEFAULT_SUPPLIERS: Record<string, { label: string; search: string }[]> = {
  India: [
    { label: "Banyan Botanicals (organic Ayurvedic)",  search: "https://www.banyanbotanicals.com/search?q=" },
    { label: "Kottakkal Arya Vaidya Sala",              search: "https://www.kottakkalstore.com/search?q=" },
    { label: "Organic India",                           search: "https://in.organicindiashop.com/search?q=" },
    { label: "Amazon India",                            search: "https://www.amazon.in/s?k=" }
  ],
  "Peru/Andes/Spanish": [
    { label: "Inkanatural (Peru)",                      search: "https://www.inkanat.com/?s=" },
    { label: "Amazon Andes Export",                     search: "https://www.amazonandes.com/catalogsearch/result/?q=" },
    { label: "Mountain Rose Herbs (US)",                search: "https://mountainroseherbs.com/search?q=" }
  ],
  China: [
    { label: "1stChineseHerbs",                          search: "https://www.1stchineseherbs.com/search.php?search_query=" },
    { label: "Plum Dragon Herbs",                        search: "https://plumdragonherbs.com/search?q=" },
    { label: "Kamwo Herbs",                              search: "https://kamwo.com/search?q=" }
  ],
  Japan: [
    { label: "Kenko.com (Japan)",                        search: "https://www.kenko.com/search/?q=" },
    { label: "iHerb (Kampo)",                            search: "https://www.iherb.com/search?kw=" },
    { label: "Amazon Japan",                             search: "https://www.amazon.co.jp/s?k=" }
  ],
  Global: [
    { label: "Mountain Rose Herbs",                      search: "https://mountainroseherbs.com/search?q=" },
    { label: "Starwest Botanicals",                      search: "https://www.starwest-botanicals.com/search/?search_query=" },
    { label: "iHerb",                                    search: "https://www.iherb.com/search?kw=" }
  ]
};

/** Case-insensitive key map. Keys should match remedy.name loosely. */
export const ENRICHMENTS: Record<string, Enrichment> = {
  "ashwagandha": {
    who: ["Chronic stress", "Poor sleep", "Burnout", "Low libido / male fertility", "Mild hypothyroid (with supervision)"],
    whoNot: ["Pregnancy", "Hyperthyroidism (unsupervised)", "Autoimmune flare", "Active liver disease", "Nightshade allergy"],
    why: "Withanolides down-regulate HPA-axis hyperactivity, reducing cortisol and supporting anabolic hormones. Clinical trials show reduced perceived stress and improved sleep onset.",
    when: "Take in the evening with warm milk or food. Typical course 8–12 weeks; take 2-week breaks periodically.",
    warnings: ["Can raise thyroid hormones", "Mild sedation - avoid before driving until known tolerance", "Rare reports of drug-induced liver injury"],
    interactions: ["Sedatives (benzos, alcohol)", "Levothyroxine", "Immunosuppressants", "BP and diabetes medications"],
    pairings: ["Brahmi (cognition)", "Shatavari (women's equivalent)", "Tulsi (adaptogen stack)"],
    constituents: ["Withanolides (2.5–5%)", "Withaferin A", "Alkaloids", "Saponins"],
    partsUsed: ["Root (preferred)", "Leaf (avoid chronic high doses)"],
    taste: "Bitter, astringent, sweet (post-digestive)",
    energetics: "Warming, moistening, grounding (vata↓, kapha↑ if excess)"
  },
  "turmeric": {
    who: ["Osteoarthritis / joint stiffness", "Chronic low-grade inflammation", "Post-workout recovery", "Mild depression (adjunct)"],
    whoNot: ["Active gallstones", "Bile duct obstruction", "2 weeks before surgery"],
    why: "Curcuminoids inhibit NF-κB and COX-2, reducing inflammatory cytokines. Bioavailability is low unless paired with piperine (black pepper) or fat.",
    when: "With meals containing fat. Therapeutic doses 500–1500 mg curcumin extract/day.",
    warnings: ["May lower blood sugar", "May increase bleeding risk", "High doses can irritate gut lining"],
    interactions: ["Warfarin, antiplatelets", "Diabetes medications", "Antacids / PPIs"],
    pairings: ["Black pepper (piperine)", "Ghee / fat for absorption", "Ginger for digestion"],
    constituents: ["Curcumin", "Desmethoxycurcumin", "Turmerones (in root)"],
    partsUsed: ["Rhizome"],
    taste: "Bitter, pungent, astringent",
    energetics: "Warming, drying"
  },
  "triphala": {
    who: ["Chronic constipation", "Sluggish digestion", "Daily detox / gut-microbiome maintenance", "Eye health (as eyewash)"],
    whoNot: ["Pregnancy (haritaki can be too strong)", "Acute diarrhea", "Severe dehydration"],
    why: "Three-fruit blend acts on bowel regulation (haritaki), rejuvenation/vitamin-C (amalaki), and drying/respiratory (bibhitaki). Modern studies show gut-microbiome modulation.",
    when: "½–1 tsp at bedtime in warm water. Safe for long-term daily use.",
    warnings: ["Loose stools if dose too high", "Avoid in active diarrhea"],
    interactions: ["May increase absorption of some medications — separate by 2 hr"],
    pairings: ["Psyllium for bulk", "Trikatu for digestive fire"],
    constituents: ["Tannins", "Gallic acid", "Vitamin C (amalaki)", "Anthraquinones"],
    taste: "Five of six rasas (all but salty)",
    energetics: "Tridoshic — balances vata, pitta, kapha"
  },
  "ginger": {
    who: ["Nausea (morning sickness, motion, chemo)", "Cold hands/feet", "Early cold with chills", "Dyspepsia / slow digestion"],
    whoNot: ["Active gastric ulcer", "Gallstones", "2 weeks before surgery"],
    why: "Gingerols and shogaols modulate serotonin 5-HT3 receptors (anti-nausea) and activate TRPV1 (warming). Pro-kinetic effect on stomach emptying.",
    when: "As needed, up to 4 g/day. Best fresh or as decoction.",
    warnings: ["Mild blood thinning at high doses", "Heartburn possible in sensitive individuals"],
    interactions: ["Warfarin", "Antiplatelets", "Diabetes meds"],
    pairings: ["Honey + lemon (colds)", "Turmeric (inflammation)", "Peppermint (digestion)"],
    constituents: ["Gingerols", "Shogaols", "Zingerone"],
    partsUsed: ["Fresh rhizome (sheng jiang)", "Dried (gan jiang — warmer)"],
    taste: "Pungent, sweet (post-digestive)",
    energetics: "Warming"
  },
  "tulsi": {
    who: ["Recurrent respiratory infections", "Stress + poor sleep", "Blood-sugar swings", "Daily immune tonic"],
    whoNot: ["Pregnancy (high doses)", "Trying to conceive (may reduce fertility)", "Anticoagulant therapy"],
    why: "Eugenol and ursolic acid are adaptogenic, antimicrobial, and anti-inflammatory. COX-2 inhibition and cortisol modulation.",
    when: "Daily as tea; morning or evening. 2–3 cups/day.",
    warnings: ["May lower fertility with long-term high doses", "Mild blood thinning"],
    interactions: ["Anticoagulants", "Diabetes medications"],
    pairings: ["Ginger + honey (colds)", "Ashwagandha (stress)"],
    taste: "Pungent, bitter",
    energetics: "Warming, slightly drying"
  },
  "ginseng": {
    who: ["Chronic fatigue", "Post-illness recovery", "Age-related cognitive decline", "Type-2 diabetes adjunct"],
    whoNot: ["Uncontrolled hypertension", "Acute infection with fever", "Insomnia/anxiety (Asian ginseng too stimulating)", "Hormone-sensitive cancers"],
    why: "Ginsenosides modulate HPA-axis, improve insulin sensitivity, enhance NO-mediated vasodilation, and show neuroprotective effects.",
    when: "Morning, with food. Courses of 8–12 weeks with breaks.",
    warnings: ["Can cause insomnia, headache, palpitations"],
    interactions: ["Warfarin", "MAOIs", "Stimulants", "Antidiabetic drugs"],
    pairings: ["Astragalus (immune)", "Licorice (harmonizer)", "Goji (yin balance)"],
    constituents: ["Ginsenosides Rb1, Rg1, Re"],
    taste: "Sweet, slightly bitter",
    energetics: "Warming (Asian), cooling (American)"
  },
  "reishi": {
    who: ["Chronic stress + immune fatigue", "Insomnia with anxiety", "Adjunct oncology (with MD)", "Liver support"],
    whoNot: ["Anticoagulant therapy", "Before surgery", "Mushroom allergy"],
    why: "Triterpenes and beta-glucans modulate NK-cell activity and down-regulate sympathetic tone; GABA-ergic effects support sleep.",
    when: "Evening with food. 1–5 g dried/day.",
    warnings: ["Can cause dry mouth, nosebleeds, GI upset"],
    interactions: ["Anticoagulants", "Immunosuppressants", "Hypotensives"],
    pairings: ["Cordyceps (stamina)", "Lion's mane (cognition)"],
    constituents: ["Beta-glucans", "Triterpenes (ganoderic acids)", "Ling Zhi-8 protein"],
    taste: "Bitter",
    energetics: "Neutral, slightly cooling"
  },
  "echinacea": {
    who: ["Onset of cold or flu", "Upper respiratory infections", "Wound healing (topical)"],
    whoNot: ["Autoimmune disease", "Long-term daily use (> 10 days)", "Ragweed allergy"],
    why: "Alkylamides bind CB2 receptors; polysaccharides stimulate macrophage activity. Best effect at symptom onset.",
    when: "At first symptom; high dose 3–5× daily for 7–10 days, then stop.",
    warnings: ["Rash in ragweed-sensitive individuals"],
    interactions: ["Immunosuppressants", "Caffeine (slows metabolism)"],
    pairings: ["Elderberry", "Goldenseal (short-term)"],
    constituents: ["Alkylamides", "Echinacoside", "Polysaccharides"],
    taste: "Pungent, tingling",
    energetics: "Cooling"
  },
  "elderberry": {
    who: ["Flu / cold symptom reduction", "Recurrent URTIs", "Immune prep in winter"],
    whoNot: ["Autoimmune flare", "Pregnancy (syrup usually OK; avoid raw berries/plant)"],
    why: "Anthocyanins block viral hemagglutinin; trials show ~2-day reduction in flu duration.",
    when: "1 tbsp syrup 3–4× daily during acute illness; 1 tbsp daily for prevention (short courses).",
    warnings: ["Never consume raw berries, bark, or leaves — contain cyanogenic glycosides"],
    interactions: ["Immunosuppressants", "Diuretics (theoretical)"],
    pairings: ["Zinc + vitamin C", "Echinacea"],
    constituents: ["Anthocyanins", "Quercetin", "Sambucus proteins"],
    taste: "Tart, sweet",
    energetics: "Cooling"
  },
  "maca": {
    who: ["Low libido", "Menopausal symptoms", "Athletic stamina", "Mood support"],
    whoNot: ["Hormone-sensitive cancers (caution)", "Thyroid disease (goitrogen concern — cook/gelatinize)"],
    why: "Macamides and macaenes modulate hypothalamic function; not phytoestrogenic. Improves sexual function and mood in trials.",
    when: "Morning or mid-day. 1.5–3 g/day gelatinized powder.",
    warnings: ["Raw maca contains goitrogens — choose gelatinized"],
    interactions: ["Hormone therapy (theoretical)"],
    pairings: ["Cacao (traditional Andean)", "Lepidium varieties: red (women), black (men), yellow (general)"],
    constituents: ["Macamides", "Macaenes", "Glucosinolates"],
    taste: "Nutty, earthy",
    energetics: "Warming"
  },
  "aloe vera": {
    who: ["Minor burns", "Dry skin / eczema", "Constipation (inner leaf, short term)", "Gastritis (inner gel)"],
    whoNot: ["Pregnancy (oral)", "Children oral", "IBD flare", "Kidney disease (oral)"],
    why: "Acemannan polysaccharide stimulates fibroblasts and healing; anthraquinones in outer rind are a stimulant laxative.",
    when: "Topical as needed; oral ≤ 2 weeks, inner fillet only.",
    warnings: ["Latex (yellow sap) can cause electrolyte imbalance and dependency"],
    interactions: ["Diuretics (potassium loss)", "Digoxin", "Diabetes meds"],
    taste: "Bitter",
    energetics: "Cooling"
  },
  "garlic": {
    who: ["High blood pressure", "Elevated cholesterol", "Recurrent infections", "Cardiovascular protection"],
    whoNot: ["Anticoagulant therapy", "2 weeks before surgery", "Active GI ulcer"],
    why: "Allicin (formed when crushed) is antimicrobial; long-term intake reduces BP ~8 mmHg and LDL modestly.",
    when: "Crush, rest 10 min, consume with food. 1–2 cloves/day.",
    warnings: ["GI upset, reflux", "Bleeding risk with NSAIDs"],
    interactions: ["Warfarin", "Antiplatelets", "HIV protease inhibitors", "Cyclosporine"],
    constituents: ["Allicin", "Ajoene", "S-allyl cysteine"],
    taste: "Pungent",
    energetics: "Warming"
  }
};

export function enrichmentFor(name: string): Enrichment | undefined {
  const k = name.toLowerCase().split("/")[0].trim();
  return ENRICHMENTS[k] ??
    Object.entries(ENRICHMENTS).find(([key]) => k.includes(key) || key.includes(k))?.[1];
}
