// Everyday: things for arriving, waiting, keeping and finding. `at` is bottom-centre unless a function says
// otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts are drawn
// in the object's own units (`units.ts`), back to front with blanks.
import { arc, deg, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { depth } from "../shapes"
import {
  ell,
  outline,
  place,
  pts,
  slab,
  sym,
  tuck,
  type Map,
  type Oval,
} from "./units"

/** An inward-opening door with an empty doorway and a mat; `at` is bottom-centre of the mat. */
export const door: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const o = depth(r)
  const swing = r.between(18, 20)
  s.stroke(p.line(P(-7, 33), P(30, 33)))
  outline(s, p, pts(P, [-28, 24, -28 + swing, 44, -28 + swing, 120, -28, 140]))
  s.fill(p.disc(...dot(P(-32 + swing, 83), 2 * k)))
  // The casing hides the floor line's run-on at the right jamb.
  outline(
    s,
    p,
    pts(
      P,
      [-34, 24, -34, 148, 34, 148, 34, 24, 28, 24, 28, 142, -28, 142, -28, 24],
    ),
  )
  s.stroke(p.line(P(-26, 24), P(26, 24)))
  outline(s, p, [
    P(-42, 21 + o[1] * 42),
    P(28, 21 + o[1] * 42),
    P(28 + o[0] * 42, 21),
    P(-42 + o[0] * 42, 21),
  ])
}

/** An empty woven basket with its handles folded over the sides; `at` is bottom-centre. */
export const basket: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const wide = r.between(58, 60)
  const h = wide * 1.1
  const section = (f: number): [number, number, number, number] => [
    0,
    12 + h * f,
    48 + (wide - 48) * f,
    6 + 6 * f,
  ]
  const base = section(0)
  const low = section(0.3)
  const high = section(0.65)
  const rim = section(1)
  const body = [...ell(P, rim, 180, 360, 18), ...ell(P, base, 0, 180, 16)]
  s.blank(p.shape(body))
  for (const a of [24, 57, 90, 123, 156]) {
    const t = (a * Math.PI) / 180
    s.stroke(
      p.line(
        P(low[2] * Math.cos(t), low[1] - low[3] * Math.sin(t)),
        P(high[2] * Math.cos(t), high[1] - high[3] * Math.sin(t)),
      ),
    )
  }
  // Clear the ribs' run-on before drawing the two bands and the body's contour.
  s.blank(p.shape([...ell(P, rim, 180, 0), ...ell(P, high, 0, 180)]))
  s.blank(p.shape([...ell(P, low, 180, 0), ...ell(P, base, 0, 180)]))
  for (const f of [0.3, 0.65]) {
    const band = section(f)
    const side = section(f + 0.06)
    s.stroke(
      p.path([
        P(-side[2], side[1]),
        ...ell(P, band, 180, 0, 18),
        P(side[2], side[1]),
      ]),
    )
  }
  s.stroke(p.shape(body))
  for (const f of [0, 1])
    s.stroke(
      p.path([
        P(-wide, rim[1]),
        ...ell(
          P,
          [0, rim[1], wide + 2 + f * 3, h * (0.62 + f * 0.09)],
          180,
          0,
          24,
        ),
        P(wide, rim[1]),
      ]),
    )
  outline(s, p, ell(P, [0, rim[1], wide - 4, 8], 0, 360, 24))
  s.stroke(p.path(tuck(P, rim, ell(P, rim, 180, 0, 18))))
  for (const side of [-1, 1]) {
    s.blank(p.disc(...dot(P(side * wide, rim[1]), 2.8 * k)))
    s.stroke(p.disc(...dot(P(side * wide, rim[1]), 2.8 * k)))
  }
}

