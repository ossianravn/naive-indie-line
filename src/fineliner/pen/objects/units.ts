// Drawing in an object's own units, for the bistro and food collections: u runs right and v up from where the object
// stands, ovals are placed the same way, and a rim can take a line's ends round its back so they don't poke out.
import { arc, type Point } from "../geometry"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"

export type Map = (u: number, v: number) => Point
export type Oval = [u: number, v: number, rx: number, ry: number]

/** Places an object's units on the sheet. */
export const place =
  ([x, y]: Point, k: number): Map =>
  (u, v) => [x + u * k, y - v * k]

/** Points round an oval, placed by P: 0 degrees is right, 90 is down. */
export const ell = (P: Map, o: Oval, a: number, b: number, n = 10) =>
  arc([0, 0], o[2], o[3], a, b, n).map(([du, dv]) => P(o[0] + du, o[1] - dv))

/** Points from a flat list of u, v pairs, placed by P. */
export const pts = (P: Map, uv: number[]) =>
  uv.filter((_, i) => i % 2 === 0).map((u, i) => P(u, uv[2 * i + 1] ?? 0))

/** A symmetric outline from its right half (u, v pairs, bottom to top): up the left side and down the right. */
export const sym = (P: Map, uv: number[]) => [
  ...pts((u, v) => P(-u, v), uv),
  ...pts(P, uv).reverse(),
]

/** A run between a rim's two ends, carried a step round its back at both, so the pen's run-on follows the rim. */
export const tuck = (P: Map, o: Oval, run: Point[]) => [
  ...ell(P, o, 205, 180, 2).slice(0, -1),
  ...run,
  ...ell(P, o, 360, 335, 2).slice(1),
]

/** A closed outline in one stroke that hides what is behind it. */
export function outline(s: Sheet, p: Pen, q: Point[]) {
  s.blank(p.shape(q))
  s.stroke(p.shape(q))
}

/** A disc t thick, as a saucer, a plate or a table top: its outline, and the front of its top tucked into it. */
export function slab(s: Sheet, p: Pen, P: Map, o: Oval, t: number) {
  const below: Oval = [o[0], o[1] - t, o[2], o[3]]
  outline(s, p, [...ell(P, o, 180, 360, 16), ...ell(P, below, 0, 180, 16)])
  s.stroke(p.path(tuck(P, o, ell(P, o, 180, 0, 16))))
}
