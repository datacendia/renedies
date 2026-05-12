"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, Pill } from "lucide-react";
import { getStoredMedications } from "@/components/recipe/MedicationsPicker";
import { analyzeBlend, SEVERITY_STYLE, type InteractionHit, type Severity } from "@/lib/interactions";

interface Props {
  name: string;
  latin?: string;
}

/**
 * Renders on the encyclopedia detail page. Reads the user's saved
 * medications from localStorage and runs this single remedy through
 * `analyzeBlend` to surface any drug conflicts specific to it.
 *
 * Silent by default — only appears if there are actual hits, so users
 * without meds set never see it.
 */
export function DrugConflictNotice({ name, latin }: Props) {
  const [hits, setHits] = useState<InteractionHit[]>([]);
  const [hasMeds, setHasMeds] = useState(false);

  useEffect(() => {
    const meds = getStoredMedications();
    setHasMeds(meds.length > 0);
    if (meds.length === 0) { setHits([]); return; }
    const results = analyzeBlend([{ name, latin }], meds)
      .filter(h => h.id.startsWith("drug-"));
    setHits(results);
  }, [name, latin]);

  if (!hasMeds || hits.length === 0) return null;

  const Icon = hits.some(h => h.severity === "danger") ? ShieldAlert : AlertTriangle;

  return (
    <section className="rounded-xl border p-5 space-y-3" style={{
      borderColor: "rgb(220 38 38 / 0.35)",
      background: "rgb(220 38 38 / 0.05)"
    }}>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-red-600" />
        <h2 className="font-display text-xl text-red-700">
          Conflicts with your medications
        </h2>
      </div>
      <p className="text-xs text-ink-soft flex items-center gap-1.5">
        <Pill className="w-3 h-3" /> Based on the meds you've saved locally.
        <Link href="/recipe" className="underline hover:text-ink">Edit</Link>
      </p>
      {hits.map(h => {
        const S = SEVERITY_STYLE[h.severity as Severity];
        return (
          <div
            key={h.id}
            className="rounded-lg p-3 border"
            style={{ background: S.bg, borderColor: S.border }}
          >
            <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: S.fg }}>
              {S.label}
            </div>
            <div className="text-sm font-medium text-ink mt-0.5">{h.title}</div>
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">{h.detail}</p>
          </div>
        );
      })}
    </section>
  );
}
