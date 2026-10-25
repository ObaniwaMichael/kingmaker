import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

export const runtime = "nodejs";
export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function OgImage() {
  const buf = await readFile(
    join(process.cwd(), "public", "wallpapers", "laptop-wallpaper.jpg"),
  );
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
