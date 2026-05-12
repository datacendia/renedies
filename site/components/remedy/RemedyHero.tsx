"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
export { pickVariant, type RemedyVariant } from "./pickVariant";
import type { RemedyVariant } from "./pickVariant";
import type { EvidenceData, EvidenceGrade } from "./EvidencePanel";

interface RemedyHeroProps {
  variant: RemedyVariant;
  name: string;
  latin?: string;
  region: string;
  children?: ReactNode;
  evidence?: EvidenceData | null;
}

export function RemedyHero({
  variant, name, latin, region, children, evidence
}: RemedyHeroProps) {
  const accentBar = (
    <motion.div
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-[2px] bg-ember origin-left mt-4"
    />
  );

  // Extract unique grades from evidence claims
  const uniqueGrades = evidence
    ? [...new Set(evidence.claims.map((c) => c.grade))]
    : [];

  const gradeColors: Record<EvidenceGrade, string> = {
    likely: "bg-emerald-100 text-emerald-700 border-emerald-200",
    possibly: "bg-teal-100 text-teal-700 border-teal-200",
    unclear: "bg-amber-100 text-amber-700 border-amber-200",
    preliminary: "bg-orange-100 text-orange-700 border-orange-200",
    ineffective: "bg-red-100 text-red-700 border-red-200",
    traditional: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const gradeLabels: Record<EvidenceGrade, string> = {
    likely: "Likely",
    possibly: "Possibly",
    unclear: "Unclear",
    preliminary: "Preliminary",
    ineffective: "Ineffective",
    traditional: "Traditional",
  };

  if (variant === "formula") {
    const [lead, ...rest] = name.split(/[\s—–]+/);
    return (
      <header className="relative">
        <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">
          {region} · formula
        </div>
        <h1 className="font-display italic text-5xl md:text-7xl text-ink mt-3 leading-[0.98] tracking-tight">
          <span className="block">{lead}</span>
          {rest.length > 0 && (
            <span className="block text-ember not-italic text-4xl md:text-6xl mt-1">
              {rest.join(" ")}
            </span>
          )}
        </h1>
        {latin && <p className="italic text-ink-soft mt-3 text-lg">{latin}</p>}
        {uniqueGrades.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {uniqueGrades.map((grade) => (
              <span
                key={grade}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${gradeColors[grade]}`}
              >
                {gradeLabels[grade]}
              </span>
            ))}
          </div>
        )}
        {accentBar}
        {children}
      </header>
    );
  }

  if (variant === "tonic") {
    return (
      <header className="relative overflow-hidden rounded-2xl border border-ember/30 p-8 md:p-10 bg-gradient-to-br from-ember/5 via-transparent to-accent/5">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-ember/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.28em] text-ember font-semibold">
            {region} · tonic & adaptogen
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-ink mt-3 leading-[0.95] tracking-tight">
            {name}
          </h1>
          {latin && <p className="italic text-ink-soft mt-3 text-lg">{latin}</p>}
          {uniqueGrades.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {uniqueGrades.map((grade) => (
                <span
                  key={grade}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${gradeColors[grade]}`}
                >
                  {gradeLabels[grade]}
                </span>
              ))}
            </div>
          )}
          {accentBar}
          {children}
        </div>
      </header>
    );
  }

  // monograph (default)
  return (
    <header>
      <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">
        {region} · monograph
      </div>
      <h1 className="font-display text-5xl md:text-7xl text-ink mt-3 leading-[0.98] tracking-tight">
        {name}
      </h1>
      {latin && <p className="italic text-ink-soft mt-3 text-lg">{latin}</p>}
      {uniqueGrades.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {uniqueGrades.map((grade) => (
            <span
              key={grade}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${gradeColors[grade]}`}
            >
              {gradeLabels[grade]}
            </span>
          ))}
        </div>
      )}
      {accentBar}
      {children}
    </header>
  );
}
