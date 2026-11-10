// People in scenes, with faces: a whole person in any of the visitors' poses, looking out, turned to either side or
// seen from behind, so a room of several people does not have them all facing the same way. Looking out, the pose
// gives the face its mood (a find held high: joy, looking up; headphones on: eyes closed). Turned, the head is in
// profile over a body that stays square, as a naive hand draws someone looking across. From behind, the back of the
// clothes and of the head. `at` is where they stand (bottom-centre) and `k` their scale; composition comes from `r`
// (the shape stream), never from the pen, so takes agree.
import { add, arc, lerp, type Point } from "../geometry"
import type { Sheet } from "../layers"
import { define, type Draw, type DrawOptions, objectsIn } from "../library"
import { box, depth } from "../shapes"
import type { Pen } from "../stroke"
import { clothes, TOPS } from "./clothes"
import { HAIR, hairBehind, head } from "./faces"
import { backOfHead, profile, profileBehind } from "./heads"
import { fan } from "./parts"
import { arms, handset } from "./poses"
import { cheer, swaying } from "./visitors"

/** Which way someone faces: towards you, to the left or right of the sheet, or away. */
export const VIEWS = ["front", "left", "right", "back"]

/**
 * A person in a pose ("stand", "walk", "browse", "mug", "record", "cheer", "listen", "hail", "point",
 * "reach", "carry", "call") and a view (see VIEWS).
 * Their hair, glasses, beard, top and bottom come from the seed unless given.
 */
export const figure: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  {
    pose = "stand",
    view = "front",
    hair = r.pick(HAIR),
    glasses = r.chance(0.3),
    beard = r.chance(0.15),
  } = {},
) => {
  const picked = r.pick(TOPS)
  // A hood would sit over long hair.
  const top = picked === "hoodie" && hair === "long" ? "sweater" : picked
  const bottom = r.chance(0.3) ? "skirt" : "trousers"
  const stride = pose === "walk" ? 9 : r.signed() * 2
  const side = view === "left" ? -1 : view === "right" ? 1 : 0
  const back = view === "back"
  const { swing, bend } =
    pose === "cheer"
      ? { swing: [164 + r.signed() * 3, -166 + r.signed() * 3] as Point }
      : pose === "hail"
        ? { swing: [138 + r.signed() * 4, r.signed() * 5] as Point }
        : arms(r, pose, side)
  const c: Point = [at[0], at[1] - 178 * k]
  const mood = pose === "cheer" ? "joy" : pose === "listen" ? "dreamy" : ""
  if (side) profileBehind(s, p, c, k, side, hair)
  else if (!back) hairBehind(s, p, c, k, hair)
  const { hands } = clothes(s, p, r, at, k, {
    pose: pose === "record" ? "mug" : pose === "listen" ? "browse" : pose,
    top,
    bottom,
    stride,
    swing,
    back,
    bend,
  })
  if (back) backOfHead(s, p, c, k, hair, [12, 15.5])
  else if (side) profile(s, p, c, k, side, { hair, glasses, beard, mood })
  else head(s, p, r, c, k, { hair, glasses, beard, mood })
  if (pose === "cheer") cheer(s, p, r, hands as [Point, Point], k, 0.28)
  if (pose === "listen") {
    headphonesOn(s, p, c, k, side)
    swaying(s, p, at, k)
  }
  if (pose === "hail") fan(s, p, hands[0] as Point, 9 * k, [-150, -120, -90])
  if (pose === "call")
    handset(s, p, hands[side > 0 ? 0 : 1] as Point, c, k, side ? 6 : 13)
  return hands
}

/** Headphones worn on a head centred at `c`: the band over the crown and a cup over each ear, or the near one in
 * profile (side 1 or -1). */
function headphonesOn(s: Sheet, p: Pen, c: Point, k: number, side: number) {
  const P = (u: number, v: number): Point => [c[0] + u * k, c[1] + v * k]
  const cup = (at: Point, rx: number) => {
    s.blank(p.disc(at, [rx * k, 0], [0, 6 * k]))
    s.stroke(p.ring(at, [rx * k, 0], [0, 6 * k]))
  }
  if (side) {
    // Seen from the side, the band rises from the near cup over the crown.
    s.stroke(
      p.path([
        P(side * -1.5, -4),
        P(side * -2.6, -11),
        P(side * -1.8, -17.5),
        P(side * 0.5, -19.8),
      ]),
    )
    cup(P(side * -1.5, 2), 4.2)
    return
  }
  const band = [
    ...arc(P(0, -1), 16.5 * k, 19.5 * k, 192, 348, 16),
    ...arc(P(0, -1), 14.6 * k, 17.6 * k, 348, 192, 16),
  ]
  s.blank(p.shape(band))
  s.stroke(p.shape(band))
  for (const u of [-1, 1]) cup(P(u * 14.5, 2.5), 3.6)
}

/** Someone carrying a parcel in both forearms; the parcel sits on their hands, or behind them seen from the back. */
const carrying: Draw = (s, p, r, at, k, options: DrawOptions) => {
  const o = depth(r)
  const parcel = (m: Point) =>
    box(s, p, o, add(m, [-26 * k, 6 * k]), 52 * k, 32 * k, 24 * k)
  if (options.view === "back") parcel([at[0], at[1] - 112 * k])
  const hands = figure(s, p, r, at, k, { pose: "carry", ...options })
  if (options.view !== "back") {
    const [a, b] = hands as [Point, Point]
    parcel(lerp(a, b, 0.5))
  }
}

const T = objectsIn("people")
const as =
  (pose: string, view: string): Draw =>
  (s, p, r, at, k, options: DrawOptions) =>
    figure(s, p, r, at, k, { pose, view, ...options })

define(
  T(
    "person-back",
    "From behind",
    [118, 262],
    [59, 252],
    1.15,
    as("stand", "back"),
    ["person", "guest", "arriving"],
  ),
  T(
    "person-side",
    "In profile",
    [128, 262],
    [64, 252],
    1.15,
    as("stand", "right"),
    ["person", "profile", "waiting"],
  ),
  T(
    "person-cheer",
    "With a find",
    [150, 350],
    [75, 338],
    1,
    as("cheer", "front"),
    ["person", "music", "joy"],
  ),
  T(
    "person-listening",
    "In headphones",
    [130, 250],
    [65, 240],
    1,
    as("listen", "front"),
    ["person", "music", "listening"],
  ),
  T(
    "person-pointing",
    "Pointing",
    [190, 262],
    [64, 252],
    1.15,
    as("point", "right"),
    ["person", "showing", "work"],
  ),
  T(
    "person-carrying",
    "Carrying a parcel",
    [130, 262],
    [65, 252],
    1.15,
    carrying,
    ["person", "delivery", "work"],
  ),
)
