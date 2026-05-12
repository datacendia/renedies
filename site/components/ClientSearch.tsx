"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { VirtuosoGrid } from "react-virtuoso";
import { useTranslations } from "next-intl";
import type { Remedy } from "@/lib/content";
import { FavoriteButton } from "./FavoriteButton";
import { Search, MapPin } from "lucide-react";

/**
 * Fast client-side search over all remedies. Used on /encyclopedia for
 * instant filtering without round-trips.
 */
export function ClientSearch({ remedies }: { remedies: Remedy[] }) {
  const t = useTranslations("components.search");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<"all" | "verified">("all");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return remedies.filter(r => {
      if (region !== "all" && r.region !== region) return false;
      if (confidenceFilter === "verified" && r.confidence !== "verified") return false;
      if (!needle) return true;
      return (
        r.name.toLowerCase().includes(needle) ||
        (r.latin ?? "").toLowerCase().includes(needle) ||
        (r.benefit ?? "").toLowerCase().includes(needle)
      );
    });
  }, [remedies, q, region, confidenceFilter]);

  const regions = useMemo(() => Array.from(new Set(remedies.map(r => r.region))), [remedies]);

  return (
    <>
      <div className="sticky top-16 z-30 bg-[#fbfaf6]/95 backdrop-blur border-b border-brand-100 py-3 -mx-5 px-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("placeholder", { count: remedies.length })}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500 text-sm bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setRegion("all")}
              className={`text-xs px-2.5 py-1 rounded-full border ${region === "all" ? "bg-brand-600 text-white border-brand-600" : "border-brand-200 text-brand-700 hover:bg-brand-50"}`}
            >{t("all")}</button>
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`text-xs px-2.5 py-1 rounded-full border ${region === r ? "bg-brand-600 text-white border-brand-600" : "border-brand-200 text-brand-700 hover:bg-brand-50"}`}
              >{r}</button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confidenceFilter === "verified"}
              onChange={e => setConfidenceFilter(e.target.checked ? "verified" : "all")}
              className="accent-brand-600"
            />
            {t("verifiedOnly")}
          </label>
          <span className="text-xs text-neutral-500 ml-auto">{t("ofTotal", { shown: results.length, total: remedies.length })}</span>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-neutral-500 py-12">{t("noMatch", { query: q })}</p>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          totalCount={results.length}
          listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
          itemContent={(index) => {
            const r = results[index];
            return (
              <div key={r.slug} className="group rounded-xl border border-brand-100 bg-white p-5 hover:shadow-md hover:border-brand-300 transition relative h-full">
                <div className="absolute top-3 right-3">
                  <FavoriteButton slug={r.slug} size={18} />
                </div>
                <Link href={`/encyclopedia/${r.slug}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xs uppercase tracking-wide text-brand-600 font-medium">{r.region}</div>
                    {r.confidence === "verified" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">{t("verified")}</span>
                    )}
                    {r.confidence === "preliminary" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 font-medium">{t("preliminary")}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-brand-800 group-hover:text-brand-600 mt-0.5 pr-8">{r.name}</h3>
                  {r.latin && <div className="text-xs italic text-neutral-500">{r.latin}</div>}
                  {r.benefit && <p className="text-sm text-neutral-700 mt-3 line-clamp-2">{r.benefit}</p>}
                  {r.sourcing && (
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-1">
                      <MapPin className="inline w-3 h-3 mr-1" />{r.sourcing}
                    </p>
                  )}
                </Link>
              </div>
            );
          }}
        />
      )}
    </>
  );
}
