import { NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALE_COOKIE } from "@/i18n/config";

export const runtime = "edge";

/**
 * POST /api/locale
 * Body: { locale: "en" | "es" | "ja" | "zh" | "hi" }
 *
 * Sets the `rem_locale` cookie so next-intl's server config (i18n/request.ts)
 * picks it up on subsequent navigations. Returns 400 for unsupported codes —
 * never trust client-supplied strings as raw cookie values.
 */
export async function POST(req: NextRequest) {
  let body: { locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { locale } = body;
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1y
    sameSite: "lax",
    httpOnly: false
  });
  return res;
}
