/**
 * Body-region ontology. Each region owns a set of symptom tags
 * (which already exist in the content layer) plus a free-text keyword list
 * to catch everything the tag system misses.
 *
 * Pure data module — safe to import from client components.
 * Server-only matching logic lives in ./bodyMapServer.ts.
 */
export type BodyRegion =
  | "head"     | "throat"  | "chest"   | "heart"
  | "stomach"  | "liver"   | "gut"     | "pelvis"
  | "skin"     | "joints"  | "energy"  | "sleep";

export interface BodyRegionDef {
  id: BodyRegion;
  label: string;
  blurb: string;
  /** Symptom tags from content.ts SYMPTOM_KEYWORDS */
  symptoms: string[];
  /** Free-text fallback keywords */
  keywords: string[];
}

export const BODY_REGIONS: BodyRegionDef[] = [
  { id: "head",    label: "Head & mind",  blurb: "Headaches, tension, focus, memory.",
    symptoms: ["Sleep & Anxiety"],
    keywords: ["headache", "migraine", "focus", "memory", "cognitive", "brain", "tension"] },

  { id: "throat",  label: "Throat & sinuses", blurb: "Sore throat, congestion, cough.",
    symptoms: ["Cough & Respiratory"],
    keywords: ["throat", "sinus", "hoarse", "tonsil"] },

  { id: "chest",   label: "Chest & lungs", blurb: "Cough, asthma, bronchitis.",
    symptoms: ["Cough & Respiratory"],
    keywords: ["lung", "bronch", "asthma", "breath", "wheez"] },

  { id: "heart",   label: "Heart & circulation", blurb: "Blood pressure, cholesterol, palpitations.",
    symptoms: ["Heart & BP"],
    keywords: ["heart", "cardiac", "palpitation", "circulation", "cholesterol", "vein"] },

  { id: "stomach", label: "Stomach",       blurb: "Nausea, reflux, appetite.",
    symptoms: ["Digestion"],
    keywords: ["nausea", "reflux", "ulcer", "stomach", "appetite"] },

  { id: "liver",   label: "Liver & detox", blurb: "Jaundice, detox, hangover, sluggish bile.",
    symptoms: ["Liver & Detox"],
    keywords: ["liver", "bile", "jaundice", "gallbladder", "hangover"] },

  { id: "gut",     label: "Gut & bowels",  blurb: "Bloating, IBS, constipation, diarrhoea.",
    symptoms: ["Digestion"],
    keywords: ["bowel", "ibs", "constip", "diarr", "bloat", "colon", "intestin"] },

  { id: "pelvis",  label: "Pelvis & reproduction", blurb: "Cycles, menopause, fertility, libido.",
    symptoms: ["Women's Health", "Men's Vitality"],
    keywords: ["uterus", "ovar", "menstrual", "menopause", "fertil", "prostate", "libido", "pms"] },

  { id: "skin",    label: "Skin",          blurb: "Eczema, acne, wounds, psoriasis.",
    symptoms: ["Skin"],
    keywords: ["skin", "eczema", "acne", "psoria", "wound", "burn", "rash"] },

  { id: "joints",  label: "Joints & muscles", blurb: "Arthritis, back pain, stiffness.",
    symptoms: ["Joints & Pain"],
    keywords: ["joint", "arthrit", "back", "muscle", "rheum", "stiff", "cramp"] },

  { id: "energy",  label: "Energy & immunity", blurb: "Fatigue, adaptogens, immune support.",
    symptoms: ["Immunity & Fatigue", "Blood Sugar"],
    keywords: ["fatigue", "adaptogen", "immun", "energy", "adrenal", "chronic"] },

  { id: "sleep",   label: "Sleep & nerves", blurb: "Insomnia, anxiety, stress.",
    symptoms: ["Sleep & Anxiety"],
    keywords: ["sleep", "insomnia", "anxiety", "stress", "calm", "sedative", "nerve"] }
];

export const BODY_REGION_BY_ID = new Map(BODY_REGIONS.map(r => [r.id, r]));
