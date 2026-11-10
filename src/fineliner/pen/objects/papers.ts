// Studio: paper in its forms, from a stack of sheets to a board of scraps. Each function draws one object; `at` is its
// anchor and `k` its scale. Flat things lie on the table in the kit's 3/4 view, receding along one depth(r) each.
import { add, lerp, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, cylinder, depth, drum, scribble } from "../shapes"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A flat sheet's corners on the table: front-left at `a`, `w` wide, receding `d` along `o`. */
const flat = (a: Point, w: number, d: number, o: Point): Point[] => [
  a,
  [a[0] + w, a[1]],
  add([a[0] + w, a[1]], o, d),
  add(a, o, d),
]

/** A stack of loose sheets, each a little out of line, the top sheet's front corner lifting. `at` is front-left. */
export const paperStack: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, d] = [104 * k, 70 * k]
  const n = 6
  for (let i = 0; i < n - 1; i++) {
    const a: Point = [at[0] + r.signed() * 4 * k, at[1] - i * 3.2 * k]
    box(s, p, o, a, w + r.signed() * 3 * k, 3.2 * k, d)
  }
  const a: Point = [
    at[0] + r.signed() * 3 * k,
    at[1] - (n - 1) * 3.2 * k - 3 * k,
  ]
  const [A, B, C, D] = flat(a, w, d, o) as [Point, Point, Point, Point]
  const lift = r.between(9, 12) * k
  // The front-right corner lifts: the sheet lies flat up to a fold, and the corner beyond it stands up off the stack,
  // showing the sheet beneath where it was.
  const E = lerp(A, B, 0.84)
  const F = lerp(B, C, 0.3)
  const tip: Point = [B[0] + 5 * k, B[1] - lift]
  solid(s, p, [A, E, F, C, D])
  solid(s, p, [E, add(lerp(E, tip, 0.5), [-2 * k, -1 * k]), tip, F])
}

/** Three or four rolled drawings standing in a round bin. `at` is the middle of the bin's foot. */
export const paperRolls: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const rolls = [
    [-13, 116, 6, -4],
    [4, 142, 5.5, 2],
    [15, 124, 6, 6],
    [-3, 100, 6.5, -1],
  ].slice(0, r.chance(0.5) ? 3 : 4)
  drum(s, p, P(0, 70), [30 * k, 26 * k, 70 * k, 9 * k], () => {
    for (const [u, v, rad, lean] of rolls as [
      number,
      number,
      number,
      number,
    ][]) {
      const top = P(u + lean + r.signed(), v)
      cylinder(s, p, top, rad * k, 2.4 * k, (v - 62) * k)
    }
  })
}

/** A portfolio lying on the table, tied with string, a label on its cover. `at` is its front-left corner. */
export const folder: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, d] = [150 * k, 104 * k]
  const top = box(s, p, o, at, w, 7 * k, d)
  const label = [
    top.top(0.12, 0.62),
    top.top(0.44, 0.62),
    top.top(0.44, 0.84),
    top.top(0.12, 0.84),
  ]
  solid(s, p, label)
  const l0 = lerp(label[0] as Point, label[3] as Point, 0.5)
  s.stroke(
    p.line(
      add(l0, [4 * k, 0]),
      add(lerp(label[1] as Point, label[2] as Point, 0.5), [-8 * k, 0]),
    ),
  )
  // The string runs round the cover from front to back and ties in a bow near the front edge.
  const u = r.between(0.6, 0.68)
  const knot = top.top(u, 0.26)
  s.stroke(p.path([top.top(u, 0.02), knot, top.top(u + 0.01, 0.98)]))
  for (const side of [-1, 1]) {
    const loop = [
      knot,
      add(knot, [side * 15 * k, -6 * k]),
      add(knot, [side * 17 * k, 2 * k]),
      knot,
    ]
    s.stroke(p.path(loop))
    s.stroke(p.line(knot, add(knot, [side * 9 * k, 11 * k])))
  }
}

/**
 * A printed proof lying flat: crop marks at its corners, a block of type, a picture box and a colour bar of five
 * patches (one washed); a loupe stands on it. `at` is the sheet's front-left corner.
 */
