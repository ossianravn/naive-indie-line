// Indie: the room itself. A pinned picture, chairs, a lamp and a window. Each function draws one object; `at` is
// its anchor (bottom-left unless it says otherwise) and `k` its scale. Composition comes from `r` (the shape
// stream), never from the pen, so takes agree.
import { add, dist, dot, rect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { box, depth, drum, pad, sprig } from "../shapes"
import type { Pen } from "../stroke"

type Map = (u: number, v: number) => Point

/** A closed outline that hides what it stands in front of. */
function outline(s: Sheet, p: Pen, points: Point[]) {
  s.blank(p.shape(points))
  s.stroke(p.shape(points))
}

/** The corners of the part of a mapped unit square between u0, v0 and u1, v1. */
function quad(m: Map, a: number, b: number, c: number, d: number) {
  return [m(a, b), m(c, b), m(c, d), m(a, d)]
}

/** A frame round a mapped square, `iu` and `iv` wide. Its band is blanked first, so what runs on into it is covered. */
function frame(s: Sheet, p: Pen, m: Map, iu: number, iv: number) {
  for (const f of [0, 1]) {
    const [a, b] = [f * (1 - iu), f * (1 - iv)]
    s.blank(p.shape(quad(m, 0, b, 1, b + iv)))
    s.blank(p.shape(quad(m, a, 0, a + iu, 1)))
  }
  s.stroke(p.shape(quad(m, 0, 0, 1, 1)))
  s.stroke(p.shape(quad(m, iu, iv, 1 - iu, 1 - iv)))
}

/** A short solid bar from a to b, `t` thick: a rung or a rod with square ends, since the pen runs past no fill. */
function bar(s: Sheet, p: Pen, a: Point, b: Point, t: number) {
  const len = dist(a, b) || 1
  const n: Point = [(a[1] - b[1]) / len, (b[0] - a[0]) / len]
  const f = t / 2
  s.fill(p.shape([add(a, n, f), add(b, n, f), add(b, n, -f), add(a, n, -f)]))
}

/** A picture pinned to the wall, centred on `at`: a slightly turned frame with a mat, corner pins and a small drawing. */
export const picture: Draw = (
  s,
  p,
  r,
  c,
  k = 1,
  { w = 96 * k, h = 120 * k, kind = r.pick(["boat", "moon", "hills"]) } = {},
) => {
  const tilt = r.signed() * 2.2
  const at: Map = (u, v) =>
    turn([c[0] + (u - 0.5) * w, c[1] + (v - 0.5) * h], c, tilt)
  const q = (u0: number, v0: number, u1: number, v1: number) =>
    quad(at, u0, v0, u1, v1)
  s.blank(p.shape(q(0, 0, 1, 1)))
  /** A rolling hill from side to side, its top at v and rising by `rise` at u = mid; it hides what stands behind. */
  const hill = (v: number, rise: number, mid = 0.5) => {
    const top = Array.from({ length: 9 }, (_, i) => {
      const u = 0.06 + i * 0.11
      const f = u < mid ? u / mid : (1 - u) / (1 - mid)
      return at(u, v - rise * f * f * (3 - 2 * f))
    })
    s.blank(p.shape([...top, at(0.94, 0.96), at(0.06, 0.96)]))
    s.stroke(p.path(top))
  }
  /** A cottage on the ground at u, v: walls, a solid roof and a window left in the paper. */
  const cottage = (u: number, v: number, z: number) => {
    outline(s, p, q(u - z, v - z * 1.1, u + z, v))
    const [l, e] = [u - z * 1.3, u + z * 1.3]
    s.fill(p.shape([at(l, v - z), at(u, v - z * 2.1), at(e, v - z)]))
    s.fill(p.shape(q(u - z * 0.35, v - z * 0.7, u + z * 0.05, v - z * 0.35)))
  }
  if (kind === "boat") {
    // A sailboat on a calm sea under a low sun: the sail is the picture's one pocket of ink.
    s.stroke(p.ring(...dot(at(r.between(0.2, 0.3), 0.26), w * 0.07)))
    const u = r.between(0.42, 0.56)
    s.fill(p.shape([at(u, 0.3), at(u, 0.6), at(u + 0.2, 0.6)]))
    s.stroke(p.line(at(u - 0.015, 0.27), at(u - 0.015, 0.63)))
    const hull = [-0.17, 0.24, 0.18, -0.12].map((du, i) =>
      at(u + du, i < 2 ? 0.63 : 0.7),
    )
    outline(s, p, hull)
    for (const a of [0.12, 0.26]) {
      const wave = [0, 1, 2, 3, 4, 5, 6].map((i) =>
        at(a + i * 0.1, 0.76 + (a - 0.12) * 0.57 + (i % 2 ? 0.015 : -0.015)),
      )
      s.stroke(p.path(wave))
    }
  } else if (kind === "moon") {
    const m = at(0.55, 0.36)
    s.fill(p.disc(...dot(m, w * 0.17)))
    s.blank(p.disc(...dot(add(m, [w * 0.08, -w * 0.04]), w * 0.15)))
    for (const u of [0.16, 0.24, 0.78, 0.86])
      s.fill(p.disc(...dot(at(u, r.between(0.2, 0.62)), 1.1 * k)))
    hill(0.86, 0.1, r.between(0.3, 0.7))
  } else {
    s.stroke(p.ring(...dot(at(0.74, 0.24), w * 0.075)))
    hill(0.78, 0.16, 0.3)
    s.stroke(p.line(at(0.32, 0.62), at(0.32, 0.72)))
    s.fill(p.disc(at(0.32, 0.53), [w * 0.04, 0], [0, h * 0.13]))
    hill(0.86, 0.12, 0.7)
    cottage(0.66, 0.78, 0.07)
  }
  frame(s, p, at, 0.08, 0.07)
  for (const u of [0.04, 0.96])
    for (const v of [0.035, 0.965]) s.fill(p.disc(...dot(at(u, v), 1.6 * k)))
}

/**
 * A slat-back chair in three-quarter view, as on the object sheet: back legs that rise into the back posts, a bowed
 * top rail and three slats, a seat with real thickness, and front legs narrowing to the floor. Legs, posts and slats
 * are thin closed outlines, so their ends stay square instead of running past.
 */
export const chair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [w, d, seat, t, g] = [56 * k, 40 * k, 46 * k, 7 * k, 4 * k]
  const tall = r.between(52, 60) * k
  /** A thin member from a up to b, `width` wide at b and `foot` wide at a, seen face on. */
  const stick = (a: Point, b: Point, width = g, foot = width) => {
    const f = add(a, [(width - foot) / 2, 0])
    outline(s, p, [f, add(f, [foot, 0]), add(b, [width, 0]), b])
  }
  const back = (u: number, v: number): Point => add([x + u, y - v], o, d - g)
  const [u0, u1, top] = [1 * k + g, w - 1 * k - g, seat + tall]
  stick(back(1 * k, 0), back(1 * k, top), g, g * 0.8)
  stick(back(w - g - 1 * k, 0), back(w - g - 1 * k, top), g, g * 0.8)
  for (const u of [0.25, 0.5, 0.75]) {
    const sx = u0 + (u1 - u0) * u - 1.5 * k
    stick(back(sx, seat), back(sx, top - 11 * k), 3 * k)
  }
  const bow = (i: number) => {
    const f = 1 - i / 6
    return back(u0 + (u1 - u0) * f, top - (3 - 2.5 * Math.sin(Math.PI * f)) * k)
  }
  const ends = [back(u0, top - 12 * k), back(u1, top - 12 * k)]
  outline(s, p, [...ends, ...Array.from({ length: 7 }, (_, i) => bow(i))])
  box(s, p, o, [x, y - seat + t], w, t, d)
  stick([x + 1 * k, y], [x + 1 * k, y - seat + t], g, g * 0.75)
  stick([x + w - g - 1 * k, y], [x + w - g - 1 * k, y - seat + t], g, g * 0.75)
}

