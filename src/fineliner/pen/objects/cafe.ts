// Café: the kitchen's things, from the morning coffee to a plate of lunch. `at` is bottom-centre unless a
// function says otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. The
// helpers (place, ell, pts, tuck, outline, slab) live in units.ts.
import { add, arc, deg, dot, times, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { ell, outline, place, pts, slab, tuck } from "./units"
import type { Map, Oval } from "./units"

/** A cup with a double-line handle on its saucer, steaming. The handle is drawn first, so the cup hides its roots. */
export const coffee: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  const rim: Oval = [0, 26, 17, 5]
  slab(s, p, P, [0, 2, 30, 8], 2)
  s.stroke(p.path(ell(P, [15, 16, 9, 6.5], -110, 110, 12)))
  s.stroke(p.path(ell(P, [15, 16, 5, 3], -120, 120, 10)))
  const sides = [P(-17, 26), ...ell(P, [0, 5, 15, 4.4], 180, 0, 14), P(17, 26)]
  s.blank(
    p.shape([...ell(P, rim, 180, 360, 12), ...sides.slice(1, -1).reverse()]),
  )
  s.stroke(p.ring(P(0, 26), [17 * k, 0], [0, 5 * k]))
  s.stroke(p.path(tuck(P, rim, sides)))
  s.fill(p.disc(P(0, 25.4), [14 * k, 0], [0, 3.4 * k]))
  for (const u of [-6, 4]) {
    const wisp = Array.from({ length: 12 }, (_, i) => Math.sin(i * 0.55 + u))
    s.stroke(p.path(wisp.map((w, i) => P(u + w * 2.4, 37 + i * 2))))
  }
}

/**
 * A round teapot, as on the object sheet: a squat body on a short foot, a domed lid with a solid knob, a spout curving
 * up from low on the right and a loop handle on the left. The spout, handle and foot are drawn first, so the body
 * hides where they join it.
 */
export const teapot: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  /** Points on an ellipse centred at (u, v), in the object's units: 0 degrees is right, 90 is down. */
  const oval = (
    u: number,
    v: number,
    rx: number,
    ry: number,
    a0: number,
    a1: number,
    n = 10,
  ) => arc([0, 0], rx, ry, a0, a1, n).map(([du, dv]) => P(u + du, v - dv))
  s.stroke(p.path([P(-19, 9), P(-16, 0), P(16, 0), P(19, 9)]))
  s.stroke(
    p.path([
      P(28, 14),
      P(42, 20),
      P(51, 31),
      P(57, 45),
      P(62, 55),
      P(56, 58),
      P(51, 48),
      P(45, 39),
      P(36, 34),
    ]),
  )
  s.stroke(p.path(oval(-34, 35, 17, 17, 290, 70, 14)))
  s.stroke(p.path(oval(-34, 35, 10, 10, 300, 60, 12)))
  const body = oval(0, 34, 40, 31, 0, 360, 28)
  s.blank(p.shape(body))
  s.stroke(p.ring(P(0, 34), [40 * k, 0], [0, 31 * k]))
  const lid = [...oval(0, 61, 17, 9, 180, 360), ...oval(0, 61, 17, 3.5, 0, 180)]
  s.blank(p.shape(lid))
  s.stroke(p.shape(lid))
  s.fill(p.disc(...dot(P(0, 73), 3.8 * k)))
}

/**
 * A moka pot: two faceted chambers on a base rim, a band where they screw together and a lid domed over the top with
 * a solid knob, a beak at the top right and a bakelite handle. The rim, band and lid are drawn after the chambers, so
 * they hide where the facet edges end; the beak and handle come first, so the pot hides their roots.
 */
export const moka: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  s.stroke(p.path(pts(P, [14, 70, 23, 77, 31, 84, 18, 81.5])))
  const grip = [-17, 77, -30, 79, -36, 73, -35.5, 50, -30.5, 47, -29.5, 52]
  s.fill(p.shape(pts(P, [...grip, -30.5, 70, -27, 72.5, -17, 71])))
  outline(
    s,
    p,
    pts(P, [-21, 2.5, -8, 0.8, 8, 0.8, 21, 2.5, 13.5, 39, -13.5, 39]),
  )
  for (const f of [-1, 1]) s.stroke(p.line(P(f * 8, 4.5), P(f * 5.1, 39.5)))
  outline(
    s,
    p,
    pts(P, [-22, 1.5, -8, -0.5, 8, -0.5, 22, 1.5, 21.2, 6, -21.2, 6]),
  )
  outline(s, p, pts(P, [-13.5, 40, 13.5, 40, 19, 80, -19, 80]))
  for (const f of [-1, 1]) s.stroke(p.line(P(f * 5.1, 41), P(f * 7.2, 80.5)))
  outline(s, p, pts(P, [-14.6, 36, 14.6, 36, 14.4, 43, -14.4, 43]))
  outline(s, p, [
    ...ell(P, [0, 79.4, 20.5, 1.6], 180, 0, 10),
    ...ell(P, [0, 79.4, 20.5, 8], 0, -180, 12).slice(1, -1),
  ])
  s.stroke(p.line(P(0, 87.5), P(0, 90)))
  s.fill(p.disc(...dot(P(0, 91.5), 3.2 * k)))
}

