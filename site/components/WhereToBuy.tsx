import { ShoppingBag, ExternalLink } from "lucide-react";
import { DEFAULT_SUPPLIERS, type Enrichment } from "@/lib/enrichment";

export function WhereToBuy({
  name, region, affiliates
}: {
  name: string;
  region: string;
  affiliates?: Enrichment["affiliates"];
}) {
  const query = encodeURIComponent(name);
  const defaults = DEFAULT_SUPPLIERS[region] ?? DEFAULT_SUPPLIERS.Global;
  const items = [
    ...(affiliates ?? []),
    ...defaults.map(s => ({ label: s.label, url: s.search + query, region }))
  ];

  return (
    <section className="rounded-xl bg-white border border-brand-100 p-5">
      <h2 className="flex items-center gap-2 font-serif text-xl text-brand-800">
        <ShoppingBag className="w-5 h-5 text-brand-600" /> Where to buy
      </h2>
      <p className="text-xs text-neutral-500 mt-1">
        We may earn a small commission from these links — it helps keep the encyclopedia free to browse.
      </p>
      <ul className="mt-3 grid sm:grid-cols-2 gap-2">
        {items.map((s, i) => (
          <li key={i}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener sponsored"
              className="flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-lg border border-brand-100 bg-brand-50 hover:bg-brand-100 transition"
            >
              <span>{s.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
