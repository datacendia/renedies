import { getTranslations } from "next-intl/server";
import { getAllRemedies } from "@/lib/content";
import { SEASONAL_CALENDAR } from "@/lib/seasonal";
import { SeasonalDashboard } from "@/components/seasonal/SeasonalDashboard";

export const metadata = {
  title: "Seasonal Dashboard",
  description: "Hemisphere-aware harvest calendar. What's in season, where you are, right now.",
  alternates: { canonical: "/seasonal" },
  openGraph: { title: "Seasonal Dashboard", url: "/seasonal", type: "website" }
};

export default async function SeasonalPage() {
  const t = await getTranslations("pages.seasonal");
  // Build slug lookup for each calendar keyword so the client can link out.
  const all = getAllRemedies();
  const index: Record<string, { slug: string; name: string; region: string }> = {};
  for (const r of all) {
    const key = r.name.toLowerCase();
    // Index the full name and each word (min 3 chars) for matching
    index[key] = { slug: r.slug, name: r.name, region: r.region };
    for (const word of key.split(/[^a-z]+/).filter(Boolean)) {
      if (!index[word] && word.length > 3) {
        index[word] = { slug: r.slug, name: r.name, region: r.region };
      }
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-44 mx-auto mt-4" />
        <p className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </p>
      </header>

      <SeasonalDashboard calendar={SEASONAL_CALENDAR} remedyIndex={index} />
    </section>
  );
}
