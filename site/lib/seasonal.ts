/**
 * Seasonal harvest & energetics calendar. Client-safe (pure data).
 *
 * Each entry lists herbs that are traditionally at peak availability or
 * therapeutic relevance in a given month & hemisphere. The keyword column
 * is used to link these entries to real remedies in our library.
 */

export type Hemisphere = "N" | "S";

export interface SeasonalHerb {
  name: string;      // display name (what the user sees)
  keyword: string;   // lowercase, matches remedy.name for linking
  slug?: string;     // optional direct slug mapping for image lookup
  why: string;       // one-line reason this plant belongs here
  category: "fruit" | "leaf" | "root" | "flower" | "bark" | "mushroom" | "seed";
}

export interface SeasonalMonth {
  month: number;          // 0-11
  label: string;
  focus: string;          // what the season asks of the body
  herbs: SeasonalHerb[];
}

/* ─────────── Northern-hemisphere calendar ─────────── */
const NH: SeasonalMonth[] = [
  { month: 0,  label: "January",   focus: "Deep immunity & warming kidney tonics",
    herbs: [
      { name: "Reishi",      keyword: "reishi",      slug: "global-2-reishi", why: "Immune modulation for winter",  category: "mushroom" },
      { name: "Astragalus",  keyword: "astragalus",  slug: "china-2-astragalus", why: "Wei-qi / defensive energy",     category: "root" },
      { name: "Elderberry",  keyword: "elder",       slug: "global-2-elderberry", why: "Preserved from autumn harvest", category: "fruit" },
      { name: "Ginger",      keyword: "ginger",      slug: "india-4-ginger", why: "Warms digestion in cold",       category: "root" }
    ] },
  { month: 1,  label: "February",  focus: "Lung & respiratory support",
    herbs: [
      { name: "Mullein",       keyword: "mullein",     slug: "global-24-mullein", why: "Lung demulcent",           category: "leaf" },
      { name: "Thyme",         keyword: "thyme",       slug: "global-5-thyme", why: "Antiseptic for coughs",    category: "leaf" },
      { name: "Licorice",      keyword: "licorice",    slug: "india-6-licorice", why: "Harmonising tonic",        category: "root" },
      { name: "Eucalyptus",    keyword: "eucalyptus",  slug: "global-58-eucalyptus", why: "Decongestant steam",       category: "leaf" }
    ] },
  { month: 2,  label: "March",     focus: "Liver cleansing — the body rouses",
    herbs: [
      { name: "Dandelion root", keyword: "dandelion",  slug: "global-17-dandelion", why: "Bitter, bile-moving",           category: "root" },
      { name: "Burdock",        keyword: "burdock",    slug: "japan-44-gob-burdock-root", why: "Blood purifier",                category: "root" },
      { name: "Milk thistle",   keyword: "milk thistle", slug: "global-16-milk-thistle", why: "Hepatoprotective",            category: "seed" },
      { name: "Nettle",         keyword: "nettle",     slug: "global-18-nettle", why: "Mineral-rich spring tonic",     category: "leaf" }
    ] },
  { month: 3,  label: "April",     focus: "Spring greens & gentle detox",
    herbs: [
      { name: "Nettle tops",   keyword: "nettle",      slug: "global-18-nettle", why: "Fresh spring leaves",      category: "leaf" },
      { name: "Cleavers",      keyword: "cleavers",    slug: "global-51-cleavers-global-weed", why: "Lymphatic mover",          category: "leaf" },
      { name: "Chickweed",     keyword: "chickweed",   slug: "global-52-chickweed-global-weed", why: "Cooling, cleansing",       category: "leaf" },
      { name: "Tulsi",         keyword: "tulsi",       slug: "india-11-tulsi", why: "Beginning of growing season", category: "leaf" }
    ] },
  { month: 4,  label: "May",       focus: "Flowers emerge — nervines & heart",
    herbs: [
      { name: "Hawthorn flower", keyword: "hawthorn",  slug: "global-21-hawthorn-european", why: "Heart tonic in bloom",   category: "flower" },
      { name: "Elderflower",     keyword: "elder",     slug: "global-2-elderberry", why: "Diaphoretic for fevers", category: "flower" },
      { name: "Rose",            keyword: "rose",      slug: "india-38-rose", why: "Heart & grief",          category: "flower" },
      { name: "Lavender",        keyword: "lavender",  slug: "global-8-lavender", why: "Cooling nervine",        category: "flower" }
    ] },
  { month: 5,  label: "June",      focus: "Peak sun — cooling herbs",
    herbs: [
      { name: "Peppermint",    keyword: "mint",        slug: "global-10-peppermint", why: "Cooling digestive",          category: "leaf" },
      { name: "Lemon balm",    keyword: "lemon balm",  slug: "global-60-lemon-balm", why: "Calming the summer heart",    category: "leaf" },
      { name: "Chamomile",     keyword: "chamomile",   slug: "global-9-chamomile", why: "Harvest the flowers daily",   category: "flower" },
      { name: "St John's wort", keyword: "st john",    slug: "global-13-st-john-s-wort", why: "Peaks at summer solstice",    category: "flower" }
    ] },
  { month: 6,  label: "July",      focus: "High heat — hydration & cooling",
    herbs: [
      { name: "Hibiscus",       keyword: "hibiscus",   slug: "global-38-hibiscus", why: "Tart, cooling infusion",   category: "flower" },
      { name: "Yarrow",         keyword: "yarrow",     slug: "global-19-yarrow", why: "Diaphoretic for heat",     category: "flower" },
      { name: "Plantain",       keyword: "plantain",   slug: "global-22-plantain", why: "Insect-bite poultice",     category: "leaf" },
      { name: "Calendula",      keyword: "calendula",  slug: "global-12-calendula", why: "Skin & sunburn",           category: "flower" }
    ] },
  { month: 7,  label: "August",    focus: "Late summer — gut & damp",
    herbs: [
      { name: "Oregano",        keyword: "oregano",    slug: "global-4-oregano", why: "Peak essential oil content", category: "leaf" },
      { name: "Bitter melon",   keyword: "bitter melon",slug: "india-22-bitter-gourd",why: "Summer's classical food-medicine", category: "fruit" },
      { name: "Fig leaf",       keyword: "fig",        slug: "global-53-fig-mediterranean", why: "Blood-sugar support",        category: "leaf" },
      { name: "Sage",           keyword: "sage",       slug: "global-7-sage", why: "Tonic for relaxed summer digestion", category: "leaf" }
    ] },
  { month: 8,  label: "September", focus: "Transition — immune priming",
    herbs: [
      { name: "Elderberry",    keyword: "elder",       slug: "global-2-elderberry", why: "Harvest for winter syrups", category: "fruit" },
      { name: "Rosehip",       keyword: "rosehip",     slug: "global-54-rosehip-global", why: "Vitamin-C reservoir",       category: "fruit" },
      { name: "Schisandra",    keyword: "schisandra",  slug: "global-59-schisandra", why: "Five-flavour adaptogen",    category: "fruit" },
      { name: "Turkey tail",   keyword: "turkey tail", slug: "global-55-turkey-tail-global-mushroom", why: "Autumn mushroom foray",     category: "mushroom" }
    ] },
  { month: 9,  label: "October",   focus: "Roots harvested — grounding & warming",
    herbs: [
      { name: "Ashwagandha",   keyword: "ashwagandha", slug: "india-1-ashwagandha", why: "Root, grounding adaptogen", category: "root" },
      { name: "Valerian",      keyword: "valerian",    slug: "global-14-valerian", why: "Root dug late",            category: "root" },
      { name: "Burdock root",  keyword: "burdock",     slug: "japan-44-gob-burdock-root", why: "Warming, nourishing",      category: "root" },
      { name: "Garlic",        keyword: "garlic",      slug: "global-3-garlic-mediterranean", why: "Cured autumn heads",        category: "root" }
    ] },
  { month: 10, label: "November",  focus: "Respiratory & warmth",
    herbs: [
      { name: "Ginger",        keyword: "ginger",      slug: "india-4-ginger", why: "Circulatory warmth",     category: "root" },
      { name: "Cinnamon",      keyword: "cinnamon",    slug: "india-8-cinnamon", why: "Blood sugar & warmth",   category: "bark" },
      { name: "Reishi",        keyword: "reishi",      slug: "global-2-reishi", why: "Shen tonic as nights darken", category: "mushroom" },
      { name: "Chaga",         keyword: "chaga",       slug: "global-56-chaga-northern-hemisphere", why: "Birch-bark winter ally",  category: "mushroom" }
    ] },
  { month: 11, label: "December",  focus: "Rest, tonify, reflect",
    herbs: [
      { name: "Ashwagandha",   keyword: "ashwagandha", slug: "india-1-ashwagandha", why: "Deep-winter rasayana",  category: "root" },
      { name: "Shatavari",     keyword: "shatavari",   slug: "india-14-shatavari", why: "Moistening in cold dryness", category: "root" },
      { name: "Ginger",        keyword: "ginger",      slug: "india-4-ginger", why: "Winter kitchen medicine", category: "root" },
      { name: "Clove",         keyword: "clove",       slug: "global-57-clove-indonesia", why: "Warming spice",           category: "flower" }
    ] }
];

// Southern hemisphere is the Northern calendar shifted by 6 months.
const SH: SeasonalMonth[] = NH.map((m, i) => ({
  ...NH[(i + 6) % 12],
  month: i,
  label: m.label
}));

export const SEASONAL_CALENDAR: Record<Hemisphere, SeasonalMonth[]> = { N: NH, S: SH };

export function currentSeasonalMonth(hemi: Hemisphere, date = new Date()): SeasonalMonth {
  return SEASONAL_CALENDAR[hemi][date.getMonth()];
}

export function nearbyMonths(hemi: Hemisphere, date = new Date()): SeasonalMonth[] {
  const m = date.getMonth();
  const cal = SEASONAL_CALENDAR[hemi];
  return [cal[(m + 11) % 12], cal[m], cal[(m + 1) % 12]];
}
