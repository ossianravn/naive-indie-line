// Everyday: post sent, parcels received and things crossed off. `at` is bottom-centre unless a function says
// otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts are drawn
// back to front in the object's own units (`units.ts`), with blanks under the paper and the pencil.
import { add, dist, dot, lerp, roundRect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { pathOf, pathPoints } from "../path"
import { box, depth, scribble } from "../shapes"
import { outline, place, pts, type Map } from "./units"

/** An open envelope with a letter half out, lying back up; `at` is bottom-centre. */
export const envelope: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const tilt = r.between(-3, -1)
  const lean = r.between(0.25, 0.29)
  const Q: Map = (u, v) => turn(P(u + lean * v, v * 0.62), at, tilt)
  outline(s, p, pts(Q, [-39, 62, 0, 118, 39, 62]))
  s.blank(p.shape(pts(Q, [-39, 0, 39, 0, 39, 62, -39, 62])))
  s.stroke(p.path(pts(Q, [-39, 59, -39, 62, 39, 62, 39, 59])))
  outline(s, p, pts(Q, [-28, 14, 28, 14, 28, 96, -28, 96]))
  const text = Q(-18, 81)
  scribble(s, p, r, text[0], text[1], 33 * k, 3, 6 * k)
  // The pocket hides the inserted half of the sheet; its upper edge dips between the two side folds.
  outline(s, p, pts(Q, [-39, 0, 39, 0, 39, 62, 0, 25, -39, 62]))
  s.stroke(p.path(pts(Q, [-36, 2, 0, 25, 36, 2])))
}

/** A cardboard parcel tied both ways, with a bow and a label; `at` is bottom-left. */
export const parcel: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const b = box(s, p, o, at, 78 * k, 58 * k, 66 * k)
  const knot = b.top(0.5, 0.5)
  const side = (v: number, h: number) => add(b.front(1, h), o, 66 * k * v)
  // Pin each string to its edge or the knot, without carrying loose ends along box edges.
  const strings: [Point, Point, ...Point[]][] = [
    [b.front(0.5, 0), b.top(0.5, 0), knot],
    [b.top(0.5, 1), knot],
    [b.top(0, 0.5), knot],
    [knot, b.top(1, 0.5), side(0.5, 0)],
    [b.front(0, 0.5), b.front(1, 0.5), side(1, 0.5)],
  ]
  for (const string of strings) {
    const [a, b] = string
    const z = string[string.length - 1] ?? b
    const y = string[string.length - 2] ?? a
    const ink = (pathPoints(p.path(string)) ?? string).filter(
      ([x, v]) =>
        (x - a[0]) * (b[0] - a[0]) + (v - a[1]) * (b[1] - a[1]) > 0 &&
        (x - z[0]) * (z[0] - y[0]) + (v - z[1]) * (z[1] - y[1]) < 0,
    )
    s.stroke(pathOf([a, ...ink, z]))
  }
  const P = place(knot, k)
  // Closed bow loops cover the strings' meeting point.
  for (const side of [-1, 1]) {
    const B: Map = (u, v) => P(u * side, v)
    outline(s, p, pts(B, [0, 0, 3, 6, 8, 10, 12, 10, 14, 8, 13, 5, 8, 2]))
  }
  const label = [
    b.front(0.08, 0.1),
    b.front(0.4, 0.1),
    b.front(0.4, 0.41),
    b.front(0.08, 0.41),
  ]
  outline(s, p, label)
  const text = b.front(0.14, 0.31)
  scribble(s, p, r, text[0], text[1], 15 * k, 2, 6 * k)
}

/** The part of a run of points from `from` to `to` along it, as one dash of a dashed line. */
function stretch(q: Point[], from: number, to: number) {
  const out: Point[] = []
  let walked = 0
  q.forEach((b, i) => {
    const a = q[i - 1] ?? b
    const step = dist(a, b)
    const [t0, t1] = [(from - walked) / step, (to - walked) / step]
    if (step > 0 && t0 < 1 && t1 > 0) {
      if (t0 > 0) out.push(lerp(a, b, t0))
      out.push(t1 < 1 ? lerp(a, b, t1) : b)
    }
    walked += step
  })
  return out
}

/** A folded paper plane trailing a dashed swoop; `at` is bottom-left. */
export const paperPlane: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const tilt = r.between(-1.5, 1.5)
  const Q: Map = (u, v) => turn(P(u, v), P(100, 45), tilt)
  const curve = (a: Point, b: Point, c: Point, d: Point) =>
    Array.from({ length: 33 }, (_, i) => {
      const t = i / 32
      return lerp(
        lerp(lerp(a, b, t), lerp(b, c, t), t),
        lerp(lerp(b, c, t), lerp(c, d, t), t),
        t,
      )
    })
  // The trail: one swooping curve back from just behind the tail, drawn as five equal dashes with equal gaps.
  const trail = curve(Q(70, 56), Q(40, 64), Q(36, 12), Q(2, 20))
  const reach = trail.reduce((sum, b, i) => sum + dist(trail[i - 1] ?? b, b), 0)
  const dash = 9 * k
  const gap = (reach - 5 * dash) / 4
  for (let i = 0; i < 5; i++) {
    const from = i * (dash + gap)
    s.stroke(p.path(stretch(trail, from, from + dash)))
  }
  outline(s, p, pts(Q, [148, 85, 67, 70, 76, 57, 52, 8]))
  outline(s, p, pts(Q, [148, 85, 76, 57, 76, 42]))
}

