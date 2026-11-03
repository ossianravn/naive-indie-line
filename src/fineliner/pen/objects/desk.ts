// Studio: the freelancer's desk and what collects on it. Each function draws one object; `at` is its anchor and `k`
// its scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Closed outlines are
// one stroke each, so corners meet; parts are drawn back to front, each hiding the ends of what is behind it.
import { add, arc, deg, dist, dot, lerp, rect, roundRect } from "../geometry"
import { times, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, cylinder, depth, handle, scribble } from "../shapes"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"

type Quad = [Point, Point, Point, Point]

/** Points from a flat list of coordinates: [x0, y0, x1, y1, …]. */
const pairs = (xy: number[]) =>
  xy.flatMap((v, i): Point[] => (i % 2 ? [] : [[v, xy[i + 1] ?? 0]]))

/** The unit vector from a towards b. */
const unit = (a: Point, b: Point) => times(add(b, a, -1), 1 / (dist(a, b) || 1))

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A ring over what is behind it, as a castor, a joint or a hub: radii u across and v down. */
function knob(s: Sheet, p: Pen, c: Point, u: number, v = u) {
  s.blank(p.disc(c, [u, 0], [0, v]))
  s.stroke(p.ring(c, [u, 0], [0, v]))
}

/** A flat round thing seen from above, as a seat or a lamp's base: `c` is the centre of its top, `h` its thickness. */
function puck(s: Sheet, p: Pen, c: Point, rx: number, ry: number, h: number) {
  const below = add(c, [0, h])
  solid(s, p, [...arc(c, rx, ry, 180, 360, 12), ...arc(below, rx, ry, 0, 180)])
  s.stroke(p.path(arc(c, rx, ry, 18, 162, 12)))
}

/** A slim rod from a to b, as a lamp's arm or a chair's leg, `w0` wide at a and `w1` at b. */
function rod(s: Sheet, p: Pen, a: Point, b: Point, w0: number, w1 = w0) {
  const [dx, dy] = unit(a, b)
  const e = (q: Point, w: number) => add(q, [dy, -dx], w / 2)
  solid(s, p, [e(a, w0), e(b, w1), e(b, -w1), e(a, -w0)])
}

/** A desk whose front-left foot stands at `at`. Returns its top, for placing things on it. */
export const desk: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { w = 230 * k, d = 70 * k, legs = 70 * k } = {},
) => {
  const o = depth(r)
  const [x, y] = at
  const t = 6 * k
  // Square legs run a little up into the top, which is drawn last and hides their ends. The back pair stands a
  // depth behind, then the drawer hangs flush under the top, then the front pair.
  const leg = (u: number, back: number) =>
    box(s, p, o, add([x + (w - t) * u, y], o, back), t, legs + 2 * k, t)
  leg(0, d - t)
  leg(1, d - t)
  const under: Point = [x + w * 0.62, y - legs + 20 * k]
  const drawer = box(s, p, o, under, w * 0.3, 20 * k, d * 0.9)
  s.stroke(p.line(drawer.front(0.42, 0.5), drawer.front(0.58, 0.5)))
  leg(0, 0)
  leg(1, 0)
  return box(s, p, o, [x, y - legs], w, 7 * k, d)
}

