// Someone seated in profile on a stool, facing either way, built as seated.ts is: the torso one closed outline, the
// sleeves closed shapes from the shoulder, the head in profile, in the same proportions and clothes as figure().
// `pose` says what the near arm does: "draw" (forearm out to a table, a pen in the hand), "mug" (a mug held up) or
// "rest" (the hand on the knee). `at` is the floor under the stool; `view` "right" or "left" is the way they face.
import { add, arc, dot, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { cylinder } from "../shapes"
import type { Pen } from "../stroke"
import { TOPS } from "./clothes"
import { HAIR } from "./faces"
import { profile, profileBehind } from "./heads"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/** A sleeve from a to b, `t` wide, as one closed outline; returns where the hand goes, past the cuff. */
function sleeve(
  s: Sheet,
  p: Pen,
  a: Point,
  b: Point,
  t: number,
  cuff: boolean,
) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const n: Point = [(-dy * t) / len / 2, (dx * t) / len / 2]
  solid(s, p, [add(a, n), add(b, n), add(b, n, -1), add(a, n, -1)])
  const back = add(b, [dx, dy], (-4 * (t / 10)) / len)
  if (cuff) s.stroke(p.line(add(back, n, 0.85), add(back, n, -0.85)))
  return add(b, [dx, dy], (4 * (t / 10)) / len)
}

export const personSitting: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  {
    pose = r.pick(["draw", "mug", "rest"]),
    view = r.pick(["right", "left"]),
    hair = r.pick(HAIR),
    glasses = r.chance(0.3),
    beard = r.chance(0.15),
  } = {},
) => {
  const side = view === "left" ? -1 : 1
  const P = (u: number, v: number): Point => [
    at[0] + side * u * k,
    at[1] - v * k,
  ]
  const top = r.pick(TOPS.slice(0, 3))
  const lean = side * (pose === "draw" ? 9 : 3) + r.signed() * 1.5
  const hip = P(0, 80)
  const L = (u: number, v: number): Point => turn(P(u, v), hip, lean)
  // The stool under them: seat, the back leg, then the front legs.
  for (const [u, foot] of [
    [6, 18],
    [-14, -22],
    [14, 24],
  ] as [number, number][])
    solid(s, p, [
      P(u - 2.5, 72),
      P(u + 2.5, 72),
      P(foot + 2.5, 0),
      P(foot - 2.5, 0),
    ])
  cylinder(s, p, P(0, 78), 21 * k, 6.5 * k, 5 * k)
  const c = L(4, 168)
  profileBehind(s, p, c, k, side, hair as string)
  // The far shoe behind, then the near leg: thigh to the knee, shin to the floor, the shoe over the hem.
  const shoe = (u: number) => {
    const pts = [
      P(u - 6, 0),
      P(u + 18, 0),
      ...arc(P(u + 13, 3.5), 5.5 * k, 4.5 * k, 0, -100, 6).map(
        (q) => [q[0], q[1]] as Point,
      ),
      P(u - 6, 8),
    ]
    solid(s, p, pts)
  }
  shoe(34)
  solid(s, p, [P(-14, 92), P(46, 94), P(50, 84), P(46, 76), P(-12, 76)])
  solid(s, p, [P(37, 86), P(50, 86), P(48, 7), P(36, 7)])
  s.stroke(p.line(P(36.6, 13), P(47.6, 13)))
  shoe(40)
  // The torso, leaning to the table when they draw; a rib band at the hem of a sweater or hoodie.
  const torso = [
    L(-15, 78),
    L(14, 78),
    L(15, 120),
    L(11, 146),
    L(2, 151),
    L(-8, 149),
    L(-15, 136),
  ]
  solid(s, p, torso)
  if (top !== "overshirt") s.stroke(p.line(L(-14.4, 86), L(14.4, 86)))
  else s.stroke(p.line(L(13, 82), L(12.5, 140)))
  if (top === "hoodie")
    s.stroke(p.path([L(-9, 148), L(-15, 140), L(-11, 133), L(-4, 136)]))
  profile(s, p, c, k, side, {
    hair: hair as string,
    glasses: glasses as boolean,
    beard: beard as boolean,
    mood: "",
  })
  // The near arm: shoulder, elbow, hand, by pose.
  const shoulder = L(0, 141)
  const [elbow, hand] =
    pose === "draw"
      ? [L(10, 108), L(44, 106)]
      : pose === "mug"
        ? [L(6, 106), L(26, 132)]
        : [L(12, 106), L(40, 92)]
  sleeve(s, p, shoulder, elbow, 11 * k, false)
  const h = sleeve(s, p, elbow, hand, 10 * k, top !== "overshirt")
  s.blank(p.disc(...dot(h, 3.6 * k)))
  s.stroke(p.ring(...dot(h, 3.6 * k)))
  if (pose === "draw")
    s.stroke(
      p.line(add(h, [side * -2 * k, -8 * k]), add(h, [side * 6 * k, 6 * k])),
    )
  if (pose === "mug")
    cylinder(s, p, add(h, [side * 6 * k, -12 * k]), 7 * k, 2.4 * k, 14 * k)
}

const T = objectsIn("people")
define(T(
  "person-sitting",
  "Seated, in profile",
  [150, 220],
  [60, 210],
  1.05,
  personSitting,
  ["person", "work", "drawing"],
))
