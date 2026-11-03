// Studio: the freelancer's gear around the screens. `at` is bottom-left unless a function says otherwise.
// Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import {
  add,
  arc,
  deg,
  lerp,
  rect,
  roundRect,
  times,
  type Point,
} from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box } from "../shapes"

/** Key widths per row, front (space bar) to back, in key units; every row is 10 units. Few, large keys, so the
 * keyboard still reads as one at the size of a library tile. */
const ROWS = [
  [1.5, 7, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 2.25],
  [1.25, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

/**
 * A keyboard seen from above at three quarters, its keys in rows with a space bar, and a mouse to its right whose
 * cable curves back into the keyboard. Seen steeper than most objects, so the rows of keys have room. Keys are
 * closed shapes, which the pen does not overshoot, so small keys stay clean.
 */
export const keyboard: Draw = (s, p, r, at, k = 1) => {
  const a = (58 + r.signed() * 5) * deg
  const o: Point = [Math.cos(a) * 0.7, -Math.sin(a) * 0.7]
  const [x, y] = at
  const [w, h, d] = [120 * k, 6 * k, 62 * k]
  const base = add([x + w + 20 * k, y], o, d * 0.4)
  const [u, v]: [Point, Point] = [
    [8 * k, 0],
    [o[0] * 18 * k, o[1] * 18 * k],
  ]
  const top = add(base, [0, -6 * k])
  const tail = add(top, v)
  const plug = add([x + w * 0.88, y - h], o, d)
  s.stroke(
    p.path(
      Array.from({ length: 13 }, (_, i) => {
        const t = i / 12
        const [c0, c1, c2] = [
          (1 - t) * (1 - t) * (1 - t),
          3 * t * (1 - t),
          t * t * t,
        ]
        const q1 = add(tail, o, 18 * k)
        const q2 = add(plug, o, 14 * k)
        return [
          c0 * tail[0] + c1 * ((1 - t) * q1[0] + t * q2[0]) + c2 * plug[0],
          c0 * tail[1] + c1 * ((1 - t) * q1[1] + t * q2[1]) + c2 * plug[1],
        ] as Point
      }),
    ),
  )
  const b = box(s, p, o, at, w, h, d)
  ROWS.forEach((row, i) => {
    const [v0, v1] = [0.08 + i * 0.21, 0.08 + i * 0.21 + 0.16]
    let u0 = 0.04
    for (const units of row) {
      const u1 = u0 + (units * 0.92) / 10
      const key = [b.top(u0 + 0.008, v0), b.top(u1 - 0.008, v0)]
      s.stroke(p.shape([...key, b.top(u1 - 0.008, v1), b.top(u0 + 0.008, v1)]))
      u0 = u1
    }
  })
  // The mouse: its shell, and below it the front half of its base joined to the shell at both sides in one stroke.
  const side = Math.atan2(v[0], u[0])
  const rim = add(times(u, Math.cos(side)), v, Math.sin(side))
  const skirt = [
    add(top, rim, -1),
    ...p.round(base, u, v, side + Math.PI, Math.PI),
    add(top, rim),
  ]
  s.blank(p.shape(skirt))
  s.stroke(p.path(skirt))
  s.blank(p.disc(top, u, v))
  s.stroke(p.ring(top, u, v))
  s.fill(p.disc(add(top, v, -0.45), [1.3 * k, 0], times(o, 4 * k)))
}

/** A drawing tablet with a sketch on it and its pen lying across. */
export const tablet: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = rect(x, y - 84 * k, 124 * k, 84 * k)
  s.blank(p.shape(body))
  s.stroke(p.edges(body))
  s.stroke(p.edges([P(7, 77), P(117, 77), P(117, 7), P(7, 7)]))
  s.stroke(p.path([P(16, 22), P(36, 46), P(52, 30), P(70, 52), P(92, 26)]))
  s.stroke(p.ring(P(92, 60), [7 * k, 0], [0, 7 * k]))
  const tip = P(70, 40)
  const end = P(132, 96)
  const side: Point = [3 * k, 0]
  const stylus = [
    add(tip, [0, 0]),
    add(lerp(tip, end, 0.12), side),
    add(end, side),
    add(end, side, -1),
    add(lerp(tip, end, 0.12), side, -1),
  ]
  s.blank(p.shape(stylus))
  s.stroke(p.path([...stylus, stylus[0] as Point]))
  s.fill(
    p.shape([
      tip,
      add(lerp(tip, end, 0.06), [1.5 * k, 0]),
      add(lerp(tip, end, 0.06), [-1.5 * k, 0]),
    ]),
  )
}

/** Over-ear headphones; `at` is bottom-centre. */
export const headphones: Draw = (s, p, _r, at, k = 1) => {
  const c: Point = [at[0], at[1] - 34 * k]
  s.stroke(p.path(arc(c, 40 * k, 44 * k, 195, 345, 18)))
  s.stroke(p.path(arc(c, 34 * k, 38 * k, 198, 342, 18)))
  for (const side of [-1, 1]) {
    const cup = add(c, [side * 39 * k, 14 * k])
    s.blank(p.disc(cup, [10 * k, 0], [0, 17 * k]))
    s.stroke(p.ring(cup, [10 * k, 0], [0, 17 * k]))
    s.fill(p.disc(add(cup, [side * 3 * k, 0]), [5 * k, 0], [0, 12 * k]))
  }
}

export const camera: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  s.stroke(p.edges([P(12, 58), P(18, 68), P(40, 68), P(46, 58)], false))
  s.stroke(p.edges(rect(x + 70 * k, y - 63 * k, 12 * k, 5 * k)))
  const body = roundRect(x, y - 58 * k, 96 * k, 58 * k, 5 * k)
  s.blank(p.shape(body))
  s.stroke(p.shape(body))
  s.stroke(p.line(P(0, 44), P(96, 44)))
  const lens = P(50, 26)
  s.stroke(p.ring(lens, [22 * k, 0], [0, 22 * k]))
  s.stroke(p.ring(lens, [15 * k, 0], [0, 15 * k]))
  s.fill(p.disc(lens, [9 * k, 0], [0, 9 * k]))
  s.paper(p.disc(add(lens, [-3 * k, -3 * k]), [2 * k, 0], [0, 2 * k]))
  s.stroke(p.edges(rect(x + 76 * k, y - 40 * k, 12 * k, 8 * k)))
}

const T = objectsIn("studio")

define(
  T("keyboard", "Keyboard and mouse", [250, 112], [14, 98], 1.38, keyboard, [
    "work",
    "computer",
    "typing",
  ]),
  T("tablet", "Tablet and pen", [160, 120], [10, 112], 1, tablet, [
    "design",
    "drawing",
    "sketch",
  ]),
  T("headphones", "Headphones", [120, 90], [60, 80], 1, headphones, [
    "music",
    "focus",
    "call",
  ]),
  T("camera", "Camera", [120, 90], [12, 82], 1, camera, [
    "photo",
    "travel",
    "content",
  ]),
)
