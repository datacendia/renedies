"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface Slim { slug: string; name: string; latin?: string; benefit?: string; confidence?: string }

const REGION_ICON: Record<string, string> = {
  "India": "🕉",
  "Peru/Andes/Spanish": "🪶",
  "China": "☯",
  "Japan": "🌸",
  "Global": "🌍"
};

const REGION_FLAVOUR_KEY: Record<string, string> = {
  "India": "ayurveda",
  "Peru/Andes/Spanish": "andean",
  "China": "tcm",
  "Japan": "kampo",
  "Global": "folk"
};

export function CompareView({
  concerns, regions, table
}: {
  concerns: string[];
  regions: string[];
  table: Record<string, Record<string, Slim[]>>;
}) {
  const t = useTranslations("components.compare");
  const [concern, setConcern] = useState(concerns[0]);

  return (
    <>
      {/* Concern selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {concerns.map(c => (
          <button
            key={c}
            onClick={() => setConcern(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              concern === c
                ? "bg-ember text-[#1a120a] border-ember shadow-glow"
                : "border-line text-ink-soft hover:border-accent/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Side-by-side column grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={concern}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
        >
          {regions.map((region, i) => {
            const picks = table[concern]?.[region] ?? [];
            return (
              <motion.div
                key={region}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 h-full flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold">
                      {region}
                    </div>
                    <div className="font-display text-xl text-ink mt-0.5">
                      {REGION_FLAVOUR_KEY[region] ? t(REGION_FLAVOUR_KEY[region]) : region}
                    </div>
                  </div>
                  <span className="text-3xl opacity-70" aria-hidden>
                    {REGION_ICON[region]}
                  </span>
                </div>
                <div className="divider-ornament my-3" />

                {picks.length === 0 ? (
                  <p className="text-xs text-ink-soft italic mt-2">
                    {t("noRemedy", { concern })}
                  </p>
                ) : (
                  <ul className="space-y-3 flex-1">
                    {picks.map(p => (
                      <li key={p.slug}>
                        <Link href={`/encyclopedia/${p.slug}`} className="group block">
                          <div className="font-display text-lg text-ink group-hover:text-accent transition leading-tight">
                            {p.name}
                          </div>
                          {p.latin && <div className="text-[11px] italic text-ink-soft">{p.latin}</div>}
                          {p.benefit && <p className="text-xs text-ink-soft mt-1 line-clamp-2">{p.benefit}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-ink-soft mt-10 max-w-2xl mx-auto">
        {t("footerNote")}
      </p>
    </>
  );
}
