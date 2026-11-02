// People: visitors who are only their clothes, and a cat. `at` is where they stand (bottom-centre) and `k` their
// scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { clothes } from "./people"

/** A shirt and trousers with nobody in them, standing, walking or carrying a record. */
export const visitor: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { pose = r.pick(["stand", "walk", "record"]) } = {},
) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] + v * k]
  const { hands } = clothes(s, p, r, at, k, {
    pose: pose === "record" ? "mug" : pose,
    stride: pose === "walk" ? 9 : r.signed() * 2,
    nobody: true,
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
}

export const visitorRecord: Draw = (s, p, r, at, k) =>
  visitor(s, p, r, at, k, { pose: "record" })

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
  if (black) s.fill(p.shape(body))
  s.stroke(p.path([...body, body[0] as Point]))
  const c = P(0, 60)
  const face = [
    ...arc(c, 16 * k, 14 * k, -20, 200, 16),
    add(c, [-14 * k, -19 * k]),
    add(c, [-6 * k, -12 * k]),
    add(c, [6 * k, -12 * k]),
    add(c, [14 * k, -19 * k]),
  ]
  s.blank(p.shape(face))
  if (black) s.fill(p.shape(face))
  s.stroke(p.path([...face, face[0] as Point]))
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
    [110, 220],
    [50, 212],
    1.15,
    visitorRecord,
    ["person", "music", "shopping"],
  ),
  T("cat", "Cat", [100, 110], [50, 100], 1.1, cat, ["pet", "animal", "home"]),
)
