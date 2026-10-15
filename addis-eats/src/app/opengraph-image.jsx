import { ImageResponse } from "next/og";

export const alt = "Addis Eats delivery and food";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        color: "#fff7df",
        background: "linear-gradient(135deg, #0b1020 0%, #111827 35%, #1a2f4d 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#f3bb39", fontSize: 36, letterSpacing: 4, marginBottom: 24 }}>
        ADDIS EATS
      </div>
      <div style={{ display: "flex", fontSize: 80, fontWeight: 700, lineHeight: 1.05, maxWidth: 920 }}>
        Authentic Ethiopian flavors, delivered across Addis Ababa
      </div>
      <div style={{ display: "flex", color: "#d7e3f5", fontSize: 34, marginTop: 28 }}>
        Fresh dishes, fast delivery, and cozy cravings.
      </div>
    </div>,
    size
  );
}
