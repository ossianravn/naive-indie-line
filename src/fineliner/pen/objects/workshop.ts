// Studio: a drawing office's furniture. Each function draws one object; `at` is its anchor and `k` its scale.
// Composition comes from `r`, never from the pen, so takes agree. Timbers with real thickness are closed outlines;
// furniture that holds things returns its top as a Box, or the places to stand on.
import { add, arc, lerp, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, depth, type Box } from "../shapes"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A timber from a to b, `t` thick, as one closed outline. */
function timber(s: Sheet, p: Pen, a: Point, b: Point, t: number) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const n: Point = [(-dy * t) / len / 2, (dx * t) / len / 2]
  solid(s, p, [add(a, n), add(b, n), add(b, n, -1), add(a, n, -1)])
}

/**
 * A plan chest: a low cabinet of wide, shallow drawers on a recessed plinth, one drawer pulled out with a sheet's edge
 * lifting from it. The pulls are the ink. `at` is its front-left foot; `w` its width. Returns its top.
 */
export const planChest: Draw = (s, p, r, at, k = 1, { w = 230 } = {}) => {
  const o = depth(r)
  const W = (w as number) * k
  const [h, d, plinth, n] = [92 * k, 70 * k, 10 * k, 5]
  const open = Math.floor(r.between(1, n - 1.01))
  box(s, p, o, [at[0] + 8 * k, at[1]], W - 16 * k, plinth, d - 8 * k)
  const body = box(s, p, o, [at[0], at[1] - plinth], W, h, d)
  const dh = h / n
  const rowY = (i: number) => at[1] - plinth - i * dh
  for (let i = 1; i < n; i++)
    s.stroke(p.line([at[0] + 2.5 * k, rowY(i)], [at[0] + W - 2.5 * k, rowY(i)]))
  const pull = (x: number, y: number) =>
    s.fill(
      p.shape([
        [x - 13 * k, y - 2 * k],
        [x + 13 * k, y - 2 * k],
        [x + 13 * k, y + 2 * k],
        [x - 13 * k, y + 2 * k],
      ]),
    )
  for (let i = 0; i < n; i++) if (i !== open) pull(at[0] + W / 2, rowY(i + 0.5))
  // The drawer that is out: its front pulled towards us, a sheet lifting from it.
  const out = 15 * k
  const fx = at[0] - out * o[0] + 3 * k
  const fy = rowY(open) - out * o[1]
  const drawer = box(s, p, o, [fx, fy], W - 6 * k, dh, out)
  solid(s, p, [
    drawer.top(0.12, 0.3),
    add(drawer.top(0.24, 0.8), [0, -7 * k]),
    add(drawer.top(0.8, 0.85), [0, -5 * k]),
    drawer.top(0.9, 0.3),
  ])
  pull(fx + (W - 6 * k) / 2, fy - dh / 2)
  return body
}

/**
 * A long table top on two trestles, each an A of legs across the table's depth with a bar between. `w` and `d` size
 * the top; `at` is the front-left corner of the top's underside. Returns the top.
 */
export const trestleTable: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { w = 260, d = 80 } = {},
) => {
  const o = depth(r)
  const [W, D, H] = [(w as number) * k, (d as number) * k, 100 * k]
  const floor = at[1] + H
  for (const u of [0.14, 0.86]) {
    const x = at[0] + W * u
    const head = add([x, at[1]], o, D / 2)
    const front: Point = add([x - 4 * k, floor], o, D * 0.08)
    const back: Point = add([x + 4 * k, floor], o, D * 0.92)
    timber(s, p, head, back, 6 * k)
    s.stroke(p.line(lerp(head, front, 0.62), lerp(head, back, 0.62)))
    timber(s, p, head, front, 6 * k)
  }
  return box(s, p, o, at, W, 6 * k, D) as Box
}

/** A three-legged stool with a round seat and a ring rail. `at` is the middle of its feet. */
export const stool: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const H = 74 + r.signed() * 3
  const seat = P(0, H)
  const feet: Point[] = [P(4, 8), P(-24, 0), P(24, 0)]
  const tops: Point[] = [P(3, H - 4), P(-13, H - 6), P(13, H - 6)]
  // The back leg first, then the rail, then the front legs over the rail's ends.
  timber(s, p, tops[0] as Point, feet[0] as Point, 5 * k)
  const rail = arc(P(0, 26), 17 * k, 5 * k, 0, 360, 20)
  s.stroke(p.shape(rail))
  timber(s, p, tops[1] as Point, feet[1] as Point, 5.5 * k)
  timber(s, p, tops[2] as Point, feet[2] as Point, 5.5 * k)
  const top = [
    ...arc(seat, 22 * k, 7 * k, 180, 360, 14),
    ...arc(add(seat, [0, 5 * k]), 22 * k, 7 * k, 0, 180, 14),
  ]
  solid(s, p, top)
  s.stroke(p.path(arc(seat, 22 * k, 7 * k, 0, 180, 14)))
}

