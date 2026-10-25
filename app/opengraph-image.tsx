import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name}, ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The social card shown when the site is shared on LinkedIn, X, Slack, etc.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0b0c", color: "#f2f1ee", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: "#ff5a1f", color: "#0b0b0c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>S</div>
          <div style={{ fontSize: 30, color: "#a09f9a" }}>saikatchowdhury.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{SITE.name}</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#ff5a1f" }}>{SITE.role}</div>
          <div style={{ fontSize: 28, marginTop: 18, color: "#a09f9a" }}>Next.js · WordPress plugins · AI automation · Technical SEO</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#6c6b66" }}>{`${SITE.city} (Chittagong), ${SITE.country} · Working worldwide`}</div>
      </div>
    ),
    size,
  );
}
