import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SOCIAL_CHANNELS } from "@/lib/social";

export const metadata: Metadata = {
  title: "Social — Follow Remedia",
  description:
    "Follow Remedia on TikTok, Instagram, YouTube, and more for daily herbal remedies, recipes, and traditional-medicine deep dives."
};

export default async function SocialHubPage() {
  const t = await getTranslations("pages.social");
  const primary = SOCIAL_CHANNELS.filter((c) => c.primary);
  const secondary = SOCIAL_CHANNELS.filter((c) => !c.primary);

  return (
    <article className="max-w-6xl mx-auto px-5 py-10 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{t("eyebrow")}</p>
        <h1 className="font-display text-4xl md:text-6xl mt-3 leading-tight">{t("title")}</h1>
        <p className="mt-4 text-ink-soft">
          {t("body")}
        </p>
      </header>

      {/* Primary channels — big tiles */}
      <section className="grid gap-5 md:grid-cols-2 mb-10">
        {primary.map((ch) => {
          const Icon = ch.icon;
          return (
            <Link
              key={ch.slug}
              href={`/${ch.slug}`}
              className={`group relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${ch.accentFrom} ${ch.accentTo} p-8 md:p-10 text-white shadow-ambient hover:scale-[1.01] transition`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white,transparent_60%)]" />
              <div className="relative flex flex-col gap-8 h-full">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    <Icon className="w-3.5 h-3.5" /> {ch.platform}
                  </span>
                  <ArrowUpRight className="w-5 h-5 opacity-80 group-hover:opacity-100 transition" />
                </div>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl leading-tight">
                    {ch.platform}
                  </h2>
                  <p className="font-mono text-sm mt-1 text-white/90">{ch.handle}</p>
                  <p className="mt-3 text-white/90 text-sm md:text-base max-w-md">
                    {ch.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Secondary — compact row */}
      <section>
        <h2 className="font-display text-xl text-ink-soft mb-4">{t("alsoOn")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {secondary.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.slug}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-start gap-3 p-4 hover:border-accent/50 transition"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ch.accentFrom} ${ch.accentTo} grid place-items-center text-white shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink flex items-center gap-1">
                    {ch.platform}
                    <ArrowUpRight className="w-3 h-3 text-ink-soft" />
                  </p>
                  <p className="text-xs text-ink-soft line-clamp-2">{ch.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </article>
  );
}