/**
 * A wooden A-frame stepladder in profile, its steps on the left, seen a little from above so the far rails stand
 * behind. `at` is the foot of the near step rail. Returns the middle of each step's top, bottom first, then the cap's.
 */
export const stepladder: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const [H, lean] = [150, 40]
  const wide = 50 * k
  const rail = (a: Point, b: Point, shift = 0) => {
    const f = (q: Point) => add(q, o, shift)
    solid(s, p, [f(a), f(add(a, [5 * k, 0])), f(add(b, [5 * k, 0])), f(b)])
  }
  rail(P(0, 0), P(lean, H - 3), wide)
  rail(P(lean + 30, 0), P(lean + 6, H - 3), wide)
  const steps: Point[] = []
  for (const v of [36, 74, 112]) {
    const step = box(s, p, o, P((lean * v) / H - 9, v), 24 * k, 4 * k, wide)
    steps.push(step.top(0.5, 0.5))
  }
  rail(P(0, 0), P(lean, H - 3))
  rail(P(lean + 30, 0), P(lean + 6, H - 3))
  const cap = box(s, p, o, P(lean - 8, H), 26 * k, 6 * k, wide)
  steps.push(cap.top(0.5, 0.5))
  return steps
}

/**
 * A drawing board tilted on its stand, a sheet clipped to it and a T-square across the sheet; the clip is the ink.
 * `at` is the foot of the front-left leg.
 */
export const drawingBoard: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [W, H, D, legs] = [160 * k, 50 * k, 110 * k, 84 * k]
  const BL: Point = [at[0], at[1] - legs]
  const rise = add([0, -H], o, D)
  const B = (u: number, v: number): Point =>
    add([BL[0] + W * u, BL[1]], rise, v)
  // The back legs first, from under the board's top edge to the floor; the board hides their heads.
  for (const u of [0.08, 0.92]) {
    const top = B(u, 0.86)
    timber(s, p, top, add([BL[0] + W * u, at[1]], o, D * 1.1), 5 * k)
  }
  solid(s, p, [B(0, 0), B(1, 0), B(1, 1), B(0, 1)])
  s.stroke(p.line(add(B(0, 0), [5 * k, 4 * k]), add(B(1, 0), [-5 * k, 4 * k])))
  const sheet = [B(0.16, 0.12), B(0.76, 0.12), B(0.76, 0.9), B(0.16, 0.9)]
  solid(s, p, sheet)
  s.fill(p.shape([B(0.4, 0.84), B(0.52, 0.84), B(0.52, 0.95), B(0.4, 0.95)]))
  // The T-square: its head against the board's left edge, its blade across the sheet at a seeded height.
  const v = r.between(0.3, 0.46)
  solid(s, p, [B(0.02, v), B(0.94, v), B(0.94, v + 0.06), B(0.02, v + 0.06)])
  solid(s, p, [
    B(-0.05, v - 0.14),
    B(0.02, v - 0.14),
    B(0.02, v + 0.2),
    B(-0.05, v + 0.2),
  ])
  // The front legs under the board's near edge, a rail between them.
  const fl: Point = add(B(0.08, 0), [0, 4 * k])
  const fr: Point = add(B(0.92, 0), [0, 4 * k])
  s.stroke(
    p.line(
      add(lerp(fl, [fl[0], at[1]], 0.62), [2.5 * k, 0]),
      add(lerp(fr, [fr[0], at[1]], 0.62), [-2.5 * k, 0]),
    ),
  )
  timber(s, p, fl, [fl[0], at[1]], 5 * k)
  timber(s, p, fr, [fr[0], at[1]], 5 * k)
}

const T = objectsIn("studio")
define(
  T("drawing-board", "Drawing board", [260, 200], [22, 188], 1, drawingBoard, [
    "furniture",
    "craft",
    "studio",
  ]),
  T("plan-chest", "Plan chest", [310, 170], [24, 150], 1, planChest, [
    "furniture",
    "archive",
    "studio",
  ]),
  T("trestle-table", "Trestle table", [330, 170], [20, 54], 1, trestleTable, [
    "furniture",
    "table",
    "studio",
  ]),
  T("stool", "Stool", [90, 110], [45, 100], 1, stool, [
    "furniture",
    "seat",
    "studio",
  ]),
  T("stepladder", "Stepladder", [150, 190], [36, 180], 1, stepladder, [
    "furniture",
    "reaching",
    "studio",
  ]),
)
