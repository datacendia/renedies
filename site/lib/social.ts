import type { LucideIcon } from "lucide-react";
import { Instagram, Music2, Youtube, Pin, Send, Twitter } from "lucide-react";

/**
 * Single source of truth for social presence.
 *
 * Anything referencing a handle, URL, or channel metadata should import from
 * here so the footer, /social hub, dedicated landing pages, OpenGraph tags,
 * and JSON-LD all stay in sync.
 *
 * To add a channel: drop a new entry, create (optionally) `app/<slug>/page.tsx`
 * via the shared `<SocialLanding>` component, done.
 */
export interface SocialChannel {
  slug: string;                 // URL segment under /, e.g. "tiktok"
  key: string;                  // i18n key under `social.<key>`
  platform: string;             // Display name fallback
  handle: string;               // "@remedia"
  url: string;                  // Canonical profile URL
  icon: LucideIcon;
  accentFrom: string;           // Tailwind gradient colour classes
  accentTo: string;
  primary: boolean;             // Highlighted in the hub + Nav
  description: string;          // Fallback English description
}

// NOTE: handles below are placeholders. Replace with real URLs once live.
export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    slug: "tiktok",
    key: "tiktok",
    platform: "TikTok",
    handle: "@remedia",
    url: "https://www.tiktok.com/@remedia",
    icon: Music2, // Lucide doesn't have a TikTok glyph; Music2 reads well
    accentFrom: "from-rose-500",
    accentTo:   "to-cyan-400",
    primary: true,
    description:
      "Short-form explainers: one remedy, one ritual, one body-system each video. Subscribe for the daily herb."
  },
  {
    slug: "instagram",
    key: "instagram",
    platform: "Instagram",
    handle: "@remedia",
    url: "https://www.instagram.com/remedia",
    icon: Instagram,
    accentFrom: "from-fuchsia-500",
    accentTo:   "to-amber-400",
    primary: true,
    description:
      "Recipe carousels, plant photography, and deep-dive reels on the five healing traditions."
  },
  {
    slug: "youtube",
    key: "youtube",
    platform: "YouTube",
    handle: "@remedia",
    url: "https://www.youtube.com/@remedia",
    icon: Youtube,
    accentFrom: "from-red-500",
    accentTo:   "to-orange-400",
    primary: false,
    description:
      "Long-form: formulary breakdowns, practitioner interviews, guided rituals."
  },
  {
    slug: "pinterest",
    key: "pinterest",
    platform: "Pinterest",
    handle: "@remedia",
    url: "https://www.pinterest.com/remedia",
    icon: Pin,
    accentFrom: "from-rose-500",
    accentTo:   "to-pink-400",
    primary: false,
    description:
      "Visual boards: recipe cards, botanical illustrations, seasonal rituals."
  },
  {
    slug: "twitter",
    key: "twitter",
    platform: "X / Twitter",
    handle: "@remedia",
    url: "https://x.com/remedia",
    icon: Twitter,
    accentFrom: "from-slate-600",
    accentTo:   "to-sky-500",
    primary: false,
    description: "Daily remedy notes, evidence threads, community Q&A."
  },
  {
    slug: "telegram",
    key: "telegram",
    platform: "Telegram",
    handle: "@remedia",
    url: "https://t.me/remedia",
    icon: Send,
    accentFrom: "from-sky-500",
    accentTo:   "to-blue-400",
    primary: false,
    description: "Private channel: early PDFs, release notes, subscriber-only content."
  }
];

export function getSocial(slug: string): SocialChannel | undefined {
  return SOCIAL_CHANNELS.find((c) => c.slug === slug);
}

export const PRIMARY_CHANNELS = SOCIAL_CHANNELS.filter((c) => c.primary);
