// People: visitors who are only their clothes, and a cat. `at` is where they stand (bottom-centre) and `k` their
// scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, turn, type Point } from "../geometry"
import type { Sheet } from "../layers"
import { define, type Draw, objectsIn } from "../library"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"
import { clothes } from "./clothes"
import { fan, headphones } from "./parts"

/**
 * A sweater, hoodie or open shirt and wide trousers with nobody in them. On its own the visitor stands empty-handed;
 * scenes may ask for "walk", "browse" (both hands down into a bin in front of them), "record" (carrying a sleeve, which
 * is also its own object, the visitor with a record), "cheer" (a find held high in both hands), "listen" (browsing with
 * headphones on, swaying to it) or "hail" (a hand raised to someone: good choice).
 */
export const visitor: Draw = (s, p, r, at, k = 1, { pose = "stand" } = {}) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] + v * k]
  const top = r.pick(["sweater", "hoodie", "overshirt"])
  const stride = pose === "walk" ? 9 : r.signed() * 2
  // The newer poses draw their arms' swing after the draws every pose makes, so the older poses keep their drawings.
  const swing: Point | undefined =
    pose === "cheer"
      ? [164 + r.signed() * 3, -166 + r.signed() * 3]
      : pose === "hail"
        ? [138 + r.signed() * 4, r.signed() * 5]
        : undefined
  const { hands } = clothes(s, p, r, at, k, {
    pose: pose === "record" ? "mug" : pose === "listen" ? "browse" : pose,
    top,
    stride,
    nobody: true,
    swing,
  })
  s.stroke(p.ring(P(0, -162.5), [8 * k, 0], [0, 2.6 * k]))
  if (pose === "record") {
    const h = hands[1] as Point
    const sleeveBox = [
      add(h, [-24 * k, -14 * k]),
      add(h, [4 * k, -14 * k]),
      add(h, [4 * k, 14 * k]),
      add(h, [-24 * k, 14 * k]),
    ]
    s.fill(p.shape(arc(add(h, [-24 * k, 0]), 12 * k, 12 * k, 90, 270, 8)))
    s.blank(p.shape(sleeveBox))
    s.stroke(p.edges(sleeveBox))
    s.stroke(
      p.path([
        add(h, [-18 * k, -6 * k]),
        add(h, [-12 * k, -2 * k]),
        add(h, [-16 * k, 4 * k]),
        add(h, [-6 * k, 6 * k]),
      ]),
    )
  }
  if (pose === "cheer") cheer(s, p, r, hands as [Point, Point], k)
  if (pose === "listen") listen(s, p, r, at, k)
  if (pose === "hail") fan(s, p, hands[0] as Point, 9 * k, [-150, -120, -90])
}

/**
 * The find held high: a sleeve gripped by its sides between the two raised cuffs, the record half out of it in ink
 * (the scene's one pocket) and a fan of short strokes round it. `lift` raises it by that share of its size, so it
 * clears a head (the visitors have none).
 */
