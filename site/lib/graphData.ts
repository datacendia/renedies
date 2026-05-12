import { getAllRemedies, symptomsOf, type Remedy } from "./content";
import { profileOf } from "./energetics";

/**
 * Bipartite symptom-anchored graph.
 *
 * Primary structure: big "anchor" nodes are symptom concerns; herb nodes
 * connect to every concern they address. This turns what was a hairball into
 * a readable concept map — herbs cluster around the concerns they treat, and
 * herbs that bridge multiple concerns become visibly central.
 *
 * Secondary (toggleable) structure: herb↔herb edges on shared tastes and
 * shared energetics, used to overlay flavour/temperature affinity onto the
 * same canvas.
 *
 * Server-only (depends on content.ts).
 */

export type NodeKind = "herb" | "anchor";
export type EdgeKind = "symptom" | "taste" | "energetic";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  name: string;
  /** herb-only */
  region?: string;
  confidence?: string;
  tastes?: string[];
  energetics?: string[];
  symptoms?: string[];
  /** anchor-only: how many herbs attach to this anchor. */
  count?: number;
  /** total incident edges (all kinds) — used for label-size heuristic */
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  kind: EdgeKind;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Cap on herb nodes — keeps force simulation responsive. */
const MAX_HERBS = 140;
/** Shared-taste or shared-energetic threshold for herb↔herb overlay edges. */
const MIN_HERB_HERB_SHARED = 2;

export function buildRemedyGraph(): GraphData {
  const all = getAllRemedies();

  // Rank herbs by richness (symptom + taste + energetic profile).
  const scored = all.map(r => ({ r, score: scoreRichness(r) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_HERBS);

  const herbs: GraphNode[] = scored.map(({ r }) => {
    const p = profileOf(r);
    return {
      id: r.slug,
      kind: "herb",
      name: r.name,
      region: r.region,
      confidence: r.confidence,
      tastes: p.tastes,
      energetics: p.energetics,
      symptoms: symptomsOf(r),
      degree: 0
    };
  });

  // Anchor discovery — one anchor per symptom concern that has ≥ 3 herbs.
  const concernCounts = new Map<string, number>();
  for (const h of herbs) {
    for (const s of h.symptoms ?? []) {
      concernCounts.set(s, (concernCounts.get(s) ?? 0) + 1);
    }
  }
  const anchors: GraphNode[] = Array.from(concernCounts.entries())
    .filter(([, n]) => n >= 3)
    .map(([concern, n]) => ({
      id: anchorId(concern),
      kind: "anchor",
      name: concern,
      count: n,
      degree: n
    }));
  const anchorIds = new Set(anchors.map(a => a.id));

  const edges: GraphEdge[] = [];

  // Bipartite edges: herb → anchor for every symptom a herb addresses.
  for (const h of herbs) {
    for (const s of h.symptoms ?? []) {
      const aid = anchorId(s);
      if (!anchorIds.has(aid)) continue;
      edges.push({ source: h.id, target: aid, kind: "symptom", weight: 1 });
      h.degree++;
    }
  }

  // Overlay edges: herb ↔ herb on shared tastes (≥ 2) and on shared
  // energetics (≥ 2). Kept separate so the UI can solo each layer.
  for (let i = 0; i < herbs.length; i++) {
    for (let j = i + 1; j < herbs.length; j++) {
      const a = herbs[i], b = herbs[j];
      const sharedTaste = (a.tastes ?? []).filter(t => (b.tastes ?? []).includes(t)).length;
      if (sharedTaste >= MIN_HERB_HERB_SHARED) {
        edges.push({ source: a.id, target: b.id, kind: "taste", weight: sharedTaste });
        a.degree++; b.degree++;
      }
      const sharedEn = (a.energetics ?? []).filter(e => (b.energetics ?? []).includes(e)).length;
      if (sharedEn >= MIN_HERB_HERB_SHARED) {
        edges.push({ source: a.id, target: b.id, kind: "energetic", weight: sharedEn });
        a.degree++; b.degree++;
      }
    }
  }

  // Drop herbs with no edges at all.
  const connected = new Set(edges.flatMap(e => [e.source, e.target]));
  const nodes = [
    ...anchors.filter(a => connected.has(a.id)),
    ...herbs.filter(h => connected.has(h.id))
  ];

  return { nodes, edges };
}

function anchorId(concern: string): string {
  return "concern:" + concern.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function scoreRichness(r: Remedy): number {
  const p = profileOf(r);
  return symptomsOf(r).length * 2 + p.tastes.length + p.energetics.length +
    (r.confidence === "verified" ? 2 : 0);
}
