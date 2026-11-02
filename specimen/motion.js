// Motion is drawing: takes of the same drawing for line boil and settling, the pen drawing a picture in front of
// you, and dialogs that open and close. The paper itself never moves.
;(function (NIL) {
  "use strict"

  const TAKES = 3
  const SETTLE = 60
  const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches

  /**
   * Draw the same thing once per take. Each take uses its own pen fork (`take:n`) while the composition stream stays
   * the same, so only the line changes. CSS cycles the takes (boil) or plays them once (settle).
   */
  function takes(render) {
    const out = []
    try {
      for (let t = 0; t < TAKES; t++) {
        NIL.take = t
        out.push(render())
      }
    } finally {
      NIL.take = 0
    }
    return `<span class="takes">${out.join("")}</span>`
  }

  /** Only drawings on screen may boil, so a long page of art costs nothing off screen. */
  const eyes = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("awake", e.isIntersecting)), {
    rootMargin: "120px",
  })
  const watch = (root) => root.querySelectorAll(".takes").forEach((el) => eyes.observe(el))

  /** A new drawing settles: its takes play once, 60 ms each, then it rests on the first. */
  function settle(root) {
    if (reduced()) return
    root.querySelectorAll(".takes").forEach((el) => {
      el.dataset.show = 1
      setTimeout(() => (el.dataset.show = 2), SETTLE)
      setTimeout(() => (el.dataset.show = 0), SETTLE * 2)
      setTimeout(() => delete el.dataset.show, SETTLE * 3)
    })
  }

  /**
   * The pen draws the picture: strokes draw on in the order they were drawn, then the ink and wash fill in. Pen lines
   * keep their screen width (non-scaling strokes), so their dashes are measured in screen pixels, not with pathLength.
   */
  function drawOn(svg, { stroke = 240, total = 1100 } = {}) {
    const lines = [...svg.querySelectorAll(".ln")]
    const scale = svg.getScreenCTM()?.a || 1
    const gap = Math.min(18, (total - stroke) / Math.max(1, lines.length))
    lines.forEach((path, i) => {
      const len = path.getTotalLength() * scale + 2
      const dash = `${len} ${len}`
      path.animate([{ strokeDasharray: dash, strokeDashoffset: len }, { strokeDasharray: dash, strokeDashoffset: 0 }], {
        duration: stroke,
        delay: i * gap,
        easing: EASE,
        fill: "backwards",
      })
    })
    svg.querySelectorAll(".ink, .wash, .sheet-fill").forEach((el) =>
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: lines.length * gap, easing: EASE, fill: "backwards" }),
    )
    svg.classList.remove("unseen")
  }

  /** Draw a picture on the first time it comes into view; until then it waits undrawn. Rare moments only. */
  const firstSight = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        firstSight.unobserve(e.target)
        e.target.querySelectorAll("svg.doodle").forEach((svg) => drawOn(svg))
      }),
    { threshold: 0.35 },
  )
  function drawWhenSeen(el) {
    if (!el || reduced()) return
    el.querySelectorAll("svg.doodle").forEach((svg) => svg.classList.add("unseen"))
    firstSight.observe(el)
  }

  /** Dialogs: any [data-open="id"] opens a modal dialog; [data-close] closes the one it sits in. */
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]")
    const dialog = opener && document.getElementById(opener.dataset.open)
    if (dialog) {
      dialog.addEventListener("close", () => opener.focus(), { once: true })
      dialog.showModal()
    }
    const closer = e.target.closest("[data-close]")
    if (closer) closer.closest("dialog")?.close()
  })

  NIL.motion = { takes, watch, settle, drawOn, drawWhenSeen }
})((window.NIL = window.NIL || {}))
