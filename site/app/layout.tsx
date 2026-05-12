import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider";
import { RouteTransition } from "@/components/RouteTransition";
import { CommandPalette } from "@/components/CommandPalette";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { JsonLd } from "@/components/JsonLd";
import { siteJsonLd } from "@/lib/jsonld";
import { getAllRemedies } from "@/lib/content";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SOCIAL_CHANNELS } from "@/lib/social";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";
const REMEDY_COUNT = getAllRemedies().length;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Remedia — Traditional & Herbal Remedies Encyclopedia",
    template: "%s · Remedia"
  },
  description:
    `${REMEDY_COUNT} traditional remedies from India, Peru, China, Japan, and around the world. Benefits, recipes, sourcing, and interactive exploration.`,
  openGraph: {
    title: "Remedia",
    description: "Traditional remedies, ancestral wisdom, practical recipes.",
    type: "website",
    url: SITE_URL,
    siteName: "Remedia"
  },
  twitter: {
    card: "summary_large_image",
    title: "Remedia",
    description: "Traditional remedies, ancestral wisdom, practical recipes."
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)",  color: "#16110d" }
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tNav = await getTranslations("nav");
  const tFoot = await getTranslations("footer");
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash-of-wrong-theme */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <AuthProvider>
            <Nav />
            <main>
              <RouteTransition>{children}</RouteTransition>
            </main>
            <CommandPalette />
            <DisclaimerBanner />
            <JsonLd data={siteJsonLd(SITE_URL, REMEDY_COUNT)} />
          </AuthProvider>
          <footer className="border-t border-line mt-16 py-10 px-5 text-sm text-ink-soft">
            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
              <div>
                <p className="font-display text-2xl text-ink">Remedia</p>
                <p className="text-xs mt-1 max-w-xs">{tFoot("tagline")}</p>
                <div className="flex items-center gap-2 mt-4">
                  {SOCIAL_CHANNELS.filter((c) => c.primary).map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <a
                        key={ch.slug}
                        href={`/${ch.slug}`}
                        title={`${ch.platform} — ${ch.handle}`}
                        aria-label={ch.platform}
                        className={`w-9 h-9 grid place-items-center rounded-full text-white bg-gradient-to-br ${ch.accentFrom} ${ch.accentTo} hover:scale-110 transition`}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                  <a
                    href="/social"
                    title="All channels"
                    aria-label="All social channels"
                    className="w-9 h-9 grid place-items-center rounded-full border border-line hover:border-accent/50 hover:text-accent transition text-xs font-medium"
                  >
                    +{SOCIAL_CHANNELS.length - SOCIAL_CHANNELS.filter((c) => c.primary).length}
                  </a>
                </div>
              </div>
              <div>
                <p className="font-medium text-ink mb-2">{tFoot("explore")}</p>
                <ul className="space-y-1 text-xs">
                  <li><a href="/encyclopedia" className="hover:text-accent">{tNav("encyclopedia")}</a></li>
                  <li><a href="/compass" className="hover:text-accent">{tNav("compass")}</a></li>
                  <li><a href="/body-map" className="hover:text-accent">{tNav("bodyMap")}</a></li>
                  <li><a href="/compare" className="hover:text-accent">{tNav("compare")}</a></li>
                  <li><a href="/graph" className="hover:text-accent">{tNav("graph")}</a></li>
                  <li><a href="/recipe" className="hover:text-accent">{tNav("recipe")}</a></li>
                  <li><a href="/rituals" className="hover:text-accent">{tNav("rituals")}</a></li>
                  <li><a href="/seasonal" className="hover:text-accent">{tNav("seasonal")}</a></li>
                  <li><a href="/quiz" className="hover:text-accent">{tNav("quiz")}</a></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-ink mb-2">Connect</p>
                <ul className="space-y-1 text-xs">
                  <li><a href="/social" className="hover:text-accent">All channels</a></li>
                  {SOCIAL_CHANNELS.map((ch) => {
                    const internal = ch.slug === "tiktok" || ch.slug === "instagram";
                    return (
                      <li key={ch.slug}>
                        <a
                          href={internal ? `/${ch.slug}` : ch.url}
                          target={internal ? undefined : "_blank"}
                          rel={internal ? undefined : "noopener noreferrer"}
                          className="hover:text-accent"
                        >
                          {ch.platform} <span className="text-ink-soft/70">{ch.handle}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <p className="font-medium text-ink mb-2">{tFoot("legal")}</p>
                <ul className="space-y-1 text-xs">
                  <li><a href="/disclaimer" className="hover:text-accent">{tFoot("disclaimer")}</a></li>
                  <li><a href="/terms" className="hover:text-accent">{tFoot("terms")}</a></li>
                  <li><a href="/privacy" className="hover:text-accent">{tFoot("privacy")}</a></li>
                  <li><a href="/affiliate-disclosure" className="hover:text-accent">{tFoot("affiliate")}</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-center md:text-left">
                <p>© {new Date().getFullYear()} Remedia. {tFoot("copyright")}</p>
                <p className="mt-1">{tFoot("consult")}</p>
              </div>
              <LocaleSwitcher />
            </div>
          </footer>
        </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
