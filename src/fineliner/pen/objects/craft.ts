// Studio: the bench tools for cutting, fixing and signing off. Each function draws one object; `at` is its anchor and
// `k` its scale. Composition comes from `r`, never from the pen, so takes agree. Flat things lie on the table in the
// kit's 3/4 view along one depth(r); tools with real thickness are closed outlines.
import { add, arc, lerp, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, cylinder, depth } from "../shapes"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A point on the table: `x` along the front edge from `a`, `z` back along `o`. */
const plane =
  (a: Point, o: Point) =>
  (x: number, z: number): Point =>
    add([a[0] + x, a[1]], o, z)

/** A flat strip on the table from (x0, z0) to (x1, z1), `t` wide, as its four corners. */
function strip(
  q: (x: number, z: number) => Point,
  [x0, z0]: Point,
  [x1, z1]: Point,
  t: number,
): Point[] {
  const len = Math.hypot(x1 - x0, z1 - z0) || 1
  const [nx, nz] = [(-(z1 - z0) / len) * t * 0.5, ((x1 - x0) / len) * t * 0.5]
  return [
    q(x0 + nx, z0 + nz),
    q(x1 + nx, z1 + nz),
    q(x1 - nx, z1 - nz),
    q(x0 - nx, z0 - nz),
  ]
}

/** A cutting mat with its grid, a steel rule across it and a scalpel beside the rule. `at` is the front-left corner. */
export const cuttingMat: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [W, D] = [180 * k, 200 * k]
  const q = plane(at, o)
  solid(s, p, [q(0, 0), q(W, 0), q(W, D), q(0, D)])
  for (const f of [0.36, 0.68])
    s.stroke(p.line(q(W * 0.04, D * f), q(W * 0.96, D * f)))
  for (const f of [0.3, 0.6])
    s.stroke(p.line(q(W * f, D * 0.05), q(W * f, D * 0.95)))
  // The rule runs from front to back at a seeded slant, its ticks along the left edge.
  const x0 = r.between(0.68, 0.76) * W
  const [a, b]: [Point, Point] = [
    [x0, D * 0.02],
    [x0 + r.between(0.02, 0.1) * W, D * 1.02],
  ]
  const rule = strip(q, a, b, 15 * k)
  solid(s, p, rule)
  for (let i = 1; i < 10; i++) {
    const e0 = lerp(rule[3] as Point, rule[2] as Point, i / 10)
    const e1 = lerp(rule[0] as Point, rule[1] as Point, i / 10)
    s.stroke(p.line(lerp(e0, e1, 0.06), lerp(e0, e1, i % 2 ? 0.3 : 0.5)))
  }
  // The scalpel lies near the front, pointing at the rule: a slim handle and a pointed blade.
  const h0: Point = [W * 0.08, D * r.between(0.14, 0.22)]
  const h1: Point = [W * 0.42, h0[1] + D * r.between(0.04, 0.1)]
  const handle = strip(q, h0, h1, 7 * k)
  const dx = h1[0] - h0[0]
  const dz = h1[1] - h0[1]
  const n = Math.hypot(dx, dz) || 1
  const tip = q(h1[0] + (dx / n) * 26 * k, h1[1] + (dz / n) * 26 * k)
  solid(s, p, [handle[1] as Point, tip, handle[2] as Point])
  solid(s, p, handle)
}

/** A pair of scissors lying open: two blades crossing on a screw, each with its finger loop. `at` is the screw. */
export const scissors: Draw = (s, p, r, at, k = 1) => {
  const spread = r.between(12, 18)
  const tilt = r.signed() * 6
  const half = (side: 1 | -1) => {
    const P = (u: number, v: number): Point =>
      turn([at[0] + u * k, at[1] + side * v * k], at, tilt - side * spread)
    solid(s, p, [
      P(86, 0),
      P(50, -5),
      P(10, -8.5),
      P(-6, -6.5),
      P(-24, -3),
      P(-24, 4),
      P(-6, 4),
      P(10, 3),
      P(16, 0),
    ])
    const c = P(-40, 3)
    const ax: Point = [16 * k, 0]
    const ay: Point = [0, 11 * k]
    const u = turn([ax[0], ax[1]], [0, 0], tilt - side * spread)
    const v = turn([ay[0], ay[1]], [0, 0], tilt - side * spread)
    s.blank(p.disc(c, u, v))
    s.stroke(p.disc(c, u, v))
    s.stroke(p.disc(c, [u[0] * 0.58, u[1] * 0.58], [v[0] * 0.5, v[1] * 0.5]))
  }
  half(1)
  half(-1)
  s.stroke(p.disc(at, [3.2 * k, 0], [0, 3.2 * k]))
}

/** A roll of masking tape, its loose end lying on the table and torn off in teeth. `at` is the middle of its foot. */
export const tape: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [R, e, H] = [36 * k, 13 * k, 20 * k]
  const c: Point = [at[0], at[1] - H - e]
  // The loose end first, under the roll: a band on the table running out to the right, its end torn.
  const L = r.between(56, 70) * k
  const b0: Point = [at[0], at[1]]
  const end: Point = [b0[0] + L, b0[1]]
  const torn = Array.from({ length: 7 }, (_, i) =>
    add(add(end, o, (H * i) / 6), [i % 2 ? -4 * k : 0, 0]),
  )
  solid(s, p, [b0, ...torn, add(b0, o, H)])
  cylinder(s, p, c, R, e, H)
  // The hole: its rim, and the far inside wall below it.
  const [ri, ei] = [R * 0.56, e * 0.56]
  s.blank(p.disc(c, [ri, 0], [0, ei]))
  s.stroke(p.disc(c, [ri, 0], [0, ei]))
  s.stroke(p.path(arc(add(c, [0, 5 * k]), ri * 0.9, ei, 208, 332, 10)))
}

/** A rubber stamp standing beside its open ink pad; the pad is the ink. `at` is the pad's front-left corner. */
export const rubberStamp: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const pad = box(s, p, o, at, 84 * k, 10 * k, 56 * k)
  s.fill(
    p.shape([
      pad.top(0.1, 0.16),
      pad.top(0.9, 0.16),
      pad.top(0.9, 0.84),
      pad.top(0.1, 0.84),
    ]),
  )
  const x = at[0] + r.between(100, 108) * k
  const y = at[1] + 4 * k
  box(s, p, o, [x, y], 50 * k, 6 * k, 34 * k)
  const block = box(s, p, o, [x + 3 * k, y - 6 * k], 44 * k, 16 * k, 30 * k)
  const top = block.top(0.5, 0.5)
  const neck = add(top, [0, -24 * k])
  cylinder(s, p, neck, 5.5 * k, 2 * k, 24 * k)
  const knob = add(neck, [0, -8 * k])
  s.blank(p.disc(knob, [13 * k, 0], [0, 11 * k]))
  s.stroke(p.disc(knob, [13 * k, 0], [0, 11 * k]))
}

const T = objectsIn("studio")
define(
  T("cutting-mat", "Cutting mat", [310, 130], [16, 118], 1, cuttingMat, [
    "craft",
    "packaging",
    "tools",
  ]),
  T("scissors", "Scissors", [200, 110], [96, 58], 1, scissors, [
    "editing",
    "craft",
    "tools",
  ]),
  T("tape", "Masking tape", [170, 100], [56, 84], 1, tape, [
    "fixes",
    "craft",
    "tools",
  ]),
  T("rubber-stamp", "Rubber stamp", [200, 120], [14, 104], 1, rubberStamp, [
    "approved",
    "sign-off",
    "tools",
  ]),
)
