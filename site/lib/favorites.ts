"use client";

/**
 * Local-only favorites (session/localStorage).
 *
 * When the user is logged in (Supabase), the hook in `components/FavoriteButton`
 * additionally syncs to the server via /api/favorites.
 */

const KEY = "remedia.favorites.v1";

export function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveFavorites(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify([...set]));
  window.dispatchEvent(new CustomEvent("remedia:favorites-changed"));
}

export function toggleFavorite(slug: string): Set<string> {
  const f = loadFavorites();
  if (f.has(slug)) f.delete(slug);
  else f.add(slug);
  saveFavorites(f);
  return f;
}
