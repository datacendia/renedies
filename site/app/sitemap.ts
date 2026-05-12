import type { MetadataRoute } from "next";
import { getAllRemedies } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

const STATIC_ROUTES = [
  "", "encyclopedia", "browse", "symptoms", "compass", "body-map",
  "compare", "graph", "recipe", "rituals", "seasonal", "quiz",
  "favorites", "me",
  "social", "tiktok", "instagram",
  "disclaimer", "terms", "privacy", "affiliate-disclosure"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map(path => ({
    url: `${SITE_URL}/${path}`.replace(/\/$/, "") || SITE_URL,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.7
  }));

  const remedies: MetadataRoute.Sitemap = getAllRemedies().map(r => ({
    url: `${SITE_URL}/encyclopedia/${r.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6
  }));

  return [...base, ...remedies];
}
