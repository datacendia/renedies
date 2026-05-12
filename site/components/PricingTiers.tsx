import { Check, BookOpen, FileText, Infinity as InfinityIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { checkoutUrl } from "@/lib/shopify";

// Static per-tier metadata (prices, icons, styling). Copy strings come from i18n.
const TIERS = [
  {
    key: "starter" as const,
    nsKey: "starterTier",
    price: "$5",
    cadenceKey: "cadenceOneTime",
    icon: BookOpen,
    accent: "border-brand-200",
    featureKeys: ["f1", "f2", "f3", "f4"] as const
  },
  {
    key: "pdf" as const,
    nsKey: "pdfTier",
    price: "$10",
    cadenceKey: "cadenceOneTime",
    icon: FileText,
    accent: "border-brand-300",
    featureKeys: ["f1", "f2", "f3", "f4", "f5"] as const,
    highlight: true
  },
  {
    key: "full" as const,
    nsKey: "fullTier",
    price: "$20",
    cadenceKey: "cadenceMonthly",
    icon: InfinityIcon,
    accent: "border-brand-400",
    featureKeys: ["f1", "f2", "f3", "f4", "f5"] as const
  }
];

export async function PricingTiers() {
  const t = await getTranslations("pricing");
  return (
    <section id="pricing" className="py-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-brand-800">{t("heading")}</h2>
        <p className="text-neutral-600 mt-2">{t("subheading")}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.key}
              className={`rounded-2xl border-2 ${tier.accent} ${tier.highlight ? "bg-brand-50" : "bg-white"} p-6 flex flex-col`}
            >
              <div className="flex items-center gap-2 text-brand-700">
                <Icon className="w-5 h-5" />
                <h3 className="font-serif text-2xl">{t(`${tier.nsKey}.name`)}</h3>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-semibold text-brand-800">{tier.price}</span>
                <span className="text-neutral-500 text-sm ml-1">{t(tier.cadenceKey)}</span>
              </div>
              <p className="text-sm text-neutral-600 mt-2">{t(`${tier.nsKey}.blurb`)}</p>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {tier.featureKeys.map((fk) => (
                  <li key={fk} className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span>{t(`${tier.nsKey}.${fk}`)}</span>
                  </li>
                ))}
              </ul>
              <a
                href={checkoutUrl(tier.key, "/encyclopedia")}
                className={`mt-6 block text-center py-2.5 rounded-lg font-medium transition ${
                  tier.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "bg-brand-100 text-brand-800 hover:bg-brand-200"
                }`}
              >
                {t(`${tier.nsKey}.cta`)}
              </a>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-neutral-500 mt-6">{t("checkoutNote")}</p>
    </section>
  );
}
