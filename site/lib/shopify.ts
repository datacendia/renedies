/**
 * Shopify checkout URLs. Two supported integration modes:
 *
 * 1. BUY BUTTONS (simplest, Shopify Lite $9/mo):
 *    Set env SHOPIFY_DOMAIN=yourshop.myshopify.com and paste the product variant IDs below.
 *    The checkout link format is:
 *      https://{SHOPIFY_DOMAIN}/cart/{VARIANT_ID}:1?channel=buy_button
 *
 * 2. STOREFRONT API (headless, Basic plan):
 *    Use @shopify/hydrogen-react or fetch from /api/2024-07/graphql.json.
 *    Not implemented in MVP — add once you have a real storefront access token.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "example.myshopify.com";

// Paste real variant IDs after creating products in Shopify admin.
const VARIANTS = {
  starter: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_STARTER ?? "",
  pdf:     process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_PDF     ?? "",
  full:    process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_FULL    ?? ""
};

export type TierKey = keyof typeof VARIANTS;

export function checkoutUrl(tier: TierKey, redirect?: string): string {
  const variant = VARIANTS[tier];
  if (!variant) {
    // Fallback for local dev: simulate purchase by calling our /api/unlock route.
    const params = new URLSearchParams({ tier, redirect: redirect ?? "/encyclopedia" });
    return `/api/unlock?${params.toString()}`;
  }
  const back = redirect ? `&return_to=${encodeURIComponent(redirect)}` : "";
  return `https://${DOMAIN}/cart/${variant}:1?channel=buy_button${back}`;
}
