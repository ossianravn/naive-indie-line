// Everyday: things for arriving, waiting, keeping and finding. `at` is bottom-centre unless a function says
// otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts are drawn
// in the object's own units (`units.ts`), back to front with blanks.
import { arc, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { depth, scribble } from "../shapes"
import { ell, outline, place, pts, slab, sym, tuck, type Map } from "./units"

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

/** A closed padlock with a thick shackle and rounded body; `at` is bottom-centre. */
export const padlock: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const o = depth(r)
  const back: Map = (u, v) => P(u + o[0] * 22, v - o[1] * 22)
  const H: Map = (u, v) => P(u + o[0] * 10, v - o[1] * 10)
  outline(s, p, [
    H(-18, 52),
    ...ell(H, [0, 86, 18, 20], 180, 360, 16),
    H(18, 52),
    H(12, 52),
    ...ell(H, [0, 86, 12, 14], 0, -180, 16),
    H(-12, 52),
  ])
  const graze = 180 + (Math.atan2(o[0], -o[1]) * 180) / Math.PI
  outline(s, p, [
    ...ell(P, [-21, 11, 6, 6], 90, 180, 5),
    ...ell(P, [-21, 49, 6, 6], 180, graze, 5),
    ...ell(back, [-21, 49, 6, 6], graze, 270, 5),
    ...ell(back, [21, 49, 6, 6], 270, 360, 6),
    ...ell(back, [21, 11, 6, 6], 0, graze - 180, 5),
    ...ell(P, [21, 11, 6, 6], graze - 180, 90, 5),
  ])
  s.stroke(
    p.path([
      ...ell(P, [-21, 49, 6, 6], graze - 12, 270, 5),
      ...ell(P, [21, 49, 6, 6], 270, 360, 6),
      ...ell(P, [21, 11, 6, 6], 0, graze - 168, 5),
    ]),
  )
  s.stroke(
    p.path([
      ...ell(P, [21, 49, 6, 6], 315, 322, 2),
      ...ell(back, [21, 49, 6, 6], 322, 315, 2),
    ]),
  )
  s.fill(
    p.shape([
      ...ell(P, [0, 34, 3.5, 3.5], 140, 400, 12),
      ...pts(P, [4, 22, -4, 22]),
    ]),
  )
}

/** Two flattened keys on a split ring with a tied paper tag; `at` is bottom-centre. */
export const keys: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  s.stroke(p.disc(P(-8, 71), [32 * k, 0], [0, 13 * k]))
  s.blank(p.disc(...dot(P(-29, 81), 3.2 * k)))
  const key = (cx: number, cy: number, angle: number, square: boolean) => {
    const a = (angle * Math.PI) / 180
    const M: Map = (u, v) =>
      P(
        cx + u * Math.cos(a) - v * Math.sin(a),
        cy + (u * Math.sin(a) + v * Math.cos(a)) * 0.65,
      )
    const bow = square
      ? pts(M, [12, 6, 12, 14, -14, 14, -14, -14, 12, -14, 12, -6])
      : arc([0, 0], 16, 16, 25, 335, 22).map(([u, v]) => M(u, v))
    const blade = square
      ? [35, -6, 35, -12, 45, -12, 45, 6]
      : [48, -6, 48, -13, 57, -13, 57, -4, 64, -4, 64, -11, 72, -11, 72, 6]
    const body = [...bow, ...pts(M, blade)]
    const hole = square
      ? pts(M, [-7, -7, 6, -7, 6, 7, -7, 7])
      : arc([0, 0], 7, 7, 0, 360, 18).map(([u, v]) => M(u, v))
    s.blank(p.shape(body) + p.shape([...hole].reverse()))
    s.stroke(p.shape(body))
    s.stroke(p.shape(hole))
  }
  key(-33, 59, -124 + r.signed() * 2, true)
  key(16, 58, -60 + r.signed() * 2, false)
  outline(s, p, pts(P, [25, 68, 38, 80, 66, 80, 60, 58, 32, 58]))
  s.stroke(p.path(pts(P, [20, 77, 25, 76, 33, 70])))
  s.fill(p.disc(...dot(P(34, 69), 1.5 * k)))
  const q = P(42, 69)
  scribble(s, p, r, q[0], q[1], 23 * k, 1)
}

/** A magnifier over two scribbled index cards; `at` is bottom-centre. */
export const magnifier: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const o = depth(r)
  const card = (u: number, v: number, w: number, d: number) => {
    const C: Map = (a, b) => P(u + a + o[0] * b, v - o[1] * b)
    outline(s, p, [C(0, 0), C(w, 0), C(w, d), C(0, d)])
    const textPen = {
      ...p,
      path: (q: Point[]) => p.path(q.map(([x, y]) => C(x, -y))),
    }
    scribble(s, textPen, r, 9, -(d - 12), w - 18, 3, 12)
  }
  card(-43, 38, 72, 48)
  card(-58, 10, 88, 85)
  s.fill(p.shape(pts(P, [14, 35, 41, 4, 46, 8, 19, 39])))
  s.blank(p.disc(P(-3, 43), [26 * k, 0], [0, 14 * k]))
  const glassPen = {
    ...p,
    path: (q: Point[]) => p.path(q.map(([u, v]) => P(u, 43 - (v - 43) * 1.6))),
  }
  scribble(s, glassPen, r, -17, 40.5, 30, 2, 6)
  s.stroke(p.disc(P(-3, 43), [26 * k, 0], [0, 14 * k]))
  s.stroke(p.disc(P(-3, 43), [22 * k, 0], [0, 10.5 * k]))
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
define(T("padlock", "Padlock", [100, 130], [44, 117], 1, padlock, [
  "security",
  "private",
  "permissions",
  "locked",
  "sign-in",
]))
define(T("keys", "Keys", [150, 100], [75, 92], 1, keys, [
  "access",
  "account",
  "sign-in",
  "home",
  "password",
]))
define(T("magnifier", "Magnifier", [160, 110], [72, 96], 1, magnifier, [
  "search",
  "find",
  "no results",
  "discover",
  "docs",
]))
