// Indie: the record shop's things. Each function draws one object; `at` is its anchor (usually bottom-left or
// bottom-centre) and `k` its scale.
;(function (NIL) {
  "use strict"

  const { add, lerp, times, dot, arc, rect, turn, depth, box } = NIL.shapes

  function turntable(s, p, r, at, k = 1) {
    const b = box(s, p, depth(r), at, 118 * k, 20 * k, 74 * k)
    const c = b.top(0.4, 0.5)
    const u = [b.w * 0.27, 0]
    const v = times(b.o, b.d * 0.42)
    s.stroke(p.ring(c, times(u, 1.14), times(v, 1.14)))
    s.fill(p.disc(c, u, v))
    s.paper(p.disc(c, times(u, 0.3), times(v, 0.3)))
    s.stroke(p.ring(c, times(u, 0.3), times(v, 0.3)))
    const pivot = b.top(0.87, 0.75)
    s.stroke(p.ring(...dot(pivot, 3.5 * k)))
    s.stroke(p.path([pivot, b.top(0.9, 0.35), b.top(0.7, 0.2)]))
    for (let i = 0; i < 3; i++) s.stroke(p.ring(...dot(b.front(0.12 + i * 0.09, 0.5), 2.4 * k)))
    s.stroke(p.edges([b.front(0.62, 0.28), b.front(0.86, 0.28), b.front(0.86, 0.72), b.front(0.62, 0.72)]))
  }

  function speaker(s, p, r, at, k = 1) {
    const b = box(s, p, depth(r), at, 36 * k, 56 * k, 28 * k)
    const woofer = b.front(0.5, 0.35)
    const tweeter = b.front(0.5, 0.77)
    s.stroke(p.ring(...dot(woofer, 11 * k)))
    s.stroke(p.ring(...dot(woofer, 5 * k)))
    s.fill(p.disc(...dot(woofer, 1.8 * k)))
    s.stroke(p.ring(...dot(tweeter, 5 * k)))
    s.fill(p.disc(...dot(tweeter, 1.6 * k)))
  }

  /** Record spines in one cubby: upright, then a few leaning where the row runs out. */
  function spines(s, p, r, b, u0, u1, v0, v1) {
    const gap = 0.022 + r.next() * 0.01
    const end = u0 + (u1 - u0) * (0.55 + r.next() * 0.45)
    let u = u0 + 0.012
    while (u < end) {
      const top = v1 - (0.08 + r.next() * 0.16) * (v1 - v0)
      s.stroke(p.line(b.front(u, v0 + 0.02), b.front(u, top)))
      u += gap
    }
    for (let lean = 0.04; u + lean < u1 - 0.01 && lean < 0.13; lean += 0.045) {
      s.stroke(p.line(b.front(u, v0 + 0.02), b.front(u + lean, v1 - 0.18 * (v1 - v0))))
      u += gap
    }
  }

  function shelf(s, p, r, at, k = 1) {
    const b = box(s, p, depth(r), at, 180 * k, 92 * k, 44 * k)
    for (let i = 1; i < 3; i++) s.stroke(p.line(b.front(i / 3, 0), b.front(i / 3, 1)))
    s.stroke(p.line(b.front(0, 0.5), b.front(1, 0.5)))
    for (let col = 0; col < 3; col++)
      for (let row = 0; row < 2; row++)
        spines(s, p, r, b, col / 3 + 0.01, (col + 1) / 3 - 0.01, row / 2 + 0.02, (row + 1) / 2 - 0.02)
    return b
  }

  /** A disco ball hanging by its string from `top` (default: 40 above the ball). `at` is the centre. */
  function discoBall(s, p, r, c, k = 1, { top } = {}) {
    const R = 44 * k
    s.stroke(p.line([c[0], top ?? c[1] - R - 40 * k], [c[0], c[1] - R]))
    s.blank(p.disc(...dot(c, R)))
    const [rows, cols] = [7, 8]
    const at = (i, j) => {
      const th = -Math.PI / 2 + (i * Math.PI) / rows
      const ph = -Math.PI / 2 + (j * Math.PI) / cols
      return [c[0] + R * Math.cos(th) * Math.sin(ph), c[1] - R * Math.sin(th)]
    }
    const steps = Array.from({ length: 17 }, (_, n) => n / 2)
    for (let i = 1; i < rows; i++) s.stroke(p.path(steps.map((j) => at(i, j))))
    for (let j = 1; j < cols; j++) s.stroke(p.path(steps.map((n) => at((n * rows) / 8, j))))
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++) {
        if (!(r.chance(0.16) || ((i + j) % 4 === 0 && r.chance(0.55)))) continue
        const q = [at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j)]
        const mid = lerp(q[0], q[2], 0.5)
        s.fill(p.shape(q.map((pt) => lerp(mid, pt, 0.82))))
      }
    s.stroke(p.ring(...dot(c, R)))
    s.stroke(p.edges(rect(c[0] - 4 * k, c[1] - R - 4 * k, 8 * k, 5 * k)))
  }

  /** A record half out of its sleeve; the sleeve's art is one of a few marks. */
  function record(s, p, r, at, k = 1) {
    const [x, y] = at
    const w = 70 * k
    const c = [x + w * 0.78, y - w / 2]
    s.fill(p.disc(...dot(c, w * 0.46)))
    s.paper(p.disc(...dot(c, w * 0.12)))
    s.stroke(p.ring(...dot(c, w * 0.12)))
    const sleeve = rect(x, y - w, w, w)
    s.blank(p.shape(sleeve))
    s.stroke(p.edges(sleeve))
    const art = r.pick(["ring", "squiggle", "bars"])
    const m = [x + w / 2, y - w / 2]
    if (art === "ring") s.stroke(p.ring(...dot(m, w * 0.22)))
    else if (art === "squiggle") s.stroke(p.path(Array.from({ length: 7 }, (_, i) => [x + w * (0.2 + i * 0.1), m[1] + (i % 2 ? -6 : 6) * k])))
    else for (let i = 0; i < 3; i++) s.stroke(p.line([x + w * 0.22, y - w * (0.3 + i * 0.2)], [x + w * 0.78, y - w * (0.3 + i * 0.2)]))
  }

  function cassette(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = [P(0, 4), P(4, 0), P(92, 0), P(96, 4), P(96, 56), P(92, 60), P(4, 60), P(0, 56)]
    s.blank(p.shape(body))
    s.stroke(p.edges(body))
    s.stroke(p.edges([P(10, 52), P(86, 52), P(86, 24), P(10, 24)]))
    s.stroke(p.edges([P(30, 44), P(66, 44), P(66, 32), P(30, 32)]))
    for (const cx of [22, 74]) {
      s.stroke(p.ring(...dot(P(cx, 38), 7 * k)))
      s.fill(p.disc(...dot(P(cx, 38), 2.4 * k)))
    }
    s.stroke(p.edges([P(18, 0), P(24, 12), P(72, 12), P(78, 0)], false))
    for (const hx of [32, 42, 54, 64]) s.fill(p.disc(...dot(P(hx, 6), 1.3 * k)))
    if (r.chance(0.6)) s.stroke(p.path([P(14, 48), P(34, 49), P(50, 47), P(70, 48)]))
  }

  function radio(s, p, r, at, k = 1) {
    const b = box(s, p, depth(r), at, 96 * k, 56 * k, 26 * k)
    const grille = b.front(0.3, 0.48)
    s.stroke(p.ring(...dot(grille, 19 * k)))
    for (let i = -3; i <= 3; i++)
      for (let j = -3; j <= 3; j++) {
        const pt = add(grille, [(i + (j % 2) * 0.5) * 5 * k, j * 4.4 * k])
        if (Math.hypot(pt[0] - grille[0], pt[1] - grille[1]) < 15 * k) s.fill(p.disc(...dot(pt, 0.9 * k)))
      }
    s.stroke(p.edges([b.front(0.58, 0.62), b.front(0.92, 0.62), b.front(0.92, 0.8), b.front(0.58, 0.8)]))
    for (let i = 1; i < 6; i++) s.stroke(p.line(b.front(0.58 + i * 0.057, 0.62), b.front(0.58 + i * 0.057, 0.68)))
    s.stroke(p.ring(...dot(b.front(0.66, 0.3), 5 * k)))
    s.stroke(p.ring(...dot(b.front(0.84, 0.3), 5 * k)))
    const base = b.top(0.85, 0.5)
    s.stroke(p.line(base, add(base, [-38 * k, -44 * k])))
    s.fill(p.disc(...dot(add(base, [-38 * k, -44 * k]), 1.8 * k)))
  }

  function guitar(s, p, r, at, k = 1) {
    const [x, y] = at
    const lean = r.signed() * 8
    const P = (u, v) => turn([x + u * k, y + v * k], at, lean)
    const ring = (c, rr, a0, a1) => arc(c, rr, rr, a0, a1, 14).map(([u, v]) => P(u, v))
    const outline = [...ring([0, -78], 21, -70, 50), ...ring([0, -30], 29, -50, 230), ...ring([0, -78], 21, 130, 250)]
    const neck = [P(-4, -94), P(4, -94), P(4, -158), P(-4, -158)]
    const head = [P(-6, -158), P(6, -158), P(7, -182), P(-7, -182)]
    s.blank(p.shape(outline))
    s.stroke(p.path([...outline, outline[0]]))
    s.blank(p.shape(neck))
    s.stroke(p.edges(neck))
    for (let v = -102; v > -156; v -= 8) s.stroke(p.line(P(-4, v), P(4, v)))
    s.blank(p.shape(head))
    s.stroke(p.edges(head))
    for (const v of [-164, -171, -178]) for (const side of [-1, 1]) s.fill(p.disc(...dot(P(side * 9, v), 1.4 * k)))
    s.fill(p.disc(...dot(P(0, -60), 8.5 * k)))
    s.stroke(p.edges([P(-9, -24), P(9, -24), P(9, -19), P(-9, -19)]))
  }

  function crate(s, p, r, at, k = 1) {
    const o = depth(r)
    const [w, h, d] = [100 * k, 52 * k, 50 * k]
    const lip = (u, v) => add([at[0] + w * u, at[1] - h], o, d * v)
    for (let v = 0.85; v > 0.1; v -= 0.12 + r.next() * 0.05) {
      const lean = r.signed() * 3 * k
      const rise = (16 + r.next() * 12) * k
      const sleeve = [lip(0.06, v), lip(0.94, v), add(lip(0.94, v), [lean, -rise]), add(lip(0.06, v), [lean, -rise])]
      s.blank(p.shape(sleeve))
      s.stroke(p.edges(sleeve))
    }
    const b = box(s, p, o, at, w, h, d)
    s.stroke(p.line(b.front(0, 0.5), b.front(1, 0.5)))
    s.stroke(p.edges([b.front(0.38, 0.66), b.front(0.62, 0.66), b.front(0.62, 0.84), b.front(0.38, 0.84)]))
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "indie", size, at, k, draw })
  NIL.objects.define(
    T("turntable", "Turntable", [170, 120], [14, 104], 1, turntable),
    T("speaker", "Speaker", [90, 110], [22, 98], 1.1, speaker),
    T("shelf", "Record shelf", [220, 150], [12, 138], 1, shelf),
    T("disco-ball", "Disco ball", [120, 150], [60, 88], 1, discoBall),
    T("record", "Record", [120, 100], [14, 90], 1.05, record),
    T("cassette", "Cassette", [120, 90], [12, 76], 1, cassette),
    T("radio", "Radio", [150, 140], [16, 126], 1, radio),
    T("guitar", "Guitar", [90, 200], [45, 192], 1, guitar),
    T("crate", "Record crate", [160, 130], [16, 118], 1, crate),
  )
  NIL.music = { turntable, speaker, shelf, discoBall }
})((window.NIL = window.NIL || {}))
