// Everyday: post sent, parcels received and things crossed off. `at` is bottom-centre unless a function says
// otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts are drawn
// back to front in the object's own units (`units.ts`), with blanks under the flap, the handset and the clip.
import {
  add,
  deg,
  dist,
  dot,
  lerp,
  roundRect,
  times,
  turn,
  type Point,
} from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { pathOf, pathPoints } from "../path"
import { box, depth, scribble } from "../shapes"
import { HANDS, type Pen } from "../stroke"
import { outline, place, pts, type Map } from "./units"

/** Where a line from `a` towards `b` stops, short of `b` by part of the pen's run-on, so it lands on the line at `b`. */
const short = (p: Pen, a: Point, b: Point) =>
  lerp(b, a, (HANDS[p.hand].over * 0.4) / (dist(a, b) || 1))

/** The back of a sealed envelope, tipped a little: its flap folded down to a wax seal; `at` is bottom-centre. */
export const envelope: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const tip = r.signed() * 3
  const Q: Map = (u, v) => turn(P(u, v), P(0, 31), tip)
  const [w, h, fold] = [48, 62, 24]
  outline(
    s,
    p,
    roundRect(-w, -h, 2 * w, h, 2.5).map(([u, v]) => Q(u, -v)),
  )
  // The bottom folds rise from the corners and run on under the flap, which hides their ends.
  s.stroke(p.line(Q(-w + 5, 4), Q(-6, fold + 10)))
  s.stroke(p.line(Q(w - 5, 4), Q(6, fold + 10)))
  s.blank(p.shape(pts(Q, [-w + 5, h - 3, 0, fold, w - 5, h - 3])))
  const [a, b, c] = pts(Q, [-w + 1, h - 1, 0, fold, w - 1, h - 1]) as [
    Point,
    Point,
    Point,
  ]
  s.stroke(p.path([short(p, b, a), b, short(p, b, c)]))
  const seal = Q(0, fold + 2)
  s.fill(p.disc(...dot(seal, 7.5 * k)))
  s.paper(
    p.disc(...dot(seal, 4.4 * k)) + p.disc(seal, [3.4 * k, 0], [0, -3.4 * k]),
  )
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

/**
 * A paper dart climbing away to the right: built in its own space (x to the nose, y to its left wing, z up), banked a
 * little, pitched up, turned away and seen from above, so the far wing, a sliver of the inked keel and the near wing
 * fall in place. `at` is bottom-centre.
 */
export const paperPlane: Draw = (s, p, r, at, k = 1) => {
  const [yaw, pitch] = [
    (30 + r.signed() * 3) * deg,
    (20 + r.signed() * 3) * deg,
  ]
  const [cy, sy, cp, sp] = [
    Math.cos(yaw),
    Math.sin(yaw),
    Math.cos(pitch),
    Math.sin(pitch),
  ]
  const [cb, sb, ce, se] = [
    Math.cos(-8 * deg),
    Math.sin(-8 * deg),
    Math.cos(44 * deg),
    Math.sin(44 * deg),
  ]
  const see = (x: number, y0: number, z0: number): Point => {
    const [y, z] = [y0 * cb - z0 * sb, y0 * sb + z0 * cb]
    const [x1, z1] = [x * cp - z * sp, x * sp + z * cp]
    return [x1 * cy - y * sy, z1 * ce + (x1 * sy + y * cy) * se]
  }
  const parts = [
    see(100, 0, 0),
    see(0, 0, 0),
    see(0, 40, 5),
    see(0, 0, -20),
    see(0, -40, 5),
  ]
  const us = parts.map(([u]) => u)
  const mid = (Math.min(...us) + Math.max(...us)) / 2
  const low = Math.min(...parts.map(([, v]) => v))
  const P = place(at, k)
  const [nose, spine, far, keel, near] = parts.map(([u, v]) =>
    P(u - mid, v - low + 8),
  ) as [Point, Point, Point, Point, Point]
  // The keel, the near wing over most of it, then the far wing as one run tucked into the nose and the tail, so the
  // fold between the wings is drawn once. The near wing's blank reaches a little past the fold, towards the far
  // wing, so the keel's ink never shows along it; the keel starts back from the nose, where the near wing hides it.
  const fin = [lerp(nose, spine, 0.15), spine, keel]
  s.blank(p.shape(fin))
  s.fill(p.shape(fin))
  const across: Point = [spine[1] - nose[1], nose[0] - spine[0]]
  const towards =
    across[0] * (far[0] - spine[0]) + across[1] * (far[1] - spine[1])
  const lift = times(across, ((towards > 0 ? 2 : -2) * k) / dist(nose, spine))
  s.blank(p.shape([add(nose, lift), add(spine, lift), near]))
  s.stroke(p.shape([nose, spine, near]))
  s.stroke(p.path([short(p, far, nose), far, short(p, far, spine)]))
}

/**
 * A rotary desk telephone: a coiled cord behind, then the sloping body with its dial of ten finger holes, and the
 * handset resting across the top, which hides the top face. `at` is bottom-centre.
 */
