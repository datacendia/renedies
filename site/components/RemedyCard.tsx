"use client";

import Link from "next/link";
import type { Remedy } from "@/lib/content";
import { MapPin, Sparkles, Lock } from "lucide-react";
import { motion } from "framer-motion";

const confidenceStyle: Record<string, string> = {
  verified:    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  traditional: "bg-amber-500/10   text-amber-600   border-amber-500/30",
  preliminary: "bg-sky-500/10     text-sky-600     border-sky-500/30"
};

export function RemedyCard({ r, locked = false }: { r: Remedy; locked?: boolean }) {
  const href = locked ? "/#pricing" : `/encyclopedia/${r.slug}`;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link
        href={href}
        className="card group block p-5 h-full relative overflow-hidden"
      >
        {/* Region ribbon / subtle corner glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-ember/10 blur-2xl group-hover:bg-ember/25 transition" />

        <div className="flex items-start justify-between gap-2 relative">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">{r.region}</div>
            <h3 className="font-display text-xl text-ink mt-1 leading-tight line-clamp-2">
              {r.name}
            </h3>
            {r.latin && (
              <div className="text-xs italic text-ink-soft mt-0.5 truncate">{r.latin}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {r.confidence && (
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-medium ${confidenceStyle[r.confidence]}`}>
                {r.confidence}
              </span>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-ember/15 text-ember border border-ember/30">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            )}
          </div>
        </div>

        {r.benefit && (
          <p className="text-sm text-ink-soft mt-3 line-clamp-2 leading-relaxed">
            <Sparkles className="inline w-3.5 h-3.5 mr-1 text-accent align-text-top" />
            {r.benefit}
          </p>
        )}
        {r.sourcing && !locked && (
          <p className="text-xs text-ink-soft/80 mt-2 line-clamp-1 border-t border-line pt-2">
            <MapPin className="inline w-3 h-3 mr-1 text-accent" />
            {r.sourcing}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
