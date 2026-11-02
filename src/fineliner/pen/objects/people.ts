// People with faces, and portraits for avatars. `at` is where they stand (bottom-centre) unless a function says
// otherwise; `k` is their scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, length, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"
import { mug } from "./desk"

export const HAIR = ["bob", "crop", "short", "bun", "curls", "long", "bald"]

/** A sleeve hanging from shoulder S, swung by a degrees; returns its outline and where the hand goes. */
function sleeve(S: Point, side: number, k: number, a: number) {
  const cut: Point[] = [
    [8, 27],
    [11, 51],
    [1, 53],
    [-5, 23],
  ]
  const pts = cut.map(([u, v]) =>
    turn([S[0] + side * u * k, S[1] + v * k], S, a),
  )
  const [a0, a1, a2, a3] = pts as [Point, Point, Point, Point]
  const cuff: Point = [(a1[0] + a2[0]) / 2, (a1[1] + a2[1]) / 2]
  const out: Point = [
    cuff[0] - (a0[0] + a3[0]) / 2,
    cuff[1] - (a0[1] + a3[1]) / 2,
  ]
  const len = length(out) || 1
  return { outline: [S, ...pts], hand: add(cuff, out, (4.5 * k) / len) }
}

/** What someone wears: a pose, a top, a bottom, how far apart the feet are, and whether anybody is inside. */
export interface Outfit {
  pose?: string
  top?: string
  bottom?: string
  stride?: number
  nobody?: boolean
}

/** Shirt or sweater and trousers or skirt; returns the hands and the neck. */
export function clothes(
  s: Sheet,
  p: Pen,
  r: Stream,
  at: Point,
  k: number,
  {
    pose = "stand",
    top = "shirt",
    bottom = "trousers",
    stride = 0,
    nobody = false,
  }: Outfit = {},
) {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y + v * k]
  const legs =
    bottom === "skirt"
      ? [P(-16, -90), P(-24, -40), P(24, -40), P(16, -90)]
      : [
          P(-16, -90),
          P(-15 - stride, -4),
          P(-4 - stride, -4),
          P(0, -58),
          P(4 + stride, -4),
          P(15 + stride, -4),
          P(16, -90),
        ]
  if (bottom === "skirt")
    for (const side of [-1, 1])
      for (const dx of [5, 11])
        s.stroke(p.line(P(side * dx, -40), P(side * dx, -5)))
  if (!nobody)
    for (const side of [-1, 1])
      s.fill(p.disc(P(side * (9.5 + stride), -2.5), [7 * k, 0], [0, 3 * k]))
  s.blank(p.shape(legs))
  s.stroke(p.path(legs))
  const body = [
    P(-8, -163),
    P(-22, -155),
    P(-17, -132),
    P(-20, -88),
    P(20, -88),
    P(17, -132),
    P(22, -155),
    P(8, -163),
  ]
  s.blank(p.shape(body))
  s.stroke(p.path(body))
  if (top === "shirt") {
    s.stroke(p.path([P(-8, -162), P(-3, -152), P(0, -158)]))
    s.stroke(p.path([P(8, -162), P(3, -152), P(0, -158)]))
    s.stroke(p.line(P(0, -156), P(0, -90)))
  } else {
    s.stroke(p.path(arc([0, -163], 8, 4, 0, 180, 8).map(([u, v]) => P(u, v))))
    s.stroke(p.line(P(-19.5, -95), P(19.5, -95)))
  }
  // Every pose's swing is drawn, in this order, whichever pose is used, so the draws after it stay put.
  const stand: Point = [r.signed() * 5, r.signed() * 5]
  const swings: Record<string, Point> = {
    stand,
    wave: [r.signed() * 5, -155],
    mug: [r.signed() * 5, 52],
    walk: [14, -12],
  }
  const swing = swings[pose] ?? stand
  const hands = [-1, 1].map((side, i) => {
    const sl = sleeve(P(side * 22, -155), side, k, swing[i] as number)
    s.blank(p.shape(sl.outline))
    s.stroke(p.path([...sl.outline, sl.outline[0] as Point]))
    return sl.hand
  })
  for (const h of nobody ? [] : hands) {
    s.blank(p.disc(...dot(h, 3.6 * k)))
    s.stroke(p.ring(...dot(h, 3.6 * k)))
  }
  return { hands, neck: P(0, -163) }
}

