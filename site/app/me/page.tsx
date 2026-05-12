"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Bookmark, Heart, Trash2, Leaf, Calendar as CalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  loadRitualLog, currentStreak, longestStreak, heatmap,
  loadRecipes, deleteRecipe,
  type RitualLogEntry, type SavedRecipe
} from "@/lib/personal";
import { loadFavorites } from "@/lib/favorites";
import { RITUALS } from "@/lib/rituals";

export default function MePage() {
  const t = useTranslations("pages.me");
  const [log, setLog] = useState<RitualLogEntry[]>([]);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [favCount, setFavCount] = useState(0);

  const refresh = () => {
    setLog(loadRitualLog());
    setRecipes(loadRecipes());
    setFavCount(loadFavorites().size);
  };

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("remedia:ritual-logged", h);
    window.addEventListener("remedia:recipe-saved", h);
    window.addEventListener("remedia:favorites-changed", h);
    return () => {
      window.removeEventListener("remedia:ritual-logged", h);
      window.removeEventListener("remedia:recipe-saved", h);
      window.removeEventListener("remedia:favorites-changed", h);
    };
  }, []);

  const streak     = currentStreak(log);
  const best       = longestStreak(log);
  const heat       = heatmap(log);
  const totalDays  = new Set([...heat.keys()]).size;

  const ritualCounts = new Map<string, number>();
  for (const e of log) ritualCounts.set(e.slug, (ritualCounts.get(e.slug) ?? 0) + 1);
  const topRituals = [...ritualCounts.entries()]
    .map(([slug, n]) => ({ slug, n, ritual: RITUALS.find(r => r.slug === slug) }))
    .filter(x => x.ritual)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);

  const handleDelete = (id: string) => {
    deleteRecipe(id);
  };

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-40 mx-auto mt-4" />
        <p className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard icon={Flame}     label={t("currentStreak")} value={streak}    suffix={streak === 1 ? t("day") : t("days")} accent />
        <StatCard icon={CalIcon}   label={t("longestStreak")} value={best}      suffix={best === 1 ? t("day") : t("days")} />
        <StatCard icon={Leaf}      label={t("practiceDays")}  value={totalDays} suffix={totalDays === 1 ? t("day") : t("days")} />
        <StatCard icon={Heart}     label={t("favoritesLabel")} value={favCount}  suffix={t("saved")} />
      </div>

      {/* Heatmap */}
      <section className="card p-6 mb-10">
        <h2 className="font-display text-2xl text-ink">{t("last26Weeks")}</h2>
        <p className="text-xs text-ink-soft mt-1">{t("heatmapHint")}</p>
        <Heatmap heat={heat} lessLabel={t("less")} moreLabel={t("more")} />
      </section>

      {/* Most-practised rituals */}
      {topRituals.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-ink mb-4">{t("mostPractised")}</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {topRituals.map(({ slug, n, ritual }) => (
              <Link key={slug} href={`/rituals/${slug}`} className="card block p-4 group">
                <div className="text-[9px] uppercase tracking-[0.18em] text-accent">{ritual!.region}</div>
                <div className="font-display text-lg text-ink mt-0.5 group-hover:text-accent transition">
                  {ritual!.title}
                </div>
                <div className="text-xs text-ink-soft mt-2">{n} {n === 1 ? t("completion") : t("completions")}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Saved recipes */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-accent" /> {t("savedBlends")}
        </h2>
        {recipes.length === 0 ? (
          <div className="card p-8 text-center text-ink-soft">
            <p>{t("noBlends")}</p>
            <Link href="/recipe" className="btn btn-ghost mt-4">{t("openBuilder")}</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {recipes.map(r => (
              <div key={r.id} className="card p-5 relative">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="absolute top-3 right-3 text-ink-soft hover:text-ink transition"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <div className="font-display text-lg text-ink mt-1 pr-8">{r.title}</div>
                <div className="text-xs text-ink-soft mt-1">
                  {r.servings === 1 ? t("serving", { count: r.servings }) : t("servings", { count: r.servings })}
                </div>
                <ul className="mt-3 text-xs text-ink space-y-0.5">
                  {r.ingredients.map(ing => (
                    <li key={ing.slug}>
                      <Link href={`/encyclopedia/${ing.slug}`} className="hover:text-accent">
                        • {ing.name} <span className="text-ink-soft">— {ing.parts === 1 ? t("part", { count: ing.parts }) : t("parts", { count: ing.parts })}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function StatCard({
  icon: Icon, label, value, suffix, accent
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: number; suffix: string; accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`card p-5 ${accent ? "!border-ember/40 bg-ember/5" : ""}`}
    >
      <Icon className={`w-5 h-5 ${accent ? "text-ember" : "text-accent"}`} />
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold mt-2">
        {label}
      </div>
      <div className="font-display text-4xl text-ink mt-1 tabular-nums">
        {value}
        <span className="text-base text-ink-soft ml-1 font-sans">{suffix}</span>
      </div>
    </motion.div>
  );
}

/* ─────── Heatmap ─────── */
function Heatmap({ heat, lessLabel, moreLabel }: { heat: Map<string, number>; lessLabel: string; moreLabel: string }) {
  const WEEKS = 26;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Start on Monday WEEKS ago.
  const start = new Date(today);
  start.setDate(today.getDate() - (WEEKS * 7 - 1));

  const days: { iso: string; date: Date; count: number }[] = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    days.push({ iso, date: d, count: heat.get(iso) ?? 0 });
  }

  // Group into columns (weeks).
  const cols: typeof days[] = [];
  for (let w = 0; w < WEEKS; w++) cols.push(days.slice(w * 7, w * 7 + 7));

  const intensity = (n: number) =>
    n === 0 ? "rgb(var(--line))" :
    n === 1 ? "rgb(var(--accent) / 0.35)" :
    n === 2 ? "rgb(var(--accent) / 0.6)" :
              "rgb(var(--ember) / 0.85)";

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="inline-flex gap-1">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map(d => (
              <div
                key={d.iso}
                title={`${d.iso} · ${d.count} ritual${d.count === 1 ? "" : "s"}`}
                className="w-3 h-3 rounded-sm"
                style={{ background: intensity(d.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-ink-soft">
        {lessLabel}
        {[0, 1, 2, 3].map(n => (
          <span key={n} className="w-3 h-3 rounded-sm" style={{ background: intensity(n) }} />
        ))}
        {moreLabel}
      </div>
    </div>
  );
}

function pad(n: number) { return n.toString().padStart(2, "0"); }
