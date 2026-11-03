// Points and the arithmetic every drawing shares. Lengths use Math.sqrt, which every engine rounds the same way;
// Math.hypot and ** do not, and a last-bit difference in a length can change how many points a stroke gets.

export type Point = [number, number]

export const deg = Math.PI / 180

/** Round to hundredths, so last-bit noise from a maths function cannot reach a count or a random draw. */
export const snap = (n: number) => Math.round(n * 100) / 100

export const add = (a: Point, b: Point, f = 1): Point => [
  a[0] + b[0] * f,
  a[1] + b[1] * f,
]
export const lerp = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
]
export const times = (v: Point, f: number): Point => [v[0] * f, v[1] * f]
export const length = (v: Point) => Math.sqrt(v[0] * v[0] + v[1] * v[1])
export const dist = (a: Point, b: Point) => length([b[0] - a[0], b[1] - a[1]])

/** Centre and axes for a circle of radius r, as the pen's ring and disc take them. */
export const dot = (c: Point, r: number): [Point, Point, Point] => [
  c,
  [r, 0],
  [0, r],
]

/** Points on an ellipse from a0 to a1 degrees: 0 is right, 90 is down. */
export function arc(
  c: Point,
  rx: number,
  ry: number,
  a0: number,
  a1: number,
  n = 16,
): Point[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (a0 + ((a1 - a0) * i) / n) * deg
    return [c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]
  })
}

/** A rectangle's corners from its top-left corner, clockwise. */
export const rect = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
]

/** A rectangle with rounded corners from its top-left corner, as a loop starting halfway down its left side. */
export function roundRect(
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
): Point[] {
  const c = (cx: number, cy: number, a0: number) =>
    arc([cx, cy], rad, rad, a0, a0 + 90, 5)
  return [
    [x, y + h / 2],
    ...c(x + rad, y + rad, 180),
    ...c(x + w - rad, y + rad, 270),
    ...c(x + w - rad, y + h - rad, 0),
    ...c(x + rad, y + h - rad, 90),
  ]
}

/** Turn a point round a centre by a degrees. */
export function turn(pt: Point, c: Point, a: number): Point {
  const [s, k] = [Math.sin(a * deg), Math.cos(a * deg)]
  const [dx, dy] = [pt[0] - c[0], pt[1] - c[1]]
  return [c[0] + dx * k - dy * s, c[1] + dx * s + dy * k]
}

/** The last item of a list that is known not to be empty. */
export const last = <T>(items: readonly T[]): T => items[items.length - 1] as T
