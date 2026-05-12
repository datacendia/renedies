"use client";

import { useEffect, useMemo, useState } from "react";
import { Pill, Plus, X, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { DRUGS, type DrugClass, resolveDrugQuery, getDrug } from "@/lib/drugs";

const STORAGE_KEY = "remedia:medications";

function load(): DrugClass[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is DrugClass => typeof x === "string" && !!getDrug(x as DrugClass));
  } catch { return []; }
}

function save(meds: DrugClass[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meds)); } catch { /* noop */ }
}

/**
 * Compact medications picker used by the Recipe Builder. Persists the
 * user's selection in localStorage so they don't re-enter it every visit.
 * Dispatches a CustomEvent so other components on the page react without
 * needing React context.
 */
export function MedicationsPicker({ onChange }: { onChange: (meds: DrugClass[]) => void }) {
  const t = useTranslations("components.medications");
  const [meds, setMeds] = useState<DrugClass[]>([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const init = load();
    setMeds(init);
    onChange(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const filtered = resolveDrugQuery(q);
    return filtered.filter(d => !meds.includes(d.id)).slice(0, 8);
  }, [q, meds]);

  const add = (id: DrugClass) => {
    const next = [...meds, id];
    setMeds(next);
    save(next);
    onChange(next);
    setQ("");
  };
  const remove = (id: DrugClass) => {
    const next = meds.filter(m => m !== id);
    setMeds(next);
    save(next);
    onChange(next);
  };
  const clear = () => {
    setMeds([]);
    save([]);
    onChange([]);
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
            {t("label")}
          </span>
          {meds.length > 0 && (
            <span className="text-[10px] text-ink-soft">({meds.length})</span>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-xs text-accent hover:underline"
          aria-expanded={open}
        >
          {open ? t("close") : meds.length > 0 ? t("edit") : t("add")}
        </button>
      </div>

      {meds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {meds.map(id => {
            const d = getDrug(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-soft/40 border border-accent/30 text-xs text-ink"
              >
                {d.label}
                <button
                  onClick={() => remove(id)}
                  aria-label={t("removeAria", { label: d.label })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clear}
            className="text-[10px] text-ink-soft hover:text-ink ml-1 underline"
          >
            {t("clear")}
          </button>
        </div>
      )}

      {open && (
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-surface border border-line text-sm focus:border-accent outline-none"
              autoFocus
            />
          </div>
          <ul className="mt-2 max-h-[260px] overflow-y-auto space-y-1">
            {results.map(d => (
              <li key={d.id}>
                <button
                  onClick={() => add(d.id)}
                  className="w-full text-left p-2.5 rounded-lg border border-line hover:border-accent/50 hover:bg-accent-soft/40 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink">{d.label}</div>
                      <div className="text-[11px] text-ink-soft line-clamp-1">
                        {t("exampleLine", { examples: d.examples.slice(0, 3).join(", ") })}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-accent shrink-0" />
                  </div>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="text-xs text-ink-soft italic p-3 text-center">
                {t("noMatch")}
              </li>
            )}
          </ul>
          <p className="text-[10px] text-ink-soft/80 italic mt-2">
            {t("trustNote")}
          </p>
        </div>
      )}
    </div>
  );
}

/** Load once, outside React — used by any non-React consumer. */
export function getStoredMedications(): DrugClass[] {
  return load();
}
