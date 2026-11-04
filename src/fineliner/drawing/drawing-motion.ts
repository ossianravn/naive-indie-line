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
 * Draw an element's drawings on the first time it comes into view. For rare moments (a hero, an empty state, a first
 * run). A drawing drawn in the browser waits undrawn (fl-unseen) from its first paint. One the server sent is already
 * showing, and stays so if it is in view when the script arrives; one that starts out of view is hidden there, where
 * nobody sees it go, and drawn on when it comes into view. Returns a cleanup for effects.
 */
export function drawWhenSeen(el: HTMLElement) {
  const svgs = () => [...el.querySelectorAll<SVGSVGElement>("svg.fl-drawing")]
  const show = (list: SVGSVGElement[]) =>
    list.forEach((svg) => svg.classList.remove("fl-unseen"))
  if (reduced() || typeof IntersectionObserver !== "function") {
    show(svgs())
    return () => {}
  }
  let waiting = svgs().some((svg) => svg.classList.contains("fl-unseen"))
  let timer: ReturnType<typeof setTimeout> | undefined
  const observer = new IntersectionObserver(
    (entries) => {
      const seen = entries.some((e) => e.isIntersecting)
      if (!waiting) {
        // The first report says where the server's drawing is: on screen, it stays as it is.
        if (seen) return observer.disconnect()
        svgs().forEach((svg) => svg.classList.add("fl-unseen"))
        waiting = true
        return
      }
      if (!seen) return
      observer.disconnect()
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
