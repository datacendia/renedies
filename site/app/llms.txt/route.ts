import { getAllRemedies, getRemediesByRegion, REGIONS } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remedia.app";

/**
 * `/llms.txt` — the emerging convention for giving large language models a
 * concise map of a site's content. See https://llmstxt.org.
 *
 * This is intentionally markdown-structured, link-heavy, and short enough to
 * fit in a single context window. It complements (not replaces) sitemap.xml.
 */
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const all = getAllRemedies();
  const lines: string[] = [];
  lines.push("# Remedia");
  lines.push("");
  lines.push(`> A ${all.length}-entry encyclopedia of traditional and herbal remedies from five healing traditions: Ayurveda (India), Traditional Chinese Medicine (China), Kampo (Japan), Andean & Peruvian herbalism, and other global traditions. Every entry has a benefit description, a home preparation recipe, sourcing guidance, structured pregnancy and lactation safety flags, drug-interaction flags, and (for the most-consulted herbs) citations to authoritative modern sources.`);
  lines.push("");
  lines.push("Remedia is educational content only — not medical advice. Herbs can interact with medications and have real contraindications in pregnancy, breastfeeding, and chronic disease.");
  lines.push("");

  lines.push("## Core pages");
  lines.push("");
  lines.push(`- [Home](${SITE_URL}/): overview, FAQ, featured remedies`);
  lines.push(`- [Encyclopedia](${SITE_URL}/encyclopedia): searchable index of every remedy`);
  lines.push(`- [Taste & energetics compass](${SITE_URL}/compass): interactive radial selector`);
  lines.push(`- [Body-map symptom finder](${SITE_URL}/body-map): tap a body region`);
  lines.push(`- [Cross-tradition compare](${SITE_URL}/compare): one concern, five traditions`);
  lines.push(`- [Herb relationship graph](${SITE_URL}/graph): force-directed similarity`);
  lines.push(`- [Recipe builder](${SITE_URL}/recipe): drag-drop blend with interaction warnings`);
  lines.push(`- [Guided rituals](${SITE_URL}/rituals): step-by-step preparations`);
  lines.push(`- [Seasonal dashboard](${SITE_URL}/seasonal): hemisphere-aware harvest calendar`);
  lines.push(`- [Medical disclaimer](${SITE_URL}/disclaimer)`);
  lines.push("");

  for (const region of REGIONS) {
    const items = getRemediesByRegion(region).slice(0, 50);
    lines.push(`## ${region}`);
    lines.push("");
    for (const r of items) {
      const latin = r.latin ? ` *(${r.latin})*` : "";
      const benefit = r.benefit ? ` — ${r.benefit}` : "";
      lines.push(`- [${r.name}${latin}](${SITE_URL}/encyclopedia/${r.slug})${benefit}`);
    }
    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push("- [Terms of service](" + SITE_URL + "/terms)");
  lines.push("- [Privacy policy](" + SITE_URL + "/privacy)");
  lines.push("- [Affiliate disclosure](" + SITE_URL + "/affiliate-disclosure)");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
}
