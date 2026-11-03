// Someone at work, seen from behind on an office chair: the back of a sweater, hoodie, open shirt or tee above the
// backrest, elbows out to either side, then the chair's seat, column and five-star base in front of them. The visitor
// is only their clothes; the person shows the back of their head. `at` is the floor under the chair's column.
import { add, arc, dot, length, roundRect, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"
import { TOPS } from "./clothes"
import { HAIR } from "./faces"

type Place = (u: number, v: number) => Point
const pts = (P: Place, list: [number, number][]) =>
  list.map(([u, v]) => P(u, v))

/** The office chair from behind, drawn over whoever sits in it: seat, backrest, column and base. */
function chair(s: Sheet, p: Pen, P: Place, k: number, high: number) {
  const R = (u: number, v: number, w: number, h: number, rad: number) =>
    roundRect(...P(u, v), w * k, h * k, rad * k)
  const part = (outline: Point[]) => {
    s.blank(p.shape(outline))
    s.stroke(p.shape(outline))
  }
  part(R(-33, -60, 66, 11, 5))
  part(
    pts(P, [
      [-4.5, -74],
      [4.5, -74],
      [4.5, -59],
      [-4.5, -59],
    ]),
  )
  part(R(-21, -116 - high, 42, 44 + high, 12))
  s.stroke(p.shape(R(-17, -112 - high, 34, 36 + high, 8.5)))
  // Five legs round the hub, seen a little from above: the two pointing away go behind the column.
  const hub: Point = [0, -18]
  const leg = (a: number) => {
    const tip = arc(hub, 34, 10, a, a, 1)[0] as Point
    const len = length([tip[0], tip[1] - hub[1]]) || 1
    const side: Point = [((hub[1] - tip[1]) / len) * 1.6, (tip[0] / len) * 1.6]
    part(
      pts(P, [
        add(hub, side, -1),
        add(tip, side, -0.7),
        add(tip, side, 0.7),
        add(hub, side),
      ]),
    )
    s.stroke(p.line(P(tip[0], tip[1] + 1), P(tip[0], tip[1] + 3)))
    s.blank(p.disc(...dot(P(tip[0], tip[1] + 5.5), 3 * k)))
    s.stroke(p.ring(...dot(P(tip[0], tip[1] + 5.5), 3 * k)))
  }
  leg(234)
  leg(-54)
  part(
    pts(P, [
      [-2.4, -49],
      [2.4, -49],
      [2.4, -34],
      [-2.4, -34],
    ]),
  )
  part(
    pts(P, [
      [-4, -34],
      [4, -34],
      [4, -19],
      [-4, -19],
    ]),
  )
  for (const a of [162, 18, 90]) leg(a)
}

/** The back of a head centred at `c`: the hair covers the crown and stops at the nape, the ears stand out of it. */
function backOfHead(s: Sheet, p: Pen, P: Place, k: number, hair: string) {
  const A = (rx: number, ry: number, a0: number, a1: number) =>
    arc([0, -160], rx, ry, a0, a1, 14).map(([u, v]) => P(u, v))
  s.stroke(p.line(P(-4, -145), P(-4, -139)))
  s.stroke(p.line(P(4, -145), P(4, -139)))
  s.blank(p.disc(P(0, -160), [12 * k, 0], [0, 15 * k]))
  s.stroke(p.ring(P(0, -160), [12 * k, 0], [0, 15 * k]))
  const nape = pts(P, [
    [12.5, -155],
    [6, -150.5],
    [0, -149.5],
    [-6, -150.5],
    [-12.5, -155],
  ])
  if (hair === "bob" || hair === "fringe") {
    const hem = hair === "bob" ? -148 : -151
    s.fill(p.shape([...A(15, 18, 165, 375), P(14.5, hem), P(-14.5, hem)]))
  } else if (hair === "long")
    s.fill(
      p.shape([
        ...A(15.5, 19, 160, 380),
        ...pts(P, [
          [16, -126],
          [5, -124],
          [-5, -125],
          [-16, -126],
        ]),
      ]),
    )
  else if (hair === "waves") {
    const crown = Array.from({ length: 13 }, (_, i): Point => {
      const [f, a] = [i % 2 ? 1.07 : 1, 175 + (i * 190) / 12]
      return A(13.5 * f, 18 * f, a, a)[0] as Point
    })
    s.fill(p.shape([...crown, ...nape]))
  } else s.fill(p.shape([...A(13, 16.5, 175, 365), ...nape]))
  if (hair === "curls")
    for (let a = 165; a <= 375; a += 25)
      s.fill(p.disc(...dot(A(13.5, 16.5, a, a)[0] as Point, 5 * k)))
  if (hair === "bun") s.fill(p.disc(...dot(P(0, -177), 6.5 * k)))
  if (hair === "ponytail")
    s.fill(
      p.shape(
        pts(P, [
          [-3, -156],
          [3, -156],
          [4.5, -141],
          [1, -130],
          [-2.5, -140],
        ]),
      ),
    )
  if (["crop", "bun", "ponytail", "waves"].includes(hair))
    for (const side of [-1, 1]) {
      const from = side > 0 ? -90 : 90
      const ear = arc([side * 12.5, -158], 2.8, 4, from, from + 180, 6)
      s.blank(p.shape(pts(P, ear as [number, number][])))
      s.stroke(p.path(pts(P, ear as [number, number][])))
    }
}

/** Seated from behind; `hair` gives the person a head, without it they are only their clothes. */
const seated = (withHead: boolean): Draw =>
  function sitter(s, p, r, at, k = 1, options = {}) {
    const P: Place = (u, v) => [at[0] + u * k, at[1] + v * k]
    const top = r.pick(withHead ? TOPS : TOPS.slice(0, 3))
    const hair = options.hair ?? r.pick(HAIR)
    const high = r.between(0, 8)
    const reach = [r.between(0, 4), r.between(0, 4)]
    const torso = pts(P, [
      [-8, -141],
      [-25, -133],
      [-24, -108],
      [-25, -62],
      [25, -62],
      [24, -108],
      [25, -133],
      [8, -141],
    ])
    s.blank(p.shape(torso))
    s.stroke(p.shape(torso))
    // Elbows bent out to either side, the forearms going on to the desk out of sight.
    for (const [i, side] of [-1, 1].entries()) {
      const out = reach[i] as number
      const u = (x: number) => side * x
      const arm = pts(P, [
        [u(17), -139],
        [u(26), -133],
        [u(37 + out), -104],
        [u(36 + out), -96],
        [u(28), -95],
        [u(23), -110],
      ])
      s.blank(p.shape(arm))
      s.stroke(p.shape(arm))
      if (top === "tee")
        s.stroke(
          p.path(
            pts(P, [
              [u(28.5), -118],
              [u(23), -116],
            ]),
          ),
        )
      else if (top !== "overshirt")
        s.stroke(p.line(P(u(32 + out), -100), P(u(35 + out), -97)))
    }
    if (top === "hoodie") {
      const hood = pts(P, [
        [-12, -141],
        [-14.5, -131],
        [-8, -122],
        [8, -122],
        [14.5, -131],
        [12, -141],
      ])
      s.blank(p.shape(hood))
      s.stroke(p.shape(hood))
    }
    if (top === "overshirt") {
      s.stroke(
        p.path(
          pts(P, [
            [-9, -140.5],
            [0, -137],
            [9, -140.5],
          ]),
        ),
      )
      s.stroke(p.line(P(-17, -131), P(17, -131)))
    }
    if (withHead) backOfHead(s, p, P, k, hair)
    else s.stroke(p.ring(P(0, -140.5), [8 * k, 0], [0, 2.6 * k]))
    chair(s, p, P, k, high)
  }

export const visitorSeated = seated(false)
export const personSeated = seated(true)

const T = objectsIn("people")

define(
  T(
    "visitor-seated",
    "Visitor at work",
    [120, 200],
    [60, 192],
    1.05,
    visitorSeated,
    ["person", "work", "desk"],
  ),
  T(
    "person-seated",
    "At work, from behind",
    [120, 220],
    [60, 212],
    1.05,
    personSeated,
    ["person", "work", "focus"],
  ),
)
