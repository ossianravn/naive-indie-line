// Everyday: the street outside a building: its front door, a sign on a bracket and a bicycle on its stand.
// Each function draws one object; `at` is its anchor and `k` its scale. Composition comes from `r`, never the pen.
// The door and the sign are seen straight on, the bicycle in profile, as a bicycle reads best.
import { add, lerp, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, depth } from "../shapes"
import type { Bounds } from "../path"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A rectangle from its corners, left, top, right and bottom. */
const rect = (l: number, t: number, r: number, b: number): Point[] => [
  [l, t],
  [r, t],
  [r, b],
  [l, b],
]

/**
 * A front door straight on, in its frame over a stone step: a glazed upper panel, a plain lower one, a knob, the bell
 * on the frame and the letterbox, which is the ink. `at` is the middle of the step's foot.
 */
export const streetDoor: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [W, H] = [76 * k, 168 * k]
  const step = 12 * k
  box(s, p, o, [x - W / 2 - 12 * k, y], W + 24 * k, step, 14 * k)
  const l = x - W / 2
  const t = y - step - H
  solid(s, p, rect(l - 9 * k, t - 9 * k, l + W + 9 * k, y - step))
  solid(s, p, rect(l, t, l + W, y - step))
  const glass = rect(l + 12 * k, t + 12 * k, l + W - 12 * k, t + 74 * k)
  solid(s, p, glass)
  const mid = x + r.signed() * 0.5 * k
  s.stroke(p.line([mid, t + 13 * k], [mid, t + 73 * k]))
  s.stroke(p.line([l + 13 * k, t + 43 * k], [l + W - 13 * k, t + 43 * k]))
  solid(s, p, rect(l + 12 * k, t + 92 * k, l + W - 12 * k, y - step - 14 * k))
  s.fill(p.shape(rect(x - 15 * k, t + 82 * k, x + 15 * k, t + 86.5 * k)))
  const knob: Point = [l + W - 10 * k, t + 96 * k]
  s.blank(p.disc(knob, [4 * k, 0], [0, 4 * k]))
  s.stroke(p.disc(knob, [4 * k, 0], [0, 4 * k]))
  const bell: Point = [l + W + 4.5 * k, t + 70 * k]
  s.stroke(p.disc(bell, [2.6 * k, 0], [0, 2.6 * k]))
}

/**
 * A blank board hanging from a wall bracket by two short rods, for a page to letter. `w` and `h` size the board; `at`
 * is where the bracket meets the wall (the board hangs to its right). The board's face is what a scene addresses.
 */
export const hangingSign: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { w = 110, h = 62 } = {},
) => {
  const o = depth(r)
  const [W, H] = [(w as number) * k, (h as number) * k]
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] + v * k]
  const reach = (w as number) + 26
  solid(s, p, rect(at[0] - 5 * k, at[1] - 10 * k, at[0], at[1] + 40 * k))
  solid(s, p, [P(0, -3), P(reach, -3), P(reach, 2), P(0, 2)])
  s.stroke(p.path([P(0, 34), P(reach * 0.32, 2.5)]))
  s.fill(p.disc(P(reach - 1, -0.5), [3 * k, 0], [0, 3 * k]))
  const l = at[0] + 13 * k
  const top = at[1] + 20 * k
  for (const u of [0.15, 0.85]) {
    const hx = l + W * u
    s.stroke(p.line([hx, at[1] + 3 * k], [hx, top]))
  }
  box(s, p, o, [l, top + H], W, H, 5 * k)
  return { board: [l, top, l + W, top + H] as Bounds }
}

/**
 * A city bicycle in profile on its kickstand: a step-through frame, a few spokes in each wheel, a basket on the front
 * rack and a solid saddle (the ink). `at` is where the rear wheel meets the ground.
 */
