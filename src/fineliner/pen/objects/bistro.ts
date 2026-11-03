// Food & drink: a bistro's table for two, from the wine to the lamp above it. `at` is bottom-centre unless a
// function says otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts
// are drawn in the object's own units (`units.ts`).
import { dot } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import {
  ell,
  outline,
  place,
  pts,
  slab,
  sym,
  tuck,
  type Map,
  type Oval,
} from "./units"

const BOTTLE = [
  11, 3, 11, 63, 10.4, 69, 8.4, 75, 7, 81, 4.4, 85.5, 3.8, 89, 3.8, 111, 4.2,
  112,
]

/** A wine bottle in one outline, with round shoulders, a foil capsule and a label that follows the glass. */
export const bottle: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const h = 10 + r.next() * 2
  // The body is h wide; shoulders, neck and lip keep their size.
  const B: Map = (u, v) => P(v < 76 ? (u * h) / 11 : u, v)
  outline(s, p, [
    ...sym(B, BOTTLE),
    ...ell(P, [0, 3, h, 3], 0, 180, 10).slice(1, -1),
  ])
  s.fill(
    p.shape([
      ...ell(P, [0, 98, 4.2, 1], 180, 0, 6),
      ...pts(P, [4.2, 112.5, -4.2, 112.5]),
    ]),
  )
  const w = h - 2.5
  s.stroke(
    p.shape([
      ...ell(P, [0, 19.6, w, 1.6], 180, 0, 8),
      ...ell(P, [0, 51.6, w, 1.6], 0, 180, 8),
    ]),
  )
  s.stroke(p.ring(...dot(P(0, 39), 4.2 * k)))
  s.stroke(p.line(P(-4, 27), P(4, 27)))
}

/**
 * A wine glass, poured unless `wine` is false. The bowl is one run from the rim round to it again; the stem's foot is
 * hidden under the front of the foot, so the stem stands on it.
 */
export const glass: Draw = (s, p, _r, at, k = 1, { wine = true } = {}) => {
  const P = place(at, k)
  const rim: Oval = [0, 56, 11, 2.6]
  s.stroke(p.line(P(0, 3), P(0, 27)))
  s.blank(p.shape(ell(P, [0, 2, 11, 2.6], 180, 0, 8)))
  s.stroke(p.ring(P(0, 2), [11 * k, 0], [0, 2.6 * k]))
  const bowl = ell(P, [0, 44, 14, 20], 180, 0, 16)
  const sides = [
    ...sym(P, [11, 56, 13.2, 50.5]).slice(0, 2),
    ...bowl,
    ...sym(P, [11, 56, 13.2, 50.5]).slice(2),
  ]
  s.blank(p.shape([...sides, ...ell(P, rim, 360, 180, 8).slice(1, -1)]))
  const level = ell(P, [0, 36, 12.8, 2.4], 360, 180, 8)
  if (wine) s.fill(p.shape([...ell(P, [0, 44, 14, 20], 156, 24, 12), ...level]))
  s.stroke(p.path(tuck(P, rim, sides)))
  s.stroke(p.ring(P(0, 56), [11 * k, 0], [0, 2.6 * k]))
}

/** A round-bellied carafe, half full, its neck rising into a lipped mouth. */
export const carafe: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  const mouth: Oval = [0, 94, 7, 2]
  const neck = sym(P, [6.4, 66.5, 6, 72, 6, 91, 7, 94])
  const sides = [
    ...neck.slice(0, 4).reverse(),
    ...ell(P, [0, 32, 24, 31], 253, -73, 28),
    ...neck.slice(4).reverse(),
  ]
  s.blank(p.shape([...sides, ...ell(P, mouth, 360, 180, 8).slice(1, -1)]))
  const level = ell(P, [0, 30, 23, 3.6], 360, 180, 12)
  s.wash(p.shape([...ell(P, [0, 32, 23.2, 30.2], 176, 4, 16), ...level]))
  s.stroke(p.path(tuck(P, mouth, sides)))
  s.stroke(p.ring(P(0, 94), [7 * k, 0], [0, 2 * k]))
}

const COLLAR = [
  -7.5, 58.5, -7.6, 61, -5.6, 62.8, -4.2, 63.2, 0, 62.4, 4.2, 63.2, 5.8, 62.8,
  7.6, 61, 7.2, 58, 6.4, 56.8, 6.2, 50.5, 5.4, 48.8, 4.5, 50.5, 4.4, 56.4, 0,
  56.2, -2.4, 56.3, -2.6, 52.8, -3.4, 51.4, -4.2, 52.8, -4.4, 56.6, -6.6, 57,
]

/**
 * A candle stuck in a bottle. The candle comes first; the collar of wax over the bottle's mouth hides its foot, and two
 * drips run down from the collar in the same stroke.
 */
