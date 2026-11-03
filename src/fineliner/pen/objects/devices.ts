// Studio: the freelancer's screens, and what is on them (a website, code, a design canvas or an app). `at` is
// bottom-left unless a function says otherwise. Composition comes from `r` (the shape stream), never from the pen,
// so takes agree. Outlines are closed shapes, so their corners meet; a line that has to meet an outline either ends
// in the air or carries on along it, so its overshoot never pokes through.
import {
  add,
  deg,
  dot,
  lerp,
  rect,
  roundRect,
  turn,
  type Point,
} from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { banded, box, depth } from "../shapes"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

/** Map u, v in [0, 1] onto a four-sided screen given top-left, top-right, bottom-right, bottom-left. */
function quad(corners: Point[]) {
  const [A, B, C, D] = corners as [Point, Point, Point, Point]
  return (u: number, v: number) => lerp(lerp(A, B, u), lerp(D, C, u), v)
}

/** Move a screen's corners in by `a` at the sides and top and by `b` at the bottom (top-left first, clockwise). */
const inset = (corners: Point[], a: number, b = a): Point[] =>
  corners.map((pt, i) => add(pt, [i === 0 || i === 3 ? a : -a, i < 2 ? a : -b]))

/** What a screen shows: "site", "code", "canvas" or "app"; the first three are drawn from the seed. */
export function screen(
  s: Sheet,
  p: Pen,
  r: Stream,
  corners: Point[],
  kind: string = r.pick(["site", "code", "canvas"]),
) {
  const q = quad(corners)
  const frame = (u0: number, v0: number, u1: number, v1: number) =>
    p.shape([q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)])
  const mark = (u: number, v: number, rad: number) =>
    p.disc(q(u, v), [rad, 0], [0, rad])
  if (kind === "site") {
    s.stroke(p.line(q(0.03, 0.16), q(0.97, 0.16)))
    s.fill(mark(0.08, 0.07, 2))
    for (let i = 0; i < 3; i++)
      s.stroke(p.line(q(0.6 + i * 0.12, 0.07), q(0.67 + i * 0.12, 0.07)))
    s.stroke(frame(0.08, 0.26, 0.92, 0.6))
    s.stroke(
      p.path([
        q(0.14, 0.55),
        q(0.32, 0.37),
        q(0.46, 0.5),
        q(0.58, 0.43),
        q(0.86, 0.55),
      ]),
    )
    s.stroke(mark(0.76, 0.35, 3))
    s.stroke(p.line(q(0.08, 0.69), q(0.6, 0.69)))
    s.stroke(p.line(q(0.08, 0.77), q(0.82, 0.77)))
    s.fill(frame(0.08, 0.85, 0.3, 0.94))
  } else if (kind === "code") {
    let indent = 0
    for (let v = 0.12; v < 0.92; v += 0.1) {
      indent = Math.max(0, Math.min(3, indent + Math.round(r.signed() * 1.2)))
      const u0 = 0.14 + indent * 0.08
      s.fill(mark(0.06, v, 1))
      s.stroke(
        p.line(q(u0, v), q(Math.min(0.94, u0 + r.between(0.15, 0.55)), v)),
      )
    }
  } else if (kind === "canvas") {
    s.stroke(p.line(q(0.2, 0.04), q(0.2, 0.96)))
    s.stroke(p.line(q(0.8, 0.04), q(0.8, 0.96)))
    for (let v = 0.12; v < 0.6; v += 0.12)
      s.stroke(p.line(q(0.05, v), q(0.14, v)))
    s.stroke(frame(0.3, 0.18, 0.7, 0.82))
    s.stroke(p.ring(q(0.43, 0.4), [7, 0], [0, 7]))
    s.fill(frame(0.5, 0.52, 0.62, 0.72))
    for (let v = 0.14; v < 0.5; v += 0.1)
      s.stroke(p.line(q(0.86, v), q(0.95, v)))
  } else {
    s.stroke(p.line(q(0.1, 0.1), q(0.6, 0.1)))
    for (const v of [0.2, 0.46]) {
      s.stroke(frame(0.1, v, 0.9, v + 0.2))
      s.stroke(p.line(q(0.18, v + 0.07), q(0.7, v + 0.07)))
      s.stroke(p.line(q(0.18, v + 0.13), q(0.5, v + 0.13)))
    }
    for (let i = 0; i < 4; i++) s.fill(mark(0.2 + i * 0.2, 0.88, 1.5))
  }
}

