// Studio: what stands about a drawing office on its own feet: a whiteboard on castors, a plotter and a coat rack.
// Each function draws one object; `at` is its anchor and `k` its scale. Composition comes from `r`, never the pen.
import { add, arc, lerp, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, depth, scribble } from "../shapes"
import type { Bounds } from "../path"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A castor: a small wheel under a point. */
function castor(s: Sheet, p: Pen, at: Point, k: number) {
  const c = add(at, [0, 4.5 * k])
  s.blank(p.disc(c, [4.5 * k, 0], [0, 4.5 * k]))
  s.stroke(p.disc(c, [4.5 * k, 0], [0, 4.5 * k]))
}

/**
 * A whiteboard on a stand with castors, a marker tray under its face and one marker in the tray (the ink). A diagram
 * of three boxes and arrows is half wiped. `w` and `h` size the board; `at` is the middle of the stand's feet. The
 * board's face is what a scene addresses.
 */
export const whiteboard: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { w = 180, h = 120 } = {},
) => {
  const o = depth(r)
  const [W, H] = [(w as number) * k, (h as number) * k]
  const lift = 62 * k
  const x0 = at[0] - W / 2
  const bottom = at[1] - 9 * k - lift
  // The stand: two posts with a foot each, set in from the board's ends.
  for (const u of [0.08, 0.92]) {
    const x = x0 + W * u
    solid(s, p, [
      [x - 2.5 * k, at[1] - 9 * k],
      [x + 2.5 * k, at[1] - 9 * k],
      [x + 2.5 * k, bottom - H + 14 * k],
      [x - 2.5 * k, bottom - H + 14 * k],
    ])
    const foot = box(
      s,
      p,
      o,
      [x - 20 * k, at[1] - 9 * k],
      40 * k,
      4 * k,
      22 * k,
    )
    castor(s, p, foot.front(0.1, 0), k)
    castor(s, p, foot.front(0.9, 0), k)
  }
  box(s, p, o, [x0, bottom], W, H, 5 * k)
  const P = (u: number, v: number): Point => [x0 + u * W, bottom - v * H]
  // The diagram: three boxes in a row joined by arrows, the last half wiped away.
  const node = (u: number, v: number) =>
    solid(s, p, [P(u, v), P(u + 0.16, v), P(u + 0.16, v + 0.2), P(u, v + 0.2)])
  node(0.1, 0.56)
  node(0.42, 0.56)
  for (const u of [0.28, 0.6]) {
    s.stroke(p.line(P(u, 0.66), P(u + 0.11, 0.66)))
    s.stroke(p.path([P(u + 0.08, 0.7), P(u + 0.11, 0.66), P(u + 0.08, 0.62)]))
  }
  s.stroke(p.path([P(0.74, 0.56), P(0.74, 0.76), P(0.84, 0.76)]))
  scribble(s, p, r, P(0.1, 0.32)[0], P(0.1, 0.32)[1], W * 0.5, 2, 9 * k)
  // The tray along the bottom edge, and the marker lying in it.
  const tray = box(s, p, o, add(P(0.2, 0), [0, 4 * k]), W * 0.6, 4 * k, 9 * k)
  const m = tray.top(r.between(0.55, 0.7), 0.5)
  s.fill(
    p.shape([
      add(m, [-14 * k, -2.5 * k]),
      add(m, [14 * k, -2.5 * k]),
      add(m, [14 * k, 1.5 * k]),
      add(m, [-14 * k, 1.5 * k]),
    ]),
  )
  return { face: [x0, bottom - H, x0 + W, bottom] as Bounds }
}

/**
 * A large-format plotter on its stand, a sheet curling out of its front slot towards the floor. `at` is the middle of
 * the stand's feet.
 */
export const plotter: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [W, legs] = [220 * k, 74 * k]
  const x0 = at[0] - W / 2
  for (const u of [0.1, 0.9]) {
    const x = x0 + W * u
    solid(s, p, [
      [x - 3 * k, at[1] - 8 * k],
      [x + 3 * k, at[1] - 8 * k],
      [x + 3 * k, at[1] - legs],
      [x - 3 * k, at[1] - legs],
    ])
    const foot = box(
      s,
      p,
      o,
      [x - 22 * k, at[1] - 8 * k],
      44 * k,
      4 * k,
      26 * k,
    )
    castor(s, p, foot.front(0.12, 0), k)
    castor(s, p, foot.front(0.88, 0), k)
  }
  s.stroke(
    p.line(
      [x0 + W * 0.1 + 3 * k, at[1] - 30 * k],
      [x0 + W * 0.9 - 3 * k, at[1] - 30 * k],
    ),
  )
  const body = box(s, p, o, [x0, at[1] - legs], W, 44 * k, 46 * k)
  // The slot across the front, the control panel at the right end with one light.
  const slot = [body.front(0.04, 0.42), body.front(0.8, 0.42)]
  s.stroke(p.line(slot[0] as Point, slot[1] as Point))
  solid(s, p, [
    body.front(0.84, 0.25),
    body.front(0.96, 0.25),
    body.front(0.96, 0.75),
    body.front(0.84, 0.75),
  ])
  s.fill(p.disc(body.front(0.9, 0.58), [2 * k, 0], [0, 2 * k]))
  // The sheet comes out of the slot, falls and curls forward under itself.
  const drop = r.between(36, 46) * k
  const a = body.front(0.12, 0.42)
  const b = body.front(0.62, 0.42)
  const curl = (q: Point): Point[] => [
    q,
    add(q, [-6 * k, drop * 0.5]),
    add(q, [-2 * k, drop]),
    ...arc(add(q, [6 * k, drop]), 8 * k, 7 * k, 180, 20, 6),
  ]
  const left = curl(a)
  const right = curl(b)
  solid(s, p, [...left, ...right.reverse()])
  s.stroke(p.line(lerp(a, b, 0.2), lerp(a, b, 0.8)))
}

