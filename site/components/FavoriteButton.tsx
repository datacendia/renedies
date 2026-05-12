"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { loadFavorites, toggleFavorite } from "@/lib/favorites";

export function FavoriteButton({ slug, size = 20 }: { slug: string; size?: number }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(loadFavorites().has(slug));
    const handler = () => setFav(loadFavorites().has(slug));
    window.addEventListener("remedia:favorites-changed", handler);
    return () => window.removeEventListener("remedia:favorites-changed", handler);
  }, [slug]);

  return (
    <button
      aria-label={fav ? "Remove favorite" : "Save favorite"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite(slug);
        setFav(next.has(slug));
        // Try server sync (ignore errors for non-logged-in users)
        fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, action: next.has(slug) ? "add" : "remove" })
        }).catch(() => {});
      }}
      className="p-1.5 rounded-full hover:bg-brand-50 transition"
    >
      <Heart
        size={size}
        className={fav ? "fill-red-500 text-red-500" : "text-neutral-400 hover:text-red-400"}
      />
    </button>
  );
}
