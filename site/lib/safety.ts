import safetyData from "@/data/safety.json";
import referencesData from "@/data/references.json";
import type { Remedy } from "./content";

export type SafetyFlag = "safe" | "caution" | "avoid" | "unknown";

export interface SafetyRecord {
  pregnancy: SafetyFlag;
  lactation: SafetyFlag;
  drugInteractions: string[];
  notes?: string;
}

export interface Reference {
  source: string;
  title: string;
  url: string;
  kind: "monograph" | "review" | "trial" | "database" | "book";
}

type SafetyEntry = SafetyRecord | { _alias: string };
type RawSafety = Record<string, SafetyEntry | string>;
type RawReferences = Record<string, Reference[] | { _alias: string } | string>;

const SAFETY = safetyData as unknown as RawSafety;
const REFERENCES = referencesData as unknown as RawReferences;

function normalize(s: string): string {
  return s.toLowerCase().replace(/[*_]/g, "").replace(/\s+/g, " ").trim();
}

/** Candidate lookup keys for a remedy, in priority order. */
function keysFor(r: Pick<Remedy, "name" | "latin">): string[] {
  const keys: string[] = [];
  if (r.latin) keys.push(normalize(r.latin));
  if (r.name) {
    const n = normalize(r.name);
    keys.push(n);
    // Strip leading numeric prefix ("12. Ashwagandha") if caller didn't already.
    const stripped = n.replace(/^\d+\.\s*/, "").split(/[\/—–-]/)[0].trim();
    if (stripped && stripped !== n) keys.push(stripped);
  }
  return keys;
}

function resolveAlias<T>(map: Record<string, unknown>, key: string, depth = 0): T | undefined {
  if (depth > 4) return undefined;
  const v = map[key];
  if (!v || typeof v === "string") return undefined;
  if (typeof v === "object" && "_alias" in (v as object)) {
    const alias = (v as { _alias: string })._alias;
    return resolveAlias<T>(map, alias, depth + 1);
  }
  return v as T;
}

/** Structured safety record, or null if not curated for this remedy. */
export function safetyFor(r: Pick<Remedy, "name" | "latin">): SafetyRecord | null {
  for (const k of keysFor(r)) {
    const hit = resolveAlias<SafetyRecord>(SAFETY as Record<string, unknown>, k);
    if (hit) return hit;
  }
  return null;
}

/** Curated references, or empty array if none. */
export function referencesFor(r: Pick<Remedy, "name" | "latin">): Reference[] {
  for (const k of keysFor(r)) {
    const hit = resolveAlias<Reference[]>(REFERENCES as Record<string, unknown>, k);
    if (hit) return hit;
  }
  return [];
}

export const FLAG_META: Record<SafetyFlag, { label: string; color: string; badgeClass: string; description: string }> = {
  safe: {
    label: "Generally safe",
    color: "#059669",
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    description: "Considered safe at traditional dietary or therapeutic amounts."
  },
  caution: {
    label: "Use with caution",
    color: "#d97706",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    description: "May be used under guidance, but has dose or context restrictions."
  },
  avoid: {
    label: "Avoid",
    color: "#dc2626",
    badgeClass: "bg-red-500/10 text-red-600 border-red-500/30",
    description: "Established contraindication; do not use without specialist supervision."
  },
  unknown: {
    label: "Insufficient data",
    color: "#6b7280",
    badgeClass: "bg-neutral-500/10 text-neutral-600 border-neutral-500/30",
    description: "No reliable human safety data. Treat as caution."
  }
};
