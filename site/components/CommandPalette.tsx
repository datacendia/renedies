"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Compass, MapPin, Leaf, ArrowRight, Command } from "lucide-react";

type Item =
  | { kind: "remedy"; slug: string; name: string; latin: string; region: string; benefit: string; url: string }
  | { kind: "page";   name: string; url: string; hint?: string }
  | { kind: "region"; name: string; url: string; hint?: string };

interface Index {
  pages:    Extract<Item, { kind: "page" }>[];
  regions:  Extract<Item, { kind: "region" }>[];
  remedies: Extract<Item, { kind: "remedy" }>[];
}

const MAX_RESULTS = 32;

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreItem(item: Item, tokens: string[]): number {
  if (!tokens.length) return 0;
  const hay = (
    item.kind === "remedy"
      ? `${item.name} ${item.latin} ${item.region} ${item.benefit}`
      : `${item.name} ${(item as any).hint ?? ""}`
  ).toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return 0;
    // Prefix match on name gets a big boost.
    if (item.kind === "remedy" && item.name.toLowerCase().startsWith(t)) score += 40;
    if (item.name.toLowerCase() === t) score += 30;
    score += 10;
    // Word-boundary bonus
    if (new RegExp(`\\b${t}`).test(hay)) score += 3;
  }
  // Prefer non-remedy routes a tiny bit so "compass" -> /compass, not a herb.
  if (item.kind === "page")   score += 4;
  if (item.kind === "region") score += 2;
  return score;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [index, setIndex] = useState<Index | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hotkey handler (Cmd/Ctrl+K, / when not in input, Esc)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lazy-load index when first opened
  useEffect(() => {
    if (!open || index) return;
    fetch("/api/search-index")
      .then(r => r.json())
      .then((d: Index) => setIndex(d))
      .catch(() => setIndex({ pages: [], regions: [], remedies: [] }));
  }, [open, index]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
    else { setQuery(""); setCursor(0); }
  }, [open]);

  const results = useMemo<Item[]>(() => {
    if (!index) return [];
    const tokens = tokenize(query);
    const all: Item[] = [...index.pages, ...index.regions, ...index.remedies];
    if (!tokens.length) {
      // Default: show pages + regions so the palette feels instantly useful.
      return [...index.pages, ...index.regions].slice(0, MAX_RESULTS);
    }
    const scored: { item: Item; s: number }[] = [];
    for (const item of all) {
      const s = scoreItem(item, tokens);
      if (s > 0) scored.push({ item, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, MAX_RESULTS).map(x => x.item);
  }, [index, query]);

  useEffect(() => { setCursor(0); }, [query]);

  const go = useCallback((item: Item) => {
    setOpen(false);
    router.push(item.url);
  }, [router]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const it = results[cursor]; if (it) go(it); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -8, opacity: 0, scale: 0.98 }}
            animate={{ y: 0,  opacity: 1, scale: 1 }}
            exit={{    y: -8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full max-w-xl bg-elevated border border-line rounded-2xl shadow-ambient overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
              <Search className="w-4 h-4 text-ink-soft" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search remedies, tools, regions…"
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-soft text-[15px]"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="text-[10px] uppercase tracking-wider text-ink-soft border border-line px-1.5 py-0.5 rounded">Esc</kbd>
            </div>

            <ul className="max-h-[60vh] overflow-y-auto py-1" role="listbox">
              {!index && (
                <li className="px-4 py-6 text-sm text-ink-soft text-center">Loading…</li>
              )}
              {index && results.length === 0 && (
                <li className="px-4 py-6 text-sm text-ink-soft text-center">No matches.</li>
              )}
              {results.map((it, i) => {
                const active = i === cursor;
                return (
                  <li key={`${it.kind}-${it.url}-${i}`} role="option" aria-selected={active}>
                    <button
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(it)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition ${
                        active ? "bg-accent-soft" : "hover:bg-accent-soft/60"
                      }`}
                    >
                      <span className="shrink-0 w-8 h-8 grid place-items-center rounded-lg bg-surface border border-line">
                        {it.kind === "remedy" ? <Leaf className="w-4 h-4 text-accent" /> :
                         it.kind === "region" ? <MapPin className="w-4 h-4 text-accent" /> :
                         /compass|quiz|map|graph/.test(it.url) ? <Compass className="w-4 h-4 text-accent" /> :
                         <BookOpen className="w-4 h-4 text-accent" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink truncate">{it.name}</span>
                        <span className="block text-xs text-ink-soft truncate">
                          {it.kind === "remedy"
                            ? `${it.region}${it.latin ? ` · ${it.latin}` : ""}${it.benefit ? ` — ${it.benefit}` : ""}`
                            : (it as any).hint ?? it.url}
                        </span>
                      </span>
                      <ArrowRight className={`w-4 h-4 shrink-0 transition ${active ? "text-accent translate-x-0.5" : "text-ink-soft opacity-0"}`} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between px-4 py-2 border-t border-line text-[10px] uppercase tracking-wider text-ink-soft">
              <span className="flex items-center gap-2">
                <kbd className="border border-line px-1 rounded">↑</kbd>
                <kbd className="border border-line px-1 rounded">↓</kbd>
                navigate
                <kbd className="border border-line px-1 rounded ml-2">↵</kbd>
                open
              </span>
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> K
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
