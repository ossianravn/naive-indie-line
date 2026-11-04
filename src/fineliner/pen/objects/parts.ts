// Shared drawn parts: leaves, flowerpots, mugs, headphones, and the strokes a cartoon draws round a moment (a fan of
// short lines, sound rising), used by several collections without registering any objects.
// Their composition and pen strokes stay the same wherever they are placed.
import { add, arc, dot, type Point } from "../geometry"
import type { Draw } from "../library"
import type { Stream } from "../seed"
import type { Sheet } from "../layers"
import { cylinder, drum, handle, scribble } from "../shapes"
import type { Pen } from "../stroke"

/** Points from a flat list of coordinates: [x0, y0, x1, y1, …]. */
const pairs = (xy: number[]) =>
  xy.flatMap((v, i): Point[] => (i % 2 ? [] : [[v, xy[i + 1] ?? 0]]))

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

/** A full mug with a heart or a scribble on it. People hold one too. */
export const mug: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const cup = cylinder(s, p, [x, y - 44 * k], 20 * k, 6 * k, 40 * k)
  handle(s, p, x + 20 * k, y - 36 * k, y - 14 * k, 11 * k)
  s.fill(p.disc(cup.top, [16.5 * k, 0], [0, 4.4 * k]))
  const m: Point = [x - 2 * k, y - 22 * k]
  const heart = pairs([0, 6, -7, -1, -4, -6, 0, -3, 4, -6, 7, -1])
  if (r.chance(0.5)) s.fill(p.shape(heart.map((d) => add(m, d, k))))
  else scribble(s, p, r, x - 12 * k, y - 26 * k, 22 * k, 2, 6 * k)
}

/**
 * Over-ear headphones face on; `at` is bottom-centre. The band and its two sliders are one closed stroke; each slider
 * holds a yoke that cradles the top of its cup, pinned to the cup at both ends, and the cushions show on the inside.
 */
export const headphones: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const [cx, cy, rx, ry, gap] = [36, 22, 9, 15, 3.5]
  const top = cy + ry + gap
  const c = P(0, 46)
  const [ox, oy, ix, iy] = [cx + 3, 28, cx - 3, 22]
  s.stroke(
    p.shape([
      P(-ox, top),
      ...arc(c, ox * k, oy * k, 180, 360, 18),
      P(ox, top),
      P(ix, top),
      ...arc(c, ix * k, iy * k, 360, 180, 14),
      P(-ix, top),
    ]),
  )
  for (const side of [-1, 1]) {
    const cup = P(side * cx, cy)
    const [yx, yy] = [(rx + gap) * k, (ry + gap) * k]
    s.stroke(p.path(arc(cup, yx, yy, 208, 332, 12)))
    s.fill(p.disc(add(cup, [-side * 8 * k, 0]), [5.5 * k, 0], [0, 12 * k]))
    s.blank(p.disc(cup, [rx * k, 0], [0, ry * k]))
    s.stroke(p.ring(cup, [rx * k, 0], [0, ry * k]))
    for (const a of [200, 340]) {
      const pin = arc(cup, (rx + gap / 2) * k, (ry + gap / 2) * k, a, a, 1)
      s.fill(p.disc(...dot(pin[0] as Point, 2 * k)))
    }
  }
}

/** Short strokes fanning out round `c` at the given angles (degrees, 0 to the right, -90 up), from `rad` to 1.4 times
 * as far: the cartoonist's "look at this" round a find, or a hand raised, or music leaking from headphones. */
export function fan(s: Sheet, p: Pen, c: Point, rad: number, angles: number[]) {
  for (const a of angles) {
    const d: Point = [
      Math.cos((a * Math.PI) / 180),
      Math.sin((a * Math.PI) / 180),
    ]
    s.stroke(p.line(add(c, d, rad), add(c, d, rad * 1.4)))
  }
}

/** Sound rising from `at`: three short waves leaning to the right, each shorter and higher than the one before. */
export function soundLines(s: Sheet, p: Pen, r: Stream, at: Point, k = 1) {
  for (let i = 0; i < 3; i++) {
    const len = (54 - i * 10) * k
    const x0 = at[0] + (i * 16 + r.between(-3, 3)) * k
    const y0 = at[1] - i * 8 * k
    const lean = r.between(0.3, 0.45)
    s.stroke(
      p.path(
        Array.from({ length: 7 }, (_, j): Point => {
          const t = j / 6
          const side = Math.sin(t * Math.PI * 2 + i) * 5 * k
          return [x0 + t * len * lean + side, y0 - t * len]
        }),
      ),
    )
  }
}
