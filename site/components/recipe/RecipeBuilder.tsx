"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Search, X, Plus, Minus, AlertTriangle, Info, ShieldAlert, Copy, Check, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  analyzeBlend, SEVERITY_STYLE, type Severity
} from "@/lib/interactions";
import { safetyFor, FLAG_META } from "@/lib/safety";
import { saveRecipe } from "@/lib/personal";
import { MedicationsPicker } from "./MedicationsPicker";
import type { DrugClass } from "@/lib/drugs";

interface Herb {
  slug: string; name: string; latin?: string; region: string;
  benefit?: string; confidence?: string;
}
interface Ingredient extends Herb { parts: number; }

const SEVERITY_ICON: Record<Severity, React.ComponentType<{ className?: string }>> = {
  info:    Info,
  caution: AlertTriangle,
  danger:  ShieldAlert
};

export function RecipeBuilder({ catalog }: { catalog: Herb[] }) {
  const t = useTranslations("components.recipe");
  const [ings, setIngs] = useState<Ingredient[]>([]);
  const [q, setQ] = useState("");
  const [servings, setServings] = useState(1);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [medications, setMedications] = useState<DrugClass[]>([]);

  /* ─────── search ─────── */
  const searchResults = useMemo(() => {
    if (!q.trim()) return catalog.slice(0, 10);
    const needle = q.toLowerCase();
    return catalog
      .filter(h =>
        h.name.toLowerCase().includes(needle) ||
        h.latin?.toLowerCase().includes(needle))
      .slice(0, 12);
  }, [q, catalog]);

  /* ─────── interactions ─────── */
  const warnings = useMemo(
    () => analyzeBlend(ings.map(i => ({ name: i.name, latin: i.latin })), medications),
    [ings, medications]
  );
  const dangerCount  = warnings.filter(w => w.severity === "danger").length;
  const cautionCount = warnings.filter(w => w.severity === "caution").length;

  /* ─────── ratio math ─────── */
  const totalParts = ings.reduce((s, i) => s + i.parts, 0);
  const gramsPerCup = 6; // conventional herbal tea strength (g of dried material per 240ml cup)
  const totalGrams = servings * gramsPerCup;

  const add = (h: Herb) => {
    if (ings.find(i => i.slug === h.slug)) return;
    setIngs(prev => [...prev, { ...h, parts: 1 }]);
    setQ("");
  };
  const remove = (slug: string) => setIngs(prev => prev.filter(i => i.slug !== slug));
  const bump = (slug: string, d: number) =>
    setIngs(prev => prev.map(i =>
      i.slug === slug ? { ...i, parts: Math.max(1, Math.min(6, i.parts + d)) } : i));
  const clear = () => setIngs([]);

  const recipeText = useMemo(() => {
    if (!ings.length) return "";
    const lines = [
      t(servings === 1 ? "blendTitleOne" : "blendTitleMany", { count: servings }),
      "",
      t("ingredientsHeading")
    ];
    for (const i of ings) {
      const ratio = totalParts ? (i.parts / totalParts) : 0;
      const g = (ratio * totalGrams).toFixed(1);
      const partLabel = t(i.parts === 1 ? "partOne" : "partMany", { count: i.parts });
      lines.push(`  • ${i.name} — ${partLabel} (~${g} g)`);
    }
    lines.push("");
    lines.push(t("exportMethod"));
    return lines.join("\n");
  }, [ings, totalParts, totalGrams, servings, t]);

  const persistRecipe = () => {
    if (ings.length === 0) return;
    const title = ings.slice(0, 3).map(i => i.name).join(" · ") + (ings.length > 3 ? "…" : "");
    saveRecipe({
      title,
      servings,
      ingredients: ings.map(i => ({ slug: i.slug, name: i.name, parts: i.parts }))
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const copyRecipe = async () => {
    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-8 items-start">
      {/* ── LEFT: catalog search + meds ── */}
      <div className="space-y-3">
        <MedicationsPicker onChange={setMedications} />
        <div className="card p-4 sticky top-20">
          <label className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
            {t("addHerbs")}
          </label>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("searchPlaceholder", { count: catalog.length })}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-surface border border-line text-sm focus:border-accent outline-none"
            />
          </div>

          <ul className="mt-3 max-h-[380px] overflow-y-auto space-y-1 pr-1">
            {searchResults.map(h => {
              const already = ings.find(i => i.slug === h.slug);
              return (
                <li key={h.slug}>
                  <button
                    onClick={() => add(h)}
                    disabled={!!already}
                    className={`w-full text-left p-2.5 rounded-lg border transition ${
                      already
                        ? "border-ember/40 bg-ember/5 text-ink-soft cursor-not-allowed"
                        : "border-line hover:border-accent/50 hover:bg-accent-soft/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-[0.18em] text-accent">{h.region}</div>
                        <div className="font-display text-base text-ink truncate">{h.name}</div>
                        {h.latin && <div className="text-[10px] italic text-ink-soft truncate">{h.latin}</div>}
                      </div>
                      <Plus className="w-4 h-4 text-accent shrink-0" />
                    </div>
                  </button>
                </li>
              );
            })}
            {searchResults.length === 0 && (
              <li className="text-xs text-ink-soft italic p-3 text-center">
                {t("noMatch")}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ── RIGHT: the pot ── */}
      <div>
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-ember/10 blur-3xl" />

          <div className="flex items-center justify-between relative">
            <div>
              <h2 className="font-display text-2xl text-ink">{t("yourBlend")}</h2>
              <p className="text-xs text-ink-soft">
                {ings.length === 0
                  ? t("empty")
                  : t(ings.length === 1 ? "blendStatOne" : "blendStatMany", { count: ings.length, parts: totalParts })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center border border-line rounded-full text-xs">
                <button
                  className="w-7 h-7 grid place-items-center hover:bg-accent-soft/50"
                  onClick={() => setServings(s => Math.max(1, s - 1))}
                  aria-label={t("fewerCups")}
                ><Minus className="w-3 h-3" /></button>
                <span className="px-2 text-ink">{t(servings === 1 ? "cupsOne" : "cupsMany", { count: servings })}</span>
                <button
                  className="w-7 h-7 grid place-items-center hover:bg-accent-soft/50"
                  onClick={() => setServings(s => Math.min(6, s + 1))}
                  aria-label={t("moreCups")}
                ><Plus className="w-3 h-3" /></button>
              </div>
              {ings.length > 0 && (
                <button
                  onClick={clear}
                  className="text-xs text-ink-soft hover:text-ink transition inline-flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> {t("clear")}
                </button>
              )}
            </div>
          </div>

          <div className="divider-ornament my-4" />

          {/* Ingredient list (reorderable) */}
          <Reorder.Group
            axis="y"
            values={ings}
            onReorder={setIngs}
            className="space-y-2 min-h-[120px]"
          >
            <AnimatePresence initial={false}>
              {ings.map(i => {
                const ratio = totalParts ? (i.parts / totalParts) : 0;
                const g = (ratio * totalGrams).toFixed(1);
                return (
                  <Reorder.Item
                    key={i.slug}
                    value={i}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="card !border-accent/25 p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
                  >
                    <Link
                      href={`/encyclopedia/${i.slug}`}
                      className="min-w-0 flex-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="text-[9px] uppercase tracking-[0.18em] text-accent flex items-center gap-1.5">
                        {(() => {
                          const s = safetyFor({ name: i.name, latin: i.latin });
                          if (!s) return null;
                          const worst = s.pregnancy === "avoid" || s.lactation === "avoid"
                            ? "avoid"
                            : s.pregnancy === "caution" || s.lactation === "caution"
                              ? "caution"
                              : "safe";
                          const meta = FLAG_META[worst];
                          return (
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ background: meta.color }}
                              title={`${meta.label} — pregnancy: ${s.pregnancy}, lactation: ${s.lactation}`}
                              aria-label={meta.label}
                            />
                          );
                        })()}
                        <span>{i.region}</span>
                      </div>
                      <div className="font-display text-lg text-ink truncate">{i.name}</div>
                    </Link>
                    <div className="inline-flex items-center border border-line rounded-full text-xs">
                      <button
                        className="w-7 h-7 grid place-items-center hover:bg-accent-soft/50"
                        onClick={() => bump(i.slug, -1)}
                        aria-label={t("less")}
                      ><Minus className="w-3 h-3" /></button>
                      <span className="px-2 font-medium text-ink">{i.parts}</span>
                      <button
                        className="w-7 h-7 grid place-items-center hover:bg-accent-soft/50"
                        onClick={() => bump(i.slug, 1)}
                        aria-label={t("more")}
                      ><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="text-xs text-ink-soft w-14 text-right tabular-nums">
                      ~{g} g
                    </div>
                    <button
                      onClick={() => remove(i.slug)}
                      className="w-7 h-7 grid place-items-center text-ink-soft hover:text-ink"
                      aria-label={t("remove")}
                    ><X className="w-3.5 h-3.5" /></button>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
            {ings.length === 0 && (
              <div className="text-xs text-ink-soft italic py-10 text-center border-2 border-dashed border-line rounded-xl">
                {t("dropHere")}
              </div>
            )}
          </Reorder.Group>

          {/* Ratio bar */}
          {ings.length > 0 && (
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold mb-2">
                {t("ratio")}
              </div>
              <div className="flex h-3 rounded-full overflow-hidden border border-line">
                {ings.map((i, idx) => (
                  <motion.div
                    key={i.slug}
                    layout
                    className="h-full"
                    style={{
                      width: `${(i.parts / totalParts) * 100}%`,
                      background: `hsl(${(idx * 57) % 360}, 55%, 52%)`
                    }}
                    title={`${i.name} — ${Math.round((i.parts / totalParts) * 100)}%`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Method + copy/share */}
          {ings.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <div className="text-xs text-ink-soft flex-1 min-w-[200px]">
                <strong className="text-ink">{t("method")}</strong> {t("methodText")}
              </div>
              <button onClick={copyRecipe} className="btn btn-ghost !text-xs">
                {copied ? <><Check className="w-3.5 h-3.5" /> {t("copied")}</> : <><Copy className="w-3.5 h-3.5" /> {t("copy")}</>}
              </button>
              <button onClick={persistRecipe} className="btn btn-ember !text-xs">
                {saved ? <><Check className="w-3.5 h-3.5" /> {t("saved")}</> : <><Bookmark className="w-3.5 h-3.5" /> {t("save")}</>}
              </button>
            </div>
          )}
        </div>

        {/* Interaction warnings */}
        <AnimatePresence>
          {warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold px-1">
                <span>{t("safetyCheck")}</span>
                <span className="flex gap-3 normal-case tracking-normal text-xs">
                  {dangerCount  > 0 && <span className="text-red-600">{t(dangerCount === 1 ? "warningsOne" : "warningsMany", { count: dangerCount })}</span>}
                  {cautionCount > 0 && <span className="text-amber-600">{t(cautionCount === 1 ? "cautionsOne" : "cautionsMany", { count: cautionCount })}</span>}
                </span>
              </div>
              {warnings.map(w => {
                const S = SEVERITY_STYLE[w.severity];
                const Icon = SEVERITY_ICON[w.severity];
                return (
                  <div
                    key={w.id}
                    className="rounded-xl p-4 border flex gap-3"
                    style={{ background: S.bg, borderColor: S.border, color: S.fg }}
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.18em] font-semibold">
                        {S.label}
                      </div>
                      <div className="font-display text-lg" style={{ color: "rgb(var(--ink))" }}>
                        {w.title}
                      </div>
                      <p className="text-xs mt-1" style={{ color: "rgb(var(--ink-soft))" }}>
                        {w.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
