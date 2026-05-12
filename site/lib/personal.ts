"use client";

/**
 * Personal practice log — purely client-side, stored in localStorage.
 *
 * Tracks:
 *  - ritual completions (with date)
 *  - streak of consecutive practice days
 *  - saved recipes from the recipe builder
 *
 * Server sync is intentionally omitted for v1 — this layer should feel
 * instant, private, and offline-first. When we add auth-gated cloud sync
 * later, this module becomes the source-of-truth for a simple JSON blob.
 */

const RIT_KEY = "remedia.rituals.v1";
const REC_KEY = "remedia.recipes.v1";

/* ─────────── Ritual log ─────────── */

export interface RitualLogEntry {
  slug: string;
  completedAt: number; // ms epoch
}

export function loadRitualLog(): RitualLogEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RIT_KEY) ?? "[]"); } catch { return []; }
}

export function logRitual(slug: string): RitualLogEntry[] {
  if (typeof window === "undefined") return [];
  const log = loadRitualLog();
  log.push({ slug, completedAt: Date.now() });
  // Cap at 500 entries to keep localStorage lean.
  const trimmed = log.slice(-500);
  localStorage.setItem(RIT_KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent("remedia:ritual-logged"));
  return trimmed;
}

/** Return unique YYYY-MM-DD strings for each practice day. */
function uniqueDays(log: RitualLogEntry[]): string[] {
  const days = new Set<string>();
  for (const e of log) {
    const d = new Date(e.completedAt);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    days.add(iso);
  }
  return [...days].sort();
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

/** Consecutive-day streak ending today (or yesterday — so a morning-only
 *  user keeps their streak until the end of the next day). */
export function currentStreak(log: RitualLogEntry[] = loadRitualLog()): number {
  const days = new Set(uniqueDays(log));
  if (days.size === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (days.has(iso)) streak++;
    else if (i === 0) continue; // allow "no practice today yet" to still show yesterday's streak
    else break;
  }
  return streak;
}

export function longestStreak(log: RitualLogEntry[] = loadRitualLog()): number {
  const days = uniqueDays(log);
  if (days.length === 0) return 0;
  let best = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur  = new Date(days[i]);
    const diff = (cur.getTime() - prev.getTime()) / 86400000;
    if (Math.round(diff) === 1) { run++; best = Math.max(best, run); }
    else run = 1;
  }
  return best;
}

/** Heatmap data for a given year: Map<YYYY-MM-DD, count>. */
export function heatmap(log: RitualLogEntry[] = loadRitualLog()): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of log) {
    const d = new Date(e.completedAt);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    m.set(iso, (m.get(iso) ?? 0) + 1);
  }
  return m;
}

/* ─────────── Saved recipes ─────────── */

export interface SavedRecipe {
  id: string;                              // uuid-lite
  title: string;
  createdAt: number;
  servings: number;
  ingredients: { slug: string; name: string; parts: number }[];
}

export function loadRecipes(): SavedRecipe[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(REC_KEY) ?? "[]"); } catch { return []; }
}

export function saveRecipe(r: Omit<SavedRecipe, "id" | "createdAt">): SavedRecipe {
  const rec: SavedRecipe = { ...r, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), createdAt: Date.now() };
  const all = loadRecipes();
  all.unshift(rec);
  localStorage.setItem(REC_KEY, JSON.stringify(all.slice(0, 100)));
  window.dispatchEvent(new CustomEvent("remedia:recipe-saved"));
  return rec;
}

export function deleteRecipe(id: string) {
  const all = loadRecipes().filter(r => r.id !== id);
  localStorage.setItem(REC_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("remedia:recipe-saved"));
}
