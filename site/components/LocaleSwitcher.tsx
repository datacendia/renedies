"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

/**
 * Minimal locale switcher — a native <select> wrapped with a globe icon.
 * POSTs to /api/locale to persist the choice, then calls router.refresh()
 * so the server re-renders with new messages.
 */
export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onChange(next: string) {
    if (next === current) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: next })
    });
    startTransition(() => router.refresh());
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-soft" aria-label="Language selector">
      <Globe className="w-3.5 h-3.5" aria-hidden />
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
        className="bg-transparent border border-line rounded px-1.5 py-0.5 focus:outline-none focus:border-accent"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>{LOCALE_LABELS[code]}</option>
        ))}
      </select>
    </label>
  );
}