export const bicycle: Draw = (s, p, r, at, k = 1) => {
  const R = 36 * k
  const rear: Point = [at[0], at[1] - R]
  const front: Point = [at[0] + 118 * k, at[1] - R]
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const bb = P(50, 26)
  const seatTop = P(30, 94)
  const head = P(100, 92)
  const turnSpokes = r.next() * 60
  for (const c of [rear, front]) {
    s.stroke(p.disc(c, [R, 0], [0, R]))
    s.stroke(p.disc(c, [R - 4 * k, 0], [0, R - 4 * k]))
    for (let i = 0; i < 4; i++) {
      const a = (turnSpokes + i * 45 + (c === front ? 20 : 0)) * (Math.PI / 180)
      const d: Point = [Math.cos(a) * (R - 5 * k), Math.sin(a) * (R - 5 * k)]
      s.stroke(p.line(add(c, d), add(c, d, -1)))
    }
    s.fill(p.disc(c, [2.6 * k, 0], [0, 2.6 * k]))
  }
  // The kickstand down and back from the bottom bracket.
  s.stroke(p.line(bb, P(36, 0)))
  // Frame: chain and seat stays to the rear hub, a low curved down tube for stepping through, the seat tube.
  s.stroke(p.path([rear, bb, P(54, 42), P(72, 64), head]))
  s.stroke(p.line(rear, lerp(seatTop, bb, 0.18)))
  s.stroke(p.line(lerp(seatTop, bb, 0.02), bb))
  s.stroke(p.line(head, front))
  s.stroke(p.disc(bb, [8 * k, 0], [0, 8 * k]))
  s.stroke(p.line(add(bb, [-3 * k, 7 * k]), add(bb, [-8 * k, 17 * k])))
  s.stroke(p.line(add(bb, [-14 * k, 17 * k]), add(bb, [-2 * k, 17 * k])))
  // Handlebar sweeping back from the stem; the saddle on its post.
  s.stroke(p.path([head, P(98, 108), P(88, 113), P(77, 110)]))
  const saddle = [P(18, 99), P(40, 101), P(42, 98), P(30, 95), P(18, 96)]
  s.stroke(p.line(seatTop, P(30, 96)))
  s.fill(p.shape(saddle))
  // The basket on its rack over the front wheel.
  const rackY = 72
  s.stroke(p.line(P(112, rackY), add(front, [0, -2 * k])))
  const basket = rect(
    at[0] + 104 * k,
    at[1] - (rackY + 26) * k,
    at[0] + 146 * k,
    at[1] - rackY * k,
  )
  solid(s, p, basket)
  for (const u of [0.33, 0.66])
    s.stroke(
      p.line(
        lerp(basket[0] as Point, basket[1] as Point, u),
        lerp(basket[3] as Point, basket[2] as Point, u),
      ),
    )
  s.stroke(
    p.line(
      lerp(basket[0] as Point, basket[3] as Point, 0.5),
      lerp(basket[1] as Point, basket[2] as Point, 0.5),
    ),
  )
}

/** A small bird standing in profile, facing right: the eye and the beak are the ink. `at` is between its feet. */
export const bird: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const tilt = r.between(-4, 4)
  for (const u of [-3, 3]) {
    s.stroke(p.line(P(u, 9), P(u + 1, 0)))
    s.stroke(p.line(P(u + 1, 0.5), P(u + 5, 0.5)))
  }
  // Tail, body and head in one outline, the head a little up and forward.
  const body = [
    P(-24, 20 + tilt * 0.3),
    P(-10, 14),
    P(4, 8),
    P(14, 12),
    P(18, 21),
    P(17, 28 + tilt * 0.2),
    P(12, 33),
    P(5, 32),
    P(1, 26),
    P(-8, 22),
    P(-23, 24 + tilt * 0.3),
  ]
  s.blank(p.shape(body))
  s.stroke(p.shape(body))
  s.stroke(p.path([P(-6, 20), P(2, 15), P(9, 16)]))
  s.fill(p.shape([P(17.5, 27), P(25, 25), P(17.5, 23)]))
  s.fill(p.disc(P(11, 26.5), [1.4 * k, 0], [0, 1.4 * k]))
}

const T = objectsIn("everyday")
define(
  T("street-door", "Front door", [130, 220], [65, 210], 1, streetDoor, [
    "arrival",
    "contact",
    "street",
  ]),
  T("hanging-sign", "Hanging sign", [170, 120], [16, 18], 1, hangingSign, [
    "sign",
    "shop",
    "street",
  ]),
  T("bird", "Bird", [84, 64], [36, 56], 1, bird, [
    "animal",
    "outside",
    "small",
  ]),
  T("bicycle", "Bicycle", [230, 140], [44, 130], 1, bicycle, [
    "street",
    "delivery",
    "city",
  ]),
)
