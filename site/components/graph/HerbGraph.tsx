"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY,
  type Simulation, type SimulationNodeDatum, type SimulationLinkDatum
} from "d3-force";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Info, Leaf, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import type { GraphData, GraphNode, EdgeKind } from "@/lib/graphData";

interface SimNode extends SimulationNodeDatum, GraphNode {}
interface SimEdge extends SimulationLinkDatum<SimNode> {
  weight: number;
  kind: EdgeKind;
}

const REGION_COLOR: Record<string, string> = {
  "India":               "#d97706",
  "Peru/Andes/Spanish":  "#c2410c",
  "China":               "#b91c1c",
  "Japan":               "#be185d",
  "Global":              "#4d7c0f"
};

const EDGE_COLOR: Record<EdgeKind, string> = {
  symptom:   "rgb(var(--accent))",
  taste:     "rgb(var(--ember))",
  energetic: "#8b5cf6"
};

type EdgeMode = "symptom" | "taste" | "energetic" | "all";

const HEIGHT = 640;

export function HerbGraph({ data }: { data: GraphData }) {
  const t = useTranslations("components.graph");
  const svgRef   = useRef<SVGSVGElement>(null);
  const gRef     = useRef<SVGGElement>(null);
  const simRef   = useRef<Simulation<SimNode, SimEdge> | null>(null);
  const zoomRef  = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);

  const [selected, setSelected]   = useState<SimNode | null>(null);
  const [regionFilter, setRegion] = useState<string>("all");
  const [edgeMode, setEdgeMode]   = useState<EdgeMode>("symptom");
  const [concern, setConcern]     = useState<string>("all");
  const [search, setSearch]       = useState<string>("");

  const anchors = useMemo(
    () => data.nodes.filter(n => n.kind === "anchor"),
    [data.nodes]
  );

  /* ───────────── simulation setup (runs once per data change) ───────────── */
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const width = svgRef.current.clientWidth || 900;

    // Deep-copy so simulation doesn't mutate server data.
    const nodes: SimNode[] = data.nodes.map(n => ({ ...n }));
    const edges: SimEdge[] = data.edges.map(e => ({ ...e }));
    nodesRef.current = nodes;

    // Pin anchors to a gentle ring around the centre. The force simulation
    // can still jiggle them slightly but they stay roughly fixed.
    const anchorNodes = nodes.filter(n => n.kind === "anchor");
    const anchorCount = anchorNodes.length;
    const cx = width / 2, cy = HEIGHT / 2;
    const R  = Math.min(width, HEIGHT) * 0.36;
    anchorNodes.forEach((a, i) => {
      const theta = (i / anchorCount) * Math.PI * 2 - Math.PI / 2;
      a.fx = cx + Math.cos(theta) * R;
      a.fy = cy + Math.sin(theta) * R;
    });

    const g = select(gRef.current);
    g.selectAll("*").remove();

    // Edge layer
    const linkSel = g.append("g")
      .attr("class", "edges")
      .attr("stroke-linecap", "round")
      .selectAll<SVGLineElement, SimEdge>("line")
      .data(edges)
      .join("line")
      .attr("stroke", d => EDGE_COLOR[d.kind])
      .attr("stroke-width", d => d.kind === "symptom" ? 1.2 : Math.min(0.8 + d.weight * 0.35, 2.0));

    // Node layer
    const nodeSel = g.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, SimNode>("g.node")
      .data(nodes, d => d.id)
      .join("g")
      .attr("class", d => `node node-${d.kind}`)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelected(d));

    // Anchor rendering: soft pill with text inside.
    const anchorSel = nodeSel.filter(d => d.kind === "anchor");
    anchorSel.append("rect")
      .attr("class", "anchor-pill")
      .attr("rx", 14).attr("ry", 14)
      .attr("fill", "rgb(var(--accent-soft))")
      .attr("stroke", "rgb(var(--accent))")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.7);
    anchorSel.append("text")
      .attr("class", "anchor-label")
      .text(d => d.name.toUpperCase())
      .attr("font-family", "ui-sans-serif, system-ui, sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("letter-spacing", "0.08em")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "rgb(var(--accent))")
      .attr("pointer-events", "none");
    // Measure text to size the pill after first paint.
    anchorSel.each(function () {
      const group = select(this);
      const textEl = group.select<SVGTextElement>("text.anchor-label");
      const bb = (textEl.node() as SVGTextElement).getBBox();
      group.select<SVGRectElement>("rect.anchor-pill")
        .attr("x", -bb.width / 2 - 12)
        .attr("y", -bb.height / 2 - 6)
        .attr("width",  bb.width + 24)
        .attr("height", bb.height + 12);
    });

    // Herb rendering: coloured circle + label.
    const herbSel = nodeSel.filter(d => d.kind === "herb");
    herbSel.append("circle")
      .attr("class", "herb-dot")
      .attr("r", d => 4 + Math.min(d.degree, 10) * 0.5)
      .attr("fill", d => REGION_COLOR[d.region ?? ""] ?? "#888")
      .attr("stroke", "rgb(var(--elevated))")
      .attr("stroke-width", 1.2);
    herbSel.append("text")
      .attr("class", "herb-label")
      .text(d => d.name)
      .attr("font-family", "Fraunces, Cormorant Garamond, serif")
      .attr("font-size", d => 9 + Math.min(d.degree, 6) * 0.35)
      .attr("dx", d => 6 + Math.min(d.degree, 10) * 0.4)
      .attr("dy", 3)
      .attr("fill", "rgb(var(--ink))")
      .attr("paint-order", "stroke")
      .attr("stroke", "rgb(var(--surface))")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("pointer-events", "none");

    // Force layout. Links are tuned per-kind: symptom (bipartite) gets short
    // distance + high strength to actually cluster around anchors; taste /
    // energetic get longer distance + weaker strength so they visually
    // "suggest" rather than dominate.
    const sim = forceSimulation<SimNode, SimEdge>(nodes)
      .force("link", forceLink<SimNode, SimEdge>(edges)
        .id(d => d.id)
        .distance(d => d.kind === "symptom" ? 80 : 160)
        .strength(d => d.kind === "symptom" ? 0.85 : 0.02))
      .force("charge", forceManyBody<SimNode>().strength(d => d.kind === "anchor" ? -800 : -60))
      .force("center", forceCenter(cx, cy))
      .force("collide", forceCollide<SimNode>(d => d.kind === "anchor" ? 55 : 12))
      .force("x", forceX<SimNode>(cx).strength(0.02))
      .force("y", forceY<SimNode>(cy).strength(0.02));

    simRef.current = sim;

    sim.on("tick", () => {
      linkSel
        .attr("x1", d => (d.source as SimNode).x ?? 0)
        .attr("y1", d => (d.source as SimNode).y ?? 0)
        .attr("x2", d => (d.target as SimNode).x ?? 0)
        .attr("y2", d => (d.target as SimNode).y ?? 0);
      nodeSel.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Drag — herbs only (anchors stay fixed).
    herbSel.call(
      drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
    );

    // Zoom + pan.
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => { g.attr("transform", event.transform.toString()); });
    zoomRef.current = zoomBehavior;
    select(svgRef.current)
      .call(zoomBehavior)
      .call(zoomBehavior.transform, zoomIdentity);

    return () => { sim.stop(); };
  }, [data]);

  /* ───────────── re-apply filters + highlight whenever UI state changes ───────────── */
  useEffect(() => {
    if (!gRef.current) return;
    const g = select(gRef.current);
    const q = search.trim().toLowerCase();
    const concernAnchorId = concern === "all" ? null : `concern:${concern.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    // Which nodes are "in focus"?
    const inRegion = (n: SimNode) =>
      regionFilter === "all" || n.kind === "anchor" || n.region === regionFilter;

    // Which herbs connect to the focused concern?
    const concernConnected = new Set<string>();
    if (concernAnchorId) {
      concernConnected.add(concernAnchorId);
      for (const e of (data.edges as SimEdge[])) {
        if (e.kind !== "symptom") continue;
        const sid = typeof e.source === "string" ? e.source : (e.source as SimNode).id;
        const tid = typeof e.target === "string" ? e.target : (e.target as SimNode).id;
        if (sid === concernAnchorId) concernConnected.add(tid);
        if (tid === concernAnchorId) concernConnected.add(sid);
      }
    }

    const nodeInFocus = (n: SimNode) => {
      if (!inRegion(n)) return false;
      if (concernAnchorId && !concernConnected.has(n.id)) return false;
      if (q && n.kind === "herb" && !n.name.toLowerCase().includes(q)) return false;
      return true;
    };

    g.selectAll<SVGGElement, SimNode>("g.node")
      .attr("opacity", d => nodeInFocus(d) ? 1 : 0.12);

    // Edges: respect edge-mode toggle + both endpoints in focus.
    g.selectAll<SVGLineElement, SimEdge>("line")
      .attr("stroke-opacity", d => {
        if (edgeMode !== "all" && d.kind !== edgeMode) return 0;
        const s = d.source as SimNode;
        const t = d.target as SimNode;
        if (!nodeInFocus(s) || !nodeInFocus(t)) return 0.04;
        return d.kind === "symptom" ? 0.35 : 0.18;
      });
  }, [regionFilter, edgeMode, concern, search, data.edges]);

  /* ───────────── center on a search hit ───────────── */
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q || !svgRef.current || !zoomRef.current) return;
    const hit = nodesRef.current.find(n => n.kind === "herb" && n.name.toLowerCase().includes(q));
    if (!hit || hit.x == null || hit.y == null) return;
    const width = svgRef.current.clientWidth || 900;
    const t = zoomIdentity
      .translate(width / 2 - hit.x * 1.4, HEIGHT / 2 - hit.y * 1.4)
      .scale(1.4);
    // We don't have d3-transition installed; snap instantly (still looks fine).
    select(svgRef.current).call(zoomRef.current.transform, t);
  }, [search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="card p-3 mb-3 space-y-3">
        {/* Edge-mode tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold shrink-0">{t("connectBy")}</span>
          {(["symptom", "taste", "energetic", "all"] as EdgeMode[]).map(m => {
            const active = edgeMode === m;
            return (
              <button
                key={m}
                onClick={() => setEdgeMode(m)}
                className={`text-xs px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  active ? "bg-ember text-[#1a120a] border-ember font-medium" : "border-line text-ink-soft hover:border-accent/50"
                }`}
              >
                {m !== "all" && (
                  <span className="w-2 h-2 rounded-full" style={{ background: EDGE_COLOR[m as EdgeKind] }} />
                )}
                {m === "symptom" ? t("concern") : m === "taste" ? t("taste") : m === "energetic" ? t("energetic") : t("all")}
              </button>
            );
          })}
        </div>

        {/* Concern focus + region filter + search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-ink-soft" />
            <select
              value={concern}
              onChange={e => setConcern(e.target.value)}
              className="text-xs bg-transparent border border-line rounded-full px-3 py-1 text-ink hover:border-accent/50"
            >
              <option value="all">{t("allConcerns")}</option>
              {anchors.map(a => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setRegion("all")}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${regionFilter === "all" ? "bg-ember text-[#1a120a] border-ember" : "border-line text-ink-soft"}`}
            >
              {t("allRegions")}
            </button>
            {Object.keys(REGION_COLOR).map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${regionFilter === r ? "bg-ember text-[#1a120a] border-ember" : "border-line text-ink-soft hover:border-accent/50"}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: REGION_COLOR[r] }} />
                {r.replace("/Andes/Spanish", "")}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5 border border-line rounded-full px-3 py-1">
            <Search className="w-3.5 h-3.5 text-ink-soft" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("findHerb")}
              className="bg-transparent outline-none text-xs text-ink placeholder:text-ink-soft w-32 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* How to read */}
      <details className="card p-3 mb-3 text-xs text-ink-soft group">
        <summary className="flex items-center gap-2 cursor-pointer list-none">
          <Info className="w-3.5 h-3.5 text-accent" />
          <span className="font-medium text-ink">{t("howToRead")}</span>
          <span className="ml-auto text-accent transition group-open:rotate-45 text-lg leading-none">+</span>
        </summary>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div>
            <div className="text-ink font-medium mb-1 flex items-center gap-1.5">
              <span className="inline-block w-4 h-4 rounded-full bg-accent-soft border border-accent/70" />
              {t("concernPills")}
            </div>
            <p>{t("concernPillsDesc")}</p>
          </div>
          <div>
            <div className="text-ink font-medium mb-1 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-accent" /> {t("dotsHerbs")}
            </div>
            <p>{t("dotsHerbsDesc")}</p>
          </div>
          <div>
            <div className="text-ink font-medium mb-1">{t("linesRelations")}</div>
            <p>{t("linesRelationsDesc")}</p>
          </div>
        </div>
      </details>

      <div className="card overflow-hidden relative" style={{ height: HEIGHT }}>
        <svg ref={svgRef} className="w-full h-full" role="img" aria-label="Herb relationship graph">
          <g ref={gRef} />
        </svg>

        {/* Selected node detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.24 }}
              className="absolute top-4 right-4 w-72 max-w-[80vw] bg-elevated border border-line rounded-xl p-4 shadow-ambient"
            >
              <div className="flex items-start justify-between">
                {selected.kind === "herb" ? (
                  <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: REGION_COLOR[selected.region ?? ""] }}>
                    {selected.region}
                  </div>
                ) : (
                  <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-accent">
                    {t("concernHerbs", { count: selected.count ?? 0 })}
                  </div>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="text-ink-soft hover:text-ink text-xs"
                  aria-label={t("closeAria")}
                >✕</button>
              </div>
              <div className="font-display text-xl text-ink mt-1">{selected.name}</div>

              {selected.kind === "herb" ? (
                <>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selected.tastes?.map(t => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                    {selected.energetics?.map(e => (
                      <span key={e} className="chip" style={{ color: "rgb(var(--ember))", borderColor: "rgb(var(--ember) / 0.3)", background: "rgb(var(--ember) / 0.08)" }}>
                        {e}
                      </span>
                    ))}
                  </div>
                  {selected.symptoms && selected.symptoms.length > 0 && (
                    <div className="mt-3 text-xs text-ink-soft">
                      <strong className="text-ink">{t("addresses")}:</strong> {selected.symptoms.join(", ")}
                    </div>
                  )}
                  <div className="text-xs text-ink-soft mt-2">{t("connections")}: {selected.degree}</div>
                  <Link
                    href={`/encyclopedia/${selected.id}`}
                    className="btn btn-primary mt-3 w-full !py-1.5 !text-xs"
                  >
                    {t("openMonograph")}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-ink-soft mt-3 leading-relaxed">
                    {t("focusConcernHint")}
                  </p>
                  <button
                    onClick={() => { setConcern(selected.name); setSelected(null); }}
                    className="btn btn-primary mt-3 w-full !py-1.5 !text-xs"
                  >
                    {t("focusConcern")}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
