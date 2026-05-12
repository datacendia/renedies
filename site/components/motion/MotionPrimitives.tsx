"use client";

import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

/* ─────────── Shared easings/durations ─────────── */
export const EASE  = [0.2, 0.8, 0.2, 1] as const;
export const DUR   = { xs: 0.18, sm: 0.28, md: 0.42, lg: 0.64 } as const;

/* ─────────── FadeUp: on-enter reveal ─────────── */
export function FadeUp({
  children, delay = 0, y = 14, className = "",
  as = "div"
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "section" | "article" | "header" | "h1" | "h2" | "p" }) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: DUR.md, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ─────────── Stagger container + item ─────────── */
export const staggerParent: Variants = {
  hidden: { opacity: 1 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } }
};
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: DUR.md, ease: EASE } }
};

export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={staggerChild} {...props} />;
}

/* ─────────── Tilt-on-hover card wrapper ─────────── */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -3, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={className}
      style={{ transformStyle: "preserve-3d", transformPerspective: 800 }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── Page transition shell ─────────── */
export function PageFade({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.sm, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
