// Things in a room, drawn by the pen in a flattened oblique view. Each object takes its own depth angle from the
// seed, so neighbours disagree a little about perspective, as they do in a naive drawing.
;(function (NIL) {
  "use strict"

  const deg = Math.PI / 180
  const add = (a, b, f = 1) => [a[0] + b[0] * f, a[1] + b[1] * f]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const times = (v, f) => [v[0] * f, v[1] * f]
  const dot = (c, r) => [c, [r, 0], [0, r]]

  /** Where "back" is for one object: up and to the right, at a seeded angle and depth. */
  function depth(r) {
    const a = (30 + r.signed() * 12) * deg
    const f = 0.5 + r.signed() * 0.1
    return [Math.cos(a) * f, -Math.sin(a) * f]
  }

  /** An oblique box: front face w × h with its bottom-left corner at `at`, receding d along `o`. */
  function box(s, p, o, at, w, h, d) {
    const [x, y] = at
    const A = [x, y]
    const B = [x + w, y]
    const C = [x + w, y - h]
    const D = [x, y - h]
    const back = (q) => add(q, o, d)
    const [B2, C2, D2] = [back(B), back(C), back(D)]
    s.blank(p.shape([A, B, B2, C2, D2, D]))
    s.stroke(p.edges([A, B, C, D]))
    s.stroke(p.edges([D, D2, C2, C], false))
    s.stroke(p.edges([C2, B2, B], false))
    return {
      w,
      d,
      o,
      /** u runs left to right, v bottom to top. */
      front: (u, v) => [x + w * u, y - h * v],
      /** u runs left to right, v front to back. */
      top: (u, v) => add(lerp(D, C, u), o, d * v),
    }
  }

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

  function discoBall(s, p, r, c, R, top) {
    s.stroke(p.line([c[0], top], [c[0], c[1] - R]))
    s.blank(p.disc(...dot(c, R)))
    const rows = 7
    const cols = 8
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
    s.stroke(p.edges([add(c, [-4, -R - 4]), add(c, [4, -R - 4]), add(c, [4, -R + 1]), add(c, [-4, -R + 1])]))
  }

  function bottle(s, p, r, at, k = 1) {
    const [x, y] = at
    const half = (10 + r.next() * 2) * k
    const neck = 3.6 * k
    const P = (u, v) => [x + u * k, y - v * k]
    const outline = [
      [x - half, y],
      [x - half, y - 66 * k],
      P(-half / k + 2, 76),
      P(-neck / k, 86),
      P(-neck / k, 112),
      P(neck / k, 112),
      P(neck / k, 86),
      P(half / k - 2, 76),
      [x + half, y - 66 * k],
      [x + half, y],
    ]
    s.blank(p.shape(outline))
    s.stroke(p.path([...outline, outline[0]]))
    s.fill(p.shape([P(-neck / k - 0.4, 98), P(neck / k + 0.4, 98), P(neck / k + 0.4, 112), P(-neck / k - 0.4, 112)]))
    const label = [P(-half / k + 2.5, 18), P(half / k - 2.5, 18), P(half / k - 2.5, 48), P(-half / k + 2.5, 48)]
    s.stroke(p.edges(label))
    s.stroke(p.ring(...dot(P(0, 33), 4 * k)))
  }

  function glass(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    s.stroke(p.ring(P(0, 1.5), [11 * k, 0], [0, 2.5 * k]))
    s.stroke(p.line(P(0, 2), P(0, 26)))
    const bowl = Array.from({ length: 13 }, (_, i) => {
      const t = Math.PI + (i * Math.PI) / 12
      return P(Math.cos(t) * 13, 40 + Math.sin(t) * 14)
    })
    const rim = [P(-13, 52), ...bowl, P(13, 52)]
    s.blank(p.shape(rim))
    s.fill(p.shape([...bowl.slice(2, 11), P(11, 40), P(-11, 40)]))
    s.stroke(p.path(rim))
    s.stroke(p.ring(P(0, 52), [13 * k, 0], [0, 2.8 * k]))
  }

  NIL.things = { depth, box, turntable, speaker, shelf, discoBall, bottle, glass, add, lerp, times, dot }
})((window.NIL = window.NIL || {}))
