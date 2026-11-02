// Scenes: rooms composed from the object library, back to front, inside the hand-drawn border. Every object gets its
// own fork of the scene's seed, so two speakers in one room are drawn differently.
;(function (NIL) {
  "use strict"

  const W = 640
  const H = 440
  const M = 14

  /** The parts every room shares: the scene's own pen and stream, a way to place objects, walls and the border. */
  function stage(seed, hand) {
    const s = NIL.sheet()
    const p = NIL.pen(seed, hand)
    const r = NIL.stream(NIL.seedOf(seed), "room")
    const put = (id, key, at, k = 1, options) => NIL.objects.place(s, id, `${seed}:${key}`, hand, at, k, options)
    const corner = r.between(0.13, 0.22) * W
    const floor = r.between(0.6, 0.66) * H
    const walls = () => {
      s.stroke(p.line([corner, M], [corner, floor]))
      s.stroke(p.line([corner, floor], [W - M, floor + r.signed() * 6]))
      s.stroke(p.line([corner, floor], [M, floor + (corner - M) * 0.62]))
    }
    const rug = () => {
      const y = H - M - r.between(34, 56)
      const sway = r.next() * 3
      s.stroke(p.path(Array.from({ length: 9 }, (_, i) => [M + 40 + (i * (W - 2 * M - 80)) / 8, y + Math.sin((i / 8) * 4 + sway) * 14])))
    }
    const border = () => s.stroke(p.edges([[M, M], [W - M, M], [W - M, H - M], [M, H - M]]))
    return { s, p, r, put, corner, floor, walls, rug, border }
  }

  /** A listening corner: a record shelf with a turntable, a disco ball, a picture and visitors. */
  function room(seed, hand) {
    const { s, p, r, put, corner, floor, walls, rug, border } = stage(seed, hand)
    walls()
    if (r.chance(0.6)) {
      const [x0, x1] = [M + 12, corner - 14]
      s.stroke(p.edges([[x0, floor + (corner - x0) * 0.62 + 4], [x0, H * 0.2], [x1, H * 0.12], [x1, floor + (corner - x1) * 0.62]], false))
      s.fill(p.disc([x1 - 7, H * 0.42], [1.8, 0], [0, 1.8]))
    }
    rug()
    put("picture", "picture", [r.between(0.62, 0.7) * W, H * 0.2], 0.875)
    put("disco-ball", "ball", [r.between(0.28, 0.36) * W, H * 0.25], 0.95, { top: M })
    const b = put("shelf", "shelf", [r.between(0.4, 0.45) * W, floor + 44], 1.15)
    put("speaker", "left", b.top(0.01, 0.22), 0.95)
    put("speaker", "right", b.top(0.83, 0.22), 0.95)
    put("turntable", "turntable", b.top(0.2, 0.08), 0.84)
    put("sunflower", "plant", [r.between(0.86, 0.89) * W, floor + 80], 1.35)
    if (r.chance(0.5)) put("visitor", "first", [r.between(0.1, 0.13) * W, H - M - 14], 1.3, { pose: "walk" })
    if (r.chance(0.5)) put("person", "second", [r.between(0.27, 0.31) * W, H - M - 34], 1.08, { pose: "mug" })
    else put("visitor", "second", [r.between(0.27, 0.31) * W, H - M - 34], 1.25, { pose: "record" })
    border()
    return s.svg(W, H, "A room corner with a record shelf, a disco ball and visitors")
  }

  /** A freelancer's studio: a desk with a screen, a lamp and a mug, notes on the wall, someone with a coffee. */
  function studio(seed, hand) {
    const { s, r, put, floor, walls, border } = stage(seed, hand)
    walls()
    put("window", "window", [r.between(0.24, 0.3) * W, floor - 120], 0.9)
    put("sticky-notes", "notes", [r.between(0.58, 0.62) * W, H * 0.3], 0.8)
    if (r.chance(0.6)) put("picture", "picture", [r.between(0.84, 0.88) * W, H * 0.24], 0.65)
    const top = put("desk", "desk", [r.between(0.34, 0.4) * W, floor + 74], 1, { w: 280, d: 74, legs: 80 })
    put("books", "books", top.top(0.02, 0.62), 0.62)
    put("house-plant", "plant", top.top(0.32, 0.75), 0.65)
    if (r.chance(0.5)) put("monitor", "screen", top.top(0.62, 0.62), 1)
    else put("laptop", "screen", top.top(0.4, 0.3), 0.85)
    put("desk-lamp", "lamp", top.top(0.92, 0.7), 0.75)
    put("mug", "mug", top.top(0.2, 0.18), 0.62)
    put("person-mug", "person", [r.between(0.13, 0.18) * W, H - M - 22], 1.08)
    if (r.chance(0.6)) put("cat", "cat", [r.between(0.82, 0.9) * W, H - M - 18], 0.9)
    border()
    return s.svg(W, H, "A studio with a desk, a screen, sticky notes and a person with a coffee")
  }

  /** A bistro table for two, set for dinner, under a pendant lamp. */
  function bistro(seed, hand) {
    const { s, r, put, floor, walls, rug, border } = stage(seed, hand)
    walls()
    rug()
    put("picture", "picture", [r.between(0.72, 0.78) * W, H * 0.24], 0.8)
    put("window", "window", [r.between(0.28, 0.33) * W, floor - 128], 0.85, { view: "moon" })
    const x = r.between(0.5, 0.55) * W
    const y = H - M - 36
    put("pendant", "lamp", [x, H * 0.24], 1.05, { top: M })
    put("chair", "far", [x + 34, y - 22], 0.95)
    put("bistro-table", "table", [x, y], 1.1)
    const t = [x, y - 114]
    put("bottle", "wine", [t[0] - 34, t[1] + 2], 0.62)
    put("candle", "candle", [t[0] + 44, t[1] - 2], 0.55)
    put("glass", "left", [t[0] - 12, t[1] + 8], 0.75)
    put("glass", "right", [t[0] + 22, t[1] + 4], 0.75)
    put("plate", "plate", [t[0] - 2, t[1] + 22], 0.62)
    put("person", "guest", [r.between(0.2, 0.25) * W, H - M - 20], 1.1, { pose: r.pick(["stand", "wave"]) })
    if (r.chance(0.5)) put("visitor", "waiter", [r.between(0.84, 0.88) * W, H - M - 24], 1.1, { pose: "stand" })
    else put("cat", "cat", [r.between(0.84, 0.88) * W, H - M - 24], 0.9)
    border()
    return s.svg(W, H, "A bistro table for two with wine, a candle and a plate, under a pendant lamp")
  }

  NIL.scenes = {
    room: ["Listening room", room],
    studio: ["Studio", studio],
    bistro: ["Bistro", bistro],
  }
})((window.NIL = window.NIL || {}))
