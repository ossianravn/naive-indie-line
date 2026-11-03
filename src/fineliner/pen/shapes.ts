// Shapes every object builds from: the oblique box, the upright cylinder, a cup's handle and lines of scribbled
// text. Objects take their own depth angle from the seed, so neighbours disagree a little about perspective.
import { add, arc, deg, lerp, type Point } from "./geometry"
import type { Stream } from "./seed"
import type { Sheet } from "./layers"
import type { Pen } from "./stroke"

/** Where "back" is for one object: up and to the right, at a seeded angle and depth. */
export function depth(r: Stream): Point {
  const a = (30 + r.signed() * 12) * deg
  const f = 0.5 + r.signed() * 0.1
  return [Math.cos(a) * f, -Math.sin(a) * f]
}

export interface Box {
  w: number
  d: number
  o: Point
  /** A point on the front face: u runs left to right, v bottom to top. */
  front(u: number, v: number): Point
  /** A point on the top face: u runs left to right, v front to back. */
  top(u: number, v: number): Point
}

/** An oblique box: front face w × h with its bottom-left corner at `at`, receding d along `o`. */
export function box(
  s: Sheet,
  p: Pen,
  o: Point,
  at: Point,
  w: number,
  h: number,
  d: number,
): Box {
  const [x, y] = at
  const A: Point = [x, y]
  const B: Point = [x + w, y]
  const C: Point = [x + w, y - h]
  const D: Point = [x, y - h]
  const back = (q: Point) => add(q, o, d)
  const [B2, C2, D2] = [back(B), back(C), back(D)]
  s.blank(p.shape([A, B, B2, C2, D2, D]))
  s.stroke(p.edges([A, B, C, D]))
  s.stroke(p.edges([D, D2, C2, C], false))
  s.stroke(p.edges([C2, B2, B], false))
  return {
    w,
    d,
    o,
    front: (u, v) => [x + w * u, y - h * v],
    top: (u, v) => add(lerp(D, C, u), o, d * v),
  }
}

/**
 * A padded box, as an armchair's arm, back or cushion: an oblique box whose front face has rounded top corners, so its
 * top rolls over instead of meeting the front at an edge. Same arguments as `box`, plus the corners' radius.
 */
export function pad(
  s: Sheet,
  p: Pen,
  o: Point,
  at: Point,
  w: number,
  h: number,
  d: number,
  rad: number,
): Box {
  const [x, y] = at
  const back = (q: Point) => add(q, o, d)
  const left: Point = [x + rad, y - h + rad]
  const right: Point = [x + w - rad, y - h + rad]
  // Where a line along `o` grazes the top-left roll: the left edge of the top.
  const len = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1
  const graze = Math.atan2(-o[0] / len, o[1] / len) / deg + 360
  const tangent = arc(left, rad, rad, graze, graze, 1)[0] as Point
  const front: Point[] = [
    [x, y],
    ...arc(left, rad, rad, 180, 270, 6),
    ...arc(right, rad, rad, 270, 360, 6),
    [x + w, y],
  ]
  const rim = (
    [
      ...arc(left, rad, rad, graze, 270, 4),
      ...arc(right, rad, rad, 270, 360, 6),
      [x + w, y],
    ] as Point[]
  ).map(back)
  s.blank(
    p.shape([
      [x, y],
      ...arc(left, rad, rad, 180, graze, 4),
      ...rim,
      [x + w, y],
    ]),
  )
  s.stroke(p.path(front))
  s.stroke(p.line([x, y], [x + w, y]))
  s.stroke(p.path(rim))
  s.stroke(p.line(tangent, back(tangent)))
  s.stroke(p.line([x + w, y], back([x + w, y])))
  return {
    w,
    d,
    o,
    front: (u, v) => [x + w * u, y - h * v],
    top: (u, v) => add([x + rad + (w - 2 * rad) * u, y - h], o, d * v),
  }
}

/** An upright cylinder seen from a little above: `c` is the centre of its top. Returns its rims. */
export function cylinder(
  s: Sheet,
  p: Pen,
  c: Point,
  rx: number,
  ry: number,
  h: number,
) {
  const bottom: Point = [c[0], c[1] + h]
  s.blank(
    p.shape([
      ...arc(c, rx, ry, 180, 360, 12),
      ...arc(bottom, rx, ry, 0, 180, 12),
    ]),
  )
  s.stroke(p.ring(c, [rx, 0], [0, ry]))
  s.stroke(p.line([c[0] - rx, c[1]], [c[0] - rx, bottom[1]]))
  s.stroke(p.line([c[0] + rx, c[1]], [c[0] + rx, bottom[1]]))
  s.stroke(p.path(arc(bottom, rx, ry, 0, 180, 12)))
  return { top: c, bottom }
}

/** A handle on the side of a cup or jug, from y0 to y1 at x, bulging by `reach`. */
export function handle(
  s: Sheet,
  p: Pen,
  x: number,
  y0: number,
  y1: number,
  reach: number,
) {
  s.stroke(p.path(arc([x, (y0 + y1) / 2], reach, (y1 - y0) / 2, -90, 90, 10)))
}

/** Short wavy lines of text, for menus, notes and screens. */
export function scribble(
  s: Sheet,
  p: Pen,
  r: Stream,
  x: number,
  y: number,
  w: number,
  lines: number,
  gap = 7,
) {
  for (let i = 0; i < lines; i++) {
    const len =
      w * (i === lines - 1 ? r.between(0.35, 0.7) : r.between(0.75, 1))
    const pts = Array.from({ length: 6 }, (_, j): Point => [
      x + (len * j) / 5,
      y + i * gap + (j % 2 ? 0.8 : -0.8),
    ])
    s.stroke(p.path(pts))
  }
}
