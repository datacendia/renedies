"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  TASTES, ENERGETICS, TASTE_DESC, ENERGETIC_DESC,
  type Taste, type Energetic
} from "@/lib/energetics";

interface Entry {
  slug: string;
  name: string;
  latin?: string;
  region: string;
  benefit?: string;
  confidence?: string;
  tastes: Taste[];
  energetics: Energetic[];
}

const SIZE = 380;          // SVG viewBox (square)
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 170;
const INNER_R = 70;

export function TasteCompass({ entries }: { entries: Entry[] }) {
  const t = useTranslations("components.tasteCompass");
  const [tastes, setTastes]         = useState<Set<Taste>>(new Set());
  const [energetics, setEnergetics] = useState<Set<Energetic>>(new Set());
  const reduced = useReducedMotion();

  const hasSelection = tastes.size + energetics.size > 0;

  const toggleTaste = (t: Taste) =>
    setTastes(prev => {
      const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n;
    });
  const toggleEnergetic = (e: Energetic) =>
    setEnergetics(prev => {
      const n = new Set(prev); n.has(e) ? n.delete(e) : n.add(e); return n;
    });
  const reset = () => { setTastes(new Set()); setEnergetics(new Set()); };

  /** Matches: must include ALL selected tastes AND ALL selected energetics.
   *  Falls back to a wider "any match" if strict yields too few.
   *
   *  We compute the full ranked list (`all`) for the counter, and a
   *  truncated view (`shown`) for the rendered grid so the DOM stays
   *  reasonable even when hundreds of herbs qualify. */
  const RENDER_CAP = 60;
  const { shown, total } = useMemo(() => {
    if (!hasSelection) return { shown: [] as Entry[], total: 0 };
    const strict = entries.filter(e =>
      [...tastes].every(t => e.tastes.includes(t)) &&
      [...energetics].every(en => e.energetics.includes(en))
    );
    const out = strict.length >= 6 ? strict : entries.filter(e =>
      [...tastes].some(t => e.tastes.includes(t)) ||
      [...energetics].some(en => e.energetics.includes(en))
    );
    const ranked = out
      .map(e => ({
        e,
        score: [...tastes].filter(t => e.tastes.includes(t)).length
             + [...energetics].filter(en => e.energetics.includes(en)).length * 1.2
      }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.e);
    return { shown: ranked.slice(0, RENDER_CAP), total: ranked.length };
  }, [entries, tastes, energetics, hasSelection]);
  const matches = shown;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 items-start">
      {/* ── LEFT: the compass wheel ── */}
      <div className="flex flex-col items-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[460px] select-none">
          <defs>
            <radialGradient id="compass-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgb(var(--ember) / 0.35)" />
              <stop offset="70%"  stopColor="rgb(var(--ember) / 0)" />
            </radialGradient>
          </defs>

          {/* Ambient glow */}
          <circle cx={CX} cy={CY} r={OUTER_R + 30} fill="url(#compass-glow)" />

          {/* Six taste wedges */}
          {TASTES.map((t, i) => {
            const startA = (i / 6) * Math.PI * 2 - Math.PI / 2 - Math.PI / 6;
            const endA   = startA + Math.PI / 3;
            const active = tastes.has(t);
            const d = arcPath(CX, CY, INNER_R + 4, OUTER_R, startA, endA);
            const midA = (startA + endA) / 2;
            const labelR = (INNER_R + OUTER_R) / 2;
            const lx = CX + Math.cos(midA) * labelR;
            const ly = CY + Math.sin(midA) * labelR;
            const color = TASTE_DESC[t].color;
            return (
              <g key={t} className="cursor-pointer" onClick={() => toggleTaste(t)}>
                <motion.path
                  d={d}
                  initial={false}
                  animate={{
                    fill:   active ? color   : "rgb(var(--elevated))",
                    opacity: active ? 1 : 0.9,
                    scale:  active ? 1.03 : 1
                  }}
                  transition={{ duration: 0.28 }}
                  style={{ originX: `${CX}px`, originY: `${CY}px` }}
                  stroke="rgb(var(--line))"
                  strokeWidth={1.5}
                />
                <text
                  x={lx} y={ly}
                  textAnchor="middle" dominantBaseline="middle"
                  className="font-display pointer-events-none"
                  fontSize={16}
                  fill={active ? "#fff" : "rgb(var(--ink))"}
                  style={{ letterSpacing: "0.02em" }}
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Central hub */}
          <circle
            cx={CX} cy={CY} r={INNER_R}
            fill="rgb(var(--elevated))"
            stroke="rgb(var(--accent) / 0.4)"
            strokeWidth={1.5}
          />
          <text
            x={CX} y={CY - 8}
            textAnchor="middle"
            fontSize={11}
            className="font-sans uppercase"
            fill="rgb(var(--ink-soft))"
            style={{ letterSpacing: "0.18em" }}
          >
            {t("matches")}
          </text>
          <motion.text
            key={total /* trigger animation on number change */}
            x={CX} y={CY + 18}
            textAnchor="middle"
            fontSize={36}
            className="font-display"
            fill="rgb(var(--ember))"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {hasSelection ? total : "—"}
          </motion.text>
        </svg>

        {/* Energetics row */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {ENERGETICS.map(e => {
            const active = energetics.has(e);
            return (
              <button
                key={e}
                onClick={() => toggleEnergetic(e)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  active
                    ? "bg-ember text-[#1a120a] border-ember shadow-glow"
                    : "border-line text-ink-soft hover:border-accent/50"
                }`}
                style={active ? undefined : { borderColor: `${ENERGETIC_DESC[e].color}30` }}
                title={ENERGETIC_DESC[e].short}
              >
                {e}
              </button>
            );
          })}
        </div>

        {hasSelection && (
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition"
          >
            <RotateCcw className="w-3 h-3" /> {t("clearSelection")}
          </button>
        )}

        {/* Legend */}
        <div className="mt-8 w-full max-w-md">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-3">{t("aboutTheTastes")}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {TASTES.map(t => (
              <div key={t} className="flex items-start gap-2">
                <span
                  className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: TASTE_DESC[t].color }}
                />
                <div>
                  <div className="font-medium text-ink capitalize">{t}</div>
                  <div className="text-ink-soft">{TASTE_DESC[t].short}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: results ── */}
      <div className="min-h-[320px]">
        {!hasSelection && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card p-8 text-center"
          >
            <Sparkles className="w-8 h-8 mx-auto text-accent" />
            <h3 className="font-display text-2xl mt-3">{t("tapToBegin")}</h3>
            <p className="text-ink-soft text-sm mt-2 max-w-md mx-auto">
              {t.rich("exampleHint", {
                b1: c => <strong>{c}</strong>,
                b2: c => <strong>{c}</strong>,
                b3: c => <strong>{c}</strong>
              })}
            </p>
          </motion.div>
        )}

        {hasSelection && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl text-ink">
                  {t(total === 1 ? "matchingOne" : "matchingMany", { count: total })}
                </h3>
                <p className="text-xs text-ink-soft mt-1">
                  {total > matches.length
                    ? t("showingTop", { count: matches.length })
                    : t("sortedByStrength")}
                </p>
              </div>
            </div>
            <motion.ul
              layout
              className="grid sm:grid-cols-2 gap-3"
            >
              <AnimatePresence mode="popLayout">
                {matches.map((e, i) => (
                  <motion.li
                    key={e.slug}
                    layout
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.32, delay: Math.min(i * 0.015, 0.3) }}
                  >
                    <Link
                      href={`/encyclopedia/${e.slug}`}
                      className="card block p-4 h-full"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] uppercase tracking-[0.18em] text-accent font-semibold">{e.region}</span>
                        <div className="flex gap-1 flex-wrap justify-end">
                          {e.tastes.map(t => (
                            <span
                              key={t}
                              className="w-2 h-2 rounded-full"
                              style={{ background: TASTE_DESC[t].color }}
                              title={t}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="font-display text-lg text-ink mt-1 leading-tight">{e.name}</div>
                      {e.latin && <div className="text-[11px] italic text-ink-soft">{e.latin}</div>}
                      {e.benefit && (
                        <p className="text-xs text-ink-soft mt-2 line-clamp-2">{e.benefit}</p>
                      )}
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {e.energetics.map(en => (
                          <span
                            key={en}
                            className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
                            style={{
                              borderColor: `${ENERGETIC_DESC[en].color}55`,
                              color: ENERGETIC_DESC[en].color
                            }}
                          >
                            {en}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────── SVG helpers ─────────── */
function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}
function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const [x0o, y0o] = polar(cx, cy, r1, a0);
  const [x1o, y1o] = polar(cx, cy, r1, a1);
  const [x1i, y1i] = polar(cx, cy, r0, a1);
  const [x0i, y0i] = polar(cx, cy, r0, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return [
    `M ${x0o} ${y0o}`,
    `A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${r0} ${r0} 0 ${large} 0 ${x0i} ${y0i}`,
    "Z"
  ].join(" ");
}
