import { getTranslations } from "next-intl/server";
import { getAllRemedies, REGIONS, type Region } from "@/lib/content";
import { RecipeBuilder } from "@/components/recipe/RecipeBuilder";

export const metadata = {
  title: "Recipe Builder",
  description: "Build a custom herbal blend with drag-and-drop. Live doses, ratios, and interaction warnings.",
  alternates: { canonical: "/recipe" },
  openGraph: { title: "Recipe Builder", url: "/recipe", type: "website" }
};

export default async function RecipePage() {
  const t = await getTranslations("pages.recipe");
  const all = getAllRemedies();
  // Interleave across regions so the visible head of the catalog mixes all five
  // traditions rather than leading with whichever region sorts first.
  const byRegion: Record<Region, typeof all> = Object.fromEntries(
    REGIONS.map(r => [r, all.filter(x => x.region === r)])
  ) as Record<Region, typeof all>;
  const interleaved: typeof all = [];
  const maxLen = Math.max(...REGIONS.map(r => byRegion[r].length));
  for (let i = 0; i < maxLen; i++) {
    for (const r of REGIONS) {
      const next = byRegion[r][i];
      if (next) interleaved.push(next);
    }
  }
  const catalog = interleaved.map(r => ({
    slug: r.slug, name: r.name, latin: r.latin, region: r.region,
    benefit: r.benefit, confidence: r.confidence
  }));

  return (
    <section className="max-w-7xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-40 mx-auto mt-4" />
        <p className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </p>
      </header>

      <RecipeBuilder catalog={catalog} />
    </section>
  );
}
