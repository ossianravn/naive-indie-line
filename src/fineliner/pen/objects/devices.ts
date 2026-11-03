// Studio: the freelancer's screens, and what is on them (a website, code, a design canvas or an app). `at` is
// bottom-left unless a function says otherwise. Composition comes from `r` (the shape stream), never from the pen,
// so takes agree.
import { add, dot, lerp, rect, roundRect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth } from "../shapes"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

/** Map u, v in [0, 1] onto a four-sided screen given top-left, top-right, bottom-right, bottom-left. */
function quad(corners: Point[]) {
  const [A, B, C, D] = corners as [Point, Point, Point, Point]
  return (u: number, v: number) => lerp(lerp(A, B, u), lerp(D, C, u), v)
}

/** What a screen shows: "site", "code", "canvas" or "app"; the first three are drawn from the seed. */
export function screen(
  s: Sheet,
  p: Pen,
  r: Stream,
  corners: Point[],
  kind: string = r.pick(["site", "code", "canvas"]),
) {
  const q = quad(corners)
  const box4 = (u0: number, v0: number, u1: number, v1: number) => [
    q(u0, v0),
    q(u1, v0),
    q(u1, v1),
    q(u0, v1),
  ]
  if (kind === "site") {
    s.stroke(p.line(q(0, 0.16), q(1, 0.16)))
    s.fill(p.disc(q(0.08, 0.08), [2, 0], [0, 2]))
    for (let i = 0; i < 3; i++)
      s.stroke(p.line(q(0.6 + i * 0.12, 0.08), q(0.68 + i * 0.12, 0.08)))
    s.stroke(p.edges(box4(0.08, 0.24, 0.92, 0.6)))
    s.stroke(
      p.path([
        q(0.12, 0.56),
        q(0.32, 0.36),
        q(0.46, 0.5),
        q(0.58, 0.42),
        q(0.88, 0.56),
      ]),
    )
    s.stroke(p.ring(q(0.76, 0.33), [3, 0], [0, 3]))
    s.stroke(p.line(q(0.08, 0.69), q(0.6, 0.69)))
    s.stroke(p.line(q(0.08, 0.77), q(0.82, 0.77)))
    s.fill(p.shape(box4(0.08, 0.85, 0.3, 0.94)))
  } else if (kind === "code") {
    let indent = 0
    for (let v = 0.12; v < 0.92; v += 0.1) {
      indent = Math.max(0, Math.min(3, indent + Math.round(r.signed() * 1.2)))
      const u0 = 0.14 + indent * 0.08
      s.stroke(p.line(q(0.05, v), q(0.08, v)))
      s.stroke(
        p.line(q(u0, v), q(Math.min(0.94, u0 + r.between(0.15, 0.55)), v)),
      )
    }
  } else if (kind === "canvas") {
    s.stroke(p.line(q(0.2, 0), q(0.2, 1)))
    s.stroke(p.line(q(0.8, 0), q(0.8, 1)))
    for (let v = 0.12; v < 0.6; v += 0.12)
      s.stroke(p.line(q(0.04, v), q(0.15, v)))
    s.stroke(p.edges(box4(0.3, 0.18, 0.7, 0.82)))
    s.stroke(p.ring(q(0.43, 0.42), [7, 0], [0, 7]))
    s.fill(p.shape(box4(0.5, 0.5, 0.62, 0.7)))
    for (let v = 0.14; v < 0.5; v += 0.1)
      s.stroke(p.line(q(0.84, v), q(0.96, v)))
  } else {
    s.stroke(p.line(q(0.1, 0.1), q(0.6, 0.1)))
    for (const v of [0.2, 0.46]) {
      s.stroke(p.edges(box4(0.1, v, 0.9, v + 0.2)))
      s.stroke(p.line(q(0.18, v + 0.07), q(0.7, v + 0.07)))
      s.stroke(p.line(q(0.18, v + 0.13), q(0.5, v + 0.13)))
    }
    for (let i = 0; i < 4; i++)
      s.fill(p.disc(q(0.2 + i * 0.2, 0.88), [1.5, 0], [0, 1.5]))
  }
}

export const laptop: Draw = (s, p, r, at, k = 1, { kind } = {}) => {
  const o = depth(r)
  const [x, y] = at
  const [w, d, h] = [124 * k, 64 * k, 80 * k]
  const back = (u: number) => add([x + w * u, y - 4 * k], o, d)
  const lean: Point = [o[0] * 8 * k, -h]
  const lid: [Point, Point, Point, Point] = [
    add(back(0), lean),
    add(back(1), lean),
    back(1),
    back(0),
  ]
  s.blank(p.shape(lid))
  s.stroke(p.edges(lid))
  const inset = (pt: Point, u: number, v: number) => add(pt, [u * k, v * k])
  screen(
    s,
    p,
    r,
    [
      inset(lid[0], 6, 6),
      inset(lid[1], -6, 6),
      inset(lid[2], -6, -6),
      inset(lid[3], 6, -6),
    ],
    kind,
  )
  const deck = box(s, p, o, at, w, 4 * k, d)
  const keys = (u0: number, v0: number, u1: number, v1: number) => [
    deck.top(u0, v0),
    deck.top(u1, v0),
    deck.top(u1, v1),
    deck.top(u0, v1),
  ]
  s.stroke(p.edges(keys(0.08, 0.38, 0.92, 0.9)))
  for (const v of [0.55, 0.72])
    s.stroke(p.line(deck.top(0.08, v), deck.top(0.92, v)))
  s.stroke(p.edges(keys(0.38, 0.08, 0.62, 0.3)))
}

/** A monitor on its stand; `at` is the centre of the stand's foot. */
export const monitor: Draw = (s, p, r, at, k = 1, { kind } = {}) => {
  const [x, y] = at
  const [w, h] = [150 * k, 96 * k]
  const top = y - 30 * k - h
  s.stroke(p.ring([x, y - 3 * k], [26 * k, 0], [0, 5 * k]))
  s.stroke(p.line([x - 4 * k, y - 4 * k], [x - 4 * k, y - 30 * k]))
  s.stroke(p.line([x + 4 * k, y - 4 * k], [x + 4 * k, y - 30 * k]))
  const outer = rect(x - w / 2, top, w, h)
  s.blank(p.shape(outer))
  s.stroke(p.edges(outer))
  const inner = rect(x - w / 2 + 6 * k, top + 6 * k, w - 12 * k, h - 14 * k)
  s.stroke(p.edges(inner))
  const pad: Point[] = [
    [4, 4],
    [-4, 4],
    [-4, -4],
    [4, -4],
  ]
  screen(
    s,
    p,
    r,
    inner.map((pt, i) => add(pt, pad[i] as Point, k)),
    kind,
  )
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

/** A browser window showing a website, with the pointer on it. */
export const website: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const [w, h] = [172 * k, 124 * k]
  const win = rect(x, y - h, w, h)
  s.blank(p.shape(win))
  s.stroke(p.edges(win))
  s.stroke(p.line([x, y - h + 16 * k], [x + w, y - h + 16 * k]))
  for (let i = 0; i < 3; i++)
    s.stroke(
      p.ring([x + (10 + i * 9) * k, y - h + 8 * k], [2.6 * k, 0], [0, 2.6 * k]),
    )
  s.stroke(p.edges(rect(x + 44 * k, y - h + 4 * k, 96 * k, 8 * k)))
  screen(
    s,
    p,
    r,
    [
      [x + 6 * k, y - h + 22 * k],
      [x + w - 6 * k, y - h + 22 * k],
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
