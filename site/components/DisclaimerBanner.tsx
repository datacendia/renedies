"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "rem_disclaimer_ack_v1";

/**
 * One-time medical disclaimer. Visible until the user acknowledges it, which
 * we persist in localStorage. Also refreshable via `?disclaimer=1` in the URL
 * for legal review.
 */
export function DisclaimerBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const force = new URLSearchParams(window.location.search).has("disclaimer");
    const acked = window.localStorage.getItem(STORAGE_KEY);
    setShow(force || !acked);
  }, []);

  const dismiss = () => {
    try { window.localStorage.setItem(STORAGE_KEY, new Date().toISOString()); } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-labelledby="disclaimer-title"
          aria-describedby="disclaimer-body"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: 120, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto rounded-2xl border border-amber-500/40 bg-elevated/95 backdrop-blur-md shadow-ambient">
            <div className="p-5 flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500/15 grid place-items-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p id="disclaimer-title" className="font-display text-lg text-ink">
                  Educational content — not medical advice
                </p>
                <p id="disclaimer-body" className="text-sm text-ink-soft mt-1 leading-relaxed">
                  Herbs can interact with medications and have real contraindications
                  in pregnancy, breastfeeding, and chronic disease. Confirm botanical
                  identification, start low, and consult a qualified practitioner
                  before use. By continuing you acknowledge the{" "}
                  <Link href="/disclaimer" className="text-accent hover:underline">full medical disclaimer</Link>.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={dismiss}
                    className="btn btn-primary !px-4 !py-2 text-sm"
                  >
                    I understand
                  </button>
                  <Link href="/disclaimer" className="btn btn-ghost !px-4 !py-2 text-sm">
                    Read more
                  </Link>
                </div>
              </div>
              <button
                onClick={dismiss}
                aria-label="Dismiss disclaimer"
                className="shrink-0 w-8 h-8 grid place-items-center rounded-full border border-line hover:border-accent/50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
