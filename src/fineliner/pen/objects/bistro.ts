// Food & drink: a bistro's table for two, from the wine to the lamp above it. `at` is bottom-centre unless a
// function says otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { scribble } from "../shapes"

export const bottle: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const half = 10 + r.next() * 2
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const outline = [
    P(-half, 0),
    P(-half, 66),
    P(-half + 2, 76),
    P(-3.6, 86),
    P(-3.6, 112),
    P(3.6, 112),
    P(3.6, 86),
    P(half - 2, 76),
    P(half, 66),
    P(half, 0),
  ]
  s.blank(p.shape(outline))
  s.stroke(p.path([...outline, outline[0] as Point]))
  s.fill(p.shape([P(-4, 98), P(4, 98), P(4, 112), P(-4, 112)]))
  s.stroke(
    p.edges([
      P(-half + 2.5, 18),
      P(half - 2.5, 18),
      P(half - 2.5, 48),
      P(-half + 2.5, 48),
    ]),
  )
  s.stroke(p.ring(...dot(P(0, 33), 4 * k)))
}

/** A wine glass, poured unless `wine` is false. */
export const glass: Draw = (s, p, _r, at, k = 1, { wine = true } = {}) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  s.stroke(p.ring(P(0, 1.5), [11 * k, 0], [0, 2.5 * k]))
  s.stroke(p.line(P(0, 2), P(0, 26)))
  const bowl = arc([0, 44], 14, 20, 180, 360, 14).map(([u, v]) => P(u, v))
  const rim = [P(-11, 56), ...bowl, P(11, 56)]
  s.blank(p.shape(rim))
  if (wine) s.fill(p.shape([...bowl.slice(3, 12), P(12, 37), P(-12, 37)]))
  s.stroke(p.path(rim))
  s.stroke(p.ring(P(0, 56), [11 * k, 0], [0, 2.6 * k]))
}

export const carafe: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = [
    P(-6, 92),
    P(-6, 70),
    ...arc([0, 36], 24, 34, 250, -70, 18).map(([u, v]) => P(u, 72 - v)),
    P(6, 70),
    P(6, 92),
  ]
  s.blank(p.shape(body))
  s.wash(
    p.shape(arc([0, 36], 23, 33, 20, 160, 12).map(([u, v]) => P(u, 72 - v))),
  )
  s.stroke(p.path(body))
  s.stroke(p.ring(P(0, 92), [6 * k, 0], [0, 1.8 * k]))
}

/** A candle stuck in a bottle, with two drips of wax. */
export const candle: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = [
    P(-15, 0),
    P(-15, 38),
    P(-6, 50),
    P(-6, 62),
    P(6, 62),
    P(6, 50),
    P(15, 38),
    P(15, 0),
  ]
  s.blank(p.shape(body))
  s.stroke(p.path([...body, body[0] as Point]))
  s.stroke(p.edges([P(-5, 62), P(5, 62), P(5, 92), P(-5, 92)]))
  const drips: Point[] = [
    [-5, 80],
    [5, 74],
  ]
  for (const [u, v] of drips)
    s.stroke(p.path([P(u, v + 10), P(u + Math.sign(u) * 1.5, v + 4), P(u, v)]))
  s.stroke(p.line(P(0, 92), P(0, 96)))
  s.fill(p.shape([P(0, 97), P(3.4, 103), P(0, 112), P(-3.4, 103)]))
}

export const cutlery: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const fork = (c: Point) => {
    s.stroke(
      p.edges(
        [
          add(c, [-2 * k, 0]),
          add(c, [2 * k, 0]),
          add(c, [2.5 * k, -62 * k]),
          add(c, [-2.5 * k, -62 * k]),
        ],
        false,
      ),
    )
    s.stroke(
      p.path([
        add(c, [-2.5 * k, -62 * k]),
        add(c, [-8 * k, -70 * k]),
        add(c, [-8 * k, -92 * k]),
      ]),
    )
    s.stroke(
      p.path([
        add(c, [2.5 * k, -62 * k]),
        add(c, [8 * k, -70 * k]),
        add(c, [8 * k, -92 * k]),
      ]),
    )
    for (const dx of [-2.6, 2.6])
      s.stroke(p.line(add(c, [dx * k, -72 * k]), add(c, [dx * k, -92 * k])))
  }
  const knife = (c: Point) =>
    s.stroke(
      p.path([
        add(c, [-3 * k, 0]),
        add(c, [-3 * k, -54 * k]),
        add(c, [-4 * k, -94 * k]),
        add(c, [4 * k, -78 * k]),
        add(c, [3 * k, -54 * k]),
        add(c, [3 * k, 0]),
        add(c, [-3 * k, 0]),
      ]),
    )
  fork([x - 14 * k, y])
  knife([x + 14 * k, y])
  s.stroke(p.line([x + 11 * k, y - 54 * k], [x + 17 * k, y - 54 * k]))
}

