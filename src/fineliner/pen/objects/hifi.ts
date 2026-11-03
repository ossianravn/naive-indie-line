// Indie: the hi-fi. Each function draws one object; `at` is its anchor (bottom-left unless it says
// otherwise) and `k` its scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import {
  add,
  dist,
  dot,
  lerp,
  roundRect,
  times,
  turn,
  type Point,
} from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth } from "../shapes"
import type { Pen } from "../stroke"

/** A thin ring between two radii of an ellipse: the inner loop runs the other way, so it is a hole. */
const groove = (p: Pen, c: Point, u: Point, v: Point, a: number, b: number) =>
  p.disc(c, times(u, b), times(v, b)) + p.disc(c, times(u, a), times(v, -a))

/** A knob on a front panel: a clean rim and a small cap. */
function knob(p: Pen, c: Point, rad: number) {
  return [p.disc(...dot(c, rad)), p.disc(...dot(c, rad * 0.45))]
}

/** A narrow bar along a to b, `half` either side of it: a needle or a tonearm's head. */
function bar(a: Point, b: Point, half: number): Point[] {
  const len = dist(a, b) || 1
  const n: Point = [((a[1] - b[1]) / len) * half, ((b[0] - a[0]) / len) * half]
  return [add(a, n), add(b, n), add(b, n, -1), add(a, n, -1)]
}

/**
 * A record player with its lid open: the lid first, hinged on the plinth's back edge so the plinth hides its foot;
 * then the plinth on two feet, the platter with a record on it, the tonearm resting on the record, knobs and a switch.
 */
export const turntable: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, h, d, foot] = [106 * k, 20 * k, 64 * k, 3 * k]
  const base: Point = [at[0], at[1] - foot]
  const hinge = (u: number): Point => add([base[0] + w * u, base[1] - h], o, d)
  const lift = add([0, -r.between(30, 34) * k], o, 20 * k)
  const up = times(lift, 1 / dist([0, 0], lift))
  const lid = [hinge(0), add(hinge(0), lift), add(hinge(1), lift), hinge(1)]
  s.blank(p.shape(lid))
  s.stroke(p.path(lid))
  const rim = 3.5 * k
  s.stroke(
    p.path([
      add(hinge(0), [rim, 0]),
      add(add(hinge(0), lift), add([rim, 0], up, -rim)),
      add(add(hinge(1), lift), add([-rim, 0], up, -rim)),
      add(hinge(1), [-rim, 0]),
    ]),
  )
  for (const u of [0.04, 0.84])
    s.stroke(
      p.shape(roundRect(at[0] + w * u, base[1] - 1, w * 0.12, foot + 1, 1)),
    )
  const b = box(s, p, o, base, w, h, d)
  // The platter's edge shows below the record as a crescent: a lower ring, then the platter hides its upper part.
  const c = b.top(0.42, 0.5)
  const u: Point = [w * 0.29, 0]
  const v = times(b.o, b.d * 0.41)
  s.stroke(p.disc(add(c, [0, 2.5 * k]), times(u, 1.08), times(v, 1.08)))
  s.blank(p.disc(c, times(u, 1.08), times(v, 1.08)))
  s.stroke(p.disc(c, times(u, 1.08), times(v, 1.08)))
  s.fill(p.disc(c, times(u, 0.96), times(v, 0.96)))
  s.paper(groove(p, c, u, v, 0.66, 0.7))
  s.paper(groove(p, c, u, v, 0.81, 0.84))
  s.paper(p.disc(c, times(u, 0.32), times(v, 0.32)))
  s.fill(p.disc(...dot(c, 1.1 * k)))
  // The tonearm: a post at the back right, the counterweight behind it, an arm bent once, its head on the record.
  const post = b.top(0.88, 0.72)
  const bearing = add(post, [0, -3.5 * k])
  const elbow = add(b.top(0.88, 0.26), [0, -3.5 * k])
  const tail = add(add(add(c, u, 0.86 * 0.9), v, -0.86 * 0.44), [0, -1.5 * k])
  const weight = lerp(bearing, elbow, -0.16)
  s.stroke(p.disc(post, [4.5 * k, 0], times(b.o, 9 * k)))
  s.stroke(p.path([weight, bearing, elbow, tail]))
  s.fill(p.disc(...dot(bearing, 1.6 * k)))
  s.fill(p.disc(...dot(weight, 2.4 * k)))
  const head = bar(lerp(elbow, tail, 0.6), lerp(elbow, tail, 1.12), 1.8 * k)
  s.paper(p.shape(head))
  s.stroke(p.shape(head))
  for (let i = 0; i < 3; i++)
    for (const d of knob(p, b.front(0.1 + i * 0.075, 0.5), 2.6 * k)) s.stroke(d)
  const [sx, sy] = b.front(0.64, 0.68)
  s.stroke(p.shape(roundRect(sx, sy, w * 0.22, h * 0.36, 2 * k)))
  const tab = sx + w * (r.chance(0.5) ? 0.03 : 0.13)
  s.fill(p.shape(roundRect(tab, sy + 1.5 * k, w * 0.06, h * 0.36 - 3 * k, 1)))
}

