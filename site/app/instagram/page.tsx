import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SocialLanding } from "@/components/SocialLanding";
import { getSocial } from "@/lib/social";

const CHANNEL_SLUG = "instagram";

export const metadata: Metadata = {
  title: "Instagram — Recipes & Rituals",
  description:
    "Follow @remedia on Instagram for recipe carousels, botanical photography, and deep-dive reels on traditional medicine.",
  openGraph: {
    title: "Remedia on Instagram",
    description:
      "Recipe carousels, plant photography, and deep-dive reels on the five healing traditions."
  }
};

// Placeholder curated posts — replace with real post metadata when the feed
// scraper/oEmbed integration ships.
const FEATURED = [
  {
    title: "Golden milk — the real recipe",
    blurb: "Carousel: why every Ayurvedic grandmother uses ghee + black pepper.",
    url: "https://www.instagram.com/remedia"
  },
  {
    title: "Reel — inside a Peruvian herbolario",
    blurb: "A 45-second tour of a Cusco market stall and its muña, coca, and pisonay.",
    url: "https://www.instagram.com/remedia"
  },
  {
    title: "5 herbs for sleep (ranked)",
    blurb: "Carousel ranking the sedative herbs by evidence strength.",
    url: "https://www.instagram.com/remedia"
  },
  {
    title: "Making chyawanprash at home",
    blurb: "The 50-herb Ayurvedic jam, scaled down for a small kitchen.",
    url: "https://www.instagram.com/remedia"
  },
  {
    title: "Kampo formulas explained",
    blurb: "Why Japanese clinical medicine prescribes 3 herbs where TCM uses 12.",
    url: "https://www.instagram.com/remedia"
  },
  {
    title: "Herb of the month — Reishi",
    blurb: "Sourcing, dose, clinical evidence, and the safety caveats nobody posts.",
    url: "https://www.instagram.com/remedia"
  }
];

export default async function InstagramPage() {
  const t = await getTranslations("pages.instagram");
  const channel = getSocial(CHANNEL_SLUG)!;
  return (
    <SocialLanding
      channel={channel}
      lead={t("lead")}
      featured={FEATURED}
      relatedHrefs={[
        { href: "/recipe",       label: "Recipe builder" },
        { href: "/encyclopedia", label: "Full encyclopedia (623 entries)" },
        { href: "/compass",      label: "Taste & energetics compass" },
        { href: "/seasonal",     label: "Seasonal rituals" }
      ]}
    />
  );
}
