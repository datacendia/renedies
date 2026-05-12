import { getAllRemedies } from "../lib/content.js";
import { inferTastes, TASTES } from "../lib/energetics.js";

const all = getAllRemedies();
const counts: Record<string, number> = {};
for (const t of TASTES) counts[t] = 0;

const sourHits: { name: string; why: string }[] = [];
const SOUR = ["sour", "lemon", "lime", "tamarind", "amla", "vinegar", "hibiscus",
              "pomegranate", "cranberry", "plum", "umeboshi", "yoghurt", "yogurt",
              "kefir", "kombucha"];

for (const r of all) {
  const tastes = inferTastes(r);
  for (const t of tastes) counts[t]++;
  if (tastes.includes("sour")) {
    const hay = `${r.name} ${r.latin ?? ""} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
    const hit = SOUR.find(w => hay.includes(w)) ?? "?";
    sourHits.push({ name: r.name, why: hit });
  }
}

console.log("Total remedies:", all.length);
console.log("Taste counts:", counts);
console.log("\nSour-tagged remedies (top 40):");
for (const h of sourHits.slice(0, 40)) console.log(`  [${h.why}]  ${h.name}`);
console.log(`  … total sour: ${sourHits.length}`);

// Flag substring false-positives (the keyword appears mid-word)
console.log("\nPossible substring false-positives:");
for (const h of sourHits) {
  const kw = h.why;
  const hay = (all.find(r => r.name === h.name)?.name ?? "").toLowerCase();
  const full = `${h.name}`;
  if (kw !== "?" && kw.length <= 4) {
    // short keywords are most likely to false-positive
    console.log(`  short-kw "${kw}" →  ${full}`);
  }
}
