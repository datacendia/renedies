import { ImageResponse } from "next/og";
import { getRemedyBySlug } from "@/lib/content";

export const alt = "Remedia — remedy monograph";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated on-demand and cached by Next. Build-time prerender is intentionally
// skipped: it doubles build time and trips a Windows-specific `fileURLToPath`
// bug in the bundled @vercel/og font loader.
export const dynamic = "force-static";
export const revalidate = false;

export default function RemedyOg({ params }: { params: { slug: string } }) {
  const r = getRemedyBySlug(params.slug);
  const name = r?.name ?? "Remedy";
  const latin = r?.latin ?? "";
  const region = r?.region ?? "Traditional";
  const benefit = r?.benefit ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #16110d 0%, #1f3a1f 60%, #3e2618 100%)",
          color: "#fbfaf6", fontFamily: "serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
          <span>Remedia</span>
          <span>{region}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 70 }}>
          <div style={{ fontSize: 104, lineHeight: 1, fontWeight: 700, letterSpacing: -2 }}>
            {name}
          </div>
          {latin && (
            <div style={{ fontSize: 34, fontStyle: "italic", opacity: 0.75 }}>
              {latin}
            </div>
          )}
        </div>

        {benefit && (
          <div style={{
            marginTop: "auto", fontSize: 28, opacity: 0.85,
            lineHeight: 1.35, maxWidth: 1020,
            borderLeft: "4px solid #d97f49", paddingLeft: 24
          }}>
            {benefit.length > 180 ? benefit.slice(0, 177) + "…" : benefit}
          </div>
        )}
      </div>
    ),
    size
  );
}
