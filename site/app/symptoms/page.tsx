import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAllRemedies, getSymptomSummaries, REGIONS } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";
const REMEDY_COUNT = getAllRemedies().length;

export const metadata: Metadata = {
  title: "Browse by symptom",
  description:
    "Pick what's bothering you — sleep, digestion, joints, immunity, women's health, and more — and see ranked remedies from Ayurveda, Andean, TCM, Kampo, and global traditions.",
  alternates: { canonical: "/symptoms" },
  openGraph: {
    title: "Browse by symptom — Remedia",
    description:
      `Symptom-first entry to ${REMEDY_COUNT} remedies across five traditions.`,
    type: "website",
    url: "/symptoms"
  }
};

/** Short one-liner shown under each concern card. Hand-written because it
 *  reads better than any auto-derived summary. */
const BLURB: Record<string, string> = {
  "Sleep & Anxiety":     "Settle the nervous system — valerian, ashwagandha, passionflower, tulsi, kampo yokukansan.",
  "Cough & Respiratory": "Open airways, ease the throat — mullein, licorice, thyme, ma-huang formulas, pi-pa-gao.",
  "Digestion":           "Appetite, bloating, nausea, IBS — ginger, peppermint, hingvashtak, rikkunshitō, chamomile.",
  "Joints & Pain":       "Inflammatory and muscular — turmeric, boswellia, nirgundi oil, daruharidra, warming oils.",
  "Immunity & Fatigue":  "Adaptogens and rasayanas — ashwagandha, reishi, astragalus, schisandra, eleuthero.",
  "Women's Health":      "Menstrual, menopausal, fertility — shatavari, dong quai, tōki-shakuyaku-san, red raspberry.",
  "Men's Vitality":      "Libido, prostate, stamina — ashwagandha, safed musli, maca, saw palmetto, eucommia.",
  "Skin":                "Topical and internal — turmeric, neem, calendula, manjistha, centella.",
  "Heart & BP":          "Circulation, cholesterol, BP — hawthorn, arjuna, garlic, hibiscus, olive leaf.",
  "Liver & Detox":       "Hepatoprotective and bitter — milk thistle, bhumyamalaki, dandelion, artichoke.",
  "Blood Sugar":         "Glycemic modulators — cinnamon, gymnema, fenugreek, bitter melon, berberine."
};

const REGION_ACCENT: Record<string, string> = {
  "India":               "text-amber-700",
  "Peru/Andes/Spanish":  "text-orange-700",
  "China":               "text-red-700",
  "Japan":               "text-rose-700",
  "Global":              "text-emerald-700"
};

export default async function SymptomsIndexPage() {
  const t = await getTranslations("pages.symptoms");
  const tc = await getTranslations("common");
  const summaries = getSymptomSummaries();

  return (
    <article className="max-w-5xl mx-auto px-5 py-10">
      <JsonLd data={breadcrumbJsonLd(SITE_URL, [
        { name: "Home", url: "/" },
        { name: "Symptoms", url: "/symptoms" }
      ])} />

      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> {t("badge")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-3">
          {t("title")}
        </h1>
        <p className="text-ink-soft mt-3 max-w-2xl mx-auto leading-relaxed">
          {t("body", { count: REMEDY_COUNT })}
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {summaries.map(s => {
          const topRegions = REGIONS
            .filter(r => (s.byRegion[r] ?? 0) > 0)
            .sort((a, b) => (s.byRegion[b] ?? 0) - (s.byRegion[a] ?? 0));
          return (
            <Link
              key={s.slug}
              href={`/symptoms/${s.slug}`}
              className="card p-5 group hover:border-accent/50 transition relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-xl text-ink group-hover:text-accent transition">
                    {s.label}
                  </h2>
                  <p className="text-xs text-ink-soft mt-1.5 leading-relaxed line-clamp-2">
                    {(() => { try { return t(`blurbs.${s.label}` as any); } catch { return t("defaultBlurb"); } })()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition shrink-0 mt-1" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  {topRegions.map(r => (
                    <span key={r} className={`uppercase tracking-[0.15em] ${REGION_ACCENT[r] ?? "text-ink-soft"}`}>
                      {r.split("/")[0]} · {s.byRegion[r]}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-ink-soft">{s.count === 1 ? t("herb", { count: s.count }) : t("herbs", { count: s.count })}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-ink-soft mt-10 text-center italic">
        {tc("educationalNoteLong")}
      </p>
    </article>
  );
}
