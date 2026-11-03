// Indie: the shop floor. Browser bins, a rail of sleeves face out on the wall, the counter with its till and a gig
// poster. Each function draws one object; `at` is its anchor (bottom-left unless it says otherwise) and `k` its
// scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, lerp, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import { box, depth, scribble, type Box } from "../shapes"
import type { Pen } from "../stroke"
import { outline } from "./units"

/** A thin upright with square ends, from a up to b, `t` wide: a leg or a post. */
const post = (s: Sheet, p: Pen, a: Point, b: Point, t: number) =>
  outline(s, p, [a, add(a, [t, 0]), add(b, [t, 0]), b])

/**
 * A browser bin on legs, the shop's main furniture: an open box at hip height with records standing in it face
 * forward, leaning back a little, and a divider card with a tab now and then. `at` is the front-left foot. Returns
 * the middle of its open top, where a browsing hand goes.
 */
export const recordBin: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, h, d, legs, t] = [130 * k, 46 * k, 56 * k, 52 * k, 4 * k]
  const base = at[1] - legs
  /** A point of the bin: u across, v from front to back, z up from its bottom. */
  const Q = (u: number, v: number, z = h): Point =>
    add([at[0] + w * u, base - z], o, d * v)
  const tv = t / d
  const inner = (u: number, v: number) => Q(t / w + u * (1 - (2 * t) / w), v)
  // The back legs first, under the bin; the box hides their tops.
  post(s, p, add(Q(1, 1, 0), [-t, legs]), add(Q(1, 1, 0), [-t, 0]), t)
  s.stroke(p.path([Q(0, 0.06), Q(0, 1), Q(0.97, 1)]))
  s.stroke(p.path([inner(0, tv), inner(0, 1 - tv), inner(1, 1 - tv)]))
  // Two columns of square sleeves standing face forward, half out of the bin, each leaning back a little, and a
  // divider card with a tab in one of them. All the rows are drawn from the back, so nearer sleeves hide farther ones.
  const rows: { u0: number; u1: number; v: number; card: boolean }[] = []
  for (const [ua, ub] of [
    [0.04, 0.49],
    [0.51, 0.96],
  ] as const) {
    const divider = r.chance(0.6) ? r.between(0.3, 0.7) : -1
    let carded = false
    for (let v = 0.86; v > 0.1; v -= r.between(0.1, 0.15)) {
      const card: boolean = !carded && divider > 0 && v < divider
      carded ||= card
      rows.push({ u0: ua, u1: ub, v, card })
    }
  }
  rows.sort((a, b) => b.v - a.v)
  for (const { u0, u1, v, card } of rows) {
    const lean = (0.08 + r.next() * 0.08) * d
    const top = h + r.between(24, 32) * k + (card ? 7 * k : 0)
    const pt = (u: number, z: number) => add(Q(u, v, z), o, (lean * z) / top)
    const sleeve = [pt(u0, h * 0.4), pt(u1, h * 0.4), pt(u1, top), pt(u0, top)]
    s.blank(p.shape(sleeve))
    s.stroke(p.shape(sleeve))
    if (!card) continue
    // The divider's tab stands up from its top edge.
    const ut = u0 + (u1 - u0) * r.between(0.15, 0.55)
    const span = (u1 - u0) * 0.35
    const tab = [
      pt(ut, top),
      pt(ut + span, top),
      pt(ut + span * 0.92, top + 8 * k),
      pt(ut + span * 0.08, top + 8 * k),
    ]
    s.blank(p.shape(tab))
    s.stroke(p.path(tab))
  }
  const ring = [inner(1, 1 - tv), inner(1, tv), inner(0, tv)]
  s.blank(
    p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), ...ring, Q(0, 0)]),
  )
  s.stroke(p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 0), Q(0, 0)]))
  s.stroke(p.path([Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), Q(1, 0)]))
  s.stroke(p.path(ring))
  // A card on the front for the section's name, as a scribble.
  const lc = Q(0.5, 0, h * 0.55)
  outline(s, p, [
    add(lc, [-15 * k, -6 * k]),
    add(lc, [15 * k, -6 * k]),
    add(lc, [15 * k, 6 * k]),
    add(lc, [-15 * k, 6 * k]),
  ])
  scribble(s, p, r, lc[0] - 10 * k, lc[1], 20 * k, 1)
  // The front legs, and a rail between them a hand above the floor.
  post(s, p, [at[0] + 3 * k, at[1]], Q(3 / 130, 0, 0), t)
  post(s, p, [at[0] + w - t - 3 * k, at[1]], Q(1 - (t + 3 * k) / w, 0, 0), t)
  const low = at[1] - 12 * k
  s.stroke(p.line([at[0] + 3 * k + t, low], [at[0] + w - 3 * k - t, low]))
  return Q(0.5, 0.5)
}

