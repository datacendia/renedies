"use client";

import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "apothecary";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to Garden (light) mode" : "Switch to Apothecary (dark) mode"}
      title={isDark ? "Garden mode" : "Apothecary mode"}
      className={`relative w-10 h-10 grid place-items-center rounded-full border border-line hover:border-accent/50 transition ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate:   0, opacity: 1, scale: 1 }}
            exit={{    rotate:  90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-ember"
          >
            <Moon className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate:  0, opacity: 1, scale: 1 }}
            exit={{    rotate:-90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-accent"
          >
            <Sun className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