/** A coat stand with three feet and four hooks, a tote bag hanging from one and a scarf from another. `at` is its foot. */
export const coatRack: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const H = 180
  // Feet first, then the pole over their roots.
  for (const [u, v] of [
    [-26, 0],
    [26, 0],
    [8, 9],
  ] as [number, number][])
    s.stroke(p.path([P(u, v), P(u * 0.3, 14), P(0, 18)]))
  solid(s, p, [P(-3, 12), P(3, 12), P(3, H), P(-3, H)])
  s.fill(p.disc(P(0, H + 4), [4.5 * k, 0], [0, 4.5 * k]))
  const hook = (side: number) =>
    s.stroke(
      p.path([P(side * 2.5, H - 14), P(side * 14, H - 6), P(side * 19, H + 2)]),
    )
  hook(-1)
  hook(1)
  // The tote hangs from the left hook by its handle; the scarf falls from the right in two ends.
  const hl = P(-17, H - 2)
  const bag = P(-28 + r.signed() * 2, H - 52)
  s.stroke(p.path([add(bag, [-14 * k, 0]), hl, add(bag, [10 * k, 0])]))
  solid(s, p, [
    add(bag, [-20 * k, 0]),
    add(bag, [18 * k, 0]),
    add(bag, [21 * k, 56 * k]),
    add(bag, [-23 * k, 56 * k]),
  ])
  scribble(s, p, r, bag[0] - 10 * k, bag[1] + 26 * k, 18 * k, 1, 6 * k)
  const hr = P(17, H - 2)
  const drape = r.between(54, 70)
  for (const [dx, len] of [
    [-2, drape],
    [8, drape - 16],
  ] as [number, number][]) {
    const end = add(hr, [dx * k, len * k])
    solid(s, p, [
      add(hr, [-4 * k, 0]),
      add(hr, [4 * k, 0]),
      add(end, [5 * k, 0]),
      add(end, [-5 * k, 0]),
    ])
    for (const f of [-3, 0, 3])
      s.stroke(p.line(add(end, [f * k, 0.5 * k]), add(end, [f * k, 6 * k])))
  }
}

/** A round wall clock, its hands set by the seed: the hub is the ink. `at` is its centre. */
export const wallClock: Draw = (s, p, r, at, k = 1) => {
  const R = 32 * k
  s.blank(p.disc(at, [R + 3 * k, 0], [0, R + 3 * k]))
  s.stroke(p.disc(at, [R + 3 * k, 0], [0, R + 3 * k]))
  s.stroke(p.disc(at, [R - 1 * k, 0], [0, R - 1 * k]))
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const [c, n] = [Math.cos(a), Math.sin(a)]
    const len = i % 3 ? 3 : 6
    s.stroke(
      p.line(
        add(at, [c * (R - 4 * k), n * (R - 4 * k)]),
        add(at, [c * (R - (4 + len) * k), n * (R - (4 + len) * k)]),
      ),
    )
  }
  const hand = (turns: number, len: number) => {
    const a = turns * Math.PI * 2 - Math.PI / 2
    s.stroke(
      p.line(at, add(at, [Math.cos(a) * len * k, Math.sin(a) * len * k])),
    )
  }
  const hour = Math.floor(r.between(0, 12))
  const minute = r.between(0, 1)
  hand((hour + minute) / 12, 15)
  hand(minute, 23)
  s.fill(p.disc(at, [2.6 * k, 0], [0, 2.6 * k]))
}

const T = objectsIn("studio")
define(
  T("whiteboard", "Whiteboard", [230, 230], [115, 220], 1, whiteboard, [
    "process",
    "planning",
    "studio",
  ]),
  T("plotter", "Plotter", [292, 160], [142, 148], 1, plotter, [
    "print",
    "production",
    "studio",
  ]),
  T("wall-clock", "Wall clock", [90, 90], [45, 45], 1, wallClock, [
    "hours",
    "turnaround",
    "studio",
  ]),
  T("coat-rack", "Coat rack", [120, 220], [64, 212], 1, coatRack, [
    "arrival",
    "team",
    "studio",
  ]),
)
