"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { BODY_REGIONS, type BodyRegion } from "@/lib/bodyMap";

interface Slim {
  slug: string; name: string; latin?: string;
  region: string; benefit?: string; confidence?: string;
}

/**
 * Body diagram with clickable SVG hotspots.
 * Hotspots are positioned on a stylised front-view human silhouette.
 */
const HOTSPOTS: Record<BodyRegion, { x: number; y: number; r: number }> = {
  head:    { x: 150, y: 40,  r: 26 },
  throat:  { x: 150, y: 78,  r: 14 },
  chest:   { x: 150, y: 120, r: 30 },
  heart:   { x: 132, y: 120, r: 16 },
  stomach: { x: 150, y: 170, r: 22 },
  liver:   { x: 172, y: 160, r: 16 },
  gut:     { x: 150, y: 205, r: 26 },
  pelvis:  { x: 150, y: 248, r: 22 },
  joints:  { x:  98, y: 230, r: 18 },
  skin:    { x: 206, y: 170, r: 14 },
  energy:  { x:  98, y: 130, r: 18 },
  sleep:   { x: 202, y:  42, r: 18 }
};

interface RegionData { items: Slim[]; total: number }

export function BodyMap({ byRegion }: { byRegion: Record<string, RegionData> }) {
  const t = useTranslations("components.bodyMap");
  const [active, setActive] = useState<BodyRegion>("chest");
  const [hover, setHover]   = useState<BodyRegion | null>(null);
  const activeRegion = byRegion[active] ?? { items: [], total: 0 };
  const results = activeRegion.items;
  const activeDef = BODY_REGIONS.find(r => r.id === active)!;

  return (
    <div className="grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] gap-8 items-start">
      {/* ── LEFT: SVG body ── */}
      <div className="relative">
        <svg viewBox="0 0 300 400" className="w-full max-w-[420px] mx-auto">
          <defs>
            <radialGradient id="body-glow" cx="50%" cy="30%" r="60%">
              <stop offset="0%"  stopColor="rgb(var(--ember) / 0.18)" />
              <stop offset="80%" stopColor="rgb(var(--ember) / 0)" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill="url(#body-glow)" />

          {/* Silhouette */}
          <g
            fill="rgb(var(--elevated))"
            stroke="rgb(var(--accent) / 0.3)"
            strokeWidth="1.5"
          >
            {/* head */}
            <ellipse cx="150" cy="40"  rx="24" ry="28" />
            {/* neck */}
            <rect x="138" y="66" width="24" height="14" rx="4" />
            {/* torso */}
            <path d="M 110 82
                     Q 104 84 100 96
                     L 92 180
                     Q 90 210 98 240
                     L 108 270
                     L 192 270
                     L 202 240
                     Q 210 210 208 180
                     L 200 96
                     Q 196 84 190 82 Z" />
            {/* arms */}
            <path d="M 96 88  Q 78 100 72 150  L 68 210 Q 70 232 82 238 L 90 232 Q 86 200 88 170 Z" />
            <path d="M 204 88 Q 222 100 228 150 L 232 210 Q 230 232 218 238 L 210 232 Q 214 200 212 170 Z" />
            {/* legs */}
            <path d="M 112 270 L 118 380 L 140 380 L 144 270 Z" />
            <path d="M 156 270 L 160 380 L 182 380 L 188 270 Z" />
          </g>

          {/* Hotspots */}
          {BODY_REGIONS.map(def => {
            const pos = HOTSPOTS[def.id];
            const isActive = active === def.id;
            const isHover  = hover === def.id;
            const count = byRegion[def.id]?.total ?? 0;
            return (
              <g
                key={def.id}
                className="cursor-pointer"
                onClick={() => setActive(def.id)}
                onMouseEnter={() => setHover(def.id)}
                onMouseLeave={() => setHover(null)}
              >
                <motion.circle
                  cx={pos.x} cy={pos.y} r={pos.r}
                  initial={false}
                  animate={{
                    fill: isActive
                      ? "rgb(var(--ember) / 0.85)"
                      : isHover
                        ? "rgb(var(--accent) / 0.35)"
                        : "rgb(var(--accent) / 0.12)",
                    scale: isActive ? 1.08 : 1
                  }}
                  style={{ originX: `${pos.x}px`, originY: `${pos.y}px` }}
                  stroke={isActive ? "rgb(var(--ember))" : "rgb(var(--accent) / 0.5)"}
                  strokeWidth={isActive ? 2 : 1}
                  transition={{ duration: 0.22 }}
                />
                {isActive && (
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={pos.r}
                    fill="none"
                    stroke="rgb(var(--ember))"
                    strokeWidth={2}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.2 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    style={{ originX: `${pos.x}px`, originY: `${pos.y}px` }}
                  />
                )}
                <text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={isActive ? "#1a120a" : "rgb(var(--ink))"}
                  className="pointer-events-none"
                >
                  {count}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Region chips under body for mobile affordance */}
        <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
          {BODY_REGIONS.map(def => (
            <button
              key={def.id}
              onClick={() => setActive(def.id)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                active === def.id
                  ? "bg-ember text-[#1a120a] border-ember"
                  : "border-line text-ink-soft hover:border-accent/40"
              }`}
            >
              {def.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: results ── */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                {t("regionLabel")}
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-ink mt-1">{activeDef.label}</h2>
              <p className="text-ink-soft mt-2">{activeDef.blurb}</p>
              <p className="text-xs text-ink-soft mt-1">
                {t(activeRegion.total === 1 ? "showingOne" : "showingMany", { shown: results.length, total: activeRegion.total })}
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3">
              {results.map((r, i) => (
                <motion.li
                  key={r.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                >
                  <Link href={`/encyclopedia/${r.slug}`} className="card block p-4 h-full">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-accent font-semibold">{r.region}</div>
                    <div className="font-display text-lg text-ink mt-0.5">{r.name}</div>
                    {r.latin && <div className="text-[11px] italic text-ink-soft">{r.latin}</div>}
                    {r.benefit && <p className="text-xs text-ink-soft mt-2 line-clamp-2">{r.benefit}</p>}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {results.length === 0 && (
              <div className="card p-6 text-center text-ink-soft">
                {t("noMatches")}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
