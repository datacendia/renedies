import { Metadata } from "next";
import { FlaskConical, BookOpen, ExternalLink, AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Evidence Grading Schema",
  description: "How we grade clinical evidence for herbal remedies",
};

const GRADES = [
  { tier: "likely",      dots: "●●●●○", color: "emerald" },
  { tier: "possibly",    dots: "●●●○○", color: "teal" },
  { tier: "unclear",     dots: "●●○○○", color: "amber" },
  { tier: "preliminary", dots: "●○○○○", color: "orange" },
  { tier: "ineffective", dots: "⚠️○○○○",  color: "red" },
  { tier: "traditional", dots: "○○○○○", color: "slate" },
];

const COLOR_MAP = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  teal: "text-teal-600 bg-teal-50 border-teal-200",
  amber: "text-amber-600 bg-amber-50 border-amber-200",
  orange: "text-orange-600 bg-orange-50 border-orange-200",
  red: "text-red-600 bg-red-50 border-red-200",
  slate: "text-slate-600 bg-slate-50 border-slate-200",
};

export default async function MethodsPage() {
  const t = await getTranslations("pages.methods");
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink mb-3">{t("title")}</h1>
        <p className="text-lg text-ink-soft">{t("subtitle")}</p>
      </div>

      <section className="card p-6 mb-8">
        <h2 className="flex items-center gap-2 font-display text-2xl text-ink mb-4">
          <FlaskConical className="w-6 h-6 text-accent" /> {t("overviewTitle")}
        </h2>
        <p className="text-ink leading-relaxed mb-4">{t("overview1")}</p>
        <p className="text-ink-soft leading-relaxed">{t("overview2")}</p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="font-display text-2xl text-ink mb-4">{t("tiersTitle")}</h2>
        {GRADES.map((grade) => (
          <div
            key={grade.tier}
            className={`card p-5 border-l-4 ${COLOR_MAP[grade.color as keyof typeof COLOR_MAP].split(" ").slice(1).join(" ")}`}
            style={{ borderLeftColor: grade.color === "emerald" ? "#059669" : grade.color === "teal" ? "#0d9488" : grade.color === "amber" ? "#d97706" : grade.color === "orange" ? "#ea580c" : grade.color === "red" ? "#dc2626" : "#64748b" }}
          >
            <div className="flex items-start gap-4">
              <div className={`font-mono text-2xl ${COLOR_MAP[grade.color as keyof typeof COLOR_MAP].split(" ")[0]}`}>
                {grade.dots}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${COLOR_MAP[grade.color as keyof typeof COLOR_MAP].split(" ")[0]}`}>
                  {t(`grades.${grade.tier}` as any)}
                </h3>
                <p className="text-ink-soft mt-1">{t(`grades.${grade.tier}Desc` as any)}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="card p-6 mb-8">
        <h2 className="flex items-center gap-2 font-display text-2xl text-ink mb-4">
          <BookOpen className="w-6 h-6 text-accent" /> {t("sourcesTitle")}
        </h2>
        <p className="text-ink leading-relaxed mb-4">{t("sources1")}</p>
        <ul className="space-y-2 text-ink-soft list-disc ml-5">
          <li>{t("sourceBullets.1")}</li>
          <li>{t("sourceBullets.2")}</li>
          <li>{t("sourceBullets.3")}</li>
          <li>{t("sourceBullets.4")}</li>
          <li>{t("sourceBullets.5")}</li>
        </ul>
      </section>

      <section className="card p-6 mb-8 border-amber-200 bg-amber-50">
        <h2 className="flex items-center gap-2 font-display text-2xl text-amber-700 mb-4">
          <AlertTriangle className="w-6 h-6" /> {t("contradictionsTitle")}
        </h2>
        <p className="text-ink leading-relaxed mb-4">{t("contradictions1")}</p>
        <p className="text-ink-soft leading-relaxed mb-4">{t("contradictions2")}</p>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <p className="text-sm font-medium text-amber-700 mb-2">{t("exampleLabel")}</p>
          <p className="text-sm text-ink">{t("exampleText")}</p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-2xl text-ink mb-4">{t("transparencyTitle")}</h2>
        <p className="text-ink leading-relaxed mb-4">{t("transparency")}</p>
        <a
          href="https://pubmed.ncbi.nlm.nih.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium"
        >
          <ExternalLink className="w-4 h-4" /> {t("searchPubmed")}
        </a>
      </section>
    </div>
  );
}
