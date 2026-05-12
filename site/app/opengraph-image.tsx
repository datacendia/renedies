import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Remedia — Traditional & Herbal Remedies Encyclopedia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #16110d 0%, #1f3a1f 55%, #3e2618 100%)",
          color: "#fbfaf6",
          fontFamily: "serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 24,
              background: "#d97f49", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 28, color: "#fbfaf6"
            }}
          >
            ❧
          </div>
          <span>Remedia</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, fontWeight: 700, letterSpacing: -2 }}>
            Traditional &amp; Herbal<br />Remedies Encyclopedia
          </div>
          <div style={{ fontSize: 28, opacity: 0.82, maxWidth: 940, lineHeight: 1.3 }}>
            India · Peru &amp; Andes · China · Japan · Global — benefits, recipes,
            sourcing, and interactive exploration.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 20, opacity: 0.7 }}>
          <span>Five traditions, one library.</span>
          <span>remedia.app</span>
        </div>
      </div>
    ),
    size
  );
}
