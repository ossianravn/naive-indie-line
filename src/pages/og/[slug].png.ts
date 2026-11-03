// Share images, drawn by the pen and rasterised at build time: one PNG per main page, block and component.
import "@/fineliner/pen/objects"
import "@/fineliner/pen/objects/rooms"
import "@/site/maaltid/drawings"
import type { APIRoute } from "astro"
import sharp from "sharp"
import { shareSvg, type Share } from "@/site/share/share-image"
import { SHARES } from "@/site/share/shares"

export function getStaticPaths() {
  return SHARES.map((share) => ({ params: { slug: share.slug }, props: share }))
}

export const GET: APIRoute = async ({ props }) => {
  const png = await sharp(Buffer.from(shareSvg(props as Share)))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  })
}