export function cheer(
  s: Sheet,
  p: Pen,
  r: Stream,
  [a, b]: [Point, Point],
  k: number,
  lift = 0,
) {
  const n = Math.min(56 * k, Math.max(40 * k, Math.abs(b[0] - a[0]) * 0.9))
  const c = add([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [0, -n * (0.2 + lift)])
  const tilt = r.signed() * 6
  const on = (u: number, v: number) =>
    turn([c[0] + (u - 0.5) * n, c[1] + (v - 0.5) * n], c, tilt)
  s.fill(p.disc(...dot(on(0.62, 0.02), n * 0.4)))
  s.paper(p.disc(...dot(on(0.62, -0.1), n * 0.09)))
  const sleeve = [on(0, 0), on(1, 0), on(1, 1), on(0, 1)]
  s.blank(p.shape(sleeve))
  s.stroke(p.shape(sleeve))
  s.stroke(p.line(on(0.18, 0.64), on(0.82, 0.64)))
  s.stroke(p.line(on(0.18, 0.78), on(0.6, 0.78)))
  fan(s, p, on(0.5, -0.05), n * 0.72, [-160, -128, -96, -64, -28])
}

/**
 * Headphones on an empty collar, a little music leaking from the cups and a sway either side of the shoulders: someone
 * lost in what they are hearing.
 */
function listen(s: Sheet, p: Pen, r: Stream, at: Point, k: number) {
  const head: Point = [at[0], at[1] - 184 * k]
  headphones(s, p, r, add(head, [0, 13.6 * k]), k * 0.62, {})
  swaying(s, p, at, k)
}

/** Music leaking either side of the head and a sway either side of the shoulders, for someone standing at `at`. */
export function swaying(s: Sheet, p: Pen, at: Point, k: number) {
  const head: Point = [at[0], at[1] - 184 * k]
  for (const side of [-1, 1]) {
    fan(
      s,
      p,
      add(head, [side * 30 * k, 0]),
      6 * k,
      side < 0 ? [190, 215] : [-10, -35],
    )
    for (const d of [0, 7])
      s.stroke(
        p.path(
          arc(
            add(at, [side * (34 + d) * k, -135 * k]),
            6 * k,
            14 * k,
            side < 0 ? 120 : -60,
            side < 0 ? 240 : 60,
            6,
          ),
        ),
      )
  }
}

export const visitorRecord: Draw = (s, p, r, at, k) =>
  visitor(s, p, r, at, k, { pose: "record" })
export const visitorCheer: Draw = (s, p, r, at, k) =>
  visitor(s, p, r, at, k, { pose: "cheer" })
export const visitorListening: Draw = (s, p, r, at, k) =>
  visitor(s, p, r, at, k, { pose: "listen" })

/** A sitting cat, black or white from the seed, its tail to one side. */
export const cat: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { black = r.chance(0.4) } = {},
) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const tail = r.chance(0.5) ? 1 : -1
  s.stroke(
    p.path([
      P(tail * 18, 4),
      P(tail * 34, 10),
      P(tail * 36, 28),
      P(tail * 28, 40),
    ]),
  )
  const body = [
    P(-12, 44),
    P(-20, 26),
    P(-23, 8),
    P(-19, 0),
    P(19, 0),
    P(23, 8),
    P(20, 26),
    P(12, 44),
  ]
  s.blank(p.shape(body))
  // A black cat is one pocket of ink; a separate outline round it would wobble off its edge.
  s[black ? "fill" : "stroke"](p.shape(body))
  const c = P(0, 60)
  const face = [
    ...arc(c, 16 * k, 14 * k, -20, 200, 16),
    add(c, [-14 * k, -19 * k]),
    add(c, [-6 * k, -12 * k]),
    add(c, [6 * k, -12 * k]),
    add(c, [14 * k, -19 * k]),
  ]
  s.blank(p.shape(face))
  s[black ? "fill" : "stroke"](p.shape(face))
  const eye = black
    ? (pt: Point) => s.paper(p.disc(...dot(pt, 1.6 * k)))
    : (pt: Point) => s.fill(p.disc(...dot(pt, 1.4 * k)))
  eye(add(c, [-6 * k, 0]))
  eye(add(c, [6 * k, 0]))
  if (!black) {
    s.fill(
      p.shape([
        add(c, [-1.6 * k, 4 * k]),
        add(c, [1.6 * k, 4 * k]),
        add(c, [0, 6 * k]),
      ]),
    )
    for (const side of [-1, 1])
      for (const dy of [5, 8])
        s.stroke(
          p.line(
            add(c, [side * 5 * k, dy * k]),
            add(c, [side * 17 * k, (dy + (dy - 6.5) * 1.5) * k]),
          ),
        )
    for (let i = 0; i < 3; i++)
      s.stroke(p.line(P(-14 + i * 3, 14 + i * 9), P(-6 + i * 3, 16 + i * 9)))
  }
}

const T = objectsIn("people")

define(
  T("visitor", "Visitor", [110, 220], [50, 212], 1.15, visitor, [
    "person",
    "guest",
    "anonymous",
  ]),
  T(
    "visitor-record",
    "Visitor with a record",
    [112, 220],
    [70, 212],
    1.15,
    visitorRecord,
    ["person", "music", "shopping"],
  ),
  T(
    "visitor-cheer",
    "Visitor with a find",
    [150, 330],
    [75, 318],
    1,
    visitorCheer,
    ["person", "music", "joy"],
  ),
  T(
    "visitor-listening",
    "Visitor in headphones",
    [130, 240],
    [65, 232],
    1,
    visitorListening,
    ["person", "music", "listening"],
  ),
  T("cat", "Cat", [100, 110], [50, 100], 1.1, cat, ["pet", "animal", "home"]),
)
