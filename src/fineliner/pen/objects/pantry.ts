// Food & drink: a working kitchen's pantry, pasta board and wine tools. `at` is bottom-centre unless a
// function says otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts
// are drawn in the object's own units (`units.ts`).
import { dot } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth, scribble } from "../shapes"
import { ell, outline, place, pts, slab, sym, tuck, type Map } from "./units"

/** A rectangular oil tin with a flat wire handle and screw cap; `at` is bottom-centre. */
export const oliveOil: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const tin = box(s, p, depth(r), P(-19, 2), 36 * k, 101 * k, 42 * k)
  s.stroke(
    p.shape([
      tin.top(0.12, 0.15),
      tin.top(0.18, 0.54),
      tin.top(0.26, 0.61),
      tin.top(0.57, 0.61),
      tin.top(0.65, 0.49),
      tin.top(0.73, 0.2),
    ]),
  )
  const cap = place(tin.top(0.8, 0.52), k)
  s.fill(
    p.shape([
      ...ell(cap, [0, 1.2, 3.2, 1], 180, 360, 8),
      ...ell(cap, [0, 0, 3.2, 1], 0, 180, 8),
    ]),
  )
  s.stroke(p.shape(pts(P, [-13, 30, 11, 30, 11, 73, -13, 73])))
  const text = P(-8, 60)
  scribble(s, p, r, text[0], text[1], 15 * k, 2, 11 * k)
}

/** A swing-top jar with brine and floating pickled rounds; `at` is bottom-centre. */
export const jar: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  outline(s, p, [
    ...sym(P, [25, 9, 25, 73, 24, 80, 20, 86, 17, 90, 17, 95]),
    ...ell(P, [0, 9, 25, 6], 0, 180, 14).slice(1, -1),
  ])
  s.wash(
    p.shape([
      ...ell(P, [0, 44, 21, 4], 180, 360, 16),
      ...ell(P, [0, 13, 21, 4], 0, 180, 16),
    ]),
  )
  s.stroke(p.disc(P(0, 44), [21 * k, 0], [0, 4 * k]))
  for (const [u, v, a, b, angle] of [
    [-11, 32, 7, 5, 0.4],
    [10, 23, 7, 4, -0.6],
    [-7, 16, 6, 5, 0],
    [9, 38, 6, 3, 0.7],
  ] satisfies [number, number, number, number, number][]) {
    const c = Math.cos(angle),
      n = Math.sin(angle)
    s.stroke(p.disc(P(u, v), [a * c * k, -a * n * k], [b * n * k, b * c * k]))
  }
  s.stroke(p.disc(P(0, 87), [20 * k, 0], [0, 3.2 * k]))
  for (const f of [-1, 1]) {
    s.stroke(p.path(pts(P, [f * 20, 102, f * 24, 91, f * 20, 87])))
    s.stroke(p.line(P(f * 11, 101), P(f * 17, 88)))
  }
  slab(s, p, P, [0, 96, 19, 4], 2)
  slab(s, p, P, [0, 103, 21, 4], 3)
  s.fill(p.disc(P(19, 95), [3 * k, 0], [0, 1.8 * k]))
}

