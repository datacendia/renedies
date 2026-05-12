import { getTranslations } from "next-intl/server";
import { getAllRemedies } from "@/lib/content";
import { profileOf } from "@/lib/energetics";
import { TasteCompass } from "@/components/compass/TasteCompass";

export const metadata = {
  title: "Taste & Energetics Compass",
  description: "Explore herbs by flavour and temperature across Ayurveda, TCM, Kampo, Andean, and global traditions.",
  alternates: { canonical: "/compass" },
  openGraph: { title: "Taste & Energetics Compass", url: "/compass", type: "website" }
};

export default async function CompassPage() {
  const t = await getTranslations("pages.compass");
  // Precompute profiles server-side so the client bundle is lightweight.
  const all = getAllRemedies();
  const entries = all.map(r => {
    const p = profileOf(r);
    return {
      slug: r.slug,
      name: r.name,
      latin: r.latin,
      region: r.region,
      benefit: r.benefit,
      confidence: r.confidence,
      tastes: p.tastes,
      energetics: p.energetics
    };
  }).filter(e => e.tastes.length > 0 || e.energetics.length > 0);

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

      <TasteCompass entries={entries} />
    </section>
  );
}
