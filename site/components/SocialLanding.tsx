import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { SocialChannel } from "@/lib/social";

interface FeaturedPost {
  title: string;
  blurb: string;
  url?: string;
}

interface Props {
  channel: SocialChannel;
  /** Optional curated post grid — placeholder tiles until a real feed API is wired. */
  featured?: FeaturedPost[];
  /** Platform-specific subtitle; falls back to channel.description. */
  lead?: string;
  /** Links to the most topically-relevant on-site pages for this channel. */
  relatedHrefs?: { href: string; label: string }[];
}

/**
 * Shared landing shell for every social channel. Renders:
 *   • big gradient hero with handle + profile CTA
 *   • featured / recent content grid (placeholder until oEmbed is wired)
 *   • cross-links to deeper site pages (encyclopedia, rituals, etc.)
 *
 * Keeping this in one component means all platform pages stay visually
 * consistent and copy can be tightened per-channel via the Props above.
 */
export function SocialLanding({ channel, featured = [], lead, relatedHrefs = [] }: Props) {
  const Icon = channel.icon;
  return (
    <article className="max-w-6xl mx-auto px-5 py-10">
      {/* Hero */}
      <section
        className={`relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${channel.accentFrom} ${channel.accentTo} p-8 md:p-14 text-white shadow-ambient`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_10%,white,transparent_60%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium">
              <Icon className="w-3.5 h-3.5" />
              <span>{channel.platform}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl mt-4 leading-tight">
              Remedia on {channel.platform}
            </h1>
            <p className="mt-3 text-white/90 text-base md:text-lg">{lead ?? channel.description}</p>
            <p className="mt-4 font-mono text-sm text-white/90">{channel.handle}</p>
          </div>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-5 py-3 font-medium shadow-lg hover:scale-[1.02] transition"
          >
            Follow <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mt-12">
          <header className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> Featured
            </h2>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-soft hover:text-accent inline-flex items-center gap-1"
            >
              See all on {channel.platform} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post, i) => (
              <a
                key={i}
                href={post.url ?? channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group p-5 hover:border-accent/50 transition"
              >
                <div
                  className={`aspect-[9/16] rounded-xl mb-4 bg-gradient-to-br ${channel.accentFrom} ${channel.accentTo} opacity-80 group-hover:opacity-100 transition flex items-end p-3`}
                >
                  <div className="text-white text-xs font-medium drop-shadow">
                    <Icon className="w-4 h-4 mb-1" />
                    {channel.platform}
                  </div>
                </div>
                <h3 className="font-medium text-ink leading-tight">{post.title}</h3>
                <p className="text-xs text-ink-soft mt-1.5 line-clamp-3">{post.blurb}</p>
              </a>
            ))}
          </div>
          <p className="text-xs text-ink-soft/80 mt-4 italic">
            Tiles are curated placeholders. Wire real content via the platform&apos;s oEmbed
            endpoint or a scheduled scraper — see `I18N.md`-adjacent docs in `/lib/social.ts`.
          </p>
        </section>
      )}

      {/* Related pages */}
      {relatedHrefs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl mb-4">Explore the full library</h2>
          <div className="flex flex-wrap gap-2">
            {relatedHrefs.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent/50 hover:text-accent transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="mt-16 text-xs text-ink-soft border-t border-line pt-6">
        <p>
          Educational content. Always consult a qualified practitioner before acting on social-media
          recommendations. See our{" "}
          <Link href="/disclaimer" className="underline hover:text-accent">
            medical disclaimer
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
