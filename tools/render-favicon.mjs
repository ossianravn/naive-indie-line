// Draws the site's favicon with the pen: a capital F in the navy pen on a tile of bond paper, the strokes run past their
// corners as the hand does, thick enough to read at 16 px. Writes public/favicon.svg (the tile turns night paper in a
// dark browser), public/favicon.ico (32 px, for anything that asks for /favicon.ico) and public/apple-touch-icon.png.
//   node tools/render-favicon.mjs
import { writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const { pen } = await createJiti(import.meta.url, { fsCache: false }).import(
  path.join(root, "src/fineliner/pen/index.ts"),
)

// Bond paper and the navy pen by day, night paper and its pen by night (src/fineliner/styles/stocks.css).
const [PAPER, INK, NIGHT_PAPER, NIGHT_INK] = [
  "#f4f0e6",
  "#263152",
  "#1b1b1a",
  "#dde3f2",
]
// The F in a 64-unit tile: the stem, then the arm and the shorter bar, each its own stroke.
const p = pen("favicon", "calm")
const strokes = [
  p.line([22, 12], [21, 53]),
  p.line([19, 13], [45, 12]),
  p.line([20, 32], [39, 31]),
]
const svg = (night = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${
    night
      ? `<style>rect{fill:${PAPER}}path{stroke:${INK}}@media (prefers-color-scheme:dark){rect{fill:${NIGHT_PAPER}}path{stroke:${NIGHT_INK}}}</style>`
      : ""
  }<rect width="64" height="64" rx="12" fill="${PAPER}"/>${strokes
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("")}</svg>\n`

writeFileSync(path.join(root, "public/favicon.svg"), svg())
const png = (size) =>
  sharp(Buffer.from(svg(false)), { density: 72 * (size / 64) })
    .resize(size, size)
    .png()
    .toBuffer()
writeFileSync(path.join(root, "public/apple-touch-icon.png"), await png(180))
// An ICO holding one 32 px PNG: a six-byte header, one sixteen-byte directory entry, then the image.
const image = await png(32)
const ico = Buffer.alloc(22)
ico.writeUInt16LE(1, 2)
ico.writeUInt16LE(1, 4)
ico.writeUInt8(32, 6)
ico.writeUInt8(32, 7)
ico.writeUInt16LE(1, 10)
ico.writeUInt16LE(32, 12)
ico.writeUInt32LE(image.length, 14)
ico.writeUInt32LE(22, 18)
writeFileSync(
  path.join(root, "public/favicon.ico"),
  Buffer.concat([ico, image]),
)
console.log("wrote public/favicon.svg, favicon.ico, apple-touch-icon.png")
