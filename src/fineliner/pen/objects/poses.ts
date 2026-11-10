// The arms of the work poses, for figure(): pointing at something, reaching up to it, carrying something in both
// forearms, and on the phone. Each pose takes its own small variety from `r`, and only when it is the pose, so the
// poses that came before draw exactly as they did. `side` is which way the head turns: 1 right, -1 left, 0 out.
import { add, dist, lerp, type Point } from "../geometry"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

export interface Arms {
  swing?: Point
  bend?: [number | undefined, number | undefined]
}

/** The swing (and elbow bend) of both arms for a work pose; nothing for any other pose. */
export function arms(r: Stream, pose: string, side: number): Arms {
  if (pose === "point") {
    // The arm on the side they face goes out level towards what they show.
    const out = 84 + r.signed() * 4
    return { swing: side < 0 ? [out, r.signed() * 4] : [r.signed() * 4, -out] }
  }
  if (pose === "reach") {
    const up = 171 + r.signed() * 3
    return {
      swing: side < 0 ? [up, r.signed() * 4] : [r.signed() * 4 + 6, -up],
    }
  }
  if (pose === "carry") {
    // Upper arms down at the sides, forearms forward and in, the hands meeting under the load.
    const a = 8 + r.signed() * 3
    return { swing: [a, -a], bend: [-88, 88] }
  }
  if (pose === "call") {
    // The hand on the back of the head's side holds the phone to the ear; the other hangs.
    const a = 18 + r.signed() * 3
    const b = 164 + r.signed() * 3
    return side > 0
      ? { swing: [a, r.signed() * 4], bend: [-b, undefined] }
      : { swing: [r.signed() * 4, -a], bend: [undefined, b] }
  }
  return {}
}

/** A phone held from the hand up to the ear of a head centred at `c`, `out` from its middle: a small slab of ink. */
export function handset(
  s: Sheet,
  p: Pen,
  hand: Point,
  c: Point,
  k: number,
  out = 6,
) {
  const ear = add(c, [(hand[0] < c[0] ? -out : out) * k, 3 * k])
  const len = dist(hand, ear) || 1
  const top = lerp(hand, ear, Math.min(1, (20 * k) / len))
  const n: Point = [
    ((ear[1] - hand[1]) / len) * 3 * k,
    ((hand[0] - ear[0]) / len) * 3 * k,
  ]
  s.fill(
    p.shape([add(hand, n), add(top, n), add(top, n, -1), add(hand, n, -1)]),
  )
}
