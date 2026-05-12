/**
 * Energetic properties for traditional lens (TCM, Ayurveda, Kampo).
 * These are SEPARATE from pharmacological safety warnings.
 * Energetic commentary is pedagogy, not pharmacovigilance.
 * These should be displayed in a different color family (purple/indigo) from safety warnings (red/amber/blue).
 */

export type EnergeticProperty = "warming" | "cooling" | "drying" | "moistening";

export interface EnergeticData {
  property: EnergeticProperty;
  tradition: "tcm" | "ayurveda" | "kampo" | "western";
  constitution: string; // e.g., "Pitta/Heat", "Vata/Cold", "Kapha/Damp"
  description: string;
  balancingHerb?: string; // Suggested herb to balance
}

const ENERGETIC_PROPS: Record<string, EnergeticData[]> = {
  "clove": [
    {
      property: "warming",
      tradition: "ayurveda",
      constitution: "Pitta/Heat",
      description: "Highly warming; increases pitta. Avoid in heat-type conditions.",
      balancingHerb: "licorice or mint",
    },
  ],
  "black pepper": [
    {
      property: "warming",
      tradition: "ayurveda",
      constitution: "Pitta/Heat",
      description: "Warming and stimulating; increases agni. Use sparingly in summer.",
      balancingHerb: "coriander or fennel",
    },
  ],
  "cayenne": [
    {
      property: "warming",
      tradition: "tcm",
      constitution: "Pitta/Heat",
      description: "Very hot dispersing; clears cold but may damage yin.",
      balancingHerb: "licorice or chrysanthemum",
    },
  ],
  "ginger": [
    {
      property: "warming",
      tradition: "tcm",
      constitution: "Pitta/Heat",
      description: "Warm and acrid; disperses cold and damp. Avoid in yin deficiency.",
      balancingHerb: "licorice or mint",
    },
  ],
  "mint": [
    {
      property: "cooling",
      tradition: "tcm",
      constitution: "Vata/Cold",
      description: "Cooling and aromatic; clears heat. Avoid in cold deficiency.",
      balancingHerb: "ginger or cinnamon",
    },
  ],
  "peppermint": [
    {
      property: "cooling",
      tradition: "ayurveda",
      constitution: "Vata/Cold",
      description: "Cooling; soothes pitta. Avoid in excess vata.",
      balancingHerb: "ginger or cardamom",
    },
  ],
  "coriander": [
    {
      property: "cooling",
      tradition: "ayurveda",
      constitution: "Vata/Cold",
      description: "Cooling; balances pitta. Good for summer.",
      balancingHerb: "ginger or black pepper",
    },
  ],
  "fennel": [
    {
      property: "cooling",
      tradition: "ayurveda",
      constitution: "Vata/Cold",
      description: "Cooling; balances all three doshas. Good for digestion.",
      balancingHerb: "ginger in cold weather",
    },
  ],
  "sage": [
    {
      property: "drying",
      tradition: "tcm",
      constitution: "Vata/Dry",
      description: "Drying and aromatic; clears damp. Avoid in yin deficiency.",
      balancingHerb: "licorice or marshmallow",
    },
  ],
  "thyme": [
    {
      property: "drying",
      tradition: "tcm",
      constitution: "Vata/Dry",
      description: "Drying; clears damp-phlegm. Avoid in dry conditions.",
      balancingHerb: "licorice or fenugreek",
    },
  ],
  "licorice": [
    {
      property: "moistening",
      tradition: "tcm",
      constitution: "Kapha/Damp",
      description: "Moistening and harmonizing; tonifies qi. Avoid in damp conditions.",
      balancingHerb: "thyme or sage",
    },
  ],
  "marshmallow": [
    {
      property: "moistening",
      tradition: "western",
      constitution: "Kapha/Damp",
      description: "Moistening and demulcent; soothes mucous membranes. Avoid in excess damp.",
      balancingHerb: "thyme or oregano",
    },
  ],
  "fenugreek": [
    {
      property: "moistening",
      tradition: "ayurveda",
      constitution: "Kapha/Damp",
      description: "Moistening; balances vata and kapha. Good for lactation.",
      balancingHerb: "thyme in damp conditions",
    },
  ],
};

export function energeticPropertiesFor(name: string): EnergeticData[] {
  const n = name.toLowerCase();
  const props: EnergeticData[] = [];
  
  for (const [keyword, data] of Object.entries(ENERGETIC_PROPS)) {
    if (n.includes(keyword)) {
      props.push(...data);
    }
  }
  
  return props;
}
