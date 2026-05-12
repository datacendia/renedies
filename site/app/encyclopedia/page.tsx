import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Paywall } from "@/components/Paywall";
import { ClientSearch } from "@/components/ClientSearch";
import { getAllRemedies } from "@/lib/content";
import { getTier, canAccessFull } from "@/lib/tier";
import { JsonLd } from "@/components/JsonLd";
import { collectionJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Encyclopedia",
  description: "Full encyclopedia of traditional herbal remedies. Instant search by name, Latin binomial, or benefit. Filter by tradition, confidence, and tag.",
  alternates: { canonical: "/encyclopedia" },
  openGraph: { title: "Encyclopedia", url: "/encyclopedia", type: "website" }
};

export default async function EncyclopediaIndex() {
  const t = await getTranslations("pages.encyclopedia");
  if (!canAccessFull(getTier())) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Paywall reason={t("locked")} />
      </div>
    );
  }
  const remedies = getAllRemedies();
  const ld = [
    collectionJsonLd(
      SITE_URL,
      "/encyclopedia",
      "Remedia Encyclopedia",
      `Full encyclopedia of ${remedies.length} traditional herbal remedies across five healing traditions.`,
      remedies.slice(0, 200).map(r => ({
        name: r.latin ? `${r.name} (${r.latin})` : r.name,
        url: `/encyclopedia/${r.slug}`
      }))
    ),
    breadcrumbJsonLd(SITE_URL, [
      { name: "Home",         url: "/" },
      { name: "Encyclopedia", url: "/encyclopedia" }
    ])
  ];
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <JsonLd data={ld} />
      <div className="mb-6">
        <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
        <p className="text-ink-soft mt-1">
          {t("body", { count: remedies.length })}
        </p>
      </div>
      <ClientSearch remedies={remedies} />
    </div>
  );
}