/** An hourglass with three posts and two small heaps of sand; `at` is bottom-centre. */
export const hourglass: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const waist = r.between(60, 63)
  const glass = sym(P, [
    14,
    14,
    20,
    19,
    21,
    28,
    18,
    38,
    10,
    49,
    3,
    waist - 2,
    3,
    waist + 3,
    10,
    76,
    18,
    87,
    21,
    101,
    19,
    110,
    14,
    115,
  ])
  s.blank(p.shape(glass))
  // Clear glass leaves the rear post visible, offset from the falling sand.
  s.stroke(p.line(P(8, 12), P(8, 123)))
  s.stroke(p.shape(glass))
  s.fill(p.shape(pts(P, [-9, 76, 0, 80, 9, 76, 3, waist + 4, -3, waist + 4])))
  s.stroke(p.line(P(0, waist + 5), P(0, 33)))
  s.fill(p.shape(pts(P, [-15, 18, -7, 25, 0, 34, 8, 24, 15, 18, 0, 15])))
  for (const u of [-25, 25]) s.stroke(p.line(P(u, 7), P(u, 120)))
  slab(s, p, P, [0, 9, 29, 7], 4)
  slab(s, p, P, [0, 120, 29, 7], 4)
}

/**
 * A closed padlock face on, its thickness showing at the right: the shackle first, its legs running down behind the
 * body, then the body and a keyhole on a small round plate. `at` is bottom-centre.
 */
export const padlock: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const band = r.between(6, 8)
  const [w, h, bend, so, si] = [32, 50, r.between(77, 81), 19, 12]
  const side: Map = (u, v) => P(u + band, v)
  const mid: Map = (u, v) => P(u + band / 2, v)
  const TL: Oval = [-w + 7, h - 7, 7, 7]
  const TR: Oval = [w - 7, h - 7, 7, 7]
  const BR: Oval = [w - 12, 12, 12, 12]
  const BL: Oval = [-w + 12, 12, 12, 12]
  outline(s, p, [
    ...pts(mid, [-so, h - 6, -so, bend]),
    ...ell(mid, [0, bend, so, so], 180, 360, 18),
    ...pts(mid, [so, bend, so, h - 6, si, h - 6, si, bend]),
    ...ell(mid, [0, bend, si, si], 360, 180, 14),
    ...pts(mid, [-si, bend, -si, h - 6]),
  ])
  outline(s, p, [
    ...ell(P, BL, 90, 180, 6),
    ...ell(P, TL, 180, 270, 5),
    ...ell(side, TR, 270, 360, 6),
    ...ell(side, BR, 0, 90, 6),
  ])
  // The front's right edge starts and ends on the outline, so its run-on follows the top and the bottom.
  s.stroke(p.path([...ell(P, TR, 280, 360, 6), ...ell(P, BR, 0, 72, 6)]))
  s.stroke(p.disc(...dot(P(0, 24), 10 * k)))
  s.fill(
    p.shape([
      ...ell(P, [0, 27, 4.4, 4.4], 125, 415, 14),
      ...pts(P, [2.4, 13, -2.4, 13]),
    ]),
  )
}

/**
 * Two keys hanging from a split ring: behind, a newer key with an inked head and three teeth; in front, an old key
 * with a ring bow and a notched bit, the ring running over its bow on one side of the hole. `at` is bottom-centre.
 */