/** A desk telephone with a sloping keypad, resting handset and loose coiled cord; `at` is bottom-centre. */
export const telephone: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const o = depth(r)
  const H: Map = (u, v) => add(P(u, 33 + v), o, 33 * k)
  const radius = r.between(5.5, 6.2)
  const coil = Array.from({ length: 97 }, (_, i) => {
    const t = i / 96
    const a = t * Math.PI * 8
    return P(57 + radius * Math.cos(a), -10 + 34 * t + 5 * Math.sin(a))
  })
  s.stroke(
    p.path([
      P(37, 4),
      P(45, 3),
      P(47, -7),
      P(51, -14),
      P(57, -16),
      ...coil,
      H(38, 4),
    ]),
  )
  const b = box(s, p, o, P(-38, 0), 76 * k, 10 * k, 44 * k)
  const [f0, f1] = [b.top(0, 0), b.top(1, 0)]
  const [b0, b1] = [
    add(b.top(0, 1), [0, -22 * k]),
    add(b.top(1, 1), [0, -22 * k]),
  ]
  outline(s, p, [f1, b.top(1, 1), b1])
  outline(s, p, [f0, f1, b1, b0])
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 3; col++) {
      const v = 0.14 + row * 0.17
      const q = lerp(lerp(f0, b0, v), lerp(f1, b1, v), 0.35 + col * 0.15)
      s.fill(p.disc(...dot(q, 1.65 * k)))
    }
  for (const u of [0.12, 0.88])
    s.stroke(
      p.line(
        lerp(lerp(f0, b0, 0.84), lerp(f1, b1, 0.84), u),
        H(-38 + 76 * u, 3),
      ),
    )
  outline(
    s,
    p,
    pts(
      H,
      [
        -43, 0, -43, 9, -39, 16, -30, 21, -16, 24, 0, 25, 16, 24, 30, 21, 39,
        16, 43, 9, 43, 0, 38, -3, 29, -2, 26, 7, 13, 12, -13, 12, -26, 7, -29,
        -2, -38, -3,
      ],
    ),
  )
}

/** A clipboard with three ticked rows and a pencil lying over its sheet; `at` is bottom-centre. */
export const checklist: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const lean = r.between(0.1, 0.14)
  const Q: Map = (u, v) => P(u + lean * v, v * 0.92)
  const board = roundRect(-35, -120, 70, 120, 5)
  outline(
    s,
    p,
    board.map(([u, v]) => Q(u + 2, -v - 3)),
  )
  outline(
    s,
    p,
    board.map(([u, v]) => Q(u, -v)),
  )
  outline(s, p, pts(Q, [-28, 8, 28, 8, 28, 113, -28, 113]))
  for (const v of [92, 68, 44]) {
    s.stroke(p.shape(pts(Q, [-21, v - 5, -11, v - 5, -11, v + 5, -21, v + 5])))
    s.stroke(p.path(pts(Q, [-20, v, -16, v - 4, -9, v + 6])))
    const text = Q(-2, v)
    scribble(s, p, r, text[0], text[1], 32 * k, 1)
  }
  const clip = roundRect(-14, -125, 28, 12, 3).map(([u, v]) => Q(u, -v))
  s.blank(p.shape(clip))
  s.fill(p.shape(clip))
  const [tip, end] = [Q(-27, 15), Q(33, 48)]
  const neck = lerp(tip, end, 0.14)
  const len = dist(tip, end)
  const side: Point = [
    ((end[1] - tip[1]) / len) * 3 * k,
    ((tip[0] - end[0]) / len) * 3 * k,
  ]
  const [a, b] = [add(neck, side), add(neck, side, -1)]
  outline(s, p, [tip, a, add(end, side), add(end, side, -1), b])
  s.stroke(
    p.path([
      lerp(a, add(end, side), 0.06),
      a,
      b,
      lerp(b, add(end, side, -1), 0.06),
    ]),
  )
  s.fill(p.shape([tip, lerp(tip, a, 0.4), lerp(tip, b, 0.4)]))
}

const T = objectsIn("everyday")

define(
  T("envelope", "Envelope", [130, 100], [49, 87], 1, envelope, [
    "newsletter",
    "inbox",
    "message",
    "email",
    "post",
  ]),
  T("parcel", "Parcel", [140, 120], [15, 109], 1, parcel, [
    "order",
    "shipping",
    "delivery",
    "gift",
    "shop",
  ]),
  T("paper-plane", "Paper plane", [170, 110], [12, 98], 1, paperPlane, [
    "sent",
    "message",
    "publish",
    "deploy",
    "done",
  ]),
  T("telephone", "Telephone", [150, 110], [65, 83], 1, telephone, [
    "contact",
    "support",
    "call",
    "help",
  ]),
  T("checklist", "Checklist", [120, 150], [48, 136], 1, checklist, [
    "done",
    "complete",
    "tasks",
    "confirm",
    "steps",
  ]),
)
