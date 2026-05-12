import { getTranslations } from "next-intl/server";
import { getAllRemedies, symptomsOf, REGIONS, getAllSymptoms } from "@/lib/content";
import { CompareView } from "@/components/compare/CompareView";

export const metadata = {
  title: "Cross-tradition Comparison",
  description: "One concern, five traditions, side by side. Compare Ayurveda, TCM, Kampo, Andean, and global herbalism.",
  alternates: { canonical: "/compare" },
  openGraph: { title: "Cross-tradition Comparison", url: "/compare", type: "website" }
};

export default async function ComparePage() {
  const t = await getTranslations("pages.compare");
  const all = getAllRemedies();
  const concerns = getAllSymptoms();

  // For each concern × region, pick the top-3 remedies (preferring verified).
  const table: Record<string, Record<string, any[]>> = {};
  for (const concern of concerns) {
    table[concern] = {};
    for (const region of REGIONS) {
      const matches = all.filter(r => r.region === region && symptomsOf(r).includes(concern));
      // Sort: verified > traditional > preliminary.
      const rank = { verified: 0, traditional: 1, preliminary: 2 } as Record<string, number>;
      matches.sort((a, b) => (rank[a.confidence ?? "traditional"] - rank[b.confidence ?? "traditional"]));
      table[concern][region] = matches.slice(0, 3).map(r => ({
        slug: r.slug, name: r.name, latin: r.latin, benefit: r.benefit,
        confidence: r.confidence
      }));
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-44 mx-auto mt-4" />
        <p className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </p>
      </header>

      <CompareView concerns={concerns} regions={REGIONS} table={table} />
    </section>
  );
}
