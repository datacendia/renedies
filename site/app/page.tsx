import Link from "next/link";
import { Compass, Activity, Flower2, Sparkles, Map, Calendar, FlaskConical, Flame, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PricingTiers } from "@/components/PricingTiers";
import { RemedyCard } from "@/components/RemedyCard";
import { getPreviewRemedies, getAllRemedies, getRemediesByRegion, getSymptomSummaries, REGIONS, localizeRemedies } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { Stagger, StaggerItem, FadeUp } from "@/components/motion/MotionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

// Features are keyed by their i18n namespace suffix (e.g. `home.features.compassTitle`).
const FEATURES = [
  { href: "/compass",  icon: Compass,      key: "compass"  },
  { href: "/body-map", icon: Activity,     key: "bodyMap"  },
  { href: "/compare",  icon: Flower2,      key: "compare"  },
  { href: "/graph",    icon: Map,          key: "graph"    },
  { href: "/recipe",   icon: FlaskConical, key: "recipe"   },
  { href: "/rituals",  icon: Flame,        key: "rituals"  },
  { href: "/seasonal", icon: Calendar,     key: "seasonal" },
  { href: "/quiz",     icon: Sparkles,     key: "quiz"     }
] as const;

const FAQ_KEYS = ["1", "2", "3", "4", "5"] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const preview = localizeRemedies(getPreviewRemedies(8), locale);
  const count = getAllRemedies().length;
  const regionCounts = Object.fromEntries(
    REGIONS.map(r => [r, getRemediesByRegion(r).length])
  ) as Record<string, number>;
  const topSymptoms = getSymptomSummaries().slice(0, 8);

  const t      = await getTranslations("home");
  const tFaq   = await getTranslations("home.faq");
  const tFeat  = await getTranslations("home.features");

  const faqForJsonLd = FAQ_KEYS.map((n) => ({
    q: tFaq(`q${n}`),
    a: tFaq(`a${n}`)
  }));

  return (
    <>
      <JsonLd data={faqJsonLd(faqForJsonLd)} />
      <Hero remedyCount={count} />

      {/* Symptom-first entry — the primary "front door" for new users */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-8">
        <FadeUp className="text-center mb-8">
          <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("startHereEyebrow")}</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mt-2">{t("startHereTitle")}</h2>
          <p className="text-ink-soft mt-3 max-w-xl mx-auto">
            {t("startHereBody")}
          </p>
        </FadeUp>
        <Stagger className="flex flex-wrap justify-center gap-2">
          {topSymptoms.map(s => (
            <StaggerItem key={s.slug}>
              <Link
                href={`/symptoms/${s.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-line hover:border-accent/50 hover:bg-accent-soft/40 transition text-sm text-ink group"
              >
                <span className="font-medium">{s.label}</span>
                <span className="text-[10px] text-ink-soft">{s.count}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="text-center mt-6">
          <Link href="/symptoms" className="text-xs text-accent hover:underline">
            {t("seeAllConcerns")}
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <FadeUp className="text-center mb-12">
          <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("exploreEyebrow")}</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mt-2">{t("exploreTitle")}</h2>
          <div className="divider-ornament w-40 mx-auto mt-4" />
        </FadeUp>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <StaggerItem key={f.href}>
              <Link href={f.href} className="card group block p-6 h-full relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent/5 group-hover:bg-accent/15 blur-2xl transition" />
                <f.icon className="w-7 h-7 text-accent" />
                <h3 className="font-display text-2xl text-ink mt-3">{tFeat(`${f.key}Title`)}</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">{tFeat(`${f.key}Body`)}</p>
                <span className="text-xs text-accent mt-4 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  {t("open")}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Regions strip */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <FadeUp className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink">{t("regionsTitle")}</h2>
        </FadeUp>
        <Stagger className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {REGIONS.map(r => (
            <StaggerItem key={r}>
              <Link
                href={`/browse?region=${encodeURIComponent(r)}`}
                className="card block text-center py-5 px-2"
              >
                <div className="font-display text-lg text-ink">{r}</div>
                <div className="text-xs text-ink-soft mt-1">{t("regionsCount", { count: regionCounts[r] })}</div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Preview */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <FadeUp className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink">{t("previewTitle")}</h2>
          <p className="text-ink-soft mt-2">{t("previewBody")}</p>
        </FadeUp>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {preview.map(r => (
            <StaggerItem key={r.slug}><RemedyCard r={r} /></StaggerItem>
          ))}
        </Stagger>
        <div className="text-center mt-10">
          <Link href="/encyclopedia" className="btn btn-ghost">
            {t("browseAll", { count })}
          </Link>
        </div>
      </section>

      {/* FAQ — backs the FAQPage JSON-LD schema */}
      <section className="max-w-3xl mx-auto px-5 py-16">
        <FadeUp className="text-center mb-8">
          <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("faqEyebrow")}</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-2">{t("faqTitle")}</h2>
        </FadeUp>
        <div className="space-y-3">
          {FAQ_KEYS.map((n) => (
            <details key={n} className="card p-5 group">
              <summary className="font-display text-lg text-ink cursor-pointer list-none flex items-start justify-between gap-4">
                <span>{tFaq(`q${n}`)}</span>
                <span className="text-accent transition group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="text-sm text-ink-soft mt-3 leading-relaxed">{tFaq(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>

      <PricingTiers />
    </>
  );
}
