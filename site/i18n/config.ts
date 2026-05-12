/**
 * i18n configuration (next-intl, cookie-based, no URL routing).
 *
 * Phase 1 — framework + core UI strings only. Page bodies (remedy data,
 * MDX articles) remain English until explicitly translated. Phase 2 will
 * either (a) add `app/[locale]/` routing or (b) extend `messages/*.json`
 * with page-specific namespaces and migrate call-sites one-by-one.
 *
 * Locale priority chosen to match the five traditions plus Spanish
 * (Andean / Iberian audience).
 */
export const LOCALES = ["en", "es", "ja", "zh", "hi"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "rem_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  zh: "中文",
  hi: "हिन्दी"
};

export function isLocale(x: unknown): x is Locale {
  return typeof x === "string" && (LOCALES as readonly string[]).includes(x);
}
