import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Leaf, FlaskConical, MapPin, AlertTriangle,
  UserCheck, UserX, Lightbulb, Clock, Pill, Printer, BookOpen, Flame
} from "lucide-react";
import { getAllRemedies, getRemedyBySlug, localizeRemedy } from "@/lib/content";
import { getLocale } from "next-intl/server";
import { getTier, canAccessFull } from "@/lib/tier";
import { enrichmentFor } from "@/lib/enrichment";
import { profileOf, ENERGETIC_DESC } from "@/lib/energetics";
import { Paywall } from "@/components/Paywall";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CopyButton } from "@/components/CopyButton";
import { WhereToBuy } from "@/components/WhereToBuy";
import { RemedyHero } from "@/components/remedy/RemedyHero";
import { pickVariant } from "@/components/remedy/pickVariant";
import { TasteRadar } from "@/components/remedy/TasteRadar";
import { ConfidenceMeter } from "@/components/remedy/ConfidenceMeter";
import { SafetyPanel } from "@/components/remedy/SafetyPanel";
import { DrugConflictNotice } from "@/components/remedy/DrugConflictNotice";
import { BotanicalImage } from "@/components/remedy/BotanicalImage";
import { ReferencesList } from "@/components/remedy/ReferencesList";
import EvidencePanel from "@/components/remedy/EvidencePanel";
import { imageFor } from "@/lib/images";
import { safetyFor, referencesFor } from "@/lib/safety";
import { inferPreparation, hasConcreteDose } from "@/lib/preparation";
import { evidenceFor } from "@/lib/evidence";
import { JsonLd } from "@/components/JsonLd";
import { remedyJsonLd, breadcrumbJsonLd, recipeHowToJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

export function generateStaticParams() {
  return getAllRemedies().map(r => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRemedyBySlug(params.slug);
  if (!r) return { title: "Remedy not found" };
  const desc = r.benefit
    ? `${r.benefit} — ${r.region} tradition. Benefits, preparation, safety, and references.`
    : `${r.name} — ${r.region} tradition. Benefits, preparation, safety, and references.`;
  const canonical = `/encyclopedia/${r.slug}`;
  return {
    title: r.name + (r.latin ? ` (${r.latin})` : ""),
    description: desc.slice(0, 180),
    alternates: { canonical },
    openGraph: {
      title: r.name,
      description: desc.slice(0, 200),
      type: "article",
      url: canonical
    },
    twitter: {
      card: "summary_large_image",
      title: r.name,
      description: desc.slice(0, 200)
    }
  };
}

export default async function RemedyPage({ params }: { params: { slug: string } }) {
  const r = getRemedyBySlug(params.slug);
  if (!r) return notFound();
  const locale = await getLocale();
  const localizedRemedy = localizeRemedy(r, locale);

  if (!canAccessFull(getTier())) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Paywall reason={`"${localizedRemedy.name}" is part of the full encyclopedia.`} />
      </div>
    );
  }

  const e = enrichmentFor(r.name);
  const profile = profileOf(localizedRemedy);
  const variant = pickVariant({ name: localizedRemedy.name, recipe: localizedRemedy.recipe, benefit: localizedRemedy.benefit });
  const safety = safetyFor(localizedRemedy);
  const references = referencesFor(localizedRemedy);
  const evidence = await evidenceFor(r.slug);
  const related = getAllRemedies()
    .filter(x => x.region === localizedRemedy.region && x.slug !== localizedRemedy.slug)
    .slice(0, 4);

  const ld = [
    remedyJsonLd(SITE_URL, localizedRemedy, references),
    breadcrumbJsonLd(SITE_URL, [
      { name: "Home",         url: "/" },
      { name: "Encyclopedia", url: "/encyclopedia" },
      { name: localizedRemedy.region,       url: `/browse?region=${encodeURIComponent(localizedRemedy.region)}` },
      { name: localizedRemedy.name,         url: `/encyclopedia/${localizedRemedy.slug}` }
    ])
  ];
  const howTo = recipeHowToJsonLd(SITE_URL, localizedRemedy);
  if (howTo) ld.push(howTo);

  return (
    <article className="max-w-4xl mx-auto px-5 py-10">
      <JsonLd data={ld} />
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link href="/encyclopedia" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink transition">
          <ArrowLeft className="w-4 h-4" /> Encyclopedia
        </Link>
        <div className="flex items-center gap-2">
          <FavoriteButton slug={localizedRemedy.slug} />
          <a
            href={`/api/print/${localizedRemedy.slug}`}
            className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink px-2.5 py-1.5 rounded-full border border-line hover:border-accent/50 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </a>
        </div>
      </div>

      {/* Variant-driven hero */}
      <RemedyHero variant={variant} name={localizedRemedy.name} latin={localizedRemedy.latin} region={localizedRemedy.region} evidence={evidence}>
        {localizedRemedy.attribution && (
          <p className="text-xs text-ink-soft mt-3">Source: {localizedRemedy.attribution}</p>
        )}
      </RemedyHero>

      {/* Botanical photo (Wikipedia cache). Renders null when no image. */}
      {imageFor(localizedRemedy.slug) && (
        <div className="mt-6">
          <BotanicalImage slug={localizedRemedy.slug} />
        </div>
      )}

      {/* Data-viz strip (taste radar + confidence + energetics) */}
      <div className="grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-5 mt-10">
        <div className="card p-4 flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold self-start">
            Taste profile
          </div>
          <div className="w-full aspect-square max-w-[180px] mt-2">
            <TasteRadar tastes={profile.tastes} percentages={profile.tastePercentages} />
          </div>
          {profile.tastes.length === 0 && (
            <p className="text-[10px] text-ink-soft italic mt-1">Not indexed</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <ConfidenceMeter confidence={localizedRemedy.confidence} />

          {profile.energetics.length > 0 && (
            <div className="card p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                Energetics
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.energetics.map(en => (
                  <span
                    key={en}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      color: ENERGETIC_DESC[en].color,
                      borderColor: `${ENERGETIC_DESC[en].color}55`,
                      background: `${ENERGETIC_DESC[en].color}12`
                    }}
                  >
                    {en}
                  </span>
                ))}
                {e?.partsUsed?.length && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium border border-line text-ink-soft">
                    Parts: {e.partsUsed.join(", ")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body content */}
      <div className="mt-8 space-y-5">
        {localizedRemedy.benefit && (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
              <Leaf className="w-5 h-5 text-accent" /> Benefit
            </h2>
            <p className="text-ink mt-2 leading-relaxed text-lg">{localizedRemedy.benefit}</p>
          </section>
        )}

        {/* Evidence grading panel */}
        <EvidencePanel data={evidence} />

        {e?.why && (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
              <Lightbulb className="w-5 h-5 text-accent" /> Why it works
            </h2>
            <p className="text-ink mt-2 leading-relaxed">{e.why}</p>
            {e.constituents?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.constituents.map((c, i) => (
                  <span key={i} className="chip">{c}</span>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {e && (e.who?.length || e.whoNot?.length) && (
          <section className="grid md:grid-cols-2 gap-4">
            {e.who?.length ? (
              <div className="card p-5">
                <h3 className="flex items-center gap-2 font-display text-xl text-ink">
                  <UserCheck className="w-5 h-5 text-emerald-500" /> Who may benefit
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink">
                  {e.who.map((x, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span><span>{x}</span></li>)}
                </ul>
              </div>
            ) : null}
            {e.whoNot?.length ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                <h3 className="flex items-center gap-2 font-display text-xl text-amber-600">
                  <UserX className="w-5 h-5" /> Who should avoid
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink">
                  {e.whoNot.map((x, i) => <li key={i} className="flex gap-2"><span className="text-amber-600">•</span><span>{x}</span></li>)}
                </ul>
              </div>
            ) : null}
          </section>
        )}

        {localizedRemedy.recipe && (
          <section className="card p-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-ember/10 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
                <FlaskConical className="w-5 h-5 text-accent" /> Preparation
              </h2>
              <CopyButton text={`${localizedRemedy.name} recipe:\n${localizedRemedy.recipe}`} />
            </div>
            <p className="text-ink mt-3 leading-relaxed relative">{localizedRemedy.recipe}</p>
            {(() => {
              const prep = inferPreparation(localizedRemedy.recipe);
              if (!prep) return null;
              const concrete = hasConcreteDose(localizedRemedy.recipe);
              return (
                <div className="mt-4 relative rounded-lg border border-line/60 bg-surface/50 px-4 py-3">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                      {concrete ? "Reference dose" : "Standard dose"}
                    </span>
                    <span className="text-xs font-medium text-ink">{prep.label}</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1.5 leading-relaxed">{prep.shortDose}</p>
                  {!concrete && (
                    <p className="text-[11px] text-ink-soft/80 italic mt-1.5">
                      The source recipe does not give an exact amount — this is the standard convention for a {prep.label.toLowerCase()}. Start at the lower end of the range.
                    </p>
                  )}
                  <Link href="/conventions" className="text-[11px] text-accent hover:underline mt-1 inline-block">
                    See all preparation conventions →
                  </Link>
                </div>
              );
            })()}
            <Link href="/recipe" className="inline-flex items-center gap-1 text-xs text-accent mt-4 hover:underline relative">
              <Flame className="w-3.5 h-3.5" /> Open in recipe builder →
            </Link>
          </section>
        )}

        {e?.when && (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
              <Clock className="w-5 h-5 text-accent" /> When to take it
            </h2>
            <p className="text-ink mt-2 leading-relaxed">{e.when}</p>
          </section>
        )}

        <DrugConflictNotice name={localizedRemedy.name} latin={localizedRemedy.latin} />

        {safety && <SafetyPanel safety={safety} />}

        {e && (e.warnings?.length || e.interactions?.length) && (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-amber-600">
              <AlertTriangle className="w-5 h-5" /> Additional cautions
            </h2>
            {e.warnings?.length ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-semibold mt-4">Warnings</p>
                <ul className="list-disc ml-5 text-sm text-ink mt-1 space-y-1">
                  {e.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </>
            ) : null}
            {e.interactions?.length ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-semibold mt-4">
                  <Pill className="inline w-3 h-3 mr-1" /> Medication interactions
                </p>
                <ul className="list-disc ml-5 text-sm text-ink mt-1 space-y-1">
                  {e.interactions.map((i, k) => <li key={k}>{i}</li>)}
                </ul>
              </>
            ) : null}
          </section>
        )}

        {localizedRemedy.extras?.length ? (
          <section className="card p-6">
            <h3 className="font-display text-xl text-ink">From the source text</h3>
            <ul className="list-disc ml-5 mt-3 text-sm text-ink space-y-1">
              {localizedRemedy.extras.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </section>
        ) : null}

        {localizedRemedy.sourcing && (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
              <MapPin className="w-5 h-5 text-accent" /> Local sourcing in {localizedRemedy.region}
            </h2>
            <p className="text-ink mt-2 leading-relaxed">{localizedRemedy.sourcing}</p>
          </section>
        )}

        <WhereToBuy name={localizedRemedy.name} region={localizedRemedy.region} affiliates={e?.affiliates} />

        {e?.pairings?.length ? (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
              <BookOpen className="w-5 h-5 text-accent" /> Traditional pairings
            </h2>
            <p className="text-ink mt-2 leading-relaxed">{e.pairings.join(" · ")}</p>
          </section>
        ) : null}

        <ReferencesList references={references} />

        {related.length > 0 && (
          <section className="pt-4">
            <h2 className="font-display text-2xl text-ink mb-4">More from {localizedRemedy.region}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map(x => {
                const localizedRelated = localizeRemedy(x, locale);
                return (
                  <Link key={x.slug} href={`/encyclopedia/${x.slug}`} className="card block p-4 group">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">{localizedRelated.region}</div>
                    <div className="font-display text-lg text-ink mt-0.5 group-hover:text-accent transition">{localizedRelated.name}</div>
                    {localizedRelated.benefit && <div className="text-xs text-ink-soft line-clamp-1 mt-1">{localizedRelated.benefit}</div>}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <p className="text-xs text-ink-soft mt-12 text-center italic">
        Educational content — not medical advice. Consult a qualified practitioner before use.
      </p>
    </article>
  );
}