/** A bookshelf speaker: a tall box with a woofer and a tweeter, each ringed, and a small light. */
export const speaker: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 36 * k, 56 * k, 28 * k)
  const woofer = b.front(0.5, 0.34)
  const tweeter = b.front(0.5, 0.77)
  s.stroke(p.ring(...dot(woofer, 12 * k)))
  s.stroke(p.disc(...dot(woofer, 7.5 * k)))
  s.fill(p.disc(...dot(woofer, 2.6 * k)))
  s.stroke(p.disc(...dot(tweeter, 5.5 * k)))
  s.fill(p.disc(...dot(tweeter, 1.8 * k)))
  s.fill(p.disc(...dot(b.front(0.84, 0.07), 0.9 * k)))
}

/**
 * A cassette face on, tipped a little: a rounded shell with four screws, the label, the window with both reels and the
 * tape between them, and the trapezoid at the bottom, whose legs end at the shell's edge.
 */
export const cassette: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const tip = r.signed() * 4
  const mid: Point = [x + 48 * k, y - 30 * k]
  const P = (u: number, v: number): Point =>
    turn([x + u * k, y - v * k], mid, tip)
  // A rounded rectangle from its bottom-left corner, in the cassette's own units.
  const R = (u: number, v: number, w: number, h: number, rad: number) =>
    roundRect(u, -(v + h), w, h, rad).map(([a, b]) => P(a, -b))
  const body = R(0, 0, 96, 60, 4)
  s.blank(p.shape(body))
  // The trapezoid's legs run past the shell's bottom edge; a strip below the shell hides what runs past.
  s.stroke(p.path([P(17.4, -1), P(23, 12), P(73, 12), P(78.6, -1)]))
  s.blank(p.shape([P(8, 0), P(88, 0), P(88, -8), P(8, -8)]))
  s.stroke(p.shape(body))
  for (const [u, v] of [
    [6, 54],
    [90, 54],
    [6, 6],
    [90, 6],
  ] as Point[])
    s.fill(p.disc(...dot(P(u, v), 1.2 * k)))
  s.stroke(p.shape(R(10, 21, 76, 33, 3)))
  if (r.chance(0.7))
    s.stroke(
      p.path([P(15, 49), P(30, 49.6), P(44, 48.6), P(r.between(56, 72), 49.2)]),
    )
  s.stroke(p.shape(R(24, 26, 48, 15, 7.5)))
  for (const cx of [31.5, 64.5]) {
    s.fill(p.disc(...dot(P(cx, 33.5), 4.6 * k)))
    s.paper(p.disc(...dot(P(cx, 33.5), 1.7 * k)))
  }
  s.stroke(p.shape(R(41, 30, 14, 7, 1)))
  for (const hx of [33, 43, 53, 63]) s.fill(p.disc(...dot(P(hx, 6), 1.3 * k)))
}

/**
 * A table radio: a box with a round grille of holes, a tuning dial with its marks and needle, two knobs, and an aerial
 * from a small mount on top. The aerial stops short of its mount and tip, which cover its ends.
 */
export const radio: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 96 * k, 56 * k, 26 * k)
  const grille = b.front(0.28, 0.48)
  s.stroke(p.disc(...dot(grille, 19 * k)))
  for (let i = -3; i <= 3; i++)
    for (let j = -3; j <= 3; j++) {
      const pt = add(grille, [(i + (j % 2) * 0.5) * 5 * k, j * 4.4 * k])
      if (dist(pt, grille) < 15 * k) s.fill(p.disc(...dot(pt, 0.9 * k)))
    }
  const [dx, dy] = b.front(0.56, 0.84)
  const [dw, dh] = [96 * k * 0.36, 56 * k * 0.22]
  s.stroke(p.shape(roundRect(dx, dy, dw, dh, 2 * k)))
  for (let i = 1; i < 10; i++)
    s.fill(p.disc(...dot([dx + (dw * i) / 10, dy + dh * 0.3], 0.55 * k)))
  const nx = dx + dw * r.between(0.25, 0.8)
  s.fill(p.shape(bar([nx, dy + 2 * k], [nx, dy + dh - 2 * k], 0.6 * k)))
  for (const u of [0.64, 0.84])
    for (const d of knob(p, b.front(u, 0.3), 5.5 * k)) s.stroke(d)
  const mount = b.top(0.86, 0.5)
  const tip = add(mount, [r.between(-42, -32) * k, -44 * k])
  const along = (t: number) => lerp(mount, tip, t)
  const reach = dist(mount, tip)
  s.stroke(p.line(along((2 * k) / reach), along(1 - (2.5 * k) / reach)))
  s.fill(p.disc(mount, [3 * k, 0], times(b.o, 3 * k)))
  s.fill(p.disc(...dot(tip, 2.2 * k)))
}

const T = objectsIn("indie")

define(
  T("turntable", "Turntable", [170, 120], [14, 104], 1, turntable, [
    "music",
    "record",
    "vinyl",
  ]),
  T("speaker", "Speaker", [90, 110], [22, 98], 1.1, speaker, [
    "music",
    "sound",
  ]),
  T("cassette", "Cassette", [120, 90], [12, 76], 1, cassette, [
    "music",
    "tape",
    "mix",
  ]),
  T("radio", "Radio", [150, 140], [16, 126], 1, radio, [
    "music",
    "sound",
    "news",
  ]),
)