/**
 * A padded club armchair, built back to front: the back, the left arm, the seat and its cushion between the arms,
 * then the right arm, each hiding what it stands in front of. Short solid legs.
 */
export const armchair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [W, D, legs] = [96 * k, 50 * k, 7 * k]
  const arm = r.between(15, 19) * k
  const [armH, backH] = [r.between(40, 46) * k, r.between(66, 74) * k]
  const thick = 13 * k
  const y0 = y - legs
  pad(s, p, o, add([x, y0], o, D - thick), W, backH, thick, 10 * k)
  pad(s, p, o, [x, y0], arm, armH, D - thick, 7 * k)
  box(s, p, o, [x + arm, y0], W - 2 * arm, 22 * k, D - thick)
  pad(s, p, o, [x + arm, y0 - 22 * k], W - 2 * arm, 9 * k, D - thick, 4 * k)
  pad(s, p, o, [x + W - arm, y0], arm, armH, D - thick, 7 * k)
  const leg = (q: Point) =>
    s.fill(
      p.shape([
        add(q, [-2 * k, 0]),
        add(q, [2 * k, 0]),
        add(q, [1.2 * k, legs]),
        add(q, [-1.2 * k, legs]),
      ]),
    )
  leg([x + 5 * k, y0])
  leg([x + W - 5 * k, y0])
  leg(add([x + W - 3 * k, y0], o, D - 6 * k))
}

