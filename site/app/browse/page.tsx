import { getTranslations } from "next-intl/server";
import { RemedyCard } from "@/components/RemedyCard";
import { getAllRemedies, getPreviewRemedies, REGIONS, type Region } from "@/lib/content";
import { getTier, canAccessFull } from "@/lib/tier";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse remedies · Remedia",
  description:
    "Browse the full Remedia encyclopedia by region — Ayurveda, TCM, Kampo, Andean, and global folk traditions — with safety, interactions, and sourcing notes."
};

export default async function BrowsePage({ searchParams }: { searchParams: { region?: string } }) {
  const t = await getTranslations("pages.browse");
  const tier = getTier();
  const unlocked = canAccessFull(tier);
  const regionFilter = searchParams.region as Region | undefined;

  const all = unlocked ? getAllRemedies() : getPreviewRemedies(20);
  const filtered = regionFilter ? all.filter(r => r.region === regionFilter) : all;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="font-serif text-4xl text-brand-800 mr-auto">
          {unlocked ? t("titleAll") : t("titleFree")}
        </h1>
        <Link
          href="/browse"
          className={`px-3 py-1.5 rounded-full text-sm border ${!regionFilter ? "bg-brand-600 text-white border-brand-600" : "border-brand-200 text-brand-700 hover:bg-brand-50"}`}
        >
          {t("all")}
        </Link>
        {REGIONS.map(r => (
          <Link
            key={r}
            href={`/browse?region=${encodeURIComponent(r)}`}
            className={`px-3 py-1.5 rounded-full text-sm border ${regionFilter === r ? "bg-brand-600 text-white border-brand-600" : "border-brand-200 text-brand-700 hover:bg-brand-50"}`}
          >
            {r}
          </Link>
        ))}
      </div>

      {!unlocked && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm">
          {t("preview")} <Link href="/#pricing" className="underline font-medium">{t("unlock")}</Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <RemedyCard key={r.slug} r={r} locked={!unlocked && !getPreviewRemedies(20).some(p => p.slug === r.slug)} />
        ))}
      </div>
    </div>
  );
}
