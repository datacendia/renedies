import type { EvidenceData } from "@/components/remedy/EvidencePanel";

/**
 * Load evidence data for a remedy by slug.
 * Returns null if no evidence file exists.
 */
export async function evidenceFor(slug: string): Promise<EvidenceData | null> {
  try {
    const data = await import(`@/data/evidence/${slug}.json`);
    return data.default as EvidenceData;
  } catch {
    return null;
  }
}
