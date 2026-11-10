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

/** Boil one part of a scene, or none: a copy of its groups from each take, stacked over the room. */
export function setHot(el: HTMLElement, key: string | undefined) {
  const copies = el.querySelectorAll(":scope > .fl-part")
  if (el.dataset.hot === key && (key === undefined || copies.length)) return
  copies.forEach((c) => c.remove())
  el.querySelectorAll(".fl-hot").forEach((g) => g.classList.remove("fl-hot"))
  if (key === undefined) return void delete el.dataset.hot
  const takes = [...el.children].filter((c) => c instanceof SVGSVGElement)
  const groups = `g[data-k="${CSS.escape(key)}"]`
  takes.forEach((take, i) => {
    const copy = document.createElementNS(SVG, "svg")
    copy.setAttribute("viewBox", take.getAttribute("viewBox") ?? "")
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
  takes[0]?.querySelectorAll(groups).forEach((g) => g.classList.add("fl-hot"))
  el.dataset.hot = key
}
