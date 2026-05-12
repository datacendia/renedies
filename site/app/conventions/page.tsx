import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PREP_CONVENTIONS } from "@/lib/preparation";

export const metadata: Metadata = {
  title: "Preparation & Measurement Conventions",
  description:
    "Standard doses by preparation type — infusion, decoction, tincture, powder, granule, essential oil, and more. Applies to any recipe in the Remedia encyclopedia that does not give an explicit amount.",
  alternates: { canonical: "/conventions" },
  openGraph: {
    title: "Preparation & Measurement Conventions — Remedia",
    description:
      "Standard doses by preparation type. The convention applied whenever a recipe doesn't give an explicit amount.",
    type: "article",
    url: "/conventions"
  }
};

export default async function ConventionsPage() {
  const t = await getTranslations("pages.conventions");
  const tc = await getTranslations("common");
  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <Link
        href="/encyclopedia"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t("backLink")}
      </Link>

      <header className="mt-6">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
          <FlaskConical className="w-3.5 h-3.5" /> {t("eyebrow")}
        </div>
        <h1 className="font-display text-4xl text-ink mt-2">
          {t("title")}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">
          {t("body")}
        </p>
      </header>

      <div className="mt-8 card p-6 space-y-5">
        {PREP_CONVENTIONS.map(p => (
          <div
            key={p.kind}
            className="border-b border-line/50 last:border-b-0 pb-5 last:pb-0"
          >
            <h2 className="font-display text-xl text-ink">{p.label}</h2>
            <p className="text-sm text-ink-soft mt-1">{p.description}</p>
            <p className="text-sm text-ink mt-2 font-medium">
              {p.shortDose}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 card p-6 bg-surface/50">
        <h2 className="font-display text-xl text-ink">{t("unitTitle")}</h2>
        <ul className="mt-3 text-sm text-ink space-y-1.5">
          <li>
            <strong>{t("unit1Strong")}</strong> {t("unit1Rest")}
            <span className="text-ink-soft"> {t("unit1Note")}</span>
          </li>
          <li>
            <strong>{t("unit2Strong")}</strong> {t("unit2Rest")}
          </li>
          <li>
            <strong>{t("unit3Strong")}</strong> {t("unit3Rest")}
          </li>
          <li>
            <strong>{t("unit4Strong")}</strong> {t("unit4Rest")}
          </li>
          <li>
            <strong>{t("unit5Strong")}</strong> {t("unit5Rest")}
          </li>
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
        <p className="text-sm text-ink leading-relaxed">
          {t("warning")}
        </p>
      </section>

      <p className="text-xs text-ink-soft mt-10 text-center italic">
        {tc("educationalNote")}
      </p>
    </article>
  );
}
