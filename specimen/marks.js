// Small pen marks for the interface (ticks, rings, underlines, arrows, frames), each in a fixed viewBox.
;(function (NIL) {
  "use strict"

  /** The marks, by name; each returns an SVG string. */
  const marks = {
    tick(seed, hand) {
      const s = NIL.sheet()
      s.stroke(NIL.pen(seed, hand).path([[4, 12], [10, 19.5], [25, -3]]))
      return s.svg(24, 24)
    },
    ring(seed, hand, w = 100, h = 40) {
      const s = NIL.sheet()
      s.stroke(NIL.pen(seed, hand).ring([w / 2, h / 2], [w / 2 - 2, 0], [0, h / 2 - 2]))
      return s.svg(w, h)
    },
    dot(seed, hand) {
      const s = NIL.sheet()
      s.fill(NIL.pen(seed, hand).disc([10, 10], [4.2, 0], [0, 4.2]))
      return s.svg(20, 20)
    },
    underline(seed, hand) {
      const s = NIL.sheet()
      const p = NIL.pen(seed, hand)
      s.stroke(p.path(Array.from({ length: 6 }, (_, i) => [2 + i * 19.2, 5 + Math.sin(i * 0.9) * 1.2])))
      return s.svg(100, 10)
    },
    arrow(seed, hand) {
      const s = NIL.sheet()
      const p = NIL.pen(seed, hand)
      s.stroke(p.path([[4, 6], [22, 4], [44, 12], [60, 28], [66, 42]]))
      s.stroke(p.path([[57, 36], [66, 43], [70, 32]]))
      return s.svg(76, 50)
    },
    pill(seed, hand, w = 44, h = 24) {
      const s = NIL.sheet()
      const p = NIL.pen(seed, hand)
      const r = h / 2 - 1
      const right = p.round([w - r - 1, h / 2], [r, 0], [0, r], -Math.PI / 2, Math.PI)
      const left = p.round([r + 1, h / 2], [r, 0], [0, r], Math.PI / 2, Math.PI)
      s.stroke(p.path([...right, ...left, right[0]]))
      return s.svg(w, h)
    },
    chevron(seed, hand) {
      const s = NIL.sheet()
      s.stroke(NIL.pen(seed, hand).path([[2, 2], [7, 7.5], [12, 2]]))
      return s.svg(14, 10)
    },
    /** A frame drawn edge by edge at a measured size, so its corners cross like the reference's border. */
    frame(seed, hand, w, h) {
      const s = NIL.sheet()
      s.stroke(NIL.pen(seed, hand).edges([[0, 0], [w, 0], [w, h], [0, h]]))
      return s.svg(w, h)
    },
  }

  NIL.marks = marks
})((window.NIL = window.NIL || {}))