const FISH = [
  -24, 0.5, -20, 3.4, -12, 5.4, -2, 5.8, 8, 4.4, 15, 2, 17.5, 1.2, 26, 6.5,
  23.5, 0.2, 26, -5.5, 17.5, -1.2, 15, -2, 8, -4.2, -2, -5.4, -12, -4.8, -20,
  -2.6,
]
const TOAST = [
  -15, 12, -15, -6, -17, -9, -16.5, -13, -12, -15.5, -6, -15, 0, -13.5, 6, -15,
  12, -15.5, 16.5, -13, 17, -9, 15, -6, 15, 12,
]
const LEAF = [
  -9, 0, -4.5, 3.6, 0, 4.6, 4.5, 3.6, 9, 0, 4.5, -3.6, 0, -4.6, -4.5, -3.6,
]

/** A plate seen from above, with one of a few dishes on it. Flat food lies in the plate's own perspective. */
export const plate: Draw = (s, p, r, at, k = 1, options = {}) => {
  const dish = options.dish ?? r.pick(["fish", "toast", "pasta", "salad"])
  const P = place(at, k)
  slab(s, p, P, [0, 14, 48, 14], 2.5)
  s.stroke(p.ring(P(0, 13.4), [34 * k, 0], [0, 9.8 * k]))
  // A point on the plate: u across and w towards us, turned by a, h above it, squashed as the plate is.
  const plane =
    (a: number, h: number, q = 0.3, cu = 0, cw = 0): Map =>
    (u, w) => {
      const [c, n] = [Math.cos(a), Math.sin(a)]
      return P(cu + u * c - w * n, 13.4 + h - cw * 0.3 - (u * n + w * c) * q)
    }
  if (dish === "fish") {
    const E: Map = (u, h) => P(u, 13.4 + h * 0.8)
    outline(s, p, pts(E, FISH))
    s.stroke(p.path(pts(E, [-12.5, 2.4, -11, 0, -12.5, -2.2])))
    s.fill(p.disc(...dot(E(-18.5, 1), 1.2 * k)))
  } else if (dish === "toast") {
    const a = r.signed() * 12 * deg
    const [top, foot] = [plane(a, 2.4), plane(a, 0)]
    const face = pts(top, TOAST)
    s.blank(p.shape([...face, foot(15, 12), foot(-15, 12)]))
    s.stroke(p.shape(face))
    s.stroke(p.path([top(-15, 6), ...pts(foot, [-15, 12, 15, 12]), top(15, 6)]))
    const egg = (t: number, m: number) =>
      top(1 + Math.cos(t) * m, Math.sin(t) * m - 1)
    s.stroke(
      p.shape(
        Array.from({ length: 9 }, (_, i) => egg(i * 0.7, r.between(7, 10))),
      ),
    )
    s.fill(p.disc(plane(a, 3.4)(2, -1), [3.4 * k, 0], [0, 2.2 * k]))
  } else if (dish === "pasta") {
    // A nest: one strand wound outwards, a spoonful of sauce on top.
    const nest = plane(0, 1.2, 0.34, r.signed() * 4, r.signed() * 3)
    const coil = (t: number, m: number) =>
      nest(Math.cos(t) * m * 1.15, Math.sin(t) * m)
    const m = (i: number) => 2 + i * 0.2 + r.signed() * 0.6
    s.stroke(p.path(Array.from({ length: 64 }, (_, i) => coil(i * 0.36, m(i)))))
    s.fill(p.disc(nest(0, 0), [4 * k, 0], [0, 2.4 * k]))
  } else {
    for (let i = 0; i < 4; i++) {
      const a = r.between(-35, 35) * deg
      const L = plane(a, 1, 0.45, r.signed() * 15, r.signed() * 9)
      outline(s, p, pts(L, LEAF))
      s.stroke(p.line(L(-5, 0.2), L(4.5, -0.2)))
    }
    for (let i = 0; i < 3; i++) {
      const at = plane(0, 1.5)(r.signed() * 18, r.signed() * 9)
      s.fill(p.disc(at, [2.6 * k, 0], [0, 1.9 * k]))
    }
  }
}

/**
 * A bowl of soup on a low foot, a spoon standing in it. The spoon rises out of a ripple, which is washed again over
 * the spoon's foot, so the spoon goes under the surface.
 */
