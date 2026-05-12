"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sun, Snowflake, Leaf, Flower2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Hemisphere, SeasonalMonth } from "@/lib/seasonal";
import { imageFor } from "@/lib/images";

interface RemedyRef { slug: string; name: string; region: string; }

const CATEGORY_ICON = {
  fruit:    "🍓",
  leaf:     "🌿",
  root:     "🫘",
  flower:   "🌸",
  bark:     "🪵",
  mushroom: "🍄",
  seed:     "🌰"
} as const;

export function SeasonalDashboard({
  calendar, remedyIndex
}: {
  calendar: Record<Hemisphere, SeasonalMonth[]>;
  remedyIndex: Record<string, RemedyRef>;
}) {
  const t = useTranslations("components.seasonal");
  const [hemi, setHemi] = useState<Hemisphere>("N");
  const [monthIdx, setMonthIdx] = useState<number>(new Date().getMonth());
  const [detectedTZ, setDetectedTZ] = useState<string>("");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDetectedTZ(tz);
      // Crude hemisphere heuristic via timezone string — works for most cases.
      const southern = /America\/(Argentina|Buenos|Santiago|Sao_Paulo|La_Paz|Lima|Bogota)|Africa\/(Johannesburg|Nairobi|Harare|Lusaka|Maputo)|Australia|Pacific\/(Auckland|Fiji|Tahiti)|Antarctica|Indian\/(Mauritius|Reunion)/i;
      setHemi(southern.test(tz) ? "S" : "N");
      setMonthIdx(new Date().getMonth());
    } catch { /* noop */ }
  }, []);

  const year = calendar[hemi];
  const current = year[monthIdx];

  const resolved = useMemo(() => current.herbs.map(h => {
    // Use explicit slug if provided, otherwise try keyword matching
    const slug = h.slug;
    let image = slug ? imageFor(slug) : null;
    let found = slug ? { slug, name: h.name, region: "" } : null;
    
    // If no explicit slug or no image found, try keyword matching
    if (!image) {
      const key = h.keyword.toLowerCase();
      const parts = key.split(/\s+/);
      const matched = remedyIndex[parts[0]] ?? Object.values(remedyIndex).find(r => r.name.toLowerCase().includes(key));
      if (matched) {
        image = imageFor(matched.slug);
        found = matched;
      }
    }
    
    // If still no image, try direct lookup using the seasonal herb's name as a fallback
    if (!image && !slug) {
      const key = h.keyword.toLowerCase().replace(/\s+/g, "-");
      // Try common slug patterns
      const possibleSlugs = [
        key,
        `global-${key}`,
        `india-${key}`,
        `china-${key}`,
        `japan-${key}`,
        `andes-${key}`
      ];
      for (const possibleSlug of possibleSlugs) {
        const testImage = imageFor(possibleSlug);
        if (testImage) {
          image = testImage;
          found = { slug: possibleSlug, name: h.name, region: "" };
          break;
        }
      }
    }
    
    return { ...h, remedy: found, image };
  }), [current, remedyIndex]);

  const seasonIcon =
    monthIdx >= 2 && monthIdx <= 4  ? <Flower2 className="w-5 h-5" /> :
    monthIdx >= 5 && monthIdx <= 7  ? <Sun     className="w-5 h-5" /> :
    monthIdx >= 8 && monthIdx <= 10 ? <Leaf    className="w-5 h-5" /> :
                                      <Snowflake className="w-5 h-5" />;

  return (
    <div>
      {/* Header controls */}
      <div className="card p-5 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-soft grid place-items-center text-accent">
            {seasonIcon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              {hemi === "N" ? t("northern") : t("southern")}
            </div>
            <div className="font-display text-2xl text-ink">
              {current.label}
            </div>
          </div>
          {detectedTZ && (
            <span className="text-xs text-ink-soft inline-flex items-center gap-1 ml-2">
              <MapPin className="w-3 h-3" /> {detectedTZ}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-line overflow-hidden text-xs">
            <button
              className={`px-3 py-1.5 ${hemi === "N" ? "bg-ember text-[#1a120a]" : "text-ink-soft"}`}
              onClick={() => setHemi("N")}
            >N</button>
            <button
              className={`px-3 py-1.5 ${hemi === "S" ? "bg-ember text-[#1a120a]" : "text-ink-soft"}`}
              onClick={() => setHemi("S")}
            >S</button>
          </div>
        </div>
      </div>

      {/* Month timeline */}
      <div className="relative mb-8">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {year.map((m, i) => {
            const active = i === monthIdx;
            return (
              <button
                key={m.month}
                onClick={() => setMonthIdx(i)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium border transition min-w-[80px] ${
                  active
                    ? "bg-ember/15 border-ember text-ink shadow-glow-sm"
                    : "border-line text-ink-soft hover:border-accent/40"
                }`}
              >
                {m.label.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.month + hemi}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
        >
          <div className="card p-6 mb-6 bg-gradient-to-r from-accent/5 to-ember/5 border-ember/20">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ember font-semibold">
              {t("thisMonthAsks")}
            </div>
            <p className="font-display text-2xl text-ink mt-1 italic">
              {current.focus}
            </p>
          </div>

          {/* Herb grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {resolved.map((h, i) => {
              const Wrapper = h.remedy ? Link : "div";
              const wrapperProps = h.remedy
                ? { href: `/encyclopedia/${h.remedy.slug}`, className: "card block p-4 h-full group" }
                : { className: "card block p-4 h-full opacity-70" } as any;
              return (
                <motion.div
                  key={`${current.month}-${h.name}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Wrapper {...wrapperProps}>
                    {h.image ? (
                      <div className="relative w-full h-32 mb-3 overflow-hidden rounded bg-surface">
                        <img
                          src={h.image.thumb}
                          alt={h.image.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-[9px] uppercase tracking-wider text-white">{h.category}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl" aria-hidden>{CATEGORY_ICON[h.category]}</span>
                        <span className="text-[9px] uppercase tracking-wider text-accent">{h.category}</span>
                      </div>
                    )}
                    <div className="font-display text-lg text-ink">{h.name}</div>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">{h.why}</p>
                    {h.remedy ? (
                      <div className="text-[10px] text-accent mt-2 opacity-0 group-hover:opacity-100 transition">
                        {t("openMonograph")}
                      </div>
                    ) : (
                      <div className="text-[10px] text-ink-soft mt-2 italic">
                        {t("notInLibrary")}
                      </div>
                    )}
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
