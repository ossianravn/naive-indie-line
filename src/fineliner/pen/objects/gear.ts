// Studio: the freelancer's gear around the screens. `at` is bottom-left unless a function says otherwise.
// Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, lerp, rect, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth } from "../shapes"

/** A keyboard with the mouse to its right. */
export const keyboard: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 132 * k, 9 * k, 46 * k)
  for (let row = 0; row < 4; row++) {
    const v = 0.15 + row * 0.22
    for (let u = 0.05; u < 0.93; u += 0.075)
      s.stroke(p.line(b.top(u, v), b.top(u + 0.045, v)))
  }
  const m: Point = [at[0] + 160 * k, at[1] - 10 * k]
  s.blank(p.disc(m, [12 * k, 0], [0, 8 * k]))
  s.stroke(p.ring(m, [12 * k, 0], [0, 8 * k]))
  s.stroke(p.line(add(m, [-10 * k, -1 * k]), add(m, [0, -1 * k])))
  s.stroke(
    p.path([
      add(m, [-11 * k, -4 * k]),
      add(m, [-18 * k, -16 * k]),
      add(m, [-28 * k, -18 * k]),
    ]),
  )
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
  const body = [
    P(4, 0),
    P(92, 0),
    P(96, 4),
    P(96, 54),
    P(92, 58),
    P(4, 58),
    P(0, 54),
    P(0, 4),
  ]
  s.blank(p.shape(body))
  s.stroke(p.edges(body))
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
  T("keyboard", "Keyboard and mouse", [190, 76], [10, 66], 1, keyboard, [
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
