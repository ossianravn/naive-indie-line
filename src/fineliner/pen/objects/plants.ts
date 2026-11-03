// Indie: the room's plants, each in a flowerpot standing at `at` (bottom centre); `k` is its scale. Composition
// comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, deg, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import { drum } from "../shapes"
import type { Pen } from "../stroke"

/** A leaf from its base along `angle` (0 = straight up, in radians), drooping as it goes: one closed outline and a rib. */
export function leaf(
  s: Sheet,
  p: Pen,
  base: Point,
  angle: number,
  len: number,
) {
  const dir: Point = [Math.sin(angle), -Math.cos(angle)]
  const nrm: Point = [-dir[1], dir[0]]
  const [width, sag] = [len * 0.36, len * 0.28]
  // t * (1.25 - 0.25 * t) stands in for t to the power 0.8, which engines do not round alike.
  const at = (t: number, side: number): Point => {
    const swell = Math.sin(Math.PI * (t * (1.25 - 0.25 * t)))
    const pt = add(add(base, dir, len * t), nrm, side * width * swell)
    return [pt[0], pt[1] + sag * t * t]
  }
  const outline = [
    ...Array.from({ length: 11 }, (_, i) => at(i / 10, 1)),
    ...Array.from({ length: 9 }, (_, i) => at(0.9 - i / 10, -1)),
  ]
  s.blank(p.shape(outline))
  s.stroke(p.shape(outline))
  s.stroke(p.path(Array.from({ length: 5 }, (_, i) => at(0.06 + i * 0.17, 0))))
}

/**
 * A flowerpot standing at `at` (bottom centre): the open top with the soil inside, a rim band in the wash and a
 * tapering body. `grow` draws what stands in the soil. Returns the centre of the opening; stems start just below it.
 */
export function pot(
  s: Sheet,
  p: Pen,
  at: Point,
  k: number,
  grow?: () => void,
): Point {
  const [x, y] = at
  const top: Point = [x, y - 36 * k]
  const soil = arc(add(top, [0, 1.6 * k]), 21 * k, 3.6 * k, 205, 335, 8)
  const body: Point[] = [
    [x - 21 * k, y - 29 * k],
    ...arc([x, y - 3 * k], 16 * k, 3 * k, 180, 0, 10),
    [x + 21 * k, y - 29 * k],
  ]
  const fill = () => {
    s.stroke(p.path(soil))
    grow?.()
    s.blank(p.shape(body))
    s.stroke(p.shape(body))
  }
  drum(s, p, top, [25 * k, 24 * k, 7 * k, 5 * k], fill, true)
  return top
}

/** A quadratic curve from a through the pull of b to c, as n + 1 points. */
const bend = (a: Point, b: Point, c: Point, n = 6) =>
  Array.from({ length: n + 1 }, (_, i): Point => {
    const t = i / n
    const [u, v, w] = [(1 - t) * (1 - t), 2 * t * (1 - t), t * t]
    return [u * a[0] + v * b[0] + w * c[0], u * a[1] + v * b[1] + w * c[1]]
  })

/** A sunflower's head facing out: a back ring of petals, a front ring between them, and a seeded centre. */
function bloom(s: Sheet, p: Pen, r: Stream, c: Point, k: number) {
  const [rc, rp] = [10 * k, r.between(23, 26) * k]
  const n = 13 + Math.floor(r.next() * 4)
  const spin = r.next() * 360
  const petal = (a: number, reach: number) => {
    const d: Point = [Math.cos(a * deg), Math.sin(a * deg)]
    const half = ((Math.PI * (rc + reach)) / n) * 0.55
    const side = (t: number, f: number) =>
      add(
        add(c, d, rc - 1.5 * k + (reach - rc) * t),
        [-d[1], d[0]],
        f * half * Math.sin(Math.PI * t),
      )
    const pts = [
      ...Array.from({ length: 7 }, (_, i) => side(i / 6, 1)),
      ...Array.from({ length: 5 }, (_, i) => side(5 / 6 - i / 6, -1)),
    ]
    s.blank(p.shape(pts))
    s.stroke(p.shape(pts))
  }
  for (let i = 0; i < n; i++) petal(spin + (i + 0.5) * (360 / n), rp * 0.86)
  for (let i = 0; i < n; i++) petal(spin + i * (360 / n), rp)
  s.blank(p.disc(...dot(c, rc)))
  s.stroke(p.ring(...dot(c, rc)))
  // Seeds on a sunflower's own spiral: each the golden angle on from the last, further out as the root of its count.
  const seeds = 11 + Math.floor(r.next() * 4)
  for (let i = 1; i <= seeds; i++) {
    const [a, f] = [i * 137.5 * deg, Math.sqrt(i / seeds) * rc * 0.7]
    s.fill(p.disc(...dot(add(c, [Math.cos(a), Math.sin(a)], f), 0.9 * k)))
  }
}

