"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info, FileText, BookOpen } from "lucide-react";

const TIERS = [
  { id: "preliminary", label: "Preliminary", blurb: "Early evidence or limited documentation.", color: "#0ea5e9", icon: Info },
  { id: "traditional", label: "Traditional", blurb: "Long-standing use across generations.",    color: "#d97706", icon: BookOpen },
  { id: "verified",    label: "Verified",    blurb: "Corroborated by modern studies.",          color: "#059669", icon: CheckCircle2 }
] as const;

export function ConfidenceMeter({ confidence }: { confidence?: string }) {
  const level = confidence ?? "traditional";
  const idx = TIERS.findIndex(t => t.id === level);
  const safeIdx = idx === -1 ? 1 : idx;
  const current = TIERS[safeIdx];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
            Evidence level
          </div>
          <div className="flex items-center gap-2 mt-1">
            <current.icon className="w-4 h-4" style={{ color: current.color }} />
            <span className="font-display text-lg text-ink">{current.label}</span>
          </div>
        </div>
        <FileText className="w-5 h-5 text-ink-soft opacity-60" />
      </div>

      {/* Segmented bar */}
      <div className="mt-4 flex gap-1">
        {TIERS.map((t, i) => {
          const active = i <= safeIdx;
          return (
            <motion.div
              key={t.id}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex-1 h-2 rounded-full origin-left"
              style={{ background: active ? t.color : "rgb(var(--line))" }}
            />
          );
        })}
      </div>
      <div className="flex gap-1 mt-1 text-[9px] uppercase tracking-wider text-ink-soft">
        {TIERS.map(t => (
          <span key={t.id} className="flex-1 text-center">{t.label}</span>
        ))}
      </div>

      <p className="text-xs text-ink-soft mt-3 leading-relaxed">{current.blurb}</p>
    </div>
  );
}
