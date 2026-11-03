// People with faces, and portraits for avatars. `at` is where they stand (bottom-centre) unless a function says
// otherwise; `k` is their scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, roundRect, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"
import { clothes, TOPS } from "./clothes"
import { mug } from "./parts"

/** Hair is a pocket of ink: drawn as an outline it reads as grey. */
export const HAIR = [
  "bob",
  "crop",
  "fringe",
  "bun",
  "curls",
  "long",
  "ponytail",
  "waves",
]

/** Points on a head centred at `c`: u across, v down, both scaled by k. */
const onHead = (c: Point, k: number) => ({
  P: (u: number, v: number): Point => [c[0] + u * k, c[1] + v * k],
  A: (rx: number, ry: number, a0: number, a1: number, n = 14, dy = 0) =>
    arc([0, dy], rx, ry, a0, a1, n).map(([u, v]): Point => [
      c[0] + u * k,
      c[1] + v * k,
    ]),
})

/** The hair that falls behind the head and shoulders: long hair, a ponytail, a fringe's back. Draw before the clothes. */
export function hairBehind(
  s: Sheet,
  p: Pen,
  c: Point,
  k: number,
  hair: string,
) {
  const { P, A } = onHead(c, k)
  const fall = ({ long: 32, fringe: 13 } as Record<string, number>)[hair]
  if (fall)
    s.fill(p.shape([P(-15, fall), ...A(15.5, 19, 160, 380, 18), P(15, fall)]))
  if (hair === "ponytail")
    s.fill(
      p.shape([
        P(7, -12),
        P(17, -10),
        P(22, 2),
        P(20, 22),
        P(16, 12),
        P(12, 0),
      ]),
    )
}

/** A face centred at `c` with its hair in front: ears, features, glasses and a beard, all from the seed unless given. */
export const head: Draw = (
  s,
  p,
  r,
  c,
  k = 1,
  { hair = r.pick(HAIR), glasses = r.chance(0.3), beard = r.chance(0.15) } = {},
) => {
  const { P, A } = onHead(c, k)
  s.stroke(p.line(P(-4, 12), P(-4, 15.5)))
  s.stroke(p.line(P(4, 12), P(4, 15.5)))
  s.blank(p.disc(c, [12 * k, 0], [0, 15 * k]))
  s.stroke(p.ring(c, [12 * k, 0], [0, 15 * k]))
  if (["crop", "bun", "ponytail", "waves"].includes(hair)) {
    s.stroke(
      p.path(A(2.6, 3.6, 270, 450, 6).map((pt) => add(pt, [12 * k, 2 * k]))),
    )
    s.stroke(
      p.path(A(2.6, 3.6, 90, 270, 6).map((pt) => add(pt, [-12 * k, 2 * k]))),
    )
  }
  // A cap of hair over the crown, its hairline given as points from the right temple to the left.
  const cap = (rx: number, ry: number, line: [number, number][]) =>
    s.fill(
      p.shape([...A(rx, ry, 180, 360, 14), ...line.map(([u, v]) => P(u, v))]),
    )
  if (hair === "bob")
    s.fill(
      p.shape([
        P(-14.5, 11),
        ...A(15, 18, 170, 370, 16),
        P(14.5, 11),
        P(11, 11),
        P(11, -4),
        P(-11, -4),
        P(-11, 11),
      ]),
    )
  else if (hair === "crop")
    cap(13, 16.5, [
      [12.6, -3],
      [9, -7],
      [4, -5],
      [-2, -8],
      [-8, -5],
      [-12.6, -3],
    ])
  else if (hair === "bun" || hair === "ponytail") {
    cap(13, 16.3, [
      [12.8, -1],
      [7, -6.5],
      [0, -8],
      [-7, -6.5],
      [-12.8, -1],
    ])
    if (hair === "bun") s.fill(p.disc(...dot(P(1, -19), 6 * k)))
  } else if (hair === "waves") {
    // Short and a little tousled: the crown's outline swells and dips.
    const crown = Array.from({ length: 13 }, (_, i): Point => {
      const [f, a] = [i % 2 ? 1.07 : 1, 190 + (i * 160) / 12]
      return A(14 * f, 18.5 * f, a, a, 1)[0] as Point
    })
    s.fill(
      p.shape([
        ...crown,
        P(12.6, -2),
        P(7, -8),
        P(1, -6),
        P(-5, -9),
        P(-12.6, -1),
      ]),
    )
  } else if (hair === "curls") {
    cap(13, 16, [
      [12.5, -1],
      [6, -6],
      [-6, -6],
      [-12.5, -1],
    ])
    for (let a = 170; a <= 370; a += 25)
      s.fill(p.disc(...dot(A(13.5, 16.5, a, a, 1)[0] as Point, 5 * k)))
  } else if (hair === "long" || hair === "fringe") {
    // Parted: each side falls from the crown past the cheeks.
    const low = hair === "long" ? 12 : 9
    s.fill(
      p.shape([
        P(-12.8, low),
        ...A(13.5, 16.5, 180, 360, 14),
        P(12.8, low),
        P(10.6, low - 1),
        P(10, -3),
        P(4, -8.5),
        P(0, -11),
        P(-4, -8.5),
        P(-10, -3),
        P(-10.6, low - 1),
      ]),
    )
  }
  if (glasses) {
    for (const side of [-1, 1])
      s.stroke(
        p.shape(
          roundRect(
            c[0] + (side * 5.2 - 4.4) * k,
            c[1] - 2.6 * k,
            8.8 * k,
            7.2 * k,
            2.6 * k,
          ),
        ),
      )
    s.stroke(p.line(P(-0.9, 0.4), P(0.9, 0.4)))
  }
  for (const side of [-1, 1]) s.fill(p.disc(...dot(P(side * 5, 1), 1.15 * k)))
  s.stroke(p.path([P(0.6, 2), P(-1.4, 7.2), P(1.4, 7.6)]))
  if (beard && !["long", "bob", "fringe"].includes(hair))
    s.fill(
      p.shape([
        P(-12, 3),
        ...A(12.5, 16.5, 170, 10, 14),
        P(12, 3),
        P(5, 9),
        P(-5, 9),
      ]),
    )
  else s.stroke(p.path(A(3.4, 1.8, 20, 160, 6, 10.5)))
}

