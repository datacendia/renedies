import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { Tier } from "@/lib/tier";
import { signUnlockToken } from "@/lib/jwt";
import { sendEmail, unlockEmailHtml } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Shopify `orders/paid` webhook handler.
 *
 * Shopify admin setup:
 *   Settings -> Notifications -> Webhooks
 *   Event: Order payment (JSON)
 *   URL:   https://yourdomain.com/api/shopify/webhook
 *
 * Copy the signing secret into SHOPIFY_WEBHOOK_SECRET env var.
 */

// Map Shopify product titles (or variant IDs) -> our internal tier.
// Shopify sends product_id and variant_id in each line_item.
const VARIANT_TO_TIER: Record<string, Tier> = {
  [process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_STARTER ?? ""]: "starter",
  [process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_PDF ?? ""]:     "pdf",
  [process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_FULL ?? ""]:    "full"
};
// Fallback by title substring
const TITLE_TO_TIER: { match: RegExp; tier: Tier }[] = [
  { match: /starter/i, tier: "starter" },
  { match: /pdf|compendium/i, tier: "pdf" },
  { match: /subscription|encyclopedia|access/i, tier: "full" }
];

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = new Uint8Array(Buffer.from(digest));
  const b = new Uint8Array(Buffer.from(hmacHeader));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

interface ShopifyOrder {
  id: number;
  email: string;
  customer?: { first_name?: string; last_name?: string; email?: string };
  line_items: Array<{ variant_id: number; product_id: number; title: string; name?: string }>;
}

export async function POST(req: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  const raw = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  if (!verifyShopifyHmac(raw, hmac, secret)) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(raw) as ShopifyOrder;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = order.email || order.customer?.email;
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  // Find highest tier purchased in this order.
  let tier: Tier = "none";
  const tierRank: Record<Tier, number> = { none: 0, starter: 1, pdf: 2, full: 3 };
  for (const item of order.line_items) {
    const byVariant = VARIANT_TO_TIER[String(item.variant_id)];
    const byTitle = TITLE_TO_TIER.find(t => t.match.test(item.title) || t.match.test(item.name ?? ""))?.tier;
    const thisTier = byVariant ?? byTitle;
    if (thisTier && tierRank[thisTier] > tierRank[tier]) tier = thisTier;
  }
  if (tier === "none") {
    return NextResponse.json({ ok: true, note: "No known tier in order" });
  }

  const token = await signUnlockToken({ email, tier, orderId: String(order.id) });
  // Prefer canonical site URL so links land on the production domain even
  // when the webhook hits a Netlify deploy preview / branch URL.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const magicUrl = `${origin}/api/unlock?token=${encodeURIComponent(token)}`;

  const name = [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(" ");
  await sendEmail({
    to: email,
    subject: "Your Remedia access is ready",
    html: unlockEmailHtml({ name, tier, magicUrl })
  });

  return NextResponse.json({ ok: true, tier });
}