/** Laptop keys per row, front (space bar) to back, in key units; every row is 10 units. */
const KEYS = [
  [1.5, 1, 5, 1, 1.5],
  [2.25, 1, 1, 1, 1, 1, 1, 1.75],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

/**
 * An open laptop: the deck is a thin box with rows of keys and a touchpad on top, each a closed shape; the lid stands
 * on the deck's back edge, its foot hidden by the deck, with the screen inset in it. Seen a little steeper than most
 * objects, so the keys have room.
 */
export const laptop: Draw = (s, p, r, at, k = 1, { kind } = {}) => {
  const a = (40 + r.signed() * 6) * deg
  const o: Point = [Math.cos(a) * 0.6, -Math.sin(a) * 0.6]
  const [x, y] = at
  const [w, d, h] = [124 * k, 64 * k, 76 * k]
  const hinge = (u: number) => add([x + w * u, y - 4 * k], o, d)
  const lean = add([0, -h], o, 6 * k)
  const sunk: Point = [0, 3 * k]
  const lid = [
    add(hinge(0), lean),
    add(hinge(1), lean),
    add(hinge(1), sunk),
    add(hinge(0), sunk),
  ]
  s.blank(p.shape(lid))
  s.stroke(p.shape(lid))
  const glass = inset([lid[0], lid[1], hinge(1), hinge(0)] as Point[], 6 * k)
  s.stroke(p.shape(glass))
  screen(s, p, r, inset(glass, 4 * k), kind)
  const deck = box(s, p, o, at, w, 4 * k, d)
  const pad = (u0: number, v0: number, u1: number, v1: number) =>
    p.shape([
      deck.top(u0, v0),
      deck.top(u1, v0),
      deck.top(u1, v1),
      deck.top(u0, v1),
    ])
  KEYS.forEach((row, i) => {
    const v0 = 0.5 + i * 0.15
    let u0 = 0.07
    for (const units of row) {
      const u1 = u0 + (units * 0.86) / 10
      s.stroke(pad(u0 + 0.008, v0, u1 - 0.008, v0 + 0.11))
      u0 = u1
    }
  })
  s.stroke(pad(0.37, 0.1, 0.63, 0.38))
}

/**
 * A monitor on its stand; `at` is the centre of the stand's foot. The screen is a shallow box; the stand's neck rises
 * from the middle of the foot behind it, so the box hides its top, and the foot is a plate seen from above.
 */
export const monitor: Draw = (s, p, r, at, k = 1, { kind } = {}) => {
  const o = depth(r)
  const [x, y] = at
  const [w, h, d] = [150 * k, 96 * k, 12 * k]
  const neck = 5 * k
  const foot: Point = [x, y - 4 * k]
  s.stroke(p.disc(foot, [26 * k, 0], [0, 5.5 * k]))
  const post = rect(x - neck, y - 40 * k, 2 * neck, 36 * k)
  s.blank(p.shape(post))
  s.stroke(p.shape(post))
  const front = add([x - w / 2, y - 30 * k], o, -(d + 8 * k))
  const b = box(s, p, o, front, w, h, d)
  const glass = [b.front(0, 1), b.front(1, 1), b.front(1, 0), b.front(0, 0)]
  const inner = inset(glass, 6 * k, 9 * k)
  s.stroke(p.shape(inner))
  s.fill(p.disc(...dot(add(b.front(0.5, 0), [0, -4.5 * k]), 1.2 * k)))
  screen(s, p, r, inset(inner, 4 * k), kind)
}

/**
 * A phone face on: a rounded body drawn in one loop, the screen inset with its own corners, and a record playing on
 * it (cover, title, progress and the three controls). Small marks are solid shapes, which the pen does not overshoot.
 */
export const phone: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const R = (u: number, v: number, w: number, h: number, rad: number) =>
    roundRect(x + u * k, y - (v + h) * k, w * k, h * k, rad * k)
  const body = R(0, 0, 42, 86, 7)
  s.blank(p.shape(body))
  s.stroke(p.shape(body))
  s.stroke(p.shape(R(3, 3, 36, 80, 4.5)))
  s.fill(p.shape(R(16.5, 77.5, 9, 3, 1.5)))
  s.fill(p.shape(rect(x + 8 * k, y - 72 * k, 26 * k, 26 * k)))
  s.paper(p.disc(...dot(P(21, 59), 7.5 * k)))
  s.fill(p.disc(...dot(P(21, 59), 1.6 * k)))
  s.stroke(p.line(P(9, 39), P(r.between(26, 31), 39)))
  s.stroke(p.line(P(9, 34), P(r.between(16, 21), 34)))
  s.stroke(p.line(P(9, 25), P(33, 25)))
  s.fill(p.disc(...dot(P(r.between(13, 27), 25), 1.7 * k)))
  for (const tri of [
    [P(18.5, 18), P(18.5, 8), P(26, 13)],
    [P(13, 16.5), P(13, 9.5), P(8, 13)],
    [P(29, 16.5), P(29, 9.5), P(34, 13)],
  ])
    s.fill(p.shape(tri))
}

