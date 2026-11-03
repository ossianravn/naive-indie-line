// A drawing in layers of paths. `blank` hides everything drawn before it inside a shape (a mask, so the paper's
// texture still shows), which is how a figure stands in front of a wall line. Paths drawn between two blanks form one
// layer, masked once by the blanks after it that reach it: one mask per layer, never nested, and a blank across the
// room leaves a layer alone, so masks stay small and paint stays cheap.
import { pathBox, type Bounds } from "./path"

export interface Sheet {
  /** A pen line. */
  stroke(d: string): void
  /** A pocket of solid ink. */
  fill(d: string): void
  /** The pen's wash: art fills only. */
  wash(d: string): void
  /** Flat paper, for small holes such as a record's label. */
  paper(d: string): void
  /** Markup the helpers cannot express, such as an even-odd ring. */
  raw(markup: string): void
  /** Hide everything drawn so far inside this shape. */
  blank(d: string): void
  /** The SVG: named by `label` (role="img"), or decorative without one. */
  svg(width: number, height: number, label?: string): string
}

// Room around a layer for its pen line: a non-scaling stroke is wider, in the drawing's units, the smaller it is shown.
const PAD = 12
const EVERYWHERE: Bounds = [-Infinity, -Infinity, Infinity, Infinity]
const grow = (
  a: Bounds | undefined,
  b: Bounds | undefined,
): Bounds | undefined =>
  !a
    ? b
    : !b
      ? a
      : [
          Math.min(a[0], b[0]),
          Math.min(a[1], b[1]),
          Math.max(a[2], b[2]),
          Math.max(a[3], b[3]),
        ]
const meet = (a: Bounds, b: Bounds) =>
  a[0] - PAD <= b[2] &&
  b[0] <= a[2] + PAD &&
  a[1] - PAD <= b[3] &&
  b[1] <= a[3] + PAD
// Markup whose paths cannot be read is treated as reaching everywhere, so it keeps every mask after it.
const boxOf = (markup: string) => {
  let box: Bounds | undefined
  for (const [, d = ""] of markup.matchAll(/ d="([^"]*)"/g))
    box = grow(box, pathBox(d) ?? EVERYWHERE)
  return box ?? EVERYWHERE
}

const escape = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  )

/** `id` prefixes the sheet's mask ids; derive it from the drawing's seed and take so server and browser agree. */
export function sheet(id: string): Sheet {
  const layers: { paths: string[]; box?: Bounds }[] = [{ paths: [] }]
  const blanks: { d: string; box: Bounds }[] = []
  const put = (markup: string, box: Bounds) => {
    const layer = layers[layers.length - 1] as (typeof layers)[number]
    layer.paths.push(markup)
    layer.box = grow(layer.box, box)
  }
  const add = (cls: string) => (d: string) => {
    put(`<path class="${cls}" d="${d}"/>`, pathBox(d) ?? EVERYWHERE)
  }
  return {
    stroke: add("ln"),
    fill: add("ink"),
    wash: add("wash"),
    paper: add("sheet-fill"),
    raw: (markup) => put(markup, boxOf(markup)),
    blank(d) {
      if (layers.every((l) => !l.paths.length)) return
      blanks.push({ d, box: pathBox(d) ?? EVERYWHERE })
      layers.push({ paths: [] })
    },
    svg(width, height, label) {
      const name = label
        ? `role="img" aria-label="${escape(label)}"`
        : `aria-hidden="true"`
      const pad = 24
      const box = `x="${-pad}" y="${-pad}" width="${width + 2 * pad}" height="${height + 2 * pad}"`
      let defs = ""
      let body = ""
      layers.forEach(({ paths, box: reach }, i) => {
        if (!paths.length || !reach) return
        const after = blanks.slice(i).filter((b) => meet(reach, b.box))
        if (!after.length) {
          body += paths.join("")
          return
        }
        const holes = after.map(({ d }) => `<path d="${d}"/>`).join("")
        defs += `<mask id="${id}-m${i}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><g fill="#000">${holes}</g></mask>`
        body += `<g mask="url(#${id}-m${i})">${paths.join("")}</g>`
      })
      // fl-size-own contains "size-", so shadcn's icon rule ([&_svg:not([class*='size-'])]:size-4) leaves a drawing
      // or pen mark inside a button or menu item at the size its call site gives it.
      return `<svg class="fl-drawing fl-size-own" viewBox="0 0 ${width} ${height}" ${name}>${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`
    },
  }
}