/** A head centred at `at`: face, ears, features and hair, all from the seed unless given. */
export const head: Draw = (
  s,
  p,
  r,
  c,
  k = 1,
  { hair = r.pick(HAIR), glasses = r.chance(0.3), beard = r.chance(0.2) } = {},
) => {
  const P = (u: number, v: number): Point => [c[0] + u * k, c[1] + v * k]
  const A = (rx: number, ry: number, a0: number, a1: number, n = 14, dy = 0) =>
    arc([0, dy], rx, ry, a0, a1, n).map(([u, v]) => P(u, v))
  if (hair === "long") {
    const back = [P(-15, 30), ...A(15.5, 19, 160, 380, 18), P(15, 30)]
    s.blank(p.shape(back))
    s.stroke(p.path(back))
  }
  s.stroke(p.line(P(-4, 13), P(-4, 21)))
  s.stroke(p.line(P(4, 13), P(4, 21)))
  s.blank(p.disc(c, [12 * k, 0], [0, 15 * k]))
  s.stroke(p.ring(c, [12 * k, 0], [0, 15 * k]))
  if (!["bob", "long"].includes(hair)) {
    s.stroke(p.path(A(3, 4, 270, 450, 6).map((pt) => add(pt, [12 * k, 2 * k]))))
    s.stroke(p.path(A(3, 4, 90, 270, 6).map((pt) => add(pt, [-12 * k, 2 * k]))))
  }
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
    s.fill(
      p.shape([
        ...A(13, 16.5, 175, 365, 14),
        P(9, -7),
        P(4, -5),
        P(-2, -8),
        P(-8, -5),
        P(-12.5, -3),
      ]),
    )
  else if (hair === "short" || hair === "bun") {
    s.stroke(p.path([P(-12, -2), ...A(13.5, 17, 190, 350, 12), P(12, -2)]))
    s.stroke(p.path([P(-6, -14), P(-2, -8), P(3, -13)]))
    if (hair === "bun") s.fill(p.disc(...dot(P(0, -20), 5.5 * k)))
  } else if (hair === "curls")
    for (let a = 165; a <= 375; a += 26)
      s.stroke(p.ring(...dot(A(14, 17, a, a, 1)[0] as Point, 4.2 * k)))
  else if (hair === "long")
    s.stroke(p.path([P(-12, 4), ...A(13, 16, 190, 350, 12), P(12, 4)]))
  if (glasses) {
    for (const side of [-1, 1])
      s.stroke(p.ring(...dot(P(side * 5, 1), 3.8 * k)))
    s.stroke(p.line(P(-1.2, 0.5), P(1.2, 0.5)))
  }
  for (const side of [-1, 1]) s.fill(p.disc(...dot(P(side * 5, 1), 1.15 * k)))
  s.stroke(p.path([P(0.6, 2), P(-1.4, 7.2), P(1.4, 7.6)]))
  if (beard && hair !== "long")
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

/** A person standing, waving or holding a mug; long hair is drawn behind the clothes. */
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
  const top = r.pick(["shirt", "sweater"])
  const bottom = r.chance(0.3) ? "skirt" : "trousers"
  const c: Point = [at[0], at[1] - 178 * k]
  if (hair === "long") head(s, p, r, c, k, { hair, glasses, beard })
  const { hands } = clothes(s, p, r, at, k, {
    pose,
    top,
    bottom,
    stride: r.signed() * 2,
  })
  if (hair !== "long") head(s, p, r, c, k, { hair, glasses, beard })
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
  const shoulders = [
    P(-36, 46),
    P(-31, 26),
    P(-12, 16),
    P(12, 16),
    P(31, 26),
    P(36, 46),
  ]
  s.stroke(p.path(shoulders))
  s.stroke(
    p.path(
      r.chance(0.5)
        ? [P(-7, 16), P(0, 25), P(7, 16)]
        : arc([0, 16], 8, 5, 0, 180, 8).map(([u, v]) => P(u, v)),
    ),
  )
  head(s, p, r, P(0, -6), k, options)
}

const T = objectsIn("people")

define(
  T("person", "Person", [110, 240], [55, 232], 1.15, person, [
    "person",
    "team",
    "customer",
  ]),
  T("person-wave", "Waving", [110, 240], [55, 232], 1.15, personWave, [
    "person",
    "greeting",
    "welcome",
  ]),
  T("person-mug", "With a mug", [110, 240], [55, 232], 1.15, personMug, [
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
