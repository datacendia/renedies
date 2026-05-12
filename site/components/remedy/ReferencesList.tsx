import { BookOpenCheck, ExternalLink } from "lucide-react";
import type { Reference } from "@/lib/safety";

const KIND_LABEL: Record<Reference["kind"], string> = {
  monograph: "Monograph",
  review:    "Review",
  trial:     "Clinical trial",
  database:  "Database",
  book:      "Book"
};

/**
 * Renders curated citations. Hidden when empty — the caller should choose
 * whether to show a "contribute" call-to-action in that case.
 */
export function ReferencesList({ references }: { references: Reference[] }) {
  if (!references.length) return null;
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
        <BookOpenCheck className="w-5 h-5 text-accent" /> References
      </h2>
      <p className="text-xs text-ink-soft mt-1">
        Curated authoritative sources. Inclusion is not an endorsement of a
        specific clinical use — consult the original for full context.
      </p>
      <ol className="mt-4 space-y-2.5 text-sm text-ink list-none">
        {references.map((r, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-semibold shrink-0 mt-1 w-[74px]">
              {r.source}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-ink hover:text-accent underline underline-offset-2 inline-flex items-center gap-1 leading-snug"
              >
                <span>{r.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
              </a>
              <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft mt-0.5">
                {KIND_LABEL[r.kind]}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
