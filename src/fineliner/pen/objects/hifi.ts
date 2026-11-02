// Indie: the hi-fi. Each function draws one object; `at` is its anchor (bottom-left unless it says
// otherwise) and `k` its scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, dist, dot, times, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth } from "../shapes"

export const turntable: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 118 * k, 20 * k, 74 * k)
  const c = b.top(0.4, 0.5)
  const u: Point = [b.w * 0.27, 0]
  const v = times(b.o, b.d * 0.42)
  s.stroke(p.ring(c, times(u, 1.14), times(v, 1.14)))
  s.fill(p.disc(c, u, v))
  s.paper(p.disc(c, times(u, 0.3), times(v, 0.3)))
  s.stroke(p.ring(c, times(u, 0.3), times(v, 0.3)))
  const pivot = b.top(0.87, 0.75)
  s.stroke(p.ring(...dot(pivot, 3.5 * k)))
  s.stroke(p.path([pivot, b.top(0.9, 0.35), b.top(0.7, 0.2)]))
  for (let i = 0; i < 3; i++)
    s.stroke(p.ring(...dot(b.front(0.12 + i * 0.09, 0.5), 2.4 * k)))
  s.stroke(
    p.edges([
      b.front(0.62, 0.28),
      b.front(0.86, 0.28),
      b.front(0.86, 0.72),
      b.front(0.62, 0.72),
    ]),
  )
}

export const speaker: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 36 * k, 56 * k, 28 * k)
  const woofer = b.front(0.5, 0.35)
  const tweeter = b.front(0.5, 0.77)
  s.stroke(p.ring(...dot(woofer, 11 * k)))
  s.stroke(p.ring(...dot(woofer, 5 * k)))
  s.fill(p.disc(...dot(woofer, 1.8 * k)))
  s.stroke(p.ring(...dot(tweeter, 5 * k)))
  s.fill(p.disc(...dot(tweeter, 1.6 * k)))
}

export const cassette: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = [
    P(0, 4),
    P(4, 0),
    P(92, 0),
    P(96, 4),
    P(96, 56),
    P(92, 60),
    P(4, 60),
    P(0, 56),
  ]
  s.blank(p.shape(body))
  s.stroke(p.edges(body))
  s.stroke(p.edges([P(10, 52), P(86, 52), P(86, 24), P(10, 24)]))
  s.stroke(p.edges([P(30, 44), P(66, 44), P(66, 32), P(30, 32)]))
  for (const cx of [22, 74]) {
    s.stroke(p.ring(...dot(P(cx, 38), 7 * k)))
    s.fill(p.disc(...dot(P(cx, 38), 2.4 * k)))
  }
  s.stroke(p.edges([P(18, 0), P(24, 12), P(72, 12), P(78, 0)], false))
  for (const hx of [32, 42, 54, 64]) s.fill(p.disc(...dot(P(hx, 6), 1.3 * k)))
  if (r.chance(0.6))
    s.stroke(p.path([P(14, 48), P(34, 49), P(50, 47), P(70, 48)]))
}

export const radio: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 96 * k, 56 * k, 26 * k)
  const grille = b.front(0.3, 0.48)
  s.stroke(p.ring(...dot(grille, 19 * k)))
  for (let i = -3; i <= 3; i++)
    for (let j = -3; j <= 3; j++) {
      const pt = add(grille, [(i + (j % 2) * 0.5) * 5 * k, j * 4.4 * k])
      if (dist(pt, grille) < 15 * k) s.fill(p.disc(...dot(pt, 0.9 * k)))
    }
  s.stroke(
    p.edges([
      b.front(0.58, 0.62),
      b.front(0.92, 0.62),
      b.front(0.92, 0.8),
      b.front(0.58, 0.8),
    ]),
  )
  for (let i = 1; i < 6; i++)
    s.stroke(
      p.line(b.front(0.58 + i * 0.057, 0.62), b.front(0.58 + i * 0.057, 0.68)),
    )
  s.stroke(p.ring(...dot(b.front(0.66, 0.3), 5 * k)))
  s.stroke(p.ring(...dot(b.front(0.84, 0.3), 5 * k)))
  const base = b.top(0.85, 0.5)
  s.stroke(p.line(base, add(base, [-38 * k, -44 * k])))
  s.fill(p.disc(...dot(add(base, [-38 * k, -44 * k]), 1.8 * k)))
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
