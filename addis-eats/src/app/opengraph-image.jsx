import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Wagyu burger from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const burger = await readFile(join(process.cwd(), "public", "wagyu-hero.jpg"));
  const burgerSource = `data:image/jpeg;base64,${burger.toString("base64")}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "#111318" }}>
      <img alt="Gold-topped burger" src={burgerSource} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>,
    size
  );
}