/** An office chair on five castors, its back on a post behind the seat. The star turns with the seed. */
export const officeChair: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const hub: Point = [x, y - 18 * k]
  const spin = r.between(0, 72)
  const feet = [0, 1, 2, 3, 4].map((i) => (90 + spin + i * 72) * deg)
  // A leg out to its castor; the back legs come first, so the column and the front legs cover where they meet.
  const leg = (a: number) => {
    const end = add(hub, [Math.cos(a) * 32 * k, Math.sin(a) * 9 * k + 3 * k])
    rod(s, p, hub, end, 6 * k, 3.5 * k)
    knob(s, p, add(end, [0, 3 * k]), 3 * k)
  }
  feet.filter((a) => Math.sin(a) < 0).forEach(leg)
  solid(s, p, rect(x - 2.5 * k, y - 58 * k, 5 * k, 26 * k))
  solid(s, p, rect(x - 4 * k, y - 36 * k, 8 * k, 18 * k))
  feet.filter((a) => Math.sin(a) >= 0).forEach(leg)
  knob(s, p, hub, 6 * k, 2.5 * k)
  const tall = r.between(40, 48) * k
  solid(s, p, rect(x - 3 * k, y - 90 * k, 6 * k, 28 * k))
  solid(s, p, roundRect(x - 23 * k, y - 82 * k - tall, 46 * k, tall, 10 * k))
  puck(s, p, [x, y - 64 * k], 30 * k, 9 * k, 7 * k)
}

/** An anglepoise lamp: a round base, a sprung arm with an elbow and a bell shade, facing left or right from the seed. */
export const deskLamp: Draw = (s, p, r, at, k = 1) => {
  const flip = r.chance(0.5) ? 1 : -1
  const x = at[0] + (flip < 0 ? 16 * k : 0)
  const P = (u: number, v: number): Point => [x + flip * u * k, at[1] - v * k]
  puck(s, p, P(0, 8), 22 * k, 5.5 * k, 5 * k)
  const [foot, elbow, head] = [P(-4, 9), P(-18, 66), P(28, 96)]
  rod(s, p, foot, elbow, 3 * k)
  // The spring runs beside the lower arm in small loops, hooked onto it at both ends.
  const along = unit(foot, elbow)
  const side = times([-along[1], along[0]], flip)
  const coil = Array.from({ length: 49 }, (_, i): Point => {
    const a = (i / 48) * 6 * 2 * Math.PI
    const c = add(lerp(foot, elbow, 0.24 + (i / 48) * 0.44), side, 4 * k)
    return add(add(c, side, Math.sin(a) * 2 * k), along, -Math.cos(a) * 1.4 * k)
  })
  s.stroke(p.path([lerp(foot, elbow, 0.18), ...coil, lerp(foot, elbow, 0.76)]))
  rod(s, p, elbow, head, 3 * k)
  knob(s, p, elbow, 4 * k)
  s.fill(p.disc(...dot(elbow, 1.2 * k)))
  // The shade, a bell from a cap at the head to an open rim; inside the rim, the dark and the bulb.
  const ax: Point = [flip * 0.5, 0.87]
  const n: Point = [-ax[1], ax[0]]
  const neck = add(head, ax, 3 * k)
  const rim = add(neck, ax, 26 * k)
  const wide = (t: number) => (5 + 11 * t ** 1.8) * k
  const flank = (f: number) =>
    Array.from({ length: 9 }, (_, i) =>
      add(add(neck, ax, i * 3.25 * k), n, f * wide(i / 8)),
    )
  const cap = arc([0, 0], 1, 1, 0, 180, 8).map(([c, sn]) =>
    add(add(neck, n, -5 * k * c), ax, -4 * k * sn),
  )
  const [u, v] = [times(n, 16 * k), times(ax, 5 * k)]
  const lip = p.round(rim, u, v, 0, Math.PI)
  solid(s, p, [...flank(1), ...lip, ...flank(-1).reverse(), ...cap])
  s.fill(p.disc(rim, u, v))
  s.blank(p.shape(p.round(add(rim, ax, -k), times(n, 6 * k), v, 0, Math.PI)))
  knob(s, p, head, 3 * k)
}

