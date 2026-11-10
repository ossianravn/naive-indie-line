// Studio: what comes off the table: prints, the drafts that missed and the prize for the one that didn't. Each
// function draws one object; `at` is its anchor and `k` its scale. Composition comes from `r`, never from the pen.
import { add, arc, lerp, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import { box, depth, drum } from "../shapes"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** Three instant photos fanned on the table; the top one's picture is the wash. `at` is the middle of their feet. */
export const photoPrints: Draw = (s, p, r, at, k = 1) => {
  const spread = r.between(11, 16)
  const hill = r.chance(0.5)
  for (let i = 0; i < 3; i++) {
    const a = (i - 1) * spread + r.signed() * 3
    const c: Point = [at[0] + (i - 1) * 30 * k, at[1]]
    const P = (u: number, v: number): Point =>
      turn([c[0] + u * k, c[1] - v * k], c, a)
    solid(s, p, [P(-32, 0), P(32, 0), P(32, 78), P(-32, 78)])
    const pic = [P(-26, 20), P(26, 20), P(26, 72), P(-26, 72)]
    if (i === 2) s.wash(p.shape(pic))
    s.stroke(p.shape(pic))
    // What each photo shows, in a line or two: hills and a sun, a horizon, a figure's head and shoulders.
    const view = (i + (hill ? 0 : 1)) % 3
    if (view === 0) {
      s.stroke(p.path([P(-26, 34), P(-10, 50), P(2, 40), P(14, 54), P(26, 40)]))
      s.stroke(p.disc(P(-10, 62), [4 * k, 0], [0, 4 * k]))
    } else if (view === 1) {
      s.stroke(p.line(P(-26, 42), P(26, 42)))
      s.stroke(p.path([P(-14, 46), P(-6, 50), P(4, 47)]))
    } else {
      s.stroke(p.disc(P(0, 52), [7 * k, 0], [0, 8 * k]))
      s.stroke(p.path(arc(P(0, 20), 16 * k, 14 * k, 180 - a, 360 - a, 10)))
    }
  }
}

/** A crumpled ball of paper: a lumpy outline and two creases. */
function ball(s: Sheet, p: Pen, r: Stream, c: Point, R: number) {
  const n = 9
  const pts = Array.from({ length: n }, (_, i): Point => {
    const a = ((i * 360) / n + r.signed() * 10) * (Math.PI / 180)
    const f = r.between(0.84, 1.08)
    return [c[0] + Math.cos(a) * R * f, c[1] + Math.sin(a) * R * f * 0.92]
  })
  solid(s, p, pts)
  const mid = add(c, [r.signed() * R * 0.2, r.signed() * R * 0.2])
  s.stroke(
    p.path([
      lerp(c, pts[1] as Point, 0.7),
      mid,
      lerp(c, pts[5] as Point, 0.68),
    ]),
  )
  s.stroke(p.line(mid, lerp(c, pts[7] as Point, 0.62)))
}

/** A wire waste basket of crumpled drafts, one fallen on the floor beside it. `at` is the middle of the basket's foot. */
export const crumpledDrafts: Draw = (s, p, r, at, k = 1) => {
  const [rt, rb, h, e] = [38 * k, 29 * k, 74 * k, 10 * k]
  const rim: Point = [at[0], at[1] - h]
  const balls: [number, number, number][] = [
    [-15, 4, 15],
    [12, 2, 14],
    [-1, -9, 13],
  ]
  drum(s, p, rim, [rt, rb, h, e], () => {
    for (const [u, v, R] of balls)
      ball(s, p, r, add(rim, [u * k + r.signed() * 2 * k, v * k]), R * k)
  })
  // The wire: uprights round the front, from rim to foot.
  for (let i = 1; i < 8; i++) {
    const a = 180 - (i * 180) / 8
    const [t] = arc(rim, rt, e, a, a, 1) as [Point]
    const [b] = arc([at[0], at[1]], rb, (e * rb) / rt, a, a, 1) as [Point]
    s.stroke(p.line(lerp(t, b, 0.04), lerp(b, t, 0.04)))
  }
  const side = r.chance(0.5) ? 1 : -1
  ball(s, p, r, [at[0] + side * 62 * k, at[1] - 12 * k], 13 * k)
}

/** A small trophy: a pencil standing on a stepped plinth with a plate on its front; the pencil's lead is the ink. */
export const award: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const base = box(s, p, o, [at[0], at[1]], 70 * k, 14 * k, 36 * k)
  void base
  const step = box(
    s,
    p,
    o,
    [at[0] + 10 * k, at[1] - 14 * k],
    50 * k,
    24 * k,
    26 * k,
  )
  solid(s, p, [
    step.front(0.18, 0.3),
    step.front(0.82, 0.3),
    step.front(0.82, 0.7),
    step.front(0.18, 0.7),
  ])
  s.stroke(p.line(step.front(0.28, 0.5), step.front(0.66, 0.5)))
  // The pencil stands in the middle of the step's top, a little off true.
  const foot = step.top(0.5, 0.5)
  const a = r.signed() * 3
  const P = (u: number, v: number): Point =>
    turn([foot[0] + u * k, foot[1] - v * k], foot, a)
  const len = 92
  solid(s, p, [P(-7, 0), P(7, 0), P(7, len), P(0, len + 20), P(-7, len)])
  s.stroke(p.line(P(0, 4), P(0, len - 2)))
  s.stroke(
    p.path([
      P(-7, len),
      P(-3.5, len + 3),
      P(0, len),
      P(3.5, len + 3),
      P(7, len),
    ]),
  )
  s.fill(p.shape([P(-2.6, len + 12.5), P(2.6, len + 12.5), P(0, len + 20)]))
}

const T = objectsIn("studio")
define(
  T("photo-prints", "Instant photos", [200, 120], [100, 104], 1, photoPrints, [
    "photography",
    "art direction",
    "paper",
  ]),
  T(
    "crumpled-drafts",
    "Crumpled drafts",
    [210, 146],
    [90, 132],
    1,
    crumpledDrafts,
    ["iterations", "empty", "paper"],
  ),
  T("award", "Award", [120, 194], [22, 180], 1, award, [
    "recognition",
    "studio",
  ]),
)