/** A paddle board, hard-cheese wedge and small knife; `at` is bottom-centre. */
export const cheese: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k),
    o = depth(r)
  const B: Map = (u, w) =>
    P(u + (0.27 + o[0] * 0.15) * w, 11 + (0.62 - o[1] * 0.25) * w)
  const front = [
    ...ell(B, [-42, 6, 6, 6], 180, 90, 4),
    B(45, 0),
    ...ell(B, [45, 6, 6, 6], 90, 0, 4),
  ]
  outline(s, p, [
    ...front.map(([x, y]) => [x, y + 5 * k] satisfies [number, number]),
    B(51, 6),
    ...ell(B, [45, 46, 6, 6], 0, -90, 4),
    ...ell(B, [-42, 46, 6, 6], -90, -180, 4),
    ...pts(B, [-48, 34, -67, 34]),
    ...ell(B, [-67, 26, 7, 8], 270, 90, 8),
    ...pts(B, [-48, 18, -48, 6]),
  ])
  s.stroke(p.path([B(-48, 9), ...front, B(51, 9)]))
  s.stroke(p.shape(ell(B, [-64, 26, 3.8, 5], 0, 360, 14)))
  const C: Map = (u, w) => {
    const q = B(u, w)
    return [q[0], q[1] - 22 * k]
  }
  outline(s, p, [
    B(-40, 8),
    B(9, 42),
    ...ell(C, [-15, 26, 30, 26], -37, -140, 14),
    C(-40, 8),
  ])
  s.stroke(p.path(pts(C, [-39, 8.7, 8, 41.3])))
  s.stroke(p.path(ell(C, [-15, 26, 27, 22], -138, -43, 14)))
  for (const [t, h] of [
    [0.28, 8],
    [0.57, 13],
    [0.82, 8],
  ] satisfies [number, number][]) {
    const q = B(-40 + 49 * t, 8 + 34 * t)
    s.stroke(p.disc([q[0], q[1] - h * k], [2.6 * k, 0], [0, 3.1 * k]))
  }
  const N: Map = (u, w) => B(32 + u + w * 0.1, w + 5)
  outline(s, p, pts(N, [-2, 13, -2, 37, 2, 34, 4, 28, 2, 13]))
  s.fill(p.shape([...ell(N, [0, 3, 3, 3], 180, 0, 8), N(2, 16), N(-2, 16)]))
}

/** A sheet of pasta dough under a wooden rolling pin, with flour beside it; `at` is bottom-centre. */
export const rollingPin: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k),
    o = depth(r)
  const phase = r.between(-0.2, 0.2)
  outline(
    s,
    p,
    Array.from({ length: 40 }, (_, i) => {
      const a = (i * Math.PI) / 20,
        f = 1 + Math.sin(a * 3 + phase) * 0.045 + Math.cos(a * 5) * 0.025
      const u = Math.cos(a) * 71 * f,
        w = Math.sin(a) * 43 * f
      return P(u + o[0] * w * 0.6, 37 + w * 0.65)
    }),
  )
  const a = ((12 + r.signed() * 2) * Math.PI) / 180
  const c = Math.cos(a),
    n = Math.sin(a)
  const R: Map = (u, v) => P(u * c - v * n, 37 + u * n + v * c)
  for (const [a, b] of [
    [-79, -52],
    [52, 79],
  ] satisfies [number, number][])
    outline(s, p, [
      ...ell(R, [a, 0, 3, 3.5], 90, 270, 8),
      ...ell(R, [b, 0, 3, 3.5], 270, 450, 8),
    ])
  outline(s, p, [
    ...ell(R, [-52, 0, 5, 8], 90, 270, 10),
    ...ell(R, [52, 0, 5, 8], 270, 450, 10),
  ])
  s.stroke(p.path(ell(R, [52, 0, 5, 8], 90, 270, 10)))
  for (const [u, v, rad] of [
    [55, 3, 1.3],
    [61, 5, 1],
    [65, 1, 1.2],
    [58, -2, 0.8],
  ] satisfies [number, number, number][])
    s.fill(p.disc(...dot(P(u, v), rad * k)))
}

