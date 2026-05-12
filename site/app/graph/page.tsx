import { getTranslations } from "next-intl/server";
import { buildRemedyGraph } from "@/lib/graphData";
import { HerbGraph } from "@/components/graph/HerbGraph";

export const metadata = {
  title: "Herb Relationship Graph",
  description: "A force-directed map of which herbs share symptoms, tastes, and energetics across every tradition.",
  alternates: { canonical: "/graph" },
  openGraph: { title: "Herb Relationship Graph", url: "/graph", type: "website" }
};

export default async function GraphPage() {
  const t = await getTranslations("pages.graph");
  const data = buildRemedyGraph();

  return (
    <section className="max-w-7xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-8">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-40 mx-auto mt-4" />
        <p className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </p>
        <p className="text-xs text-ink-soft mt-2">
          {t("counts", { herbs: data.nodes.filter(n => n.kind === "herb").length, concerns: data.nodes.filter(n => n.kind === "anchor").length, edges: data.edges.length })}
        </p>
      </header>

      <HerbGraph data={data} />
    </section>
  );
}