/** A stack of three books, each showing its pages or its spine, sometimes with a bookmark. */
export const books: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  let [x, y] = at
  for (let i = 0; i < 3; i++) {
    const w = r.between(70, 96) * k
    const h = r.between(9, 14) * k
    const b = box(s, p, o, [x, y], w, h, 50 * k)
    const on = (uv: number[]) => pairs(uv).map(([u, v]) => b.front(u, v))
    if (r.chance(0.5))
      for (const v of [0.36, 0.64])
        s.stroke(p.line(b.front(0.07, v), b.front(0.93, v)))
    else s.stroke(p.shape(on([0.36, 0.3, 0.64, 0.3, 0.64, 0.7, 0.36, 0.7])))
    x += r.signed() * 8 * k
    y -= h
  }
  const ribbon = pairs([30, 0, 36, 0, 36, 22, 33, 18, 30, 22])
  if (r.chance(0.6)) s.fill(p.shape(ribbon.map((d) => add([x, y], d, k))))
}

/** An open sketchbook, `at` its bottom-left: notes on the left page, a house and a pencil on the right. */
export const sketchbook: Draw = (s, p, r, at, k = 1) => {
  const o: Point = [0.28 + r.signed() * 0.06, -0.62]
  const [x, y] = at
  const [w, d] = [74 * k, 78 * k]
  const page = (x0: number): Quad => [
    [x0, y],
    [x0 + w, y],
    add([x0 + w, y], o, d),
    add([x0, y], o, d),
  ]
  const [left, right] = [page(x), page(x + w)]
  // The cover shows a little round the pages; the gutter is drawn once, as the left page's edge.
  const m = 3 * k
  const cover = [left[0], right[1], right[2], left[3]].map((c, i) =>
    add(add(c, [i % 3 ? m : -m, 0]), o, i < 2 ? -2 * m : 2 * m),
  )
  solid(s, p, cover)
  s.stroke(p.shape(left))
  s.stroke(p.path(right))
  const q = (pg: Quad, u: number, v: number) =>
    lerp(lerp(pg[0], pg[1], u), lerp(pg[3], pg[2], u), v)
  for (let v = 0.25; v < 0.85; v += 0.15)
    s.stroke(p.line(q(left, 0.15, v), q(left, r.between(0.6, 0.85), v)))
  const on = (uv: number[]) => pairs(uv).map(([u, v]) => q(right, u, v))
  s.stroke(
    p.shape(on([0.18, 0.3, 0.48, 0.3, 0.48, 0.55, 0.33, 0.72, 0.18, 0.55])),
  )
  s.fill(p.shape(on([0.29, 0.3, 0.37, 0.3, 0.37, 0.42, 0.29, 0.42])))
  // The pencil: its body, the sharpened wood with the lead at its tip, and the ferrule.
  const [tip, end] = [q(right, 0.6, 0.12), q(right, 1.08, 0.8)]
  const [dx, dy] = unit(tip, end)
  const neck = lerp(tip, end, 0.12)
  const [a, b] = [add(neck, [dy, -dx], 1.8 * k), add(neck, [dy, -dx], -1.8 * k)]
  rod(s, p, neck, end, 3.6 * k)
  solid(s, p, [tip, a, b])
  s.fill(p.shape([tip, lerp(tip, a, 0.4), lerp(tip, b, 0.4)]))
  rod(s, p, lerp(neck, end, 0.84), lerp(neck, end, 0.9), 3.6 * k)
}

/** Three sticky notes on the wall, each a little askew, with a pin and a few lines; now and then a corner curls. */
export const stickyNotes: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  for (let i = 0; i < 3; i++) {
    const c: Point = [
      x + (i * 46 + r.signed() * 4) * k,
      y - (26 + (i % 2) * 14) * k,
    ]
    const tilt = r.signed() * 7
    const f = r.chance(0.35) ? 7 : 0
    // Corners from the note's centre, in k, turned by its tilt.
    const on = (xy: number[]) =>
      pairs(xy).map((d) => turn(add(c, d, k), c, tilt))
    const note = on([-20, -20, 20, -20, 20, 20 - f, 20 - f, 20, -20, 20])
    s.blank(p.shape(note))
    s.wash(p.shape(note))
    s.stroke(p.shape(note))
    const g = 20 - f * 1.1
    if (f) s.stroke(p.shape(on([20, 20 - f, 20 - f, 20, g, g])))
    s.fill(p.disc(...dot(turn([c[0], c[1] - 15 * k], c, tilt), 2 * k)))
    scribble(s, p, r, c[0] - 13 * k, c[1] - 4 * k, 26 * k, 3, 7 * k)
  }
}