export const bowl: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  const rim: Oval = [0, 26, 34, 8]
  outline(s, p, [...ell(P, [0, 3, 13, 3], 180, 0, 10), P(12, 7), P(-12, 7)])
  const body = ell(P, [0, 26, 34, 23], 180, 0, 18)
  s.blank(
    p.shape([...ell(P, rim, 180, 360, 14), ...body.slice(1, -1).reverse()]),
  )
  s.stroke(p.path(tuck(P, rim, body)))
  s.stroke(p.ring(P(0, 26), [34 * k, 0], [0, 8 * k]))
  s.wash(p.disc(P(0, 25.2), [29 * k, 0], [0, 6.2 * k]))
  const E = P(-5, 26.5)
  const [d, n] = [times([0.78, -0.62], k), times([0.62, 0.78], k)]
  const S: Map = (f, w) => add(add(E, d, f), n, w)
  const [d2, n2] = [times(d, 2.6), times(n, 2.6)]
  const tip = p.round(S(36, 0), d2, n2, -Math.PI / 2, Math.PI)
  const spoon = [
    ...pts(S, [0, -1.2, 30, -1.4, 34, -2.2]),
    ...tip,
    ...pts(S, [34, 2.2, 30, 1.4, 0, 1.2]),
  ]
  s.blank(p.shape(spoon))
  s.stroke(p.path(spoon))
  const ripple: [Point, Point, Point] = [E, [5 * k, 0], [0, 1.7 * k]]
  s.blank(p.disc(...ripple))
  s.wash(p.disc(...ripple))
  s.stroke(p.ring(...ripple))
}

/** A bâtard: a long loaf with rounded ends and three scores across its back. */
export const bread: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  outline(s, p, [
    ...ell(P, [0, 9, 46, 29], 180, 360, 22),
    ...ell(P, [37, 9, 9, 9], 0, 90, 4).slice(1),
    ...ell(P, [0, 0, 37, 1.5], 0, 180, 10).slice(1, -1),
    ...ell(P, [-37, 9, 9, 9], 90, 180, 4).slice(0, -1),
  ])
  for (const u of [-21, 0, 21]) {
    const S: Map = (a, b) => P(u + a, (u ? 24 : 26.5) + b)
    s.stroke(p.shape(pts(S, [-9, -4, -1, 1.6, 8, 4.6, -1, -0.6])))
  }
}

/** A whole lemon and a cut half beside it, its face to us. */
export const lemon: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const whole: Oval = [-14, 18, 22, 17]
  outline(s, p, [
    ...pts(P, [-40.5, 18, -37.5, 20.2]),
    ...ell(P, whole, 195, 345, 14),
    ...pts(P, [9.5, 20, 12.5, 17.6, 9.5, 15.6]),
    ...ell(P, whole, 15, 165, 14),
    P(-37.5, 15.8),
  ])
  const dome = [
    36, 31.4, 42, 28, 45.5, 22, 46.5, 18.4, 49, 17.2, 46.5, 15.8, 45.5, 12, 42,
    6, 36, 2.6,
  ]
  outline(s, p, [...ell(P, [28, 17, 13, 15], 90, 270, 12), ...pts(P, dome)])
  s.stroke(p.ring(P(28, 17), [13 * k, 0], [0, 15 * k]))
  s.stroke(p.ring(P(28, 17), [10.4 * k, 0], [0, 12.2 * k]))
  const turn = r.between(0, 51)
  for (let i = 0; i < 7; i++) {
    const a = turn + (i * 360) / 7
    const mid = (a + 180 / 7) * deg
    const core = P(28 + Math.cos(mid) * 1.6, 17 - Math.sin(mid) * 1.9)
    s.stroke(
      p.shape([core, ...ell(P, [28, 17, 8.4, 10], a + 6, a + 360 / 7 - 6, 3)]),
    )
  }
}

const T = objectsIn("food")

define(
  T("coffee", "Coffee", [90, 106], [45, 88], 1.1, coffee, [
    "drink",
    "coffee",
    "morning",
  ]),
  T("teapot", "Teapot", [140, 100], [62, 92], 1, teapot, [
    "drink",
    "tea",
    "kitchen",
  ]),
  T("moka", "Moka pot", [90, 110], [50, 102], 1, moka, [
    "drink",
    "coffee",
    "kitchen",
  ]),
  T("plate", "Plate", [120, 60], [60, 52], 1.1, plate, [
    "meal",
    "dish",
    "restaurant",
  ]),
  T("bowl", "Bowl", [100, 90], [50, 78], 1.1, bowl, [
    "meal",
    "soup",
    "kitchen",
  ]),
  T("bread", "Bread", [110, 60], [55, 52], 1, bread, [
    "food",
    "bakery",
    "breakfast",
  ]),
  T("lemon", "Lemons", [120, 60], [52, 50], 1, lemon, [
    "food",
    "fruit",
    "kitchen",
  ]),
)
