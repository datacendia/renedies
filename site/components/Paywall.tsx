"use client";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export function Paywall({ reason }: { reason?: string }) {
  const t = useTranslations("components.paywall");
  return (
    <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-8 text-center my-8">
      <Lock className="w-8 h-8 mx-auto text-brand-600" />
      <h3 className="font-serif text-2xl text-brand-800 mt-3">{t("title")}</h3>
      <p className="text-neutral-700 mt-2 max-w-md mx-auto">{reason ?? t("defaultReason")}</p>
      <Link
        href="/#pricing"
        className="inline-block mt-5 bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
