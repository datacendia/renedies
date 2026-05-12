/**
 * Guided ritual mode — step-by-step preparation walkthroughs.
 * Client-safe. Rituals are curated, not auto-generated, because sequencing
 * matters and timing must be precise.
 */

export interface RitualStep {
  title: string;
  body: string;       // instruction text
  seconds?: number;   // optional timer
}

export interface Ritual {
  slug: string;
  title: string;
  remedy: string;     // keyword to link to the encyclopedia
  region: string;
  duration: string;   // human-readable
  bestTime: string;   // when to do it
  why: string;        // one-line purpose
  steps: RitualStep[];
}

export const RITUALS: Ritual[] = [
  {
    slug: "morning-tulsi-tea",
    title: "Morning Tulsi Tea",
    remedy: "tulsi",
    region: "India",
    duration: "6 min",
    bestTime: "Within the first hour of waking",
    why: "Gently awakens digestion, clears night-accumulated kapha, calms mind.",
    steps: [
      { title: "Prepare the leaves",
        body: "Pluck 8–12 fresh tulsi leaves or measure 1 heaped tsp dried. Bruise them lightly between your palms to release the essential oils." },
      { title: "Heat the water",
        body: "Bring 250 ml of water to a gentle boil, then remove from heat. Let it cool for 30 seconds — tulsi is bitter when scalded.",
        seconds: 30 },
      { title: "Steep",
        body: "Add the leaves, cover, and steep for 4 minutes. Covering preserves the volatile aromatics.",
        seconds: 240 },
      { title: "Sit and sip",
        body: "Strain into your cup. Before the first sip, take three slow breaths. Drink warm over 5–8 minutes, ideally sitting, not walking. Notice the aroma change as it cools." }
    ]
  },
  {
    slug: "ginger-steam-for-colds",
    title: "Ginger Steam for Colds",
    remedy: "ginger",
    region: "Global",
    duration: "10 min",
    bestTime: "At the first sign of congestion, evening",
    why: "Opens sinuses, breaks up mucus, warms the lungs.",
    steps: [
      { title: "Slice the ginger",
        body: "Cut 30 g of fresh ginger root into coin-thin slices — no need to peel if organic." },
      { title: "Simmer, covered",
        body: "Add to 1 L water in a pot. Bring to a simmer and cover for 10 minutes.",
        seconds: 600 },
      { title: "Steam tent",
        body: "Transfer to a heat-safe bowl. Drape a large towel over your head and the bowl to make a tent. Close eyes. Breathe slowly through the nose if possible for 5 minutes. Stop if dizzy.",
        seconds: 300 },
      { title: "Wrap up",
        body: "Dry face and neck. Put on a warm layer and go straight to rest — the body's heat response continues for another hour." }
    ]
  },
  {
    slug: "evening-chamomile-ritual",
    title: "Evening Chamomile",
    remedy: "chamomile",
    region: "Global",
    duration: "8 min",
    bestTime: "90 minutes before intended sleep",
    why: "Relaxes the nervous system and signals the body it is time for rest.",
    steps: [
      { title: "Dim the lights",
        body: "Turn off overhead lights. The ritual begins before the water boils." },
      { title: "Measure",
        body: "2 heaped tsp of dried chamomile flowers into a cup or small pot." },
      { title: "Pour & steep",
        body: "Cover with 250 ml just-off-the-boil water. Cover the cup. Steep 5 minutes.",
        seconds: 300 },
      { title: "Drink slowly",
        body: "Hold the cup in both hands. Notice the warmth. Sip without reading, scrolling, or speaking for 3 minutes.",
        seconds: 180 }
    ]
  },
  {
    slug: "triphala-night-rinse",
    title: "Triphala Night Rinse",
    remedy: "triphala",
    region: "India",
    duration: "5 min",
    bestTime: "Bedtime, on an empty stomach",
    why: "Classical Ayurvedic bowel regulator and gentle eye/tissue cleanser.",
    steps: [
      { title: "Measure",
        body: "½ teaspoon of triphala powder (or 2 tablets crushed) into a mug." },
      { title: "Warm water",
        body: "Pour 200 ml of just-boiled water over the powder. Stir. Cool 2 minutes.",
        seconds: 120 },
      { title: "Honey (optional)",
        body: "Once cooled to drinkable, add ½ tsp raw honey — never honey to hot water (tradition says this creates ama). Stir." },
      { title: "Drink & rest",
        body: "Sip standing or seated, not lying down. Brush teeth afterwards — triphala is tannin-rich." }
    ]
  },
  {
    slug: "muna-altitude-infusion",
    title: "Muña Altitude Infusion",
    remedy: "muna",
    region: "Peru/Andes/Spanish",
    duration: "7 min",
    bestTime: "After meals or when feeling altitude or digestion symptoms",
    why: "Andean minty herb (Minthostachys mollis) — classical for digestive discomfort and soroche (altitude sickness).",
    steps: [
      { title: "Hand-bruise",
        body: "Take a small sprig of dried muña (~2 g) and rub between the hands until the aroma lifts." },
      { title: "Infuse",
        body: "Place in a cup, cover with hot water (~90 °C), cover the cup. Steep 5 minutes.",
        seconds: 300 },
      { title: "Sweeten (optional)",
        body: "Andean tradition sweetens with panela or chancaca (unrefined cane sugar) rather than honey." },
      { title: "Drink slowly",
        body: "Drink within 15 minutes while volatile oils are still active." }
    ]
  },
  {
    slug: "kampo-daily-decoction",
    title: "Daily Kampo Decoction",
    remedy: "kampo",
    region: "Japan",
    duration: "25 min",
    bestTime: "20 minutes before a main meal, morning or evening",
    why: "Traditional multi-herb Kampo formulas are decocted, not steeped — the method extracts deeper root & bark compounds.",
    steps: [
      { title: "Measure",
        body: "One prescribed sachet (~6–9 g) per day of herbs from your practitioner. Place in a clay or glass pot." },
      { title: "Soak",
        body: "Cover with 600 ml cold water. Allow to soak for 10 minutes — do not skip; this opens root tissue.",
        seconds: 600 },
      { title: "Simmer",
        body: "Bring to a gentle boil, then reduce heat. Simmer uncovered until liquid reduces to ~300 ml (roughly 15 min).",
        seconds: 900 },
      { title: "Strain in two doses",
        body: "Strain. Drink half warm now and save half for later in the day in a thermos. Kampo is drunk on an empty stomach." }
    ]
  }
];

export function getRitual(slug: string): Ritual | undefined {
  return RITUALS.find(r => r.slug === slug);
}