export const keys: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const [cx, cy, R] = [3, 84, 14]
  // A key's own frame from where the ring holds it, at `a` degrees round the ring: x runs down the key, y across.
  const frame = (a: number): Map => {
    const [hx, hy] = [cx + R * Math.cos(a * deg), cy - R * Math.sin(a * deg)]
    const t = (90 + (a - 90) * 0.55) * deg
    const [c, n] = [Math.cos(t), Math.sin(t)]
    return (x, y) => P(hx + c * x + n * y, hy - n * x + c * y)
  }
  s.stroke(p.ring(P(cx, cy), [R * k, 0], [0, R * k]))
  const [left, right] = [122 + r.signed() * 3, 60 + r.signed() * 3]
  const Y = frame(right)
  const corners = (from: number) =>
    [
      ...arc([8, 5], 6, 6, from, 90, 4),
      ...arc([0, 5], 6, 6, 90, 180, 4),
      ...arc([0, -5], 6, 6, 180, 270, 4),
      ...arc([8, -5], 6, 6, 270, 360, 4),
    ].map(([x, y]) => Y(x, y))
  const yale = [
    ...corners(15),
    ...pts(Y, [55, -5, 59, -2, 59, 1.5, 55, 5, 51.5, 2.6, 47.5, 6.5]),
    ...pts(Y, [43.5, 2.6, 39.5, 6.5, 35.5, 2.6, 31.5, 6.5, 16, 6.5]),
  ]
  // Both keys' outlines run against the pen's discs, so a disc added to one is its hole and the ring shows through.
  const eye = p.disc(...dot(Y(1.2, 0), 2.6 * k))
  s.blank(p.shape(yale) + eye)
  s.stroke(p.shape(yale))
  s.fill(p.shape(corners(0)) + eye)
  const C = frame(left)
  const join = 3.5 + Math.sqrt(10.5 * 10.5 - 4.6 * 4.6)
  const ja = Math.atan2(4.6, join - 3.5) / deg
  const old = [
    ...arc([3.5, 0], 10.5, 10.5, ja, 360 - ja, 20).map(([x, y]) => C(x, y)),
    ...pts(C, [join, -4.6, 19.5, -4.6, 19.5, -2.7, 50, -2.7, 50, -13]),
    ...pts(C, [54.5, -13, 54.5, -8.5, 58.5, -8.5, 58.5, -13, 64, -13]),
    ...pts(C, [64, 2.7, 19.5, 2.7, 19.5, 4.6, join, 4.6]),
  ]
  const bow = dot(C(3.5, 0), 5.2 * k)
  s.blank(p.shape(old) + p.disc(...bow))
  s.stroke(p.shape(old))
  s.stroke(p.disc(...bow))
  s.stroke(p.path(ell(P, [cx, cy, R, R], left + 4, left + 46, 8)))
}

/** A magnifying glass at a slant: a round rim with a glint, a short collar and an inked handle; `at` is bottom-centre. */
export const magnifier: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const t = r.between(-47, -41) * deg
  const c: Point = [-12, 72]
  // The handle's own frame: x runs from the lens's centre down the handle, y across it.
  const [cs, sn] = [Math.cos(t), Math.sin(t)]
  const H: Map = (x, y) => P(c[0] + cs * x - sn * y, c[1] + sn * x + cs * y)
  outline(s, p, pts(H, [27, 3.4, 27, -3.4, 40, -3.4, 40, 3.4]))
  const end = arc([82, 0], 6.2, 6.2, -90, 90, 10).map(([x, y]) => H(x, y))
  s.fill(p.shape([...pts(H, [39, 4.6, 39, -4.6, 82, -6.2]), ...end]))
  s.paper(p.disc(...dot(H(82, 0), 1.7 * k)))
  const lens = (rad: number) => p.disc(P(...c), [rad * k, 0], [0, rad * k])
  s.blank(lens(30))
  s.stroke(lens(30))
  s.stroke(lens(24.5))
  s.stroke(p.path(ell(P, [c[0], c[1], 18.5, 18.5], 200, 240, 6)))
}

const T = objectsIn("everyday")

define(T("door", "Open door", [130, 170], [65, 158], 1, door, [
  "welcome",
  "sign-up",
  "onboarding",
  "enter",
  "home",
]))
define(T("basket", "Basket", [150, 110], [75, 100], 1, basket, [
  "empty",
  "cart",
  "saved",
  "collection",
  "shop",
]))
define(T("hourglass", "Hourglass", [90, 150], [45, 139], 1, hourglass, [
  "loading",
  "waiting",
  "processing",
  "time",
  "waitlist",
]))
define(T("padlock", "Padlock", [100, 120], [46, 110], 1, padlock, [
  "security",
  "private",
  "permissions",
  "locked",
  "sign-in",
]))
define(T("keys", "Keys", [94, 108], [50, 108], 1, keys, [
  "access",
  "account",
  "sign-in",
  "home",
  "password",
]))
define(T("magnifier", "Magnifier", [120, 120], [53.5, 114], 1, magnifier, [
  "search",
  "find",
  "no results",
  "discover",
  "docs",
]))
