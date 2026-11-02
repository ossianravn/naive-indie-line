// Motion for drawings, in the browser: a new drawing settles through its takes, and a drawing can be drawn on, stroke
// by stroke, the first time it is seen. Both do nothing under prefers-reduced-motion.

const SETTLE = 60
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"

const reduced = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches

/** A new drawing settles: its takes play once, 60 ms each, then it rests on the first. */
export function settleDrawing(el: HTMLElement) {
  if (reduced()) return
  const takes = el.classList.contains("fl-takes")
    ? [el]
    : [...el.querySelectorAll<HTMLElement>(".fl-takes")]
  for (const t of takes) {
    if (t.children.length < 3) continue
    t.dataset.show = "1"
    setTimeout(() => (t.dataset.show = "2"), SETTLE)
    setTimeout(() => (t.dataset.show = "0"), SETTLE * 2)
    setTimeout(() => delete t.dataset.show, SETTLE * 3)
  }
}

/**
 * The pen draws the picture: strokes draw on in the order they were drawn, then the ink and wash fill in. Pen lines
 * keep their screen width (non-scaling strokes), so dashes are measured in screen pixels, not with pathLength.
 */
export function drawOn(
  svg: SVGSVGElement,
  { stroke = 240, total = 1100 } = {},
) {
  const lines = [...svg.querySelectorAll<SVGPathElement>(".ln")]
  const scale = svg.getScreenCTM()?.a || 1
  const gap = Math.min(18, (total - stroke) / Math.max(1, lines.length))
  lines.forEach((path, i) => {
    const len = path.getTotalLength() * scale + 2
    const dash = `${len} ${len}`
    path.animate(
      [
        { strokeDasharray: dash, strokeDashoffset: len },
        { strokeDasharray: dash, strokeDashoffset: 0 },
      ],
      { duration: stroke, delay: i * gap, easing: EASE, fill: "backwards" },
    )
  })
  for (const el of svg.querySelectorAll(".ink, .wash, .sheet-fill"))
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      delay: lines.length * gap,
      easing: EASE,
      fill: "backwards",
    })
  svg.classList.remove("fl-unseen")
}

/**
 * Draw an element's drawings on the first time it comes into view; until then they wait undrawn. For rare moments
 * (a hero, an empty state, a first run). Returns a cleanup for effects.
 */
export function drawWhenSeen(el: HTMLElement) {
  const svgs = () => el.querySelectorAll<SVGSVGElement>("svg.fl-drawing")
  if (reduced() || typeof IntersectionObserver !== "function") {
    svgs().forEach((svg) => svg.classList.remove("fl-unseen"))
    return () => {}
  }
  svgs().forEach((svg) => svg.classList.add("fl-unseen"))
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      observer.disconnect()
      svgs().forEach((svg) => drawOn(svg))
    },
    { threshold: 0.35 },
  )
  observer.observe(el)
  return () => observer.disconnect()
}
