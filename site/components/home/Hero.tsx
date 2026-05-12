"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

/** Animated parallax hero with drifting herb glyphs and gradient wash. */
export function Hero({ remedyCount }: { remedyCount: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduced = useReducedMotion();
  const t = useTranslations("hero");

  const yBg      = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 160]);
  const yGlyph1  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);
  const yGlyph2  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -60]);
  const yTitle   = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -30]);
  const opacity  = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[80vh] flex items-center"
    >
      {/* Gradient backdrop with parallax */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-candlelight" />
        <div className="absolute inset-0 opacity-[var(--grid-opacity)]"
             style={{ backgroundImage: "var(--tw-bg-grain, radial-gradient(rgb(0 0 0 / 0.04) 1px, transparent 1px))", backgroundSize: "22px 22px" }} />
      </motion.div>

      {/* Drifting herb silhouettes (SVG) */}
      <motion.svg
        style={{ y: yGlyph1 }}
        viewBox="0 0 200 200"
        className="absolute left-[-40px] top-[12%] w-40 md:w-64 opacity-15 text-accent pointer-events-none"
        aria-hidden
      >
        <HerbGlyph />
      </motion.svg>
      <motion.svg
        style={{ y: yGlyph2 }}
        viewBox="0 0 200 200"
        className="absolute right-[-30px] bottom-[10%] w-36 md:w-56 opacity-20 text-ember pointer-events-none -scale-x-100"
        aria-hidden
      >
        <HerbGlyph />
      </motion.svg>

      <motion.div
        style={{ y: yTitle, opacity }}
        className="relative max-w-5xl mx-auto px-5 py-20 md:py-28 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 bg-elevated/80 border border-line text-ink-soft text-xs font-medium px-3 py-1 rounded-full backdrop-blur"
        >
          <Leaf className="w-3.5 h-3.5 text-accent" />
          {t("badge", { count: remedyCount })}
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl mt-6 leading-[1.02] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="block text-ink"
          >
            {t("titleLine1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="block italic text-accent"
          >
            {t("titleLine2")}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }}
          className="text-lg md:text-xl text-ink-soft mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          {t("tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 flex flex-wrap gap-3 justify-center"
        >
          <Link href="/compass" className="btn btn-ember group">
            {t("ctaCompass")}
            <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link href="/encyclopedia" className="btn btn-ghost">
            {t("ctaEncyclopedia")}
          </Link>
        </motion.div>

        {/* Soft scroll-indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-14 text-ink-soft text-xs tracking-widest uppercase"
        >
          {t("scrollHint")}
        </motion.div>
      </motion.div>
    </section>
  );
}

function HerbGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M100 20 C 90 70, 90 130, 100 180" />
      <path d="M100 40 Q 60 55, 55 85" />
      <path d="M100 40 Q 140 55, 145 85" />
      <path d="M100 75 Q 55 90, 50 130" />
      <path d="M100 75 Q 145 90, 150 130" />
      <path d="M100 110 Q 60 125, 60 160" />
      <path d="M100 110 Q 140 125, 140 160" />
      <ellipse cx="55"  cy="85"  rx="14" ry="6" transform="rotate(-30 55 85)" />
      <ellipse cx="145" cy="85"  rx="14" ry="6" transform="rotate( 30 145 85)" />
      <ellipse cx="50"  cy="130" rx="16" ry="6" transform="rotate(-30 50 130)" />
      <ellipse cx="150" cy="130" rx="16" ry="6" transform="rotate( 30 150 130)" />
      <ellipse cx="60"  cy="160" rx="14" ry="5" transform="rotate(-30 60 160)" />
      <ellipse cx="140" cy="160" rx="14" ry="5" transform="rotate( 30 140 160)" />
    </g>
  );
}
