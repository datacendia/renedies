import { getLocale, getTranslations } from "next-intl/server";
import { LEGAL } from "@/lib/legal";

export async function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const locale = await getLocale();
  const t = await getTranslations("pages.legal");
  return (
    <article className="max-w-3xl mx-auto px-5 py-12">
      <header className="mb-8 pb-6 border-b border-brand-100">
        <h1 className="font-serif text-4xl text-brand-900">{title}</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Effective: {LEGAL.effectiveDate} · Last updated: {LEGAL.lastUpdated}
        </p>
      </header>
      {locale !== "en" && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {t("onlyEnglish")}
        </div>
      )}
      <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-brand-800 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-a:text-brand-700 prose-strong:text-brand-900">
        {children}
      </div>
    </article>
  );
}
