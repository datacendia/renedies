import { NextRequest, NextResponse } from "next/server";
import { TIER_COOKIE, type Tier } from "@/lib/tier";
import { verifyUnlockToken } from "@/lib/jwt";

export const runtime = "nodejs";

/**
 * Unlock route. Two modes:
 *
 * 1. Production: ?token=<JWT> from a Shopify-webhook-generated email link.
 *    Verified with JWT_SECRET.
 *
 * 2. Dev fallback: ?tier=<tier> only works when NEXT_PUBLIC_DEV_UNLOCK=true or
 *    NODE_ENV=development. Blocks unauthenticated tier-grabbing in production.
 *
 * The post-unlock redirect target is constrained to same-origin paths so a
 * stolen or forged unlock link can't be turned into an open redirect to a
 * phishing site.
 */
function safeRedirect(raw: string | null): string {
  if (!raw) return "/encyclopedia";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/encyclopedia";
  return raw;
}

export async function GET(req: NextRequest) {
  const redirect = safeRedirect(req.nextUrl.searchParams.get("redirect"));
  const token = req.nextUrl.searchParams.get("token");
  let tier: Tier | null = null;
  let email: string | null = null;

  if (token) {
    const payload = await verifyUnlockToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    tier = payload.tier;
    email = payload.email;
  } else {
    const devAllowed = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEV_UNLOCK === "true";
    if (!devAllowed) {
      return NextResponse.json({ error: "Magic link required" }, { status: 403 });
    }
    const raw = (req.nextUrl.searchParams.get("tier") ?? "none") as Tier;
    const valid: Tier[] = ["none", "starter", "pdf", "full"];
    tier = valid.includes(raw) ? raw : "none";
  }

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set(TIER_COOKIE, tier!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/"
  });
  if (email) {
    res.cookies.set("rem_email", email, {
      httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, path: "/"
    });
  }
  return res;
}
