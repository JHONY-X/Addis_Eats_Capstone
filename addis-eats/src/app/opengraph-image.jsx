import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Greek Moussaka from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const moussaka = await readFile(join(process.cwd(), "public", "Greek_Moussaka-hero.webp"));
  const moussakaSource = `data:image/webp;base64,${moussaka.toString("base64")}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "#111318" }}>
      <img alt="Greek Moussaka" src={moussakaSource} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>,
    size
  );
}