/** What a sleeve's cover shows, inside the square from `a` (top-left), `n` wide; `ink` allows a solid shape. */
function cover(s: Sheet, p: Pen, r: Stream, a: Point, n: number, kind: string) {
  const c = add(a, [n / 2, n / 2])
  if (kind === "disc") s.fill(p.disc(...dot(add(c, [n * 0.12, 0]), n * 0.26)))
  else if (kind === "ring") s.stroke(p.disc(...dot(c, n * 0.28)))
  else if (kind === "stripes")
    for (const f of [0.34, 0.5, 0.66])
      s.stroke(p.line(add(a, [n * 0.16, n * f]), add(a, [n * 0.84, n * f])))
  else if (kind === "sun") {
    s.stroke(p.line(add(a, [n * 0.12, n * 0.66]), add(a, [n * 0.88, n * 0.66])))
    s.stroke(
      p.path(arc(add(a, [n / 2, n * 0.66]), n * 0.2, n * 0.2, 180, 360, 9)),
    )
  } else
    scribble(s, p, r, a[0] + n * 0.16, a[1] + n * 0.62, n * 0.62, 2, n * 0.14)
}

/**
 * A rail of records face out on the wall: a narrow ledge on two brackets with sleeves standing on it, each cover a
 * plain motif of its own. `at` is the left end of the ledge's top. Its width comes from `w` (default 220).
 */
export const sleeveRail: Draw = (s, p, r, at, k = 1, { w = 220 } = {}) => {
  const len = w * k
  const n = 42 * k
  const count = Math.max(2, Math.floor(len / (n + 9 * k)))
  const gap = (len - count * n) / (count + 1)
  const kinds = ["disc", "ring", "stripes", "sun", "type"]
  let inks = 0
  for (let i = 0; i < count; i++) {
    const x = at[0] + gap + i * (n + gap)
    const tilt = r.signed() * 2.5
    const c: Point = [x + n / 2, at[1] - n / 2]
    const corner = (u: number, v: number) =>
      turn([x + u * n, at[1] - n + v * n], [c[0], at[1]], tilt)
    const face = [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)]
    s.blank(p.shape(face))
    s.stroke(p.shape(face))
    let kind = r.pick(kinds)
    if (kind === "disc" && inks++ > 0) kind = "ring"
    cover(s, p, r, corner(0, 0), n, kind)
  }
  // The ledge, in front of the sleeves' feet, and its brackets under it.
  const o = depth(r)
  const ledge: Box = box(s, p, o, [at[0], at[1] + 5 * k], len, 5 * k, 9 * k)
  for (const u of [0.12, 0.88]) {
    const b = ledge.front(u, 0)
    s.stroke(p.path([b, add(b, [0, 14 * k]), add(b, [9 * k, 0])]))
  }
}

/**
 * The shop's counter: a plank front under a top that overhangs a little. `at` is its front-left foot, `w` its width
 * (default 200). Returns the top, so a scene can stand the till and a turntable on it.
 */
export const counter: Draw = (s, p, r, at, k = 1, { w = 200 } = {}) => {
  const o = depth(r)
  const [len, h, d, t] = [w * k, 84 * k, 46 * k, 6 * k]
  const body = box(s, p, o, at, len, h, d)
  // Planks: lines down the front, starting under the top and ending just above the plinth.
  const planks = Math.max(3, Math.round(len / (34 * k)))
  for (let i = 1; i < planks; i++) {
    const u = i / planks + r.signed() * 0.008
    s.stroke(p.line(body.front(u, 0.94), body.front(u, 0.12)))
  }
  s.stroke(p.line(body.front(0.012, 0.09), body.front(0.988, 0.09)))
  return box(s, p, o, [at[0] - 5 * k, at[1] - h], len + 10 * k, t, d + 4 * k)
}

/**
 * A till: a drawer at the bottom, a keypad sloping up to the back, and a small display on a post facing the customer.
 * `at` is its front-left foot.
 */
