// Line boil on a scene, one thing at a time. A scene groups each object it places under its key (g[data-k], in every
// take); the part under the pointer, or under a tap on a touch screen, boils while the rest of the room rests on its
// first take. Its groups from each take are copied into an SVG of their own over the room, which cycles as a whole
// element (data-hot, fl-hot and fl-part in styles/drawing.css). The part is found from its groups' boxes in the first take:
// the smallest box that holds the point, so a person in front of a counter wins over the counter. Measured once per
// drawing, at the first hover.

interface Part {
  key: string
  box: [number, number, number, number]
  area: number
}
const parts = new WeakMap<Element, Part[]>()

function partsOf(svg: SVGSVGElement) {
  const known = parts.get(svg)
  if (known) return known
  const boxes = new Map<string, [number, number, number, number]>()
  svg.querySelectorAll<SVGGElement>("g[data-k]").forEach((g) => {
    const key = g.dataset.k
    if (key === undefined) return
    const { x, y, width, height } = g.getBBox()
    const was = boxes.get(key)
    boxes.set(
      key,
      was
        ? [
            Math.min(was[0], x),
            Math.min(was[1], y),
            Math.max(was[2], x + width),
            Math.max(was[3], y + height),
          ]
        : [x, y, x + width, y + height],
    )
  })
  const list = [...boxes].map(([key, box]) => ({
    key,
    box,
    area: (box[2] - box[0]) * (box[3] - box[1]),
  }))
  parts.set(svg, list)
  return list
}

/** The key of the part of a scene's drawing at a point on screen, if any. */
export function partAt(el: HTMLElement, x: number, y: number) {
  const svg = el.firstElementChild
  if (!(svg instanceof SVGSVGElement)) return undefined
  const m = svg.getScreenCTM()
  if (!m) return undefined
  const p = new DOMPoint(x, y).matrixTransform(m.inverse())
  let best: Part | undefined
  for (const part of partsOf(svg)) {
    const [x0, y0, x1, y1] = part.box
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue
    if (!best || part.area < best.area) best = part
  }
  return best?.key
}

const SVG = "http://www.w3.org/2000/svg"

// Room around the part's geometry for the pen's width and its round ends, in CSS pixels: the copy clips to its box.
const PAD = 8

/**
 * The part's box on screen: its groups in every take (they wobble apart), within the room's own box. A copy as large
 * as the room would be a layer the size of the room, and each new one is rasterized whole, tiles of nothing included:
 * about 40 raster tasks at every part the pointer crosses at 2x, as heavy on a GPU as boiling inside the room was. A
 * masked group reaches as far as its mask (the whole room), so the copy clips to the box (fl-part in drawing.css).
 */
function boxOf(takes: SVGSVGElement[], groups: string) {
  const room = takes[0].getBoundingClientRect()
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const take of takes)
    take.querySelectorAll(groups).forEach((g) => {
      const r = g.getBoundingClientRect()
      if (!r.width && !r.height) return
      x0 = Math.min(x0, r.left)
      y0 = Math.min(y0, r.top)
      x1 = Math.max(x1, r.right)
      y1 = Math.max(y1, r.bottom)
    })
  // Kept inside the room, so a copy never stretches the grid it shares with it, and a whole number of device pixels
  // from its corner, so the copy's lines fall on the same sub-pixels as the room's rather than a pixel beside them.
  const px = devicePixelRatio || 1
  const snap = (v: number, from: number, round: (n: number) => number) =>
    from + round((v - from) * px) / px
  x0 = snap(Math.max(x0 - PAD, room.left), room.left, Math.floor)
  y0 = snap(Math.max(y0 - PAD, room.top), room.top, Math.floor)
  x1 = Math.min(
    snap(x1 + PAD, room.left, Math.ceil),
    snap(room.right, room.left, Math.floor),
  )
  y1 = Math.min(
    snap(y1 + PAD, room.top, Math.ceil),
    snap(room.bottom, room.top, Math.floor),
  )
  return x1 > x0 && y1 > y0 ? new DOMRect(x0, y0, x1 - x0, y1 - y0) : undefined
}

/** Boil one part of a scene, or none: a copy of its groups from each take, stacked over the room where the part is. */
export function setHot(el: HTMLElement, key: string | undefined) {
  const copies = el.querySelectorAll(":scope > .fl-part")
  if (el.dataset.hot === key && (key === undefined || copies.length)) return
  copies.forEach((c) => c.remove())
  el.querySelectorAll(".fl-hot").forEach((g) => g.classList.remove("fl-hot"))
  if (key === undefined) return void delete el.dataset.hot
  const takes = [...el.children].filter((c) => c instanceof SVGSVGElement)
  const groups = `g[data-k="${CSS.escape(key)}"]`
  const m = takes[0]?.getScreenCTM()
  const box = m && boxOf(takes, groups)
  if (!m || !box) return void delete el.dataset.hot
  // The copy's viewBox is the part's box in the room's own units, so its lines (and masks) land where they are drawn.
  const inv = m.inverse()
  const a = new DOMPoint(box.left, box.top).matrixTransform(inv)
  const b = new DOMPoint(box.right, box.bottom).matrixTransform(inv)
  // Screen pixels to the element's own, where an ancestor scales it (offsetWidth is rounded, so only past a pixel).
  const shown = el.getBoundingClientRect().width
  const scale =
    Math.abs(el.offsetWidth - shown) > 1 ? el.offsetWidth / shown || 1 : 1
  const made: SVGSVGElement[] = []
  takes.forEach((take, i) => {
    const copy = document.createElementNS(SVG, "svg")
    copy.setAttribute("viewBox", `${a.x} ${a.y} ${b.x - a.x} ${b.y - a.y}`)
    // Each axis to its own size: layout rounds the box a little, which "meet" would answer by centring the lines.
    copy.setAttribute("preserveAspectRatio", "none")
    copy.style.width = `${box.width * scale}px`
    copy.style.height = `${box.height * scale}px`
    made.push(copy)
    copy.setAttribute("class", "fl-drawing fl-size-own fl-part")
    copy.setAttribute("aria-hidden", "true")
    copy.dataset.take = String(i)
    // A group inside a masked layer keeps its mask (the mask stays where it is, in its take).
    take.querySelectorAll(groups).forEach((g) => {
      const mask = g.parentElement?.getAttribute("mask")
      const part = g.cloneNode(true)
      if (!mask) return void copy.append(part)
      const layer = document.createElementNS(SVG, "g")
      layer.setAttribute("mask", mask)
      layer.append(part)
      copy.append(layer)
    })
    el.append(copy)
  })
  // The copies sit at the start of the grid cell; move them over the part.
  const at = made[0].getBoundingClientRect()
  const move = `translate(${(box.left - at.left) * scale}px, ${(box.top - at.top) * scale}px)`
  made.forEach((copy) => (copy.style.transform = move))
  takes[0].querySelectorAll(groups).forEach((g) => g.classList.add("fl-hot"))
  el.dataset.hot = key
}