export const telephone: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const o = depth(r)
  const d = 24
  const back: Map = (u, v) => P(u + o[0] * d, v - o[1] * d)
  const [bw, tw, h] = [42, 29, 40]
  const H: Map = (u, v) => P(u + o[0] * d * 0.35, h - 1.2 + v - o[1] * d * 0.35)
  const [b0, b1, b2, b3] = [H(-40, 1), P(-56, 26), P(-56, 6), P(-32, 8)]
  const bend = (t: number) =>
    lerp(
      lerp(lerp(b0, b1, t), lerp(b1, b2, t), t),
      lerp(lerp(b1, b2, t), lerp(b2, b3, t), t),
      t,
    )
  // Five loose turns of coil along the cord's bend, each turned to the way the cord runs.
  const coil = Array.from({ length: 121 }, (_, i) => {
    const t = i / 120
    const [a, b] = [bend(Math.max(0, t - 0.01)), bend(Math.min(1, t + 0.01))]
    const len = dist(a, b) || 1
    const [tx, ty] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
    const wind = t * Math.PI * 10
    const [along, across] = [4 * k * Math.cos(wind), 5.5 * k * Math.sin(wind)]
    return add(bend(t), [tx * along - ty * across, ty * along + tx * across])
  })
  s.stroke(p.path(coil))
  const [f0, f1] = [P(-tw, h), P(tw, h)]
  outline(s, p, [
    P(-bw, 0),
    P(bw, 0),
    back(bw, 0),
    back(tw, h),
    back(-tw, h),
    f0,
  ])
  s.stroke(p.path([short(p, f1, f0), f1, short(p, f1, back(tw, h))]))
  s.stroke(p.line(short(p, P(bw, 0), f1), short(p, f1, P(bw, 0))))
  const dial = P(0, 20)
  s.stroke(p.disc(...dot(dial, 16.5 * k)))
  for (let i = 0; i < 10; i++) {
    const a = (70 + i * 30) * deg
    const q = add(dial, [11.8 * k * Math.cos(a), 11.8 * k * Math.sin(a)])
    s.stroke(p.disc(...dot(q, 2 * k)))
  }
  s.fill(p.disc(...dot(dial, 4.4 * k)))
  const handset = [
    -41, 0, -44, 6, -43, 11, -38, 14.5, -26, 17, -12, 18.5, 0, 19, 12, 18.5, 26,
    17, 38, 14.5, 43, 11, 44, 6, 41, 0,
  ]
  // Its blank runs straight between the cups, so the top face doesn't show under the handle.
  s.blank(p.shape(pts(H, [...handset, 30, 0, -30, 0])))
  s.stroke(
    p.shape(
      pts(H, [
        ...handset,
        35,
        -1,
        30,
        0,
        27,
        5,
        16,
        8,
        0,
        9,
        -16,
        8,
        -27,
        5,
        -30,
        0,
        -35,
        -1,
      ]),
    ),
  )
}

/** A clipboard with three ticked rows, its sheet's corner turned up, under an open clip; `at` is bottom-centre. */
export const checklist: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const tip = r.signed() * 2
  const Q: Map = (u, v) => turn(P(u, v), P(0, 56), tip)
  // A rounded rectangle from its bottom-left corner, in the clipboard's own units.
  const R = (u: number, v: number, w: number, h: number, rad: number) =>
    roundRect(u, -(v + h), w, h, rad).map(([a, b]) => Q(a, -b))
  outline(s, p, R(-37, 0, 74, 108, 6))
  outline(s, p, pts(Q, [-29, 9, 20, 9, 29, 18, 29, 98, -29, 98]))
  outline(s, p, pts(Q, [20, 9, 29, 18, 20.5, 18.5]))
  for (const v of [76, 56, 36]) {
    s.stroke(p.shape(pts(Q, [-21, v - 5, -11, v - 5, -11, v + 5, -21, v + 5])))
    s.stroke(p.path(pts(Q, [-19.5, v + 0.5, -16, v - 3.5, -8.5, v + 7.5])))
    const text = Q(-3, v)
    scribble(s, p, r, text[0], text[1], 28 * k, 1)
  }
  outline(s, p, R(-11, 103, 22, 11, 4))
  outline(s, p, pts(Q, [-19, 91, 19, 91, 15, 106, -15, 106]))
  s.fill(p.shape(R(-5, 96, 10, 4.5, 2.2)))
}

const T = objectsIn("everyday")

define(
  T("envelope", "Envelope", [120, 86], [60, 75], 1, envelope, [
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
  T("paper-plane", "Paper plane", [126, 98], [63, 96], 1, paperPlane, [
    "sent",
    "message",
    "publish",
    "deploy",
    "done",
  ]),
  T("telephone", "Telephone", [132, 82], [68, 72], 1, telephone, [
    "contact",
    "support",
    "call",
    "help",
  ]),
  T("checklist", "Checklist", [96, 134], [48, 124], 1, checklist, [
    "done",
    "complete",
    "tasks",
    "confirm",
    "steps",
  ]),
)