/** A standing lamp; `at` is the centre of its foot. The stem and the pull chain go in behind the foot and the shade. */
export const floorLamp: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const H = r.between(160, 180) * k
  const bot = y - H + 34 * k
  s.stroke(p.line([x, y - 2 * k], [x, bot - 4 * k]))
  for (let i = 0; i < 6; i++)
    s.fill(p.disc(...dot([x + 9 * k, bot + (4 + i * 3) * k], 0.7 * k)))
  s.fill(p.disc(...dot([x + 9 * k, bot + 22 * k], 1.8 * k)))
  drum(s, p, [x, y - 4 * k], [18 * k, 19 * k, 3.5 * k, 4.5 * k])
  drum(s, p, [x, y - H], [17 * k, r.between(25, 29) * k, 34 * k, 4 * k])
}

/** A window with a curtain at one side and a view: the moon, rooftops or a tree. `at` is the glass's bottom-left. */
export const roomWindow: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { view = r.pick(["moon", "roofs", "tree"]) } = {},
) => {
  const [x, y] = at
  const [w, h] = [92 * k, 112 * k]
  const pt: Map = (u, v) => [x + u * w, y - h + v * h]
  const side = r.chance(0.5) ? 0 : 1
  s.blank(p.shape(rect(x, y - h, w, h)))
  if (view === "moon") {
    const m = pt(0.72, 0.2)
    s.fill(p.disc(...dot(m, 8 * k)))
    s.blank(p.disc(...dot(add(m, [4 * k, -3 * k]), 7 * k)))
    for (const u of [0.14, 0.3, 0.42])
      s.fill(p.disc(...dot(pt(u, r.between(0.12, 0.4)), 1.2 * k)))
  } else if (view === "roofs") {
    // Houses across the street, standing on the frame and overlapping a little, each with a lit window.
    for (let u = 0.03; u < 0.9;) {
      const bh = r.between(0.2, 0.36)
      const bw = Math.min(r.between(0.26, 0.36), 0.97 - u)
      const gable = r.chance(0.5) ? [pt(u + bw / 2, 1 - bh - 0.1)] : []
      const [l, rr] = [pt(u, 1 - bh), pt(u + bw, 1 - bh)]
      outline(s, p, [pt(u, 0.99), l, ...gable, rr, pt(u + bw, 0.99)])
      const wu = u + bw * r.between(0.25, 0.6)
      s.fill(p.shape(quad(pt, wu, 1 - bh + 0.06, wu + 0.06, 1 - bh + 0.11)))
      u += bw * r.between(0.8, 0.95)
    }
  } else {
    // Foliage from the bottom corner away from the curtain, as on the object sheet: twigs of small solid leaves.
    const from = side ? 0.08 : 0.92
    for (let i = 0; i < 5; i++) {
      const lean = (side ? 1 : -1) * (0.02 + i * 0.08)
      const u = from + lean * r.between(1.2, 1.5)
      const tip = pt(u, r.between(0.3, 0.6))
      sprig(s, p, pt(from + lean * 0.7, 0.99), tip, 7 * k)
    }
  }
  // The bars stop just inside the frame, which is wider than the pen's run past an end, so the frame covers it.
  const [iu, iv] = [(7 * k) / w, (7 * k) / h]
  s.stroke(p.line(pt(0.5, iv - 1 / h), pt(0.5, 1 - iv + 1 / h)))
  s.stroke(p.line(pt(iu - 1 / w, 0.45), pt(1 - iu + 1 / w, 0.45)))
  frame(s, p, pt, iu, iv)
  outline(s, p, rect(x - 6 * k, y, w + 12 * k, 5 * k))
  // A curtain hanging from the rod at one side: gathered at a tie-back, flaring to a scalloped hem, with two folds.
  const [dir, cx] = [side ? -1 : 1, x + side * w]
  const [top, bottom] = [y - h - 6 * k, y + 9 * k]
  const rod: [Point, Point] = [
    [x - 12 * k, top],
    [x + w + 12 * k, top],
  ]
  bar(s, p, ...rod, 0.7 * k)
  for (const end of rod) s.fill(p.disc(...dot(end, 2.4 * k)))
  const tie = r.between(0.58, 0.66)
  /** How far the curtain reaches into the window at t, from the rod (0) to the hem (1). */
  const reach = (t: number) => {
    const q = t < tie ? (tie - t) / tie : (t - tie) / (1 - tie)
    return (10 + (t < tie ? 15 : 12) * q * q) * k
  }
  const cloth = (t: number, f: number): Point => [
    cx + dir * (-7 * k + (reach(t) + 7 * k) * f),
    top + (bottom - top) * t,
  ]
  const steps = Array.from({ length: 13 }, (_, i) => i / 12)
  const hem = Array.from({ length: 7 }, (_, i): Point => {
    const f = 1 - i / 6
    return add(cloth(1, f), [0, (i % 2 ? -2.2 : 0) * k])
  })
  const panel = [
    ...steps.map((t) => cloth(t, 0)),
    ...hem.slice(1, -1).reverse(),
    ...steps.map((t) => cloth(t, 1)).reverse(),
  ]
  outline(s, p, panel)
  for (const f of [0.36, 0.7])
    s.stroke(p.path(steps.slice(1, -1).map((t) => cloth(t, f))))
  s.fill(p.disc(...dot(cloth(tie, 1), 2.4 * k)))
}

const T = objectsIn("indie")

define(
  T("picture", "Pinned picture", [130, 150], [65, 75], 1, picture, [
    "art",
    "wall",
    "home",
  ]),
  T("chair", "Chair", [110, 140], [20, 130], 1, chair, [
    "furniture",
    "seat",
    "cafe",
  ]),
  T("armchair", "Armchair", [150, 120], [16, 110], 1, armchair, [
    "furniture",
    "seat",
    "home",
  ]),
  T("floor-lamp", "Floor lamp", [80, 200], [40, 190], 1, floorLamp, [
    "light",
    "furniture",
    "home",
  ]),
  T("window", "Window", [138, 158], [23, 140], 1, roomWindow, [
    "wall",
    "view",
    "home",
  ]),
)
