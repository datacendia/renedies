import { symptomsOf, type Remedy } from "./content";
import { BODY_REGION_BY_ID, type BodyRegion } from "./bodyMap";

/** Server-only matcher. Pulls in content.ts (node:fs) — do NOT import from a client component. */
export function matchRemedies(regionId: BodyRegion, all: Remedy[]): Remedy[] {
  const def = BODY_REGION_BY_ID.get(regionId);
  if (!def) return [];
  const out: Remedy[] = [];
  for (const r of all) {
    const tags = symptomsOf(r);
    if (def.symptoms.some(s => tags.includes(s))) { out.push(r); continue; }
    const hay = `${r.name} ${r.benefit ?? ""} ${r.recipe ?? ""}`.toLowerCase();
    if (def.keywords.some(k => hay.includes(k))) out.push(r);
  }
  return out;
}
