import { getTranslations } from "next-intl/server";
import { getAllRemedies } from "@/lib/content";
import { BODY_REGIONS } from "@/lib/bodyMap";
import { matchRemedies } from "@/lib/bodyMapServer";
import { BodyMap } from "@/components/bodymap/BodyMap";

export const metadata = {
  title: "Body-map Symptom Finder",
  description: "Tap a body region to see relevant herbs from every tradition — organs, joints, skin, respiratory, and more.",
  alternates: { canonical: "/body-map" },
  openGraph: { title: "Body-map Symptom Finder", url: "/body-map", type: "website" }
};
export default async function BodyMapPage() {
  const t = await getTranslations("pages.bodyMap");
  const all = getAllRemedies();
  // Precompute for each region: slim remedy list (top 30 by confidence) + true count.
  const byRegion: Record<string, {
    items: Array<{ slug: string; name: string; latin?: string; region: string; benefit?: string; confidence?: string }>;
    total: number
  }> = Object.fromEntries(
    BODY_REGIONS.map(def => {
      const matched = matchRemedies(def.id, all)
        .sort((a, b) => (a.confidence === "verified" ? -1 : 0) - (b.confidence === "verified" ? -1 : 0));
      return [
        def.id,
        {
          total: matched.length,
          items: matched.slice(0, 30).map(r => ({
            slug: r.slug, name: r.name, latin: r.latin, region: r.region,
            benefit: r.benefit, confidence: r.confidence
          }))
        }
      ];
    })
  );

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

      <BodyMap byRegion={byRegion} />
    </section>
  );
}