export const proof: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, d] = [150 * k, 112 * k]
  const sheet = flat(at, w, d, o)
  solid(s, p, sheet)
  const [A, B, C, D] = sheet as [Point, Point, Point, Point]
  const on = (u: number, v: number): Point => add(lerp(A, B, u), o, d * v)
  // Crop marks just outside each corner, along both edges.
  const m = 7 * k
  for (const [c, ex, ey] of [
    [A, -1, 1],
    [B, 1, 1],
    [C, 1, -1],
    [D, -1, -1],
  ] as [Point, number, number][]) {
    s.stroke(p.line(add(c, [ex * 3 * k, 0]), add(c, [ex * (3 * k + m), 0])))
    s.stroke(p.line(add(c, o, -ey * 6 * k), add(c, o, -ey * (6 * k + m * 1.6))))
  }
  solid(s, p, [on(0.1, 0.5), on(0.46, 0.5), on(0.46, 0.86), on(0.1, 0.86)])
  s.stroke(p.line(on(0.12, 0.54), on(0.44, 0.82)))
  for (let i = 0; i < 4; i++) {
    const v = 0.8 - i * 0.09
    s.stroke(p.line(on(0.56, v), on(i === 3 ? 0.76 : 0.9, v)))
  }
  const washed = Math.floor(r.between(0, 4.99))
  for (let i = 0; i < 5; i++) {
    const u0 = 0.1 + i * 0.075
    const patch = [
      on(u0, 0.12),
      on(u0 + 0.075, 0.12),
      on(u0 + 0.075, 0.25),
      on(u0, 0.25),
    ]
    if (i === washed) s.wash(p.shape(patch))
    s.stroke(p.shape(patch))
  }
  // The loupe: a short clear cylinder on the right of the sheet.
  const c = on(r.between(0.7, 0.76), 0.3)
  const lens = cylinder(s, p, add(c, [0, -14 * k]), 17 * k, 6 * k, 14 * k)
  s.stroke(p.disc(lens.top, [11 * k, 0], [0, 3.8 * k]))
}

/**
 * A pinboard of scraps on the wall: a photo, a swatch, notes and a torn page, a string between two pins. `w` and `h`
 * size the board; the pins are the ink. `at` is its bottom-left corner.
 */
export const moodBoard: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { w = 170, h = 120 } = {},
) => {
  const o = depth(r)
  const [W, H] = [(w as number) * k, (h as number) * k]
  box(s, p, o, at, W, H, 6 * k)
  const P = (u: number, v: number): Point => [at[0] + u * W, at[1] - v * H]
  const pins: Point[] = []
  const scrap = (
    u: number,
    v: number,
    sw: number,
    sh: number,
    a: number,
    inside: (q: (x: number, y: number) => Point) => void,
  ) => {
    const c = P(u, v)
    const q = (x: number, y: number): Point =>
      turn([c[0] + x * sw * k, c[1] - y * sh * k], c, a)
    solid(s, p, [q(-0.5, -0.5), q(0.5, -0.5), q(0.5, 0.5), q(-0.5, 0.5)])
    inside(q)
    pins.push(q(0, 0.4))
  }
  const tilt = () => r.signed() * 5
  scrap(0.24, 0.62, 52, 40, tilt(), (q) => {
    // A photo: a frame inside and a line of hills.
    s.stroke(
      p.path([
        q(-0.4, -0.3),
        q(-0.15, 0.05),
        q(0.05, -0.12),
        q(0.25, 0.15),
        q(0.4, -0.05),
      ]),
    )
  })
  scrap(0.62, 0.7, 40, 30, tilt(), (q) => {
    scribble(s, p, r, q(-0.38, 0.1)[0], q(-0.38, 0.1)[1], 30 * k, 2, 7 * k)
  })
  scrap(0.42, 0.26, 34, 34, tilt(), (q) => {
    s.stroke(p.line(q(-0.5, -0.1), q(0.5, -0.1)))
  })
  scrap(0.8, 0.3, 30, 44, tilt(), (q) => {
    scribble(s, p, r, q(-0.34, 0.2)[0], q(-0.34, 0.2)[1], 18 * k, 3, 7 * k)
  })
  // The string from the photo's pin to the torn page's, sagging a little.
  const [a, b] = [pins[0] as Point, pins[3] as Point]
  const mid = add(lerp(a, b, 0.5), [0, 10 * k])
  s.stroke(p.path([a, lerp(a, mid, 0.6), mid, lerp(mid, b, 0.4), b]))
  for (const pin of pins) s.fill(p.disc(pin, [3 * k, 0], [0, 3 * k]))
}

const T = objectsIn("studio")
define(
  T("paper-stack", "Stack of paper", [180, 112], [26, 98], 1, paperStack, [
    "paper",
    "deliverables",
  ]),
  T("paper-rolls", "Rolled drawings", [114, 194], [57, 180], 1, paperRolls, [
    "paper",
    "plans",
    "archive",
  ]),
  T("folder", "Portfolio", [236, 136], [20, 120], 1, folder, [
    "paper",
    "project",
    "case study",
  ]),
  T("proof", "Proof", [256, 150], [30, 126], 1, proof, ["paper", "print"]),
  T("mood-board", "Mood board", [220, 170], [14, 152], 1, moodBoard, [
    "paper",
    "strategy",
    "research",
  ]),
)
