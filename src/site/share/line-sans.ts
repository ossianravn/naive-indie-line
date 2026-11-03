// Fineliner Naïve Sans for the share images: they are rasterised at build time without a browser, so the words are
// set as outlines from the font file instead of as text. Returns an SVG in the same shape the pen's lettering has.
import fs from "node:fs"
import path from "node:path"
import opentype, { type Command } from "opentype.js"

const FILE = path.resolve("public/fonts/fineliner-naive-sans.otf")
let font: ReturnType<typeof opentype.parse> | undefined

// Written here rather than by opentype.js 2.0's toPathData, whose number formatting puts NaN into these outlines.
const n = (v: number) => (Math.round(v * 10) / 10).toString()
const data = (commands: Command[]) =>
  commands
    .map((c) =>
      c.type === "Z"
        ? "Z"
        : c.type === "C"
          ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
          : c.type === "Q"
            ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
            : `${c.type}${n(c.x)} ${n(c.y)}`,
    )
    .join("")

/** One line of words as an SVG fitted to its ink, its glyphs filled (class "glyph"). */
export function lineSans(text: string) {
  font ??= opentype.parse(new Uint8Array(fs.readFileSync(FILE)).buffer)
  const line = font.getPath(text, 0, 0, 100, { kerning: true })
  const { x1, y1, x2, y2 } = line.getBoundingBox()
  const pad = 4
  const view = `${(x1 - pad).toFixed(1)} ${(y1 - pad).toFixed(1)} ${(x2 - x1 + 2 * pad).toFixed(1)} ${(y2 - y1 + 2 * pad).toFixed(1)}`
  return `<svg viewBox="${view}"><path class="glyph" d="${data(line.commands)}"/></svg>`
}
