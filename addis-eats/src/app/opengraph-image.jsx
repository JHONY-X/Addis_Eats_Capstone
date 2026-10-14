import { ImageResponse } from "next/og";

export const alt = "Greek Moussaka from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const moussakaSource = "https://cdn.dummyjson.com/recipe-images/19.webp";

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "#111318" }}>
      <img alt="Greek Moussaka" src={moussakaSource} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>,
    size
  );
}
