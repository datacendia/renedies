import { AlertTriangle, Baby, HeartPulse, Pill, Info } from "lucide-react";
import { FLAG_META, type SafetyRecord } from "@/lib/safety";

/**
 * Renders the structured safety panel: pregnancy + lactation badges, drug
 * interactions, and a contextual note. Rendered server-side.
 */
export function SafetyPanel({ safety }: { safety: SafetyRecord }) {
  const preg = FLAG_META[safety.pregnancy];
  const lact = FLAG_META[safety.lactation];

  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
      <h2 className="flex items-center gap-2 font-display text-2xl text-amber-700">
        <AlertTriangle className="w-5 h-5" /> Safety at a glance
      </h2>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <div className={`rounded-lg border p-4 ${preg.badgeClass}`}>
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-80">Pregnancy</span>
          </div>
          <div className="font-display text-lg mt-1">{preg.label}</div>
          <p className="text-xs opacity-80 mt-1 leading-relaxed">{preg.description}</p>
        </div>
        <div className={`rounded-lg border p-4 ${lact.badgeClass}`}>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-80">Lactation</span>
          </div>
          <div className="font-display text-lg mt-1">{lact.label}</div>
          <p className="text-xs opacity-80 mt-1 leading-relaxed">{lact.description}</p>
        </div>
      </div>

      {safety.drugInteractions.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-amber-700">
            <Pill className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Drug interactions</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-ink">
            {safety.drugInteractions.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600 shrink-0">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {safety.notes && (
        <div className="mt-4 flex items-start gap-2 text-xs text-ink-soft italic leading-relaxed">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
          <span>{safety.notes}</span>
        </div>
      )}
    </section>
  );
}
