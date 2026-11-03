// Motion for drawings, in the browser: a new drawing settles through its takes, and a drawing can be drawn on, stroke
// by stroke, the first time it is seen. Both do nothing under prefers-reduced-motion.

const SETTLE = 60
// The CSS shows an undrawn drawing at 2.5 s if no script draws it; a script that arrives later finds it showing.
const LATE = 2000
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
 * Returns how long it takes, in ms.
 */
export function drawOn(
  svg: SVGSVGElement,
  { stroke = 240, total = 1100 } = {},
) {
  const lines = [...svg.querySelectorAll<SVGPathElement>(".ln")]
  const scale = svg.getScreenCTM()?.a || 1
  const gap = Math.min(18, (total - stroke) / Math.max(1, lines.length))
  // Every length first: measuring after an animate() would lay the page out again for each stroke.
  const lengths = lines.map((path) => path.getTotalLength() * scale + 2)
  lines.forEach((path, i) => {
    const len = lengths[i] as number
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
  return lines.length * gap + Math.max(stroke, 200)
}

/**
 * Draw an element's drawings on the first time it comes into view; until then they wait undrawn. For rare moments
 * (a hero, an empty state, a first run). Returns a cleanup for effects.
 */
export function drawWhenSeen(el: HTMLElement) {
  const svgs = () => [...el.querySelectorAll<SVGSVGElement>("svg.fl-drawing")]
  const show = (list: SVGSVGElement[]) =>
    list.forEach((svg) => svg.classList.remove("fl-unseen"))
  if (reduced() || typeof IntersectionObserver !== "function") {
    show(svgs())
    return () => {}
  }
  svgs().forEach((svg) => svg.classList.add("fl-unseen"))
  let first = true
  let timer: ReturnType<typeof setTimeout> | undefined
  const observer = new IntersectionObserver(
    (entries) => {
      const seen = entries.some((e) => e.isIntersecting)
      // In view when the script arrived, after the fallback showed it: drawing it again would make it blink.
      const late = first && seen && performance.now() > LATE
      first = false
      if (!seen) return
      observer.disconnect()
      if (late) return show(svgs())
      // The pen draws the take on show; the others, which line boil shows in turn, appear once it has finished.
      const [take, ...rest] = svgs()
      timer = setTimeout(() => show(rest), take ? drawOn(take) : 0)
    },
    { threshold: 0.35 },
  )
  observer.observe(el)
  return () => {
    observer.disconnect()
    clearTimeout(timer)
  }
}