/** A tilted T-handle corkscrew still entering a wine-stained cork; `at` is bottom-centre. */
export const corkscrew: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k),
    slope = r.between(0.05, 0.07)
  const R: Map = (u, v) => P(u, 14 - u * slope + v)
  s.stroke(
    p.path([
      R(-40, 0),
      ...Array.from({ length: 109 }, (_, i) => {
        const t = (i * Math.PI) / 18
        return R(-23 + t * 1.8 + 6 * Math.cos(t), 5 * Math.sin(t))
      }),
    ]),
  )
  outline(s, p, [
    ...ell(R, [15, 0, 4, 11], 90, 270, 12),
    ...ell(R, [44, 0, 4, 11], 270, 450, 12),
  ])
  s.stroke(
    p.path([R(18, 11), ...ell(R, [15, 0, 4, 11], 270, 450, 12), R(18, -11)]),
  )
  s.fill(p.shape(ell(R, [44, 0, 4, 11], 0, 360, 18)))
  const H: Map = (u, v) =>
    P(-40 + slope * u + v, 14 + 40 * slope + u - slope * v)
  outline(s, p, [
    ...ell(H, [-13, 0, 3, 4], 90, 270, 10),
    ...ell(H, [13, 0, 3, 4], 270, 450, 10),
  ])
  s.stroke(p.path([H(10, -4), ...ell(H, [13, 0, 3, 4], 90, 270, 10), H(10, 4)]))
}

/** A hinged pavement menu with two wooden frames and a paper board; `at` is bottom-centre. */
export const chalkboard: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k),
    du = 26 + depth(r)[0] * 5
  const F: Map = (u, v) => P(u + v * 0.06, v)
  const B: Map = (u, v) => P(u + du * (1 - v / 126) + v * 0.06, v)
  // Only the back frame's right leg: its left one would stand between the front legs and read as a third.
  outline(s, p, pts(B, [34, 0, 28, 0, 19, 126, 24, 126]))
  s.blank(p.shape(pts(F, [-33, 16, 33, 16, 23, 126, -23, 126])))
  s.stroke(p.line(F(-27.5, 16), F(27.5, 16)))
  s.stroke(p.line(F(-18, 126), F(18, 126)))
  for (const f of [-1, 1])
    outline(s, p, pts(F, [f * 34, 0, f * 28, 0, f * 18, 126, f * 23, 126]))
  s.stroke(p.shape(pts(F, [-24, 22, 24, 22, 16, 118, -16, 118])))
  for (const [v, w] of [
    [99, 24],
    [85, 10],
    [71, 30],
    [57, 16],
  ] satisfies [number, number][]) {
    const text = F(-15, v)
    scribble(s, p, r, text[0], text[1], (w * k) / 0.7, 1)
  }
  s.stroke(
    p.shape([
      ...ell(F, [0, 43, 6, 2], 180, 360, 8),
      ...ell(F, [0, 43, 6, 9], 0, 180, 12),
    ]),
  )
  s.stroke(p.path(tuck(F, [0, 43, 6, 2], ell(F, [0, 43, 6, 2], 180, 0, 8))))
  s.stroke(p.line(F(0, 34), F(0, 28)))
  s.stroke(p.line(F(-5, 28), F(5, 28)))
  for (const u of [-18, 18]) s.fill(p.disc(...dot(F(u, 126), 1.3 * k)))
}

const T = objectsIn("food")
define(
  T("olive-oil", "Olive oil", [80, 140], [31, 130], 1, oliveOil, [
    "oil",
    "pantry",
    "kitchen",
    "italian",
  ]),
  T("jar", "Preserving jar", [90, 130], [45, 120], 1, jar, [
    "pickles",
    "preserves",
    "ferment",
    "pantry",
    "nordic",
  ]),
  T("cheese", "Cheese board", [170, 100], [80, 91], 1, cheese, [
    "cheese",
    "board",
    "wine bar",
    "antipasti",
    "restaurant",
  ]),
  T("rolling-pin", "Rolling pin", [190, 100], [95, 88], 1, rollingPin, [
    "pasta",
    "handmade",
    "kitchen",
    "bake",
    "dough",
  ]),
  T("corkscrew", "Corkscrew", [130, 100], [65, 85], 1, corkscrew, [
    "wine",
    "natural wine",
    "bar",
    "restaurant",
  ]),
  T("chalkboard", "Pavement sign", [120, 160], [42, 149], 1, chalkboard, [
    "menu",
    "today",
    "specials",
    "open",
    "restaurant",
    "cafe",
  ]),
)
