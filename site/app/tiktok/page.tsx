import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SocialLanding } from "@/components/SocialLanding";
import { getSocial } from "@/lib/social";

const CHANNEL_SLUG = "tiktok";

export const metadata: Metadata = {
  title: "TikTok — Daily Remedies",
  description:
    "Follow @remedia on TikTok for 60-second herbal explainers, one remedy per day, from five healing traditions.",
  openGraph: {
    title: "Remedia on TikTok",
    description:
      "Daily short-form explainers: one remedy, one ritual, one body-system per video."
  }
};

// Placeholder curated posts. Replace with real video metadata — ideally driven
// by a small scheduled job that writes to /site/data/social/tiktok.json.
const FEATURED = [
  {
    title: "Ashwagandha 101 — what it does in 60s",
    blurb: "The adaptogen everyone's talking about, explained without the hype.",
    url: "https://www.tiktok.com/@remedia"
  },
  {
    title: "Ginger shot for morning nausea",
    blurb: "TCM-style warming shot, 3 ingredients, 2 minutes.",
    url: "https://www.tiktok.com/@remedia"
  },
  {
    title: "The 3 herbs every Kampo doctor keeps",
    blurb: "Kakkon, Shokyo, Kanzo — why Japanese practitioners start here.",
    url: "https://www.tiktok.com/@remedia"
  },
  {
    title: "Muña tea at altitude — a Peruvian trick",
    blurb: "Andean digestive tea that actually works in the mountains.",
    url: "https://www.tiktok.com/@remedia"
  },
  {
    title: "Why Triphala at night?",
    blurb: "The Ayurvedic logic behind the timing, in 45 seconds.",
    url: "https://www.tiktok.com/@remedia"
  },
  {
    title: "Don't buy these 3 adaptogens online",
    blurb: "Heavy-metal and adulteration risks most brands won't mention.",
    url: "https://www.tiktok.com/@remedia"
  }
];

export default async function TikTokPage() {
  const t = await getTranslations("pages.tiktok");
  const channel = getSocial(CHANNEL_SLUG)!;
  return (
    <SocialLanding
      channel={channel}
      lead={t("lead")}
      featured={FEATURED}
      relatedHrefs={[
        { href: "/encyclopedia",    label: "Full encyclopedia (623 entries)" },
        { href: "/rituals",         label: "Guided rituals" },
        { href: "/quiz",            label: "Find-your-remedy quiz" },
        { href: "/seasonal",        label: "Seasonal dashboard" }
      ]}
    />
  );
}
