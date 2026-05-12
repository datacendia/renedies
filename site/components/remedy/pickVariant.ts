/**
 * Pure heuristic — kept outside the client-component file so it can be
 * called from server components without the "use client" boundary
 * swallowing the function.
 */

export type RemedyVariant = "monograph" | "formula" | "tonic";

export function pickVariant({
  name, recipe, benefit
}: { name: string; recipe?: string; benefit?: string }): RemedyVariant {
  const n = name.toLowerCase();
  const hay = `${recipe ?? ""} ${benefit ?? ""}`.toLowerCase();
  if (/tang|-to$|-san|rasayan|churna|formula|blend|decoction|kashaya|kwath|triphala|trikatu/.test(n + " " + hay)) {
    return "formula";
  }
  if (/adaptogen|tonic|rasayana|restor|longev|daily/.test(hay) || /ashwagandha|ginseng|reishi|shatavari|astragalus|gotu kola|tulsi/.test(n)) {
    return "tonic";
  }
  return "monograph";
}
