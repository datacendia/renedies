import type { Remedy } from "./content";
import type { Reference } from "./safety";

/**
 * Schema.org JSON-LD builders for SEO and generative-engine (SGO/GEO)
 * grounding. Every public page should emit at least one of these.
 */

export function siteJsonLd(siteUrl: string, remedyCount: number) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: "Remedia",
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description: "Traditional and herbal remedies encyclopedia across five healing traditions.",
      sameAs: [] as string[]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Remedia",
      publisher: { "@id": `${siteUrl}/#org` },
      inLanguage: "en",
      description: `${remedyCount} traditional remedies with benefits, recipes, sourcing, and interactive exploration.`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/encyclopedia?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];
}

export function breadcrumbJsonLd(
  siteUrl: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.url}`
    }))
  };
}

export function remedyJsonLd(
  siteUrl: string,
  r: Remedy,
  refs: Reference[]
) {
  const url = `${siteUrl}/encyclopedia/${r.slug}`;
  const citations = refs.map(ref => ({
    "@type": "CreativeWork",
    name: ref.title,
    publisher: ref.source,
    url: ref.url
  }));

  // Use MedicalEntity + Substance (most generic match for a traditional remedy).
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["MedicalEntity", "Substance"],
    "@id": `${url}#remedy`,
    name: r.name,
    url,
    description: r.benefit ?? `${r.name} — ${r.region} tradition.`,
    medicineSystem: regionToMedicineSystem(r.region),
    recognizingAuthority: {
      "@type": "Organization",
      name: r.region === "India" ? "Ayurveda (traditional)" :
            r.region === "China" ? "TCM (traditional)"     :
            r.region === "Japan" ? "Kampo (traditional)"    :
                                   "Traditional"
    }
  };
  if (r.latin) node.alternateName = r.latin;
  if (citations.length) node.citation = citations;

  return node;
}

function regionToMedicineSystem(region: string) {
  switch (region) {
    case "India": return "Ayurveda";
    case "China": return "TraditionalChineseMedicine";
    case "Japan": return "TraditionalChineseMedicine"; // closest schema.org match
    default:      return "TraditionalMedicine";
  }
}

/** FAQ schema for the homepage. */
export function faqJsonLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };
}

/** Collection page schema for listings like /encyclopedia. */
export function collectionJsonLd(
  siteUrl: string,
  path: string,
  name: string,
  description: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `${siteUrl}${path}`,
    name,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: `${siteUrl}${it.url}`
      }))
    }
  };
}

/** HowTo schema for the per-remedy recipe (if present). */
export function recipeHowToJsonLd(siteUrl: string, r: Remedy) {
  if (!r.recipe) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to prepare ${r.name}`,
    description: r.recipe,
    totalTime: "PT15M",
    step: [{ "@type": "HowToStep", text: r.recipe }],
    url: `${siteUrl}/encyclopedia/${r.slug}`
  };
}
