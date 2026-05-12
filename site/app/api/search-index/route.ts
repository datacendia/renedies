import { NextResponse } from "next/server";
import { getAllRemedies, REGIONS } from "@/lib/content";

/**
 * Lightweight search index consumed by the global command palette.
 * Builds once per deploy; cached aggressively on the edge.
 */
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const remedies = getAllRemedies().map(r => ({
    kind: "remedy" as const,
    slug: r.slug,
    name: r.name,
    latin: r.latin ?? "",
    region: r.region,
    benefit: r.benefit ?? "",
    url: `/encyclopedia/${r.slug}`
  }));

  const pages = [
    { kind: "page", name: "Home",                       url: "/",            hint: "Landing" },
    { kind: "page", name: "Encyclopedia",               url: "/encyclopedia", hint: "Full library" },
    { kind: "page", name: "Taste & energetics compass", url: "/compass",     hint: "Radial selector" },
    { kind: "page", name: "Body-map symptom finder",    url: "/body-map",    hint: "Tap a region" },
    { kind: "page", name: "Cross-tradition compare",    url: "/compare",     hint: "Five traditions" },
    { kind: "page", name: "Herb relationship graph",    url: "/graph",       hint: "Force-directed" },
    { kind: "page", name: "Recipe builder",             url: "/recipe",      hint: "Drag-drop blends" },
    { kind: "page", name: "Guided rituals",             url: "/rituals",     hint: "Step timers" },
    { kind: "page", name: "Seasonal dashboard",         url: "/seasonal",    hint: "Harvest calendar" },
    { kind: "page", name: "Find-your-remedy quiz",      url: "/quiz",        hint: "3 questions" },
    { kind: "page", name: "Your practice",              url: "/me",          hint: "Streaks & saved" },
    { kind: "page", name: "Favorites",                  url: "/favorites",   hint: "Saved remedies" },
    { kind: "page", name: "Medical disclaimer",         url: "/disclaimer",  hint: "Legal" }
  ] as const;

  const regions = REGIONS.map(r => ({
    kind: "region" as const,
    name: r,
    url: `/browse?region=${encodeURIComponent(r)}`,
    hint: "Browse region"
  }));

  return NextResponse.json(
    { pages, regions, remedies },
    { headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
