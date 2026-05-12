import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { imageFor } from "@/lib/images";

/**
 * Renders a botanical photo from Wikipedia, with credit and outbound link.
 * Returns null if no image is cached for the slug — callers can branch on
 * this to skip the section entirely.
 */
export function BotanicalImage({ slug }: { slug: string }) {
  const img = imageFor(slug);
  if (!img || !img.thumb) return null;

  return (
    <figure className="card overflow-hidden p-0">
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {/* Wikipedia thumbnails are cross-origin; use `unoptimized` to avoid
            next/image domain allow-list grief. Wikimedia serves them with
            long-lived caching headers anyway. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.thumb}
          alt={img.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <figcaption className="px-4 py-3 flex items-baseline justify-between gap-3 text-[11px] text-ink-soft">
        <span className="line-clamp-1">
          {img.description || img.title}
        </span>
        <a
          href={img.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent hover:underline whitespace-nowrap"
        >
          Wikipedia <ExternalLink className="w-3 h-3" />
        </a>
      </figcaption>
    </figure>
  );
}
