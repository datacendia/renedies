"use client";

import { motion } from "framer-motion";
import { TASTES, TASTE_DESC, type Taste } from "@/lib/energetics";

/**
 * Six-spoke radar chart summarising a single remedy's taste profile.
 *
 * Each taste is rendered as a filled segment whose radius reflects its
 * relative weight (largest-remainder percentages that sum to exactly 100).
 * If `percentages` is omitted, falls back to a uniform split across the
 * `tastes` array for backward compatibility.
 */
export function TasteRadar({
  tastes,
  percentages,
  size = 160
}: {
  tastes: Taste[];
  percentages?: Record<Taste, number>;
  size?: number;
}) {
  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.42;
  const rLabel = size * 0.50;
  const active = new Set(tastes);

  // Effective per-taste percentage. Prefer real weights; fall back to flat 1/N.
  const flat = tastes.length > 0 ? Math.round(100 / tastes.length) : 0;
  const pct = (t: Taste): number => {
    if (percentages && percentages[t] !== undefined) return percentages[t];
    return active.has(t) ? flat : 0;
  };

  // Maximum non-zero percentage drives the outer radius scaling so the
  // chart always uses the full plot area for the dominant taste.
  const maxPct = Math.max(...TASTES.map(t => pct(t)), 1);

  // Build polygon path proportional to each taste's weight.
  const polyPoints = TASTES.map((t, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const p = pct(t);
    const r = p > 0 ? rOuter * (p / maxPct) : rOuter * 0.05;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const polyStr = polyPoints.map(p => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {/* Concentric guides */}
      {[0.3, 0.6, 1].map(k => (
        <circle key={k} cx={cx} cy={cy} r={rOuter * k}
          fill="none" stroke="rgb(var(--line))" strokeWidth="0.6" />
      ))}
      {/* Spokes */}
      {TASTES.map((t, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * rOuter;
        const y = cy + Math.sin(a) * rOuter;
        return <line key={t} x1={cx} y1={cy} x2={x} y2={y}
          stroke="rgb(var(--line))" strokeWidth="0.6" />;
      })}

      {/* Active polygon */}
      <motion.polygon
        points={polyStr}
        fill="rgb(var(--ember) / 0.18)"
        stroke="rgb(var(--ember))"
        strokeWidth="1.4"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
      />

      {/* Per-taste node dots — radius scales with each taste's weight */}
      {TASTES.map((t, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const isOn = active.has(t);
        const p = pct(t);
        const r = p > 0 ? rOuter * (p / maxPct) : rOuter * 0.05;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <circle
            key={t} cx={x} cy={y}
            r={isOn ? 3.5 : 1.5}
            fill={isOn ? TASTE_DESC[t].color : "rgb(var(--ink-soft) / 0.5)"}
          />
        );
      })}

      {/* Labels with percentages */}
      {TASTES.map((t, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * rLabel;
        const y = cy + Math.sin(a) * rLabel;
        const isOn = active.has(t);
        const percentage = pct(t);
        return (
          <text
            key={t} x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.065}
            className="font-sans"
            fill={isOn ? "rgb(var(--ink))" : "rgb(var(--ink-soft))"}
            style={{ letterSpacing: "0.04em" }}
          >
            <tspan x={x} dy={isOn ? -4 : 0}>{t}</tspan>
            {isOn && percentage > 0 && (
              <tspan x={x} dy={size * 0.08} fontSize={size * 0.05} fill="rgb(var(--ember))">
                {percentage}%
              </tspan>
            )}
          </text>
        );
      })}
    </svg>
  );
}
