// Studio: the freelancer's gear around the screens. `at` is bottom-left unless a function says otherwise.
// Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import {
  add,
  deg,
  dist,
  dot,
  lerp,
  roundRect,
  times,
  type Point,
} from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { banded, box } from "../shapes"
import { headphones } from "./parts"

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

/**
 * A drawing tablet face on, a sketch on its screen and its pen drawing the last stroke. The sketch's last stroke runs
 * along the pen, so its end goes on under the pen; the pen is one closed shape with a rounded end and a solid nib.
 */
export const tablet: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = roundRect(x, y - 84 * k, 124 * k, 84 * k, 6 * k)
  s.blank(p.shape(body))
  s.stroke(p.shape(body))
  s.stroke(p.shape(roundRect(x + 8 * k, y - 77 * k, 108 * k, 70 * k, 3 * k)))
  s.fill(p.disc(...dot(P(4, 42), 1 * k)))
  const tip = P(74, 40)
  s.stroke(p.path([P(18, 22), P(33, 46), P(47, 31), P(60, 26), tip]))
  s.stroke(p.ring(P(38, 64), [7 * k, 0], [0, 7 * k]))
  const end = P(130, 96)
  const len = dist(tip, end)
  const along = times([end[0] - tip[0], end[1] - tip[1]], 1 / len)
  const side = times([-along[1], along[0]], 3 * k)
  const cone = lerp(tip, end, 0.1)
  const cap = Array.from({ length: 5 }, (_, i) => {
    const t = ((i + 1) * Math.PI) / 6
    return add(add(end, side, Math.cos(t)), along, 3 * k * Math.sin(t))
  })
  const stylus = [
    tip,
    add(cone, side),
    add(end, side),
    ...cap,
    add(end, side, -1),
    add(cone, side, -1),
  ]
  s.blank(p.shape(stylus))
  s.stroke(p.shape(stylus))
  const nib = lerp(tip, end, 0.05)
  s.fill(p.shape([tip, add(nib, side, 0.5), add(nib, side, -0.5)]))
}

/**
 * A camera face on: the body is cut across by its top band (one closed stroke) above the grip (one run), the prism and
 * the shutter button stand on top with their feet hidden in the body, and the lens covers the band where they meet.
 */
export const camera: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  s.stroke(p.path([P(10, 55), P(18, 68), P(40, 68), P(48, 55)]))
  s.stroke(p.shape(roundRect(x + 70 * k, y - 63 * k, 12 * k, 9 * k, 1.5 * k)))
  s.blank(p.shape(roundRect(x, y - 58 * k, 96 * k, 58 * k, 5 * k)))
  banded(s, p, x, y - 58 * k, 96 * k, 58 * k, 5 * k, 14 * k)
  s.stroke(p.shape(roundRect(x + 74 * k, y - 55 * k, 14 * k, 8 * k, 2 * k)))
  const lens = P(50, 26)
  s.blank(p.disc(...dot(lens, 22 * k)))
  s.stroke(p.ring(...dot(lens, 22 * k)))
  s.stroke(p.ring(...dot(lens, 15 * k)))
  s.fill(p.disc(...dot(lens, 9 * k)))
  s.paper(p.disc(...dot(add(lens, [-3 * k, -3 * k]), 2 * k)))
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
