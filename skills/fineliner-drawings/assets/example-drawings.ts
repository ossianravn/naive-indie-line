// A project's own drawings: a watering can, someone carrying a parcel and a plant shop. Copy this file to
// src/drawings/index.ts, replace the examples with what the project needs, and import "@/drawings" in every file that
// renders <Drawing> with one of these ids. Everything registers when the module runs.
import {
  add,
  arc,
  box,
  cylinder,
  define,
  defineScene,
  depth,
  dot,
  objectsIn,
  stage,
  type Draw,
  type HandName,
  type Point,
} from "@/fineliner/pen"

import {
  HAIR,
  TOPS,
  clothes,
  hairBehind,
  head,
} from "@/fineliner/pen/objects/people"
import "@/fineliner/pen/objects/indie"
import "@/fineliner/pen/objects/food"
import "@/fineliner/pen/objects/people"

/** A watering can, its spout to the right. `at` is the middle of its base; u runs right and v up, in its own units. */
export const wateringCan: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const rise = r.between(-3, 3)
  // Back to front: the handle and the spout first, so the body hides where they join it. The handle is two arches whose
  // feet stand inside the opening, which the body's top covers.
  for (const [rx, ry] of [
    [19, 24],
    [14, 18],
  ] as const)
    s.stroke(p.path(arc(P(0, 46), rx * k, ry * k, 180, 360, 12)))
  const spout = [P(20, 10), P(20, 24), P(54, 52 + rise), P(57, 47 + rise)]
  s.blank(p.shape(spout))
  s.stroke(p.shape(spout))
  s.fill(p.disc(...dot(P(56, 50 + rise), 4.5 * k)))
  cylinder(s, p, P(0, 46), 24 * k, 6 * k, 46 * k)
  // A band round the foot: its ends sit on the sides, where the pen's run-on follows them.
  s.stroke(p.path(arc(P(0, 9), 24 * k, 6 * k, 0, 180, 12)))
}

/** Someone carrying a parcel in front of them. `at` is between their feet. */
export const parcelCarrier: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { hair = r.pick(HAIR) } = {},
) => {
  const c: Point = [at[0], at[1] - 178 * k]
  hairBehind(s, p, c, k, hair)
  const { hands } = clothes(s, p, r, at, k, { pose: "mug", top: r.pick(TOPS) })
  head(s, p, r, c, k, { hair })
  // The parcel goes last, in front of the arm that holds it, with a strip of tape over the top.
  const parcel = box(
    s,
    p,
    depth(r),
    add(hands[1] as Point, [-8 * k, 8 * k]),
    34 * k,
    22 * k,
    14 * k,
  )
  s.stroke(
    p.path([parcel.top(0.5, 0.92), parcel.top(0.5, 0), parcel.front(0.5, 0.6)]),
  )
}

const T = objectsIn("shop")

define(
  T("watering-can", "Watering can", [140, 110], [56, 100], 1, wateringCan, [
    "garden",
    "plants",
    "care",
  ]),
  T(
    "parcel-carrier",
    "Carrying a parcel",
    [110, 240],
    [55, 232],
    1.15,
    parcelCarrier,
    ["person", "delivery", "order"],
  ),
)

/** A plant shop: plants on a counter, someone behind it, a customer with a parcel and a watering can on the floor. */
function plantShop(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, w, h, m, floor, walls, border } = stage(
    seed,
    hand,
    take,
    "plant-shop",
  )
  walls()
  put("window", "window", [r.between(0.22, 0.28) * w, floor - 124], 0.85, {
    view: "tree",
  })
  put("picture", "picture", [r.between(0.78, 0.84) * w, h * 0.22], 0.7)
  // Behind the counter first, so the counter (about half their height) hides them below the waist.
  const x = r.between(0.36, 0.42) * w
  put("visitor", "keeper", [x + r.between(150, 190), floor + 50], 1.05)
  const counter = box(s, p, depth(r), [x, floor + 88], 250, 96, 36)
  s.stroke(p.line(counter.front(0.04, 0.82), counter.front(0.96, 0.82)))
  put("house-plant", "fern", counter.top(0.12, 0.6), 0.55)
  put("cactus", "cactus", counter.top(0.34, 0.55), 0.5)
  put("coffee", "cup", counter.top(0.86, 0.35), 0.55)
  // In front: the customer, and the can on the floor.
  put(
    "parcel-carrier",
    "customer",
    [r.between(0.16, 0.22) * w, h - m - 14],
    1.2,
  )
  put("watering-can", "can", [r.between(0.84, 0.88) * w, h - m - 22], 1)
  border()
  return s
}

defineScene("plant-shop", {
  name: "Plant shop",
  label:
    "A plant shop: plants on a counter, someone behind it and a customer carrying a parcel",
  size: [640, 440],
  compose: plantShop,
})
