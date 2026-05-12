"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf, Heart, Compass, BookOpen, Activity, Sparkles, Flower2, Map, Menu, X, Flame,
  FlaskConical, Calendar, Search
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Keyed by i18n `nav.*` message; label looked up at render.
const PRIMARY = [
  { href: "/encyclopedia", key: "encyclopedia", icon: BookOpen },
  { href: "/compass",      key: "compass",      icon: Compass },
  { href: "/body-map",     key: "bodyMap",      icon: Activity },
  { href: "/compare",      key: "compare",      icon: Flower2 },
  { href: "/graph",        key: "graph",        icon: Map },
  { href: "/recipe",       key: "recipe",       icon: FlaskConical },
  { href: "/rituals",      key: "rituals",      icon: Flame },
  { href: "/seasonal",     key: "seasonal",     icon: Calendar }
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <>
      <header className="border-b border-line bg-surface/70 backdrop-blur-md sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-2xl text-ink">
            <motion.span
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-accent"
            >
              <Leaf className="w-6 h-6" />
            </motion.span>
            <span>Remedia</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-ink-soft">
            {PRIMARY.map(({ href, key }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-1.5 rounded-lg transition hover:text-ink ${active ? "text-ink" : ""}`}
                >
                  {t(key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-0 -z-10 rounded-lg bg-accent-soft border border-accent/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }))}
              aria-label={tc("search")}
              title="Search (Ctrl/⌘K)"
              className="hidden sm:inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-line hover:border-accent/50 text-xs text-ink-soft transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{tc("search")}</span>
              <kbd className="border border-line px-1 rounded text-[9px] uppercase tracking-wider">⌘K</kbd>
            </button>
            <Link href="/me" className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-accent/50 transition" title="Your practice" aria-label="Your practice">
              <Flame className="w-4 h-4 text-ink-soft" />
            </Link>
            <Link href="/favorites" className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-accent/50 transition" title={t("favorites")} aria-label={t("favorites")}>
              <Heart className="w-4 h-4 text-ink-soft" />
            </Link>
            <span className="hidden sm:inline-flex"><LocaleSwitcher /></span>
            <ThemeToggle />
            <Link href="/#pricing" className="btn btn-primary !px-3 !py-1.5 hidden sm:inline-flex">
              Join
            </Link>
            <button
              className="lg:hidden w-10 h-10 grid place-items-center rounded-full border border-line"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile bottom tab bar — quick access to the five big features */}
      <MobileTabBar pathname={pathname} />

      {/* Mobile drawer (full menu) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-md lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              className="bg-elevated border-b border-line p-6 shadow-ambient"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-2xl">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 grid place-items-center rounded-full border border-line"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {PRIMARY.map(({ href, key, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="card flex items-center gap-3 p-4"
                    >
                      <Icon className="w-5 h-5 text-accent" />
                      <span className="font-medium">{t(key)}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/quiz" onClick={() => setOpen(false)} className="card flex items-center gap-3 p-4">
                    <Sparkles className="w-5 h-5 text-accent" /><span className="font-medium">{t("quiz")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={() => setOpen(false)} className="card flex items-center gap-3 p-4">
                    <Heart className="w-5 h-5 text-accent" /><span className="font-medium">{t("favorites")}</span>
                  </Link>
                </li>
              </ul>
              <Link
                href="/#pricing"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full mt-6"
              >
                Join Remedia
              </Link>
              <div className="mt-6 pt-5 border-t border-line flex justify-center">
                <LocaleSwitcher />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── Mobile bottom tab bar ─────────── */
function MobileTabBar({ pathname }: { pathname: string }) {
  const t = useTranslations("nav");
  const tabs = [
    { href: "/",             label: t("home"),         icon: Leaf },
    { href: "/compass",      label: t("compass"),      icon: Compass },
    { href: "/body-map",     label: t("bodyMap"),      icon: Activity },
    { href: "/encyclopedia", label: t("browse"),       icon: BookOpen },
    { href: "/favorites",    label: t("favorites"),    icon: Heart }
  ];
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md safe-bottom"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition ${active ? "text-accent" : "text-ink-soft"}`}
              >
                <motion.span
                  animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="grid place-items-center w-6 h-6"
                >
                  <Icon className="w-5 h-5" />
                </motion.span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
