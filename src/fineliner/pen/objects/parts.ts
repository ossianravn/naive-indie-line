// Shared drawn parts: leaves, flowerpots and mugs, used by several collections without registering any objects.
// Their composition and pen strokes stay the same wherever they are placed.
import { add, arc, type Point } from "../geometry"
import type { Draw } from "../library"
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