/** A full mug with a heart or a scribble on it. People hold one too. */
export const mug: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const cup = cylinder(s, p, [x, y - 44 * k], 20 * k, 6 * k, 40 * k)
  handle(s, p, x + 20 * k, y - 36 * k, y - 14 * k, 11 * k)
  s.fill(p.disc(cup.top, [16.5 * k, 0], [0, 4.4 * k]))
  const m: Point = [x - 2 * k, y - 22 * k]
  const heart = pairs([0, 6, -7, -1, -4, -6, 0, -3, 4, -6, 7, -1])
  if (r.chance(0.5)) s.fill(p.shape(heart.map((d) => add(m, d, k))))
  else scribble(s, p, r, x - 12 * k, y - 26 * k, 22 * k, 2, 6 * k)
}

/** A paper cup seen a little from above: the cup, a sleeve round it with a logo, and a lid with a sip hole. */
export const coffeeToGo: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const half = (v: number) => (13 + (6 * v) / 66) * k
  const ry = 3 * k
  // An ellipse round the cup at height v, `out` beyond its side, from angle a0 to a1 (0 is right, 90 is nearest).
  const rim = (v: number, out: number, a0: number, a1: number) =>
    arc([x, y - ry - v * k], half(v) + out, ry, a0, a1, 12)
  solid(s, p, [...rim(0, 0, 0, 180), ...rim(68, 0, 180, 360)])
  const sleeve = [...rim(46, 1.2 * k, 0, 180), ...rim(18, 1.2 * k, 180, 0)]
  s.blank(p.shape(sleeve))
  s.wash(p.shape(sleeve))
  s.stroke(p.shape(sleeve))
  s.stroke(p.ring([x, y - 34 * k], [6 * k, 0], [0, 6 * k]))
  // The lid's dome, then its band, which hides the dome's foot.
  const top = y - 84 * k
  const lid = arc([x, top], 14 * k, 2.5 * k, 180, 360, 10)
  solid(s, p, [...rim(68, 0.5 * k, 0, 180), ...lid])
  s.stroke(p.path(arc([x, top], 14 * k, 2.5 * k, 30, 150, 10)))
  s.fill(p.disc([x + 5 * k, top - 0.5 * k], [3 * k, 0], [0, 1 * k]))
  solid(s, p, [...rim(72, 2.5 * k, 0, 180), ...rim(66, 2.5 * k, 180, 0)])
}

const T = objectsIn("studio")

define(
  T("desk", "Desk", [290, 150], [12, 140], 1, desk, [
    "work",
    "furniture",
    "office",
  ]),
  T("office-chair", "Office chair", [100, 140], [50, 132], 1, officeChair, [
    "work",
    "furniture",
    "seat",
  ]),
  T("desk-lamp", "Desk lamp", [130, 130], [50, 122], 1, deskLamp, [
    "light",
    "work",
    "late",
  ]),
  T("books", "Books", [140, 90], [20, 82], 1, books, [
    "reading",
    "study",
    "library",
  ]),
  T("sketchbook", "Sketchbook", [200, 110], [14, 100], 1, sketchbook, [
    "drawing",
    "ideas",
    "design",
  ]),
  T("sticky-notes", "Sticky notes", [160, 90], [26, 74], 1, stickyNotes, [
    "notes",
    "planning",
    "todo",
  ]),
  T("mug", "Mug", [80, 80], [36, 72], 1, mug, ["drink", "coffee", "break"]),
  T("coffee-to-go", "Coffee to go", [60, 100], [30, 92], 1, coffeeToGo, [
    "drink",
    "coffee",
    "takeaway",
  ]),
)