export const till: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const drawer = box(s, p, o, at, 46 * k, 13 * k, 32 * k)
  s.stroke(p.line(drawer.front(0.4, 0.5), drawer.front(0.6, 0.5)))
  // The display on its post at the back, facing the customer.
  const foot = drawer.top(r.between(0.66, 0.78), 0.82)
  const head = add(foot, [0, -22 * k])
  post(s, p, foot, head, 2.6 * k)
  outline(s, p, [
    add(head, [-9 * k, 1 * k]),
    add(head, [12 * k, 1 * k]),
    add(head, [12 * k, -11 * k]),
    add(head, [-9 * k, -11 * k]),
  ])
  // The keypad: a wedge on the front of the drawer, rising to the back, with its keys as dots.
  const lift: Point = [0, -12 * k]
  const [f0, f1] = [drawer.top(0.04, 0.08), drawer.top(0.96, 0.08)]
  const foot1 = drawer.top(0.96, 0.6)
  const [b0, b1] = [add(drawer.top(0.04, 0.6), lift), add(foot1, lift)]
  outline(s, p, [f1, foot1, b1])
  outline(s, p, [f0, f1, b1, b0])
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++) {
      const v = 0.32 + j * 0.36
      const key = lerp(lerp(f0, b0, v), lerp(f1, b1, v), 0.24 + i * 0.26)
      s.fill(p.disc(...dot(key, 1 * k)))
    }
}

/**
 * A gig poster taped to the wall, centred on `at`: a big shape, the band and the date as scribbled lines, and a row
 * of tear-off tabs along the bottom with one already gone.
 */
export const poster: Draw = (s, p, r, c, k = 1) => {
  const [w, h] = [74 * k, 104 * k]
  const tilt = r.signed() * 2.5
  const at = (u: number, v: number) =>
    turn([c[0] + (u - 0.5) * w, c[1] + (v - 0.5) * h], c, tilt)
  const sheet = [at(0, 0), at(1, 0), at(1, 1), at(0, 1)]
  outline(s, p, sheet)
  const kind = r.pick(["sun", "disc", "wave"])
  if (kind === "sun") {
    s.wash(p.disc(...dot(at(0.5, 0.32), w * 0.24)))
    s.stroke(p.disc(...dot(at(0.5, 0.32), w * 0.24)))
  } else if (kind === "disc") {
    s.fill(p.disc(...dot(at(0.5, 0.32), w * 0.24)))
    s.paper(p.disc(...dot(at(0.5, 0.32), w * 0.05)))
  } else
    for (const v of [0.22, 0.32, 0.42])
      s.stroke(
        p.path(
          Array.from({ length: 7 }, (_, i) =>
            at(0.14 + i * 0.12, v + (i % 2 ? 0.03 : -0.03)),
          ),
        ),
      )
  const [x0, y0] = at(0.16, 0.6)
  scribble(s, p, r, x0, y0, w * 0.68, 2, 8 * k)
  // Tear-off tabs along the bottom: a cut line across and the slits between them.
  s.stroke(p.line(at(0.03, 0.8), at(0.97, 0.8)))
  for (let i = 1; i < 6; i++) s.stroke(p.line(at(i / 6, 0.83), at(i / 6, 0.97)))
  // Tape across two corners.
  for (const [u, v, a] of [
    [0.04, 0.02, -35],
    [0.96, 0.02, 35],
  ] as const) {
    const m = at(u, v)
    const strip = [
      [-9, -3],
      [9, -3],
      [9, 3],
      [-9, 3],
    ].map(([dx, dy]): Point => turn(add(m, [dx! * k, dy! * k]), m, a + tilt))
    outline(s, p, strip)
  }
}

const T = objectsIn("indie")

define(
  T("record-bin", "Record bin", [190, 170], [20, 160], 1, recordBin, [
    "music",
    "record",
    "shop",
  ]),
  T("sleeve-rail", "Sleeve rail", [240, 110], [10, 80], 0.95, sleeveRail, [
    "music",
    "record",
    "wall",
  ]),
  T("counter", "Counter", [250, 140], [16, 130], 0.95, counter, [
    "shop",
    "furniture",
  ]),
  T("till", "Till", [120, 110], [22, 96], 1.4, till, ["shop", "money"]),
  T("poster", "Gig poster", [120, 150], [60, 75], 1.1, poster, [
    "music",
    "wall",
    "event",
  ]),
)
