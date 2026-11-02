// Geometry every object shares: points, arcs, the oblique box and the upright cylinder. Objects take their own depth
// angle from the seed, so neighbours disagree a little about perspective, as they do in a naive drawing.
;(function (NIL) {
  "use strict"

  const deg = Math.PI / 180
  const add = (a, b, f = 1) => [a[0] + b[0] * f, a[1] + b[1] * f]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const times = (v, f) => [v[0] * f, v[1] * f]
  /** Centre and axes for a circle of radius r, as the pen's ring and disc take them. */
  const dot = (c, r) => [c, [r, 0], [0, r]]

  /** Points on an ellipse from angle a0 to a1 in degrees: 0 is right, 90 is down. */
  function arc(c, rx, ry, a0, a1, n = 16) {
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = (a0 + ((a1 - a0) * i) / n) * deg
      return [c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]
    })
  }

  /** A rectangle's corners from its top-left corner. */
  const rect = (x, y, w, h) => [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]

  /** Turn a point round a centre by a degrees. */
  function turn(pt, c, a) {
    const [s, k] = [Math.sin(a * deg), Math.cos(a * deg)]
    const [dx, dy] = [pt[0] - c[0], pt[1] - c[1]]
    return [c[0] + dx * k - dy * s, c[1] + dx * s + dy * k]
  }

  /** Where "back" is for one object: up and to the right, at a seeded angle and depth. */
  function depth(r) {
    const a = (30 + r.signed() * 12) * deg
    const f = 0.5 + r.signed() * 0.1
    return [Math.cos(a) * f, -Math.sin(a) * f]
  }

  /** An oblique box: front face w × h with its bottom-left corner at `at`, receding d along `o`. */
  function box(s, p, o, at, w, h, d) {
    const [x, y] = at
    const [A, B, C, D] = [[x, y], [x + w, y], [x + w, y - h], [x, y - h]]
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

  /** An upright cylinder seen from a little above: `c` is the centre of its top. Returns its rims. */
  function cylinder(s, p, c, rx, ry, h) {
    const bottom = [c[0], c[1] + h]
    s.blank(p.shape([...arc(c, rx, ry, 180, 360, 12), ...arc(bottom, rx, ry, 0, 180, 12)]))
    s.stroke(p.ring(c, [rx, 0], [0, ry]))
    s.stroke(p.line([c[0] - rx, c[1]], [c[0] - rx, bottom[1]]))
    s.stroke(p.line([c[0] + rx, c[1]], [c[0] + rx, bottom[1]]))
    s.stroke(p.path(arc(bottom, rx, ry, 0, 180, 12)))
    return { top: c, bottom }
  }

  /** A handle on the side of a cup or jug, from y0 to y1 at x, bulging by `reach`. */
  function handle(s, p, x, y0, y1, reach) {
    const mid = (y0 + y1) / 2
    const r = (y1 - y0) / 2
    s.stroke(p.path(arc([x, mid], reach, r, -90, 90, 10)))
  }

  /** Short wavy lines of text, for menus, notes and screens. */
  function scribble(s, p, r, x, y, w, lines, gap = 7) {
    for (let i = 0; i < lines; i++) {
      const len = w * (i === lines - 1 ? r.between(0.35, 0.7) : r.between(0.75, 1))
      const pts = Array.from({ length: 6 }, (_, j) => [x + (len * j) / 5, y + i * gap + (j % 2 ? 0.8 : -0.8)])
      s.stroke(p.path(pts))
    }
  }

  NIL.shapes = { deg, add, lerp, times, dot, arc, rect, turn, depth, box, cylinder, handle, scribble }
})((window.NIL = window.NIL || {}))
