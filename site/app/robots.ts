import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/search-index is intentionally allowed — it is the palette's
        // backing feed and is harmless to crawl.
        disallow: ["/api/unlock", "/api/auth", "/api/favorites", "/api/shopify", "/me", "/favorites"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
