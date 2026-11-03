// Shapes every object builds from: the oblique box, the padded box, a band across a rounded box, a drum seen from
// above, the upright cylinder, a cup's handle, a leafy sprig and lines of scribbled text. Objects take their own
// depth angle from the seed, so neighbours disagree a little about perspective.
import { add, arc, deg, dist, lerp, type Point } from "./geometry"
import type { Stream } from "./seed"
import type { Sheet } from "./layers"
import { HANDS, type Pen } from "./stroke"

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
  // The outline in one closed stroke, then the three inner edges meeting it at C. Their free ends stop short by about
  // half a run-past, so the pen lands on the outline instead of poking through it, as a careful hand draws a box.
  const outline = [A, B, B2, C2, D2, D]
  const tuck = (from: Point, to: Point) =>
    lerp(to, from, (HANDS[p.hand].over * 0.4) / (dist(from, to) || 1))
  s.blank(p.shape(outline))
  s.stroke(p.shape(outline))
  s.stroke(p.path([tuck(C, D), C, tuck(C, C2)]))
  s.stroke(p.line(tuck(B, C), tuck(C, B)))
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
  const roll: Point[] = [
    ...arc(left, rad, rad, graze, 270, 4),
    ...arc(right, rad, rad, 270, 360, 6),
    [x + w, y],
  ]
  // As in `box`: the outline in one closed stroke, then the front's roll and right side as one run that starts on the
  // outline and stops just short of the bottom corner.
  const outline: Point[] = [
    [x, y],
    ...arc(left, rad, rad, 180, graze, 4),
    ...roll.map(back),
    [x + w, y],
  ]
  const end = roll.length - 1
  const pull = (HANDS[p.hand].over * 0.4) / (h - rad || 1)
  roll[end] = lerp(roll[end] as Point, roll[end - 1] as Point, pull)
  s.blank(p.shape(outline))
  s.stroke(p.shape(outline))
  s.stroke(p.path(roll))
  return {
    w,
    d,
    o,
    front: (u, v) => [x + w * u, y - h * v],
    top: (u, v) => add([x + rad + (w - 2 * rad) * u, y - h], o, d * v),
  }
}

/**
 * A rounded rectangle cut across `cut` below its top, as a browser's tab bar or a camera's top: the band above the cut
 * in one closed stroke, the rest in one run whose ends carry on up the band's sides, so the cut meets both sides.
 * Blank the outline first. (x, y) is the top-left corner.
 */
export function banded(
  s: Sheet,
  p: Pen,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
  cut: number,
) {
  const c = (cx: number, cy: number, a0: number) =>
    arc([cx, cy], rad, rad, a0, a0 + 90, 5)
  s.stroke(
    p.shape([
      [x, y + cut],
      ...c(x + rad, y + rad, 180),
      ...c(x + w - rad, y + rad, 270),
      [x + w, y + cut],
    ]),
  )
  s.stroke(
    p.path([
      [x + w, y + cut],
      ...c(x + w - rad, y + h - rad, 0),
      ...c(x + rad, y + h - rad, 90),
      [x, y + cut],
    ]),
  )
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
  // The sides and the bottom in one run, starting and ending just under the rim so its run-on lands on it.
  const under = c[1] + HANDS[p.hand].over * 0.4
  s.stroke(
    p.path([
      [c[0] - rx, under],
      ...arc(bottom, rx, ry, 180, 0, 12),
      [c[0] + rx, under],
    ]),
  )
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

/**
 * Anything round seen a little from above (a pot's rim, a lampshade, a lamp's foot): its top rim centred on `c` and
 * its bottom rim `h` below. The back of the top rim goes first and starts and ends a little way down inside the front,
 * so the front, one closed stroke, covers where the pen runs past it. `inside` draws what stands inside the rim
 * (stems, a cactus) between the two, so the front hides where it goes in.
 */
export function drum(
  s: Sheet,
  p: Pen,
  c: Point,
  [rt, rb, h, e]: [number, number, number, number],
  inside?: () => void,
  wash = false,
) {
  s.blank(p.shape(arc(c, rt, e, 0, 360, 24)))
  const tuck = (f: number) => add(c, [f * rt * 0.9, e * 0.6])
  s.stroke(p.path([tuck(-1), ...arc(c, rt, e, 180, 360, 12), tuck(1)]))
  inside?.()
  const front = [
    ...arc(c, rt, e, 180, 0, 12),
    ...arc([c[0], c[1] + h], rb, (e * rb) / rt, 0, 180, 12),
  ]
  s.blank(p.shape(front))
  if (wash) s.wash(p.shape(front))
  s.stroke(p.shape(front))
}

/** A twig from a to b with small solid leaves along it in pairs and one at its tip, which covers the twig's end. */
export function sprig(s: Sheet, p: Pen, a: Point, b: Point, size: number) {
  s.stroke(p.line(a, b))
  const len = dist(a, b) || 1
  const blade = (at: Point, d: Point) => {
    const m: Point = [-d[1] * size * 0.24, d[0] * size * 0.24]
    const mid = add(at, d, size * 0.5)
    s.fill(p.shape([at, add(mid, m), add(at, d, size), add(mid, m, -1)]))
  }
  const [dx, dy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  const n = Math.max(1, Math.floor(len / (size * 1.5)))
  for (let i = 1; i <= n; i++)
    for (const f of [-0.75, 0.75])
      blade(lerp(a, b, i / (n + 0.6)), [dx * 0.65 - dy * f, dy * 0.65 + dx * f])
  blade(b, [dx, dy])
}
