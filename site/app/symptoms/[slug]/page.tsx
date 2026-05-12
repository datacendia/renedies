import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Leaf, Shield, Sparkles } from "lucide-react";
import {
  getAllSymptoms,
  remediesForSymptom,
  symptomFromSlug,
  symptomSlug,
  REGIONS,
  type Region
} from "@/lib/content";
import { safetyFor, FLAG_META } from "@/lib/safety";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

export function generateStaticParams() {
  return getAllSymptoms().map(label => ({ slug: symptomSlug(label) }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const label = symptomFromSlug(params.slug);
  if (!label) return { title: "Concern not found" };
  const matches = remediesForSymptom(label);
  return {
    title: `${label} — remedies`,
    description: `${matches.length} traditional remedies for ${label.toLowerCase()}, ranked across Ayurveda, Andean, TCM, Kampo, and global traditions.`,
    alternates: { canonical: `/symptoms/${params.slug}` },
    openGraph: {
      title: `${label} — ${matches.length} traditional remedies`,
      description: `Ranked cross-tradition list with safety flags and references.`,
      type: "article",
      url: `/symptoms/${params.slug}`
    }
  };
}

const REGION_ACCENT: Record<Region, { border: string; text: string; bg: string }> = {
  "India":              { border: "border-amber-500/30",  text: "text-amber-700",  bg: "bg-amber-500/5" },
  "Peru/Andes/Spanish": { border: "border-orange-500/30", text: "text-orange-700", bg: "bg-orange-500/5" },
  "China":              { border: "border-red-500/30",    text: "text-red-700",    bg: "bg-red-500/5" },
  "Japan":              { border: "border-rose-500/30",   text: "text-rose-700",   bg: "bg-rose-500/5" },
  "Global":             { border: "border-emerald-500/30",text: "text-emerald-700",bg: "bg-emerald-500/5" }
};

export default function SymptomDetailPage({ params }: { params: { slug: string } }) {
  const label = symptomFromSlug(params.slug);
  if (!label) return notFound();

  const all = remediesForSymptom(label);
  const byRegion = new Map<Region, typeof all>();
  for (const r of all) {
    if (!byRegion.has(r.region)) byRegion.set(r.region, []);
    byRegion.get(r.region)!.push(r);
  }

  return (
    <article className="max-w-5xl mx-auto px-5 py-10">
      <JsonLd data={breadcrumbJsonLd(SITE_URL, [
        { name: "Home",     url: "/" },
        { name: "Symptoms", url: "/symptoms" },
        { name: label,      url: `/symptoms/${params.slug}` }
      ])} />

      <Link
        href="/symptoms"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink transition"
      >
        <ArrowLeft className="w-4 h-4" /> All concerns
      </Link>

      <header className="mt-6">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Concern
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2">{label}</h1>
        <p className="text-ink-soft mt-3">
          {all.length} remedies across {byRegion.size} tradition{byRegion.size !== 1 ? "s" : ""}, ranked by relevance + data confidence.
        </p>
      </header>

      {all.length === 0 && (
        <p className="mt-12 text-center text-ink-soft italic">
          No remedies matched. Try a different concern.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {REGIONS
          .filter(r => byRegion.has(r))
          .map(region => {
            const accent = REGION_ACCENT[region];
            const remedies = byRegion.get(region)!;
            return (
              <section key={region}>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className={`font-display text-2xl ${accent.text}`}>{region}</h2>
                  <span className="text-xs text-ink-soft">
                    {remedies.length} herb{remedies.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remedies.slice(0, 12).map((r, idx) => {
                    const s = safetyFor(r);
                    const worst = s
                      ? (s.pregnancy === "avoid" || s.lactation === "avoid" ? "avoid"
                         : s.pregnancy === "caution" || s.lactation === "caution" ? "caution"
                         : "safe")
                      : null;
                    const meta = worst ? FLAG_META[worst] : null;
                    return (
                      <Link
                        key={r.slug}
                        href={`/encyclopedia/${r.slug}`}
                        className={`card p-4 block group ${accent.border} hover:border-accent/50 transition`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                            #{idx + 1}
                          </span>
                          {meta && (
                            <span
                              title={`${meta.label} — pregnancy: ${s!.pregnancy}, lactation: ${s!.lactation}`}
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ background: meta.color }}
                            />
                          )}
                        </div>
                        <div className="font-display text-lg text-ink mt-1 group-hover:text-accent transition">
                          {r.name}
                        </div>
                        {r.latin && (
                          <div className="text-[11px] italic text-ink-soft">{r.latin}</div>
                        )}
                        {r.benefit && (
                          <p className="text-xs text-ink-soft mt-2 leading-relaxed line-clamp-2">
                            {r.benefit}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
                {remedies.length > 12 && (
                  <p className="text-xs text-ink-soft italic mt-2">
                    + {remedies.length - 12} more in the encyclopedia.
                  </p>
                )}
              </section>
            );
          })}
      </div>

      <section className="mt-12 card p-5 bg-surface/50 flex items-start gap-3">
        <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-ink-soft leading-relaxed">
          <strong className="text-ink">Reading this list:</strong> ranking reflects
          how prominently the remedy addresses this concern and our curated
          confidence tier — not clinical efficacy. Always check the individual
          monograph for safety flags (pregnancy, drug interactions, duration
          limits) before use.{" "}
          <Link href="/conventions" className="underline hover:text-ink">
            Preparation conventions
          </Link>.
        </div>
      </section>
    </article>
  );
}
