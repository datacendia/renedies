import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";

/**
 * Server-side locale resolver for next-intl.
 *
 * Resolution order:
 *   1. `rem_locale` cookie (user's explicit choice from the switcher).
 *   2. `Accept-Language` header (first supported match).
 *   3. DEFAULT_LOCALE ("en").
 */
function resolveLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const tag = part.split(";")[0].trim().toLowerCase();
      const short = tag.split("-")[0];
      if (isLocale(short)) return short;
    }
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const headerStore = headers();
  const locale = resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerStore.get("accept-language")
  );

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