export const candle: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  const body = sym(P, [15, 2, 15, 36, 13.5, 42, 9, 47, 5.5, 51, 5.5, 60])
  outline(s, p, [...body, ...ell(P, [0, 2, 15, 2.4], 0, 180, 10).slice(1, -1)])
  const top: Oval = [0, 90, 4.2, 1.3]
  outline(s, p, [P(-4.2, 56), ...ell(P, top, 180, 360, 8), P(4.2, 56)])
  s.stroke(p.path(tuck(P, top, ell(P, top, 180, 0, 8))))
  outline(s, p, pts(P, COLLAR))
  s.stroke(p.line(P(0, 90.6), P(0, 95)))
  s.fill(p.shape([...ell(P, [0, 97.4, 2.6, 2.6], 200, -20, 10), P(0.8, 107.5)]))
}

const FORK = [
  7, 92.5, 5.3, 92.5, 5.3, 78, 4.1, 77.4, 2.9, 78, 2.9, 92.5, 1.2, 92.5, 1.2,
  78, 0, 77.4, -1.2, 78, -1.2, 92.5, -2.9, 92.5, -2.9, 78, -4.1, 77.4, -5.3, 78,
  -5.3, 92.5, -7, 92.5, -7, 76, -6.2, 71, -3.6, 67, -1.8, 63, -2.4, 34,
]
const KNIFE = [
  3.4, 44, 2.4, 46.5, 2.6, 50, 3.4, 70, 3.6, 82, 2.8, 89.5, 0.8, 94.5, -1.6, 96,
  -2.6, 94.5, -2.6, 46.5, -3.4, 44,
]

/** A fork and a knife side by side, each drawn round in one stroke: tines, neck, handle; blade, bolster, handle. */
export const cutlery: Draw = (s, p, _r, at, k = 1) => {
  const fork = place([at[0] - 14 * k, at[1]], k)
  const neck = pts(fork, [2.4, 34, 1.8, 63, 3.6, 67, 6.2, 71, 7, 76])
  outline(s, p, [
    ...pts(fork, FORK),
    ...ell(fork, [0, 5, 3.2, 3.2], 180, 0, 6),
    ...neck,
  ])
  const knife = place([at[0] + 14 * k, at[1]], k)
  outline(s, p, [
    ...pts(knife, KNIFE),
    ...ell(knife, [0, 5, 3.4, 3.4], 180, 0, 6),
  ])
}

/** A folded menu card standing on the table, leaning back into its tent, its dishes and prices scribbled. */
export const menuCard: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const a = (32 + r.signed() * 6) * (Math.PI / 180)
  const [du, dv] = [Math.cos(a) * 15, Math.sin(a) * 15]
  // The front leans back half the tent's depth by its top edge, 86 up.
  const L: Map = (u, v) => P(u + (du * v) / 172, v + (dv * v) / 172)
  const front = pts(L, [-30, 0, 30, 0, 30, 86, -30, 86])
  const back = P(30 + du, dv)
  s.blank(p.shape([...front.slice(0, 2), back, ...front.slice(2)]))
  s.stroke(p.shape(front))
  // The side of the tent, turned a little way along the edges it meets, so its run-on retraces them.
  const [bottom, top] = [pts(L, [27, 0, 30, 0]), pts(L, [30, 86, 27, 86])]
  s.stroke(p.path([...bottom, back, ...top]))
  s.stroke(p.ring(L(0, 72), [8 * k, 0], [0, 4 * k]))
  s.stroke(p.line(L(-6, 60), L(6, 60)))
  for (let v = 50; v > 12; v -= 8.6) {
    const len = r.between(18, 30)
    s.stroke(
      p.path(
        Array.from({ length: 6 }, (_, j) =>
          L(j * (len / 5) - 22, v + (j % 2) - 0.5),
        ),
      ),
    )
    s.stroke(p.line(L(15, v), L(22, v)))
  }
}

/** A round table on one leg and a domed foot: `at` is the centre of its foot, and its top is 104 × k above it. */
export const bistroTable: Draw = (s, p, _r, at, k = 1) => {
  const P = place(at, k)
  for (const u of [-2.6, 2.6]) s.stroke(p.line(P(u, 12), P(u, 94)))
  const dome = sym(P, [22, 7.6, 14, 10.4, 7, 13, 3.8, 15.6, 2.6, 18])
  outline(s, p, [...ell(P, [0, 5, 26, 5], 180, 0, 16), ...dome.reverse()])
  slab(s, p, P, [0, 104, 70, 18], 6)
}

/** A pendant lamp hanging from `top` (default 90 above `at`); `at` is the bottom-centre of the shade. */
export const pendant: Draw = (s, p, _r, at, k = 1, { top } = {}) => {
  const P = place(at, k)
  s.stroke(p.line([at[0], top ?? at[1] - 90 * k], P(0, 33)))
  const shade = sym(
    P,
    [23, 4, 17, 10, 11, 17, 7.5, 24, 6, 29, 2.6, 30.5, 2.6, 35],
  )
  s.fill(p.shape([...ell(P, [0, 0, 26, 4.5], 180, 0, 14), ...shade.reverse()]))
  s.stroke(p.path(ell(P, [0, -1.5, 7.5, 7.5], 180, 0, 8)))
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