/** A folded menu card standing on the table, its dishes scribbled. */
export const menuCard: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const face: Point[] = [
    [x - 34 * k, y],
    [x + 34 * k, y],
    [x + 28 * k, y - 96 * k],
    [x - 28 * k, y - 96 * k],
  ]
  s.stroke(p.line([x + 34 * k, y], [x + 46 * k, y - 10 * k]))
  s.stroke(p.line([x + 28 * k, y - 96 * k], [x + 40 * k, y - 104 * k]))
  s.stroke(p.line([x + 46 * k, y - 10 * k], [x + 40 * k, y - 104 * k]))
  s.blank(p.shape(face))
  s.stroke(p.edges(face))
  s.stroke(p.ring([x, y - 80 * k], [10 * k, 0], [0, 5 * k]))
  scribble(s, p, r, x - 20 * k, y - 62 * k, 40 * k, 6, 8 * k)
}

/** A round table on one leg: `at` is the centre of its foot, and its top is 104 × k above it. */
export const bistroTable: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const top: Point = [x, y - 104 * k]
  s.stroke(p.line([x - 2 * k, top[1] + 8 * k], [x - 2 * k, y - 6 * k]))
  s.stroke(p.line([x + 2 * k, top[1] + 8 * k], [x + 2 * k, y - 6 * k]))
  s.stroke(
    p.path([
      [x - 30 * k, y],
      [x - 4 * k, y - 8 * k],
      [x + 4 * k, y - 8 * k],
      [x + 30 * k, y],
    ]),
  )
  s.blank(
    p.shape([
      ...arc(top, 70 * k, 18 * k, 180, 360, 14),
      ...arc(add(top, [0, 6 * k]), 70 * k, 18 * k, 0, 180, 14),
    ]),
  )
  s.stroke(p.ring(top, [70 * k, 0], [0, 18 * k]))
  s.stroke(p.path(arc(add(top, [0, 6 * k]), 70 * k, 18 * k, 0, 180, 14)))
  s.stroke(p.line([x - 70 * k, top[1]], [x - 70 * k, top[1] + 6 * k]))
  s.stroke(p.line([x + 70 * k, top[1]], [x + 70 * k, top[1] + 6 * k]))
}

/** A pendant lamp hanging from `top` (default 60 above the shade); `at` is the bottom-centre of the shade. */
export const pendant: Draw = (s, p, _r, at, k = 1, { top } = {}) => {
  const [x, y] = at
  s.stroke(p.line([x, top ?? y - 90 * k], [x, y - 30 * k]))
  s.fill(
    p.shape([
      [x - 5 * k, y - 30 * k],
      [x + 5 * k, y - 30 * k],
      [x + 26 * k, y],
      [x - 26 * k, y],
    ]),
  )
  s.stroke(p.path(arc([x, y], 8 * k, 7 * k, 0, 180, 8)))
}

const T = objectsIn("food")

define(
  T("bottle", "Wine bottle", [60, 140], [30, 132], 1.05, bottle, [
    "drink",
    "wine",
    "restaurant",
  ]),
  T("glass", "Wine glass", [60, 80], [30, 74], 1.15, glass, [
    "drink",
    "wine",
    "toast",
  ]),
  T("carafe", "Carafe", [70, 120], [35, 112], 1, carafe, [
    "drink",
    "water",
    "restaurant",
  ]),
  T("candle", "Candle", [50, 130], [25, 122], 1, candle, [
    "light",
    "evening",
    "restaurant",
  ]),
  T("cutlery", "Fork and knife", [70, 110], [35, 102], 1, cutlery, [
    "meal",
    "restaurant",
  ]),
  T("menu", "Menu card", [100, 120], [44, 112], 1, menuCard, [
    "restaurant",
    "menu",
    "prices",
  ]),
  T("bistro-table", "Bistro table", [160, 130], [80, 124], 1, bistroTable, [
    "furniture",
    "restaurant",
    "cafe",
  ]),
  T("pendant", "Pendant lamp", [80, 120], [40, 108], 1, pendant, [
    "light",
    "lamp",
    "restaurant",
  ]),
)
