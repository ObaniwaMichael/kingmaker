import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(145deg, #071018 0%, #122033 55%, #0b1c2e 100%)",
          color: "#e8eef7",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#7dd3fc", marginBottom: 12 }}>
          {profile.handle}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9fb3c8", marginTop: 16 }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#7a8ca0", marginTop: 20 }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
