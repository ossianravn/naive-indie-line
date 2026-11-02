// Studio: the freelancer's devices, and what is on their screens (a website, code, a design canvas or an app).
;(function (NIL) {
  "use strict"

  const { add, lerp, arc, rect, turn, depth, box } = NIL.shapes

  /** Map u, v in [0, 1] onto a four-sided screen given top-left, top-right, bottom-right, bottom-left. */
  const quad = ([A, B, C, D]) => (u, v) => lerp(lerp(A, B, u), lerp(D, C, u), v)

  function screen(s, p, r, corners, kind = r.pick(["site", "code", "canvas"])) {
    const q = quad(corners)
    const box4 = (u0, v0, u1, v1) => [q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)]
    if (kind === "site") {
      s.stroke(p.line(q(0, 0.16), q(1, 0.16)))
      s.fill(p.disc(q(0.08, 0.08), [2, 0], [0, 2]))
      for (let i = 0; i < 3; i++) s.stroke(p.line(q(0.6 + i * 0.12, 0.08), q(0.68 + i * 0.12, 0.08)))
      s.stroke(p.edges(box4(0.08, 0.24, 0.92, 0.6)))
      s.stroke(p.path([q(0.12, 0.56), q(0.32, 0.36), q(0.46, 0.5), q(0.58, 0.42), q(0.88, 0.56)]))
      s.stroke(p.ring(q(0.76, 0.33), [3, 0], [0, 3]))
      s.stroke(p.line(q(0.08, 0.69), q(0.6, 0.69)))
      s.stroke(p.line(q(0.08, 0.77), q(0.82, 0.77)))
      s.fill(p.shape(box4(0.08, 0.85, 0.3, 0.94)))
    } else if (kind === "code") {
      let indent = 0
      for (let v = 0.12; v < 0.92; v += 0.1) {
        indent = Math.max(0, Math.min(3, indent + Math.round(r.signed() * 1.2)))
        const u0 = 0.14 + indent * 0.08
        s.stroke(p.line(q(0.05, v), q(0.08, v)))
        s.stroke(p.line(q(u0, v), q(Math.min(0.94, u0 + r.between(0.15, 0.55)), v)))
      }
    } else if (kind === "canvas") {
      s.stroke(p.line(q(0.2, 0), q(0.2, 1)))
      s.stroke(p.line(q(0.8, 0), q(0.8, 1)))
      for (let v = 0.12; v < 0.6; v += 0.12) s.stroke(p.line(q(0.04, v), q(0.15, v)))
      s.stroke(p.edges(box4(0.3, 0.18, 0.7, 0.82)))
      s.stroke(p.ring(q(0.43, 0.42), [7, 0], [0, 7]))
      s.fill(p.shape(box4(0.5, 0.5, 0.62, 0.7)))
      for (let v = 0.14; v < 0.5; v += 0.1) s.stroke(p.line(q(0.84, v), q(0.96, v)))
    } else {
      s.stroke(p.line(q(0.1, 0.1), q(0.6, 0.1)))
      for (const v of [0.2, 0.46]) {
        s.stroke(p.edges(box4(0.1, v, 0.9, v + 0.2)))
        s.stroke(p.line(q(0.18, v + 0.07), q(0.7, v + 0.07)))
        s.stroke(p.line(q(0.18, v + 0.13), q(0.5, v + 0.13)))
      }
      for (let i = 0; i < 4; i++) s.fill(p.disc(q(0.2 + i * 0.2, 0.88), [1.5, 0], [0, 1.5]))
    }
  }

  function laptop(s, p, r, at, k = 1, { kind } = {}) {
    const o = depth(r)
    const [x, y] = at
    const [w, d, h] = [124 * k, 64 * k, 80 * k]
    const back = (u) => add([x + w * u, y - 4 * k], o, d)
    const lean = [o[0] * 8 * k, -h]
    const lid = [add(back(0), lean), add(back(1), lean), back(1), back(0)]
    s.blank(p.shape(lid))
    s.stroke(p.edges(lid))
    const inset = (pt, u, v) => add(pt, [u * k, v * k])
    screen(s, p, r, [inset(lid[0], 6, 6), inset(lid[1], -6, 6), inset(lid[2], -6, -6), inset(lid[3], 6, -6)], kind)
    const deck = box(s, p, o, at, w, 4 * k, d)
    const keys = (u0, v0, u1, v1) => [deck.top(u0, v0), deck.top(u1, v0), deck.top(u1, v1), deck.top(u0, v1)]
    s.stroke(p.edges(keys(0.08, 0.38, 0.92, 0.9)))
    for (const v of [0.55, 0.72]) s.stroke(p.line(deck.top(0.08, v), deck.top(0.92, v)))
    s.stroke(p.edges(keys(0.38, 0.08, 0.62, 0.3)))
  }

  function monitor(s, p, r, at, k = 1, { kind } = {}) {
    const [x, y] = at
    const [w, h] = [150 * k, 96 * k]
    const top = y - 30 * k - h
    s.stroke(p.ring([x, y - 3 * k], [26 * k, 0], [0, 5 * k]))
    s.stroke(p.line([x - 4 * k, y - 4 * k], [x - 4 * k, y - 30 * k]))
    s.stroke(p.line([x + 4 * k, y - 4 * k], [x + 4 * k, y - 30 * k]))
    const outer = rect(x - w / 2, top, w, h)
    s.blank(p.shape(outer))
    s.stroke(p.edges(outer))
    const inner = rect(x - w / 2 + 6 * k, top + 6 * k, w - 12 * k, h - 14 * k)
    s.stroke(p.edges(inner))
    screen(s, p, r, inner.map((pt, i) => add(pt, [[4, -4, -4, 4][i] * k, [4, 4, -4, -4][i] * k])), kind)
  }

  function keyboard(s, p, r, at, k = 1) {
    const b = box(s, p, depth(r), at, 132 * k, 9 * k, 46 * k)
    for (let row = 0; row < 4; row++) {
      const v = 0.15 + row * 0.22
      for (let u = 0.05; u < 0.93; u += 0.075) s.stroke(p.line(b.top(u, v), b.top(u + 0.045, v)))
    }
    const m = [at[0] + 160 * k, at[1] - 10 * k]
    s.blank(p.disc(m, [12 * k, 0], [0, 8 * k]))
    s.stroke(p.ring(m, [12 * k, 0], [0, 8 * k]))
    s.stroke(p.line(add(m, [-10 * k, -1 * k]), add(m, [0, -1 * k])))
    s.stroke(p.path([add(m, [-11 * k, -4 * k]), add(m, [-18 * k, -16 * k]), add(m, [-28 * k, -18 * k])]))
  }

  function phone(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = [P(4, 0), P(38, 0), P(42, 4), P(42, 82), P(38, 86), P(4, 86), P(0, 82), P(0, 4)]
    s.blank(p.shape(body))
    s.stroke(p.edges(body))
    s.fill(p.shape([P(16, 80), P(26, 80), P(26, 77.5), P(16, 77.5)]))
    screen(s, p, r, [P(5, 72), P(37, 72), P(37, 8), P(5, 8)], "app")
  }

  function tablet(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = rect(x, y - 84 * k, 124 * k, 84 * k)
    s.blank(p.shape(body))
    s.stroke(p.edges(body))
    s.stroke(p.edges([P(7, 77), P(117, 77), P(117, 7), P(7, 7)]))
    s.stroke(p.path([P(16, 22), P(36, 46), P(52, 30), P(70, 52), P(92, 26)]))
    s.stroke(p.ring(P(92, 60), [7 * k, 0], [0, 7 * k]))
    const tip = P(70, 40)
    const end = P(132, 96)
    const side = [3 * k, 0]
    const pen = [add(tip, [0, 0]), add(lerp(tip, end, 0.12), side), add(end, side), add(end, side, -1), add(lerp(tip, end, 0.12), side, -1)]
    s.blank(p.shape(pen))
    s.stroke(p.path([...pen, pen[0]]))
    s.fill(p.shape([tip, add(lerp(tip, end, 0.06), [1.5 * k, 0]), add(lerp(tip, end, 0.06), [-1.5 * k, 0])]))
  }

  function headphones(s, p, r, at, k = 1) {
    const c = [at[0], at[1] - 34 * k]
    s.stroke(p.path(arc(c, 40 * k, 44 * k, 195, 345, 18)))
    s.stroke(p.path(arc(c, 34 * k, 38 * k, 198, 342, 18)))
    for (const side of [-1, 1]) {
      const cup = add(c, [side * 39 * k, 14 * k])
      s.blank(p.disc(cup, [10 * k, 0], [0, 17 * k]))
      s.stroke(p.ring(cup, [10 * k, 0], [0, 17 * k]))
      s.fill(p.disc(add(cup, [side * 3 * k, 0]), [5 * k, 0], [0, 12 * k]))
    }
  }

  function camera(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    s.stroke(p.edges([P(12, 58), P(18, 68), P(40, 68), P(46, 58)], false))
    s.stroke(p.edges(rect(x + 70 * k, y - 63 * k, 12 * k, 5 * k)))
    const body = [P(4, 0), P(92, 0), P(96, 4), P(96, 54), P(92, 58), P(4, 58), P(0, 54), P(0, 4)]
    s.blank(p.shape(body))
    s.stroke(p.edges(body))
    s.stroke(p.line(P(0, 44), P(96, 44)))
    const lens = P(50, 26)
    s.stroke(p.ring(lens, [22 * k, 0], [0, 22 * k]))
    s.stroke(p.ring(lens, [15 * k, 0], [0, 15 * k]))
    s.fill(p.disc(lens, [9 * k, 0], [0, 9 * k]))
    s.paper(p.disc(add(lens, [-3 * k, -3 * k]), [2 * k, 0], [0, 2 * k]))
    s.stroke(p.edges(rect(x + 76 * k, y - 40 * k, 12 * k, 8 * k)))
  }

  function website(s, p, r, at, k = 1) {
    const [x, y] = at
    const [w, h] = [172 * k, 124 * k]
    const win = rect(x, y - h, w, h)
    s.blank(p.shape(win))
    s.stroke(p.edges(win))
    s.stroke(p.line([x, y - h + 16 * k], [x + w, y - h + 16 * k]))
    for (let i = 0; i < 3; i++) s.stroke(p.ring([x + (10 + i * 9) * k, y - h + 8 * k], [2.6 * k, 0], [0, 2.6 * k]))
    s.stroke(p.edges(rect(x + 44 * k, y - h + 4 * k, 96 * k, 8 * k)))
    screen(s, p, r, [[x + 6 * k, y - h + 22 * k], [x + w - 6 * k, y - h + 22 * k], [x + w - 6 * k, y - 6 * k], [x + 6 * k, y - 6 * k]], "site")
    const tip = [x + w * 0.27, y - h * 0.08]
    const arrow = [tip, add(tip, [0, 16 * k]), add(tip, [4 * k, 12 * k]), add(tip, [8 * k, 19 * k]), add(tip, [10.5 * k, 18 * k]), add(tip, [7 * k, 11 * k]), add(tip, [12 * k, 11 * k])]
    s.blank(p.shape(arrow))
    s.fill(p.shape(arrow.map((pt) => turn(pt, tip, -8))))
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "studio", size, at, k, draw })
  NIL.objects.define(
    T("laptop", "Laptop", [180, 140], [16, 130], 1, laptop),
    T("monitor", "Monitor", [170, 150], [85, 142], 1, monitor),
    T("website", "Website", [190, 140], [9, 134], 1, website),
    T("keyboard", "Keyboard and mouse", [190, 76], [10, 66], 1, keyboard),
    T("phone", "Phone", [60, 100], [9, 94], 1, phone),
    T("tablet", "Tablet and pen", [160, 120], [10, 112], 1, tablet),
    T("headphones", "Headphones", [120, 90], [60, 80], 1, headphones),
    T("camera", "Camera", [120, 90], [12, 82], 1, camera),
  )
  NIL.devices = { screen, laptop, monitor }
})((window.NIL = window.NIL || {}))
