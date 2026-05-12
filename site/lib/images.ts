import imagesData from "@/data/images.json";

export interface BotanicalImageRecord {
  title: string;
  description?: string;
  extract?: string;
  thumb?: string;
  thumbWidth?: number;
  thumbHeight?: number;
  full?: string;
  fullWidth?: number;
  fullHeight?: number;
  pageUrl: string;
  queriedAs?: string;
  fetched: string;
  missing?: boolean;
}

type ImagesMap = Record<string, BotanicalImageRecord | { missing: boolean; fetched: string }>;

const IMAGES = imagesData as unknown as ImagesMap;

/**
 * Fetch the cached Wikipedia image record for a remedy slug. Returns null
 * if never fetched, the lookup missed, or the record is malformed.
 */
export function imageFor(slug: string): BotanicalImageRecord | null {
  const hit = IMAGES[slug];
  if (!hit || "missing" in hit || !(hit as BotanicalImageRecord).thumb) return null;
  return hit as BotanicalImageRecord;
}