/** A person standing, waving or holding a mug, in everyday clothes. */
export const person: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  {
    pose = r.pick(["stand", "wave", "mug"]),
    hair = r.pick(HAIR),
    glasses,
    beard,
  } = {},
) => {
  const picked = r.pick(TOPS)
  // A hood would sit over long hair.
  const top = picked === "hoodie" && hair === "long" ? "sweater" : picked
  const bottom = r.chance(0.3) ? "skirt" : "trousers"
  const c: Point = [at[0], at[1] - 178 * k]
  hairBehind(s, p, c, k, hair)
  const { hands } = clothes(s, p, r, at, k, {
    pose,
    top,
    bottom,
    stride: r.signed() * 2,
  })
  head(s, p, r, c, k, { hair, glasses, beard })
  if (pose === "mug")
    mug(s, p, r, add(hands[1] as Point, [-3 * k, 4 * k]), 0.45 * k, {})
}

export const personWave: Draw = (s, p, r, at, k) =>
  person(s, p, r, at, k, { pose: "wave" })

export const personMug: Draw = (s, p, r, at, k) =>
  person(s, p, r, at, k, { pose: "mug" })

/** Head and shoulders, for avatars: `at` is the centre of the tile. */
export const portrait: Draw = (s, p, r, at, k = 1, options = {}) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] + v * k]
  const hair = options.hair ?? r.pick(HAIR)
  const top = r.pick(TOPS)
  const shoulders = [
    P(-36, 46),
    P(-31, 26),
    P(-12, 16),
    P(12, 16),
    P(31, 26),
    P(36, 46),
  ]
  hairBehind(s, p, P(0, 1), k, hair)
  if (top === "hoodie")
    s.stroke(p.path(arc([0, 20], 17, 8, 200, 340, 8).map(([u, v]) => P(u, v))))
  // Long hair falls behind the shoulders, not over the chest.
  s.blank(p.shape(shoulders))
  s.stroke(p.path(shoulders))
  s.stroke(p.path(arc([0, 16], 8, 5, 0, 180, 8).map(([u, v]) => P(u, v))))
  if (top === "overshirt")
    for (const side of [-1, 1])
      s.stroke(
        p.path([
          P(side * 8, 17),
          P(side * 15, 30),
          P(side * 6, 33),
          P(side * 7, 46),
        ]),
      )
  if (top === "hoodie")
    for (const side of [-1, 1])
      s.stroke(p.line(P(side * 3.5, 21), P(side * 4.5, 40)))
  head(s, p, r, P(0, 1), k, { ...options, hair })
}

const T = objectsIn("people")

define(
  T("person", "Person", [118, 262], [57, 252], 1.15, person, [
    "person",
    "team",
    "customer",
  ]),
  T("person-wave", "Waving", [118, 262], [57, 252], 1.15, personWave, [
    "person",
    "greeting",
    "welcome",
  ]),
  T("person-mug", "With a mug", [118, 262], [57, 252], 1.15, personMug, [
    "person",
    "break",
    "coffee",
  ]),
  T("portrait", "Portrait", [100, 100], [50, 46], 1, portrait, [
    "avatar",
    "profile",
    "account",
  ]),
)
