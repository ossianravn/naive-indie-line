import { drawing, pen, stream, seedOf, type SceneName } from "@/fineliner/pen"
import { lineSans } from "./line-sans"

// A share image drawn by the pen: day paper with a few flecks, the label's drawn border, the title set in Naïve Indie
// Line Sans, a kicker set small, and a drawing from the library on the right. Built as one SVG at 1200 × 630 and rasterised
// at build time (src/pages/og/[slug].png.ts). Classes become inline paint, so each drawing keeps one screen weight
// however far it is scaled, without relying on non-scaling strokes in the rasteriser.

export interface Share {
  slug: string
  title: string
  kicker: string
  object?: string
  scene?: SceneName
}

const W = 1200
const H = 630
const PAPER = "#f4f0e6"
const FLECK = "#c8bea8"
const PEN = "#263152"
const WASH = "#5b72a8"
const WEIGHT = 2.6

/** One line for the font: its capitals cover every Latin-script European language; the double prime goes. */
const letterable = (text: string) =>
  text.replace(/″/gu, "").replace(/\s+/gu, " ").trim()

/** One drawing's SVG placed in a box: its viewBox fitted in, its classes painted at a weight that survives the scale. */
function place(
  svg: string,
  x: number,
  y: number,
  w: number,
  h: number,
  align = "xMidYMid",
) {
  const view = /viewBox="-?[\d.]+ -?[\d.]+ ([\d.]+) ([\d.]+)"/u.exec(svg)
  const [vw, vh] = view ? [Number(view[1]), Number(view[2])] : [w, h]
  const scale = Math.min(w / vw, h / vh)
  const stroke = (WEIGHT / scale).toFixed(2)
  const line = `fill="none" stroke="${PEN}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"`
  return svg
    .replace(/<title>[^<]*<\/title>/gu, "")
    .replace(
      /<svg [^>]*?viewBox="([^"]+)"[^>]*>/u,
      `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="$1" preserveAspectRatio="${align} meet">`,
    )
    .replace(/class="ln"/gu, line)
    .replace(
      /class="ink"/gu,
      `fill="${PEN}" stroke="${PEN}" stroke-width="${stroke}" stroke-linejoin="round"`,
    )
    .replace(/class="wash"/gu, `fill="${WASH}"`)
    .replace(/class="glyph"/gu, `fill="${PEN}"`)
    .replace(/class="sheet-fill"/gu, `fill="${PAPER}"`)
}

/** Seeded flecks of fibre on the paper, as the generated stocks have. */
function flecks(seed: string) {
  const r = stream(seedOf(seed), "share-flecks")
  return Array.from({ length: 70 }, () => {
    const x = r.between(20, W - 20)
    const y = r.between(20, H - 20)
    const a = r.between(0, Math.PI)
    const l = r.between(2, 9)
    const x2 = (x + Math.cos(a) * l).toFixed(1)
    const y2 = (y + Math.sin(a) * l).toFixed(1)
    return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2}" y2="${y2}" stroke="${FLECK}" stroke-width="1.2" stroke-linecap="round"/>`
  }).join("")
}

/** The whole share image as an SVG string. */
export function shareSvg({ slug, title, kicker, object, scene }: Share) {
  const p = pen(`share:${slug}`, "lively")
  const border = p.edges([
    [36, 36],
    [W - 36, 36],
    [W - 36, H - 36],
    [36, H - 36],
  ])
  const words = letterable(title)
  // Long titles get a shorter box, so they letter smaller and stay in the left half.
  const titleHeight = words.length > 18 ? 74 : words.length > 11 ? 92 : 112
  const titleSvg = lineSans(words || "Fineliner")
  const kickerSvg = lineSans(letterable(kicker))
  const art =
    drawing({ object, scene, seed: slug, takes: 1, title: "" })[0] ?? ""
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect width="${W}" height="${H}" fill="${PAPER}"/>`,
    flecks(slug),
    `<path d="${border}" fill="none" stroke="${PEN}" stroke-width="${WEIGHT}" stroke-linecap="round"/>`,
    place(kickerSvg, 92, 116, 520, 40, "xMinYMid"),
    place(titleSvg, 92, 190, 560, titleHeight * 2.4, "xMinYMid"),
    place(art, 660, 96, 470, 440),
    `</svg>`,
  ].join("")
}