/**
 * A browser window showing a website, with the pointer on it: the tab bar is the window's top band, with three
 * buttons and an address field, each a closed shape.
 */
export const website: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const [w, h] = [172 * k, 124 * k]
  const top = y - h
  s.blank(p.shape(roundRect(x, top, w, h, 5 * k)))
  banded(s, p, x, top, w, h, 5 * k, 16 * k)
  for (let i = 0; i < 3; i++)
    s.stroke(p.disc(...dot([x + (10 + i * 9) * k, top + 8 * k], 2.6 * k)))
  s.stroke(p.shape(roundRect(x + 44 * k, top + 4 * k, 96 * k, 8 * k, 4 * k)))
  screen(
    s,
    p,
    r,
    [
      [x + 6 * k, top + 22 * k],
      [x + w - 6 * k, top + 22 * k],
      [x + w - 6 * k, y - 6 * k],
      [x + 6 * k, y - 6 * k],
    ],
    "site",
  )
  const tip: Point = [x + w * 0.27, y - h * 0.08]
  const arrow = [
    tip,
    add(tip, [0, 16 * k]),
    add(tip, [4 * k, 12 * k]),
    add(tip, [8 * k, 19 * k]),
    add(tip, [10.5 * k, 18 * k]),
    add(tip, [7 * k, 11 * k]),
    add(tip, [12 * k, 11 * k]),
  ]
  s.blank(p.shape(arrow))
  s.fill(p.shape(arrow.map((pt) => turn(pt, tip, -8))))
}

const T = objectsIn("studio")

define(
  T("laptop", "Laptop", [180, 140], [16, 130], 1, laptop, [
    "work",
    "computer",
    "remote",
  ]),
  T("monitor", "Monitor", [170, 150], [85, 142], 1, monitor, [
    "work",
    "computer",
    "screen",
  ]),
  T("website", "Website", [190, 140], [9, 134], 1, website, [
    "web",
    "browser",
    "launch",
  ]),
  T("phone", "Phone", [80, 132], [10.5, 126], 1.4, phone, [
    "mobile",
    "app",
    "call",
  ]),
)
