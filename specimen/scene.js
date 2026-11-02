// Scenes and marks. A room is composed from the object library in back-to-front order inside the hand-drawn border;
// marks are the small pen strokes the interface uses (ticks, rings, underlines, arrows, frames).
;(function (NIL) {
  "use strict"

  const T = NIL.things
  const L = NIL.living

  /** A room corner: wall and floor lines, a picture, a disco ball, a shelf of records and whoever is visiting. */
  function room(seed, hand, w = 640, h = 440) {
    const s = NIL.sheet()
    const p = NIL.pen(seed, hand)
    const r = NIL.stream(NIL.seedOf(seed), "room")
    const m = 14
    const corner = r.between(0.13, 0.22) * w
    const floor = r.between(0.6, 0.66) * h
    s.stroke(p.line([corner, m], [corner, floor]))
    s.stroke(p.line([corner, floor], [w - m, floor + r.signed() * 6]))
    s.stroke(p.line([corner, floor], [m, floor + (corner - m) * 0.62]))
    if (r.chance(0.6)) {
      const [x0, x1] = [m + 12, corner - 14]
      const door = [
        [x0, floor + (corner - x0) * 0.62 + 4],
        [x0, h * 0.2],
        [x1, h * 0.12],
        [x1, floor + (corner - x1) * 0.62],
      ]
      s.stroke(p.edges(door, false))
      s.fill(p.disc([x1 - 7, h * 0.42], [1.8, 0], [0, 1.8]))
    }
    const rugY = h - m - r.between(34, 56)
    const sway = r.next() * 3
    s.stroke(p.path(Array.from({ length: 9 }, (_, i) => [m + 40 + (i * (w - 2 * m - 80)) / 8, rugY + Math.sin((i / 8) * 4 + sway) * 14])))
    L.picture(s, p, r, [r.between(0.62, 0.7) * w, h * 0.2], 84, 104)
    T.discoBall(s, p, r, [r.between(0.28, 0.36) * w, h * 0.25], 42, m)
    const b = T.shelf(s, p, r, [r.between(0.4, 0.45) * w, floor + 44], 1.15)
    T.speaker(s, p, r, b.top(0.01, 0.22), 0.95)
    T.speaker(s, p, r, b.top(0.83, 0.22), 0.95)
    T.turntable(s, p, r, b.top(0.2, 0.08), 0.84)
    L.plant(s, p, r, [r.between(0.86, 0.89) * w, floor + 80], 1.35, "sunflower")
    const visitors = 1 + Math.floor(r.next() * 2)
    if (visitors > 1) L.figure(s, p, r, [r.between(0.1, 0.13) * w, h - m - 14], 1.3, "walk")
    L.figure(s, p, r, [r.between(0.27, 0.31) * w, h - m - 34], 1.25, "record")
    s.stroke(p.edges([[m, m], [w - m, m], [w - m, h - m], [m, h - m]]))
    return s.svg(w, h, "A room corner with a record shelf, a disco ball and visitors who are only clothes")
  }

  const LIBRARY = [
    ["Turntable", 170, 120, (s, p, r) => T.turntable(s, p, r, [14, 104], 1)],
    ["Speaker", 90, 110, (s, p, r) => T.speaker(s, p, r, [22, 98], 1.1)],
    ["Record shelf", 220, 150, (s, p, r) => T.shelf(s, p, r, [12, 138], 1)],
    ["Disco ball", 120, 150, (s, p, r) => T.discoBall(s, p, r, [60, 88], 44, 4)],
    ["Sunflower", 120, 220, (s, p, r) => L.plant(s, p, r, [60, 212], 1, "sunflower")],
    ["House plant", 120, 140, (s, p, r) => L.plant(s, p, r, [60, 132], 1, "leafy")],
    ["Picture", 130, 150, (s, p, r) => L.picture(s, p, r, [65, 75], 96, 120)],
    ["Visitor", 110, 220, (s, p, r) => L.figure(s, p, r, [50, 212], 1.15)],
    ["Bottle", 60, 140, (s, p, r) => T.bottle(s, p, r, [30, 132], 1.05)],
    ["Glass", 60, 80, (s, p, r) => T.glass(s, p, r, [30, 74], 1.15)],
  ]

  /** Every object on its own, each from its own fork of the seed. */
  function library(seed, hand) {
    return LIBRARY.map(([name, w, h, draw]) => {
      const s = NIL.sheet()
      const key = `${seed}:${name}`
      draw(s, NIL.pen(key, hand), NIL.stream(NIL.seedOf(key), "shape"))
      return { name, svg: s.svg(w, h, name) }
    })
  }

  /** Small marks for the interface, each in a fixed viewBox. */
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

  NIL.room = room
  NIL.library = library
  NIL.marks = marks
})((window.NIL = window.NIL || {}))