/** A potted plant: a tall sunflower or a leafy one, from the seed unless `kind` says. */
export const plant: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { kind = r.pick(["sunflower", "leafy"]) } = {},
) => {
  const [x, y] = [at[0], at[1] - 36 * k + 1.5 * k]
  if (kind === "sunflower") {
    const height = r.between(110, 135) * k
    const lean = r.signed() * 12 * k
    const stem = (t: number): Point => [x + lean * t * t, y - height * t]
    pot(s, p, at, k, () =>
      s.stroke(p.path(Array.from({ length: 7 }, (_, i) => stem(i / 6)))),
    )
    const leaves = 2 + Math.floor(r.next() * 2)
    const first = r.chance(0.5) ? 1 : -1
    for (let i = 0; i < leaves; i++) {
      const t = 0.22 + (i * 0.46) / leaves + r.signed() * 0.03
      const side = i % 2 ? -first : first
      leaf(s, p, stem(t), side * r.between(60, 95) * deg, r.between(30, 40) * k)
    }
    bloom(s, p, r, stem(1), k)
    return
  }
  // A fan of stalks from the soil, tallest in the middle; each carries one leaf, outer ones in front of inner ones.
  const n = 5 + Math.floor(r.next() * 3)
  const stalks = Array.from({ length: n }, (_, i) => {
    const u = (i / (n - 1)) * 2 - 1
    const a = (u * 52 + r.signed() * 7) * deg
    const len = r.between(50, 64) * k * (1 - 0.4 * Math.abs(u))
    const foot: Point = [x + u * 5 * k, y]
    const tip: Point = [
      foot[0] + Math.sin(a) * len * 0.85,
      foot[1] - Math.cos(a) * len,
    ]
    const pull: Point = [foot[0] + Math.sin(a) * len * 0.1, tip[1] + len * 0.3]
    return { u, a, foot, tip, pull, size: r.between(25, 32) * k }
  }).sort((m, o) => Math.abs(m.u) - Math.abs(o.u))
  pot(s, p, at, k, () => {
    for (const q of stalks) s.stroke(p.path(bend(q.foot, q.pull, q.tip)))
  })
  for (const q of stalks) leaf(s, p, q.tip, q.a * 1.35, q.size)
}

export const sunflower: Draw = (s, p, r, at, k) =>
  plant(s, p, r, at, k, { kind: "sunflower" })

export const housePlant: Draw = (s, p, r, at, k) =>
  plant(s, p, r, at, k, { kind: "leafy" })

/**
 * A column cactus with one arm that bends up from its side at a rounded elbow, ribs that close in at the top and
 * areoles as dots. The arm goes in behind the column and the column into the soil, so neither shows a seam.
 */
export const cactus: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = [at[0], at[1] - 36 * k]
  const h = r.between(64, 84) * k
  const w = 11 * k
  const side = r.chance(0.5) ? 1 : -1
  const X = (u: number, v: number): Point => [x + side * u * k, v]
  const Y = y - h * r.between(0.38, 0.52)
  const lift = r.between(18, 26) * k
  // A plump arm, two thirds as wide as the column, with a round elbow and a soft inner corner.
  const [a, ax, R] = [7, r.between(26, 30), 12]
  const arm: Point[] = [
    X(8, Y + a * k),
    ...arc([0, 0], R * k, R * k, 90, 0, 6).map(([u, v]) =>
      X(ax + a - R + u / k, Y + (a - R) * k + v),
    ),
    ...arc([0, 0], a * k, a * k, 0, -180, 10).map(([u, v]) =>
      X(ax + u / k, Y - lift + v),
    ),
    ...arc([0, 0], 3 * k, 3 * k, 0, 90, 4).map(([u, v]) =>
      X(ax - a - 3 + u / k, Y - (a + 3) * k + v),
    ),
    X(8, Y - a * k),
  ]
  pot(s, p, at, k, () => {
    s.blank(p.shape(arm))
    s.stroke(p.path(arm))
    const column: Point[] = [
      [x - w, y + 6 * k],
      ...arc([x, y - h], w, w, 180, 360, 10),
      [x + w, y + 6 * k],
    ]
    s.blank(p.shape(column))
    s.stroke(p.path(column))
    // Ribs with the spines' areoles as dots along them: spines as tiny strokes came out as scribbles, since the
    // pen's run past each end is longer than the spine.
    for (const u of [-0.45, 0.45]) {
      s.stroke(
        p.path([
          [x + u * w, y + 6 * k],
          [x + u * w, y - h],
          [x + u * w * 0.4, y - h - w * 0.75],
        ]),
      )
      for (let v = r.between(0.08, 0.14); v < 0.95; v += r.between(0.15, 0.2))
        s.fill(p.disc(...dot([x + u * w, y - v * h], 0.9 * k)))
    }
    for (const v of [0.35, 0.75])
      s.fill(p.disc(...dot(X(ax, Y - lift * v), 0.9 * k)))
    if (r.chance(0.5))
      s.fill(p.disc(...dot([x + 2 * k, y - h - w + 1 * k], 3.2 * k)))
  })
}

const T = objectsIn("indie")

define(
  T("sunflower", "Sunflower", [120, 220], [60, 212], 1, sunflower, [
    "plant",
    "flower",
    "summer",
  ]),
  T("house-plant", "House plant", [120, 140], [60, 132], 1, housePlant, [
    "plant",
    "home",
  ]),
  T("cactus", "Cactus", [100, 150], [50, 142], 1, cactus, [
    "plant",
    "desert",
    "windowsill",
  ]),
)
