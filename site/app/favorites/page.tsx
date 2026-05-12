"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { loadFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/FavoriteButton";

interface RemedyLite { slug: string; name: string; region: string; latin?: string; benefit?: string; }

export default function FavoritesPage() {
  const t = useTranslations("pages.favorites");
  const [favs, setFavs] = useState<string[]>([]);
  const [all, setAll] = useState<RemedyLite[]>([]);

  useEffect(() => {
    setFavs([...loadFavorites()]);
    fetch("/api/remedies").then(r => r.json()).then(setAll);
    const handler = () => setFavs([...loadFavorites()]);
    window.addEventListener("remedia:favorites-changed", handler);
    return () => window.removeEventListener("remedia:favorites-changed", handler);
  }, []);

  const saved = all.filter(r => favs.includes(r.slug));

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-serif text-4xl text-brand-800 flex items-center gap-2">
        <Heart className="w-8 h-8 fill-red-500 text-red-500" />
        {t("title")}
      </h1>
      <p className="text-neutral-600 mt-1">{saved.length === 1 ? t("savedOne", { count: saved.length }) : t("saved", { count: saved.length })}</p>

      {saved.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <p>{t("empty")}</p>
          <Link href="/encyclopedia" className="inline-block mt-4 text-brand-700 hover:text-brand-600 font-medium">
            {t("browseLink")}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {saved.map(r => (
            <div key={r.slug} className="rounded-xl border border-brand-100 bg-white p-5 relative">
              <div className="absolute top-3 right-3"><FavoriteButton slug={r.slug} size={18} /></div>
              <Link href={`/encyclopedia/${r.slug}`}>
                <div className="text-xs uppercase tracking-wide text-brand-600 font-medium">{r.region}</div>
                <h3 className="font-serif text-xl text-brand-800 mt-0.5 pr-8">{r.name}</h3>
                {r.latin && <div className="text-xs italic text-neutral-500">{r.latin}</div>}
                {r.benefit && <p className="text-sm text-neutral-700 mt-3 line-clamp-2">{r.benefit}</p>}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
