// Indie: the room's plants, each in a flowerpot standing at `at` (bottom centre); `k` is its scale. Composition
// comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, deg, dot, rect, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"

/** A leaf from its base along `angle` (0 = straight up, in radians), drooping as it goes. */
export function leaf(
  s: Sheet,
  p: Pen,
  base: Point,
  angle: number,
  len: number,
) {
  const dir: Point = [Math.sin(angle), -Math.cos(angle)]
  const nrm: Point = [-dir[1], dir[0]]
  const [width, sag] = [len * 0.34, len * 0.28]
  // t * (1.25 - 0.25 * t) stands in for t to the power 0.8, which engines do not round alike.
  const at = (t: number, side: number): Point => {
    const swell = Math.sin(Math.PI * (t * (1.25 - 0.25 * t)))
    const pt = add(add(base, dir, len * t), nrm, side * width * swell)
    return [pt[0], pt[1] + sag * t * t]
  }
  const one = Array.from({ length: 11 }, (_, i) => at(i / 10, 1))
  const two = Array.from({ length: 11 }, (_, i) => at(1 - i / 10, -1))
  s.blank(p.shape([...one, ...two.slice(1)]))
  s.stroke(p.path([...one, ...two.slice(1)]))
  s.stroke(p.path(Array.from({ length: 5 }, (_, i) => at((i / 4) * 0.8, 0))))
}

/** A flowerpot with its rim in the wash, standing at `at` (bottom centre). Returns the top of the soil. */
export function pot(s: Sheet, p: Pen, at: Point, k: number): Point {
  const [x, y] = at
  const [top, bot, h, rim] = [25 * k, 18 * k, 36 * k, 8 * k]
  const body: Point[] = [
    [x - bot, y],
    [x + bot, y],
    [x + top, y - h + rim],
    [x - top, y - h + rim],
  ]
  const band = rect(x - top - 2 * k, y - h, 2 * (top + 2 * k), rim)
  s.blank(p.shape(body))
  s.blank(p.shape(band))
  s.wash(p.shape(band))
  s.stroke(p.edges(body))
  s.stroke(p.edges(band))
  return [x, y - h]
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
  const [x, y] = [at[0], at[1] - 36 * k]
  const tall = kind === "sunflower"
  const height = (tall ? r.between(105, 135) : r.between(55, 75)) * k
  const bend = r.signed() * 16 * k
  const stem = (t: number): Point => [x + bend * t * t, y - height * t]
  s.stroke(p.path(Array.from({ length: 7 }, (_, i) => stem(i / 6))))
  const leaves = tall
    ? 2 + Math.floor(r.next() * 2)
    : 5 + Math.floor(r.next() * 3)
  for (let i = 0; i < leaves; i++) {
    const side = i % 2 ? 1 : -1
    const t = tall ? 0.22 + (i * 0.5) / leaves : 0.15 + (i * 0.85) / leaves
    leaf(
      s,
      p,
      stem(t),
      side * r.between(45, tall ? 100 : 80) * deg,
      r.between(tall ? 32 : 24, tall ? 46 : 38) * k,
    )
  }
  if (tall) {
    const c = stem(1)
    const n = 18 + Math.floor(r.next() * 6)
    const star = Array.from({ length: n * 2 }, (_, i) =>
      add(
        c,
        [Math.cos((i * Math.PI) / n), Math.sin((i * Math.PI) / n)],
        (i % 2 ? 11 : r.between(20, 24)) * k,
      ),
    )
    s.blank(p.shape(star))
    s.stroke(p.path([...star, star[0] as Point]))
    s.stroke(p.ring(...dot(c, 10 * k)))
    s.stroke(p.path(p.round(c, [4 * k, 0], [0, 4 * k], 0.6, 4.4)))
  }
  pot(s, p, at, k)
}

export const sunflower: Draw = (s, p, r, at, k) =>
  plant(s, p, r, at, k, { kind: "sunflower" })

export const housePlant: Draw = (s, p, r, at, k) =>
  plant(s, p, r, at, k, { kind: "leafy" })

export const cactus: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = [at[0], at[1] - 36 * k]
  const h = r.between(64, 84) * k
  const w = 11 * k
  const column: Point[] = [
    [x - w, y],
    ...arc([x, y - h], w, w, 180, 360, 10),
    [x + w, y],
  ]
  const side = r.chance(0.5) ? 1 : -1
  const armY = y - h * r.between(0.4, 0.55)
  const arm: Point[] = [
    [x + side * w, armY + 7 * k],
    [x + side * 31 * k, armY + 7 * k],
    ...arc(
      [x + side * 24 * k, armY - 14 * k],
      7 * k,
      7 * k,
      side > 0 ? 0 : 180,
      side > 0 ? -180 : 360,
      8,
    ),
    [x + side * 17 * k, armY - 3 * k],
    [x + side * w, armY - 3 * k],
  ]
  s.stroke(p.path(arm))
  s.blank(p.shape(column))
  s.stroke(p.path(column))
  // Two ribs with the spines' areoles as dots along them: spines as tiny strokes came out as scribbles, since the
  // pen's run past each end is longer than the spine.
  for (const u of [-0.45, 0.45]) {
    s.stroke(p.line([x + u * w, y - 3 * k], [x + u * w, y - h]))
    for (let v = r.between(0.06, 0.14); v < 0.95; v += r.between(0.15, 0.2))
      s.fill(p.disc(...dot([x + u * w, y - v * h], 0.9 * k)))
  }
  if (r.chance(0.5)) s.fill(p.disc(...dot([x, y - h - w - 2 * k], 3.5 * k)))
  pot(s, p, at, k)
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
