// Line boil on a scene, one thing at a time. A scene groups each object it places under its key (g[data-k], in every
// take); the part under the pointer, or under a tap on a touch screen, boils while the rest of the room rests on its
// first take (data-hot and fl-hot in styles/drawing.css). The part is found from its groups' boxes in the first take:
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

/** Boil one part of a scene (its groups in every take), or none. */
export function setHot(el: HTMLElement, key: string | undefined) {
  if (el.dataset.hot === key) return
  el.querySelectorAll(".fl-hot").forEach((g) => g.classList.remove("fl-hot"))
  if (key === undefined) return void delete el.dataset.hot
  el.dataset.hot = key
  el.querySelectorAll(`g[data-k="${CSS.escape(key)}"]`).forEach((g) =>
    g.classList.add("fl-hot"),
  )
}
