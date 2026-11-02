// The pen. Every line is one thin monoline stroke with a slow hand wobble, drawn from a seed, so the same seed always
// draws the same line. Ported from the prototype in specimen/pen.js, with Patina's cross-engine rules: inputs are
// snapped before they decide a count or a random draw, and no ** or Math.pow.
import { dist, last, length, snap, type Point } from "./geometry"
import { fork, prng, seedOf } from "./seed"

export type HandName = "calm" | "lively"

/**
 * How far a hand strays. amp: slow wobble in px; wave: its wavelength; tremor: fine shake; over: how far a line may
 * run past its end (a negative draw stops short); loop: the extra turn on a drawn circle, in radians.
 */
export const HANDS = {
  calm: { amp: 0.35, wave: 60, tremor: 0.08, over: 1.2, loop: 0.12 },
  lively: { amp: 1.1, wave: 40, tremor: 0.18, over: 4.5, loop: 0.45 },
} as const

const r1 = (n: number) => Math.round(n * 10) / 10

/** Slow 1D noise along a line: random offsets at knots `wave` apart, eased between them. */
function noise(rand: () => number, size: number, wave: number, amp: number) {
  const n = Math.ceil(snap(size / wave)) + 2
  const knots = Array.from({ length: n }, () => (rand() * 2 - 1) * amp)
  return (s: number) => {
    const t = Math.max(0, s) / wave
    const i = Math.min(Math.floor(t), n - 2)
    const u = (1 - Math.cos((t - i) * Math.PI)) / 2
    return (knots[i] as number) * (1 - u) + (knots[i + 1] as number) * u
  }
}

type Sample = [number, number, number]

/** Points every `step` px along a polyline, with their distance from the start. */
function resample(points: Point[], step: number): Sample[] {
  const first = points[0] as Point
  const out: Sample[] = [[first[0], first[1], 0]]
  let s = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1] as Point
    const b = points[i] as Point
    const len = snap(dist(a, b))
    const n = Math.max(1, Math.round(len / step))
    for (let j = 1; j <= n; j++) {
      const f = j / n
      out.push([
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        s + len * f,
      ])
    }
    s += len
  }
  return out
}

function toPath(points: Point[], closed = false) {
  const d = points
    .map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`)
    .join("")
  return closed ? `${d}Z` : d
}

export interface Pen {
  hand: HandName
  /** The pen's own random stream, for choices an object makes while drawing. */
  next: () => number
  /** One straight stroke. */
  line(a: Point, b: Point): string
  /** A smooth open stroke through points. */
  path(points: Point[]): string
  /** A polygon drawn edge by edge, so its corners cross or fall short. */
  edges(points: Point[], closed?: boolean): string
  /** A closed outline in one stroke, for fills and blanks. */
  shape(points: Point[]): string
  /** A drawn ellipse (centre plus two axis vectors): the pen goes a little past where it started. */
  ring(c: Point, u: Point, v?: Point): string
  /** A closed ellipse outline, for solid discs. */
  disc(c: Point, u: Point, v?: Point): string
  /** Points round an ellipse from `from`, sweeping `turn` radians. */
  round(c: Point, u: Point, v: Point, from: number, turn: number): Point[]
}

/**
 * A pen with a hand. Each call draws the next stroke from the pen's own stream. Takes (line boil, settling) redraw
 * the same composition with another pen: a labelled fork per take, so take 0 is the drawing itself.
 */
export function pen(
  seed: string | number,
  handName: HandName = "lively",
  take = 0,
): Pen {
  const hand = HANDS[handName] ?? HANDS.lively
  const rand = prng(fork(seedOf(seed), take ? `pen:take:${take}` : "pen"))
  const between = (a: number, b: number) => a + rand() * (b - a)

  /** Offset a polyline along its normals by slow wobble plus tremor. `closed` makes the offsets meet. */
  function trace(points: Point[], closed = false): Point[] {
    const pts = resample(
      points.map(([x, y]) => [snap(x), snap(y)]),
      3,
    )
    const size = last(pts)[2] || 1
    const slow = noise(rand, size, hand.wave * between(0.8, 1.25), hand.amp)
    const fine = noise(rand, size, 7, hand.tremor)
    const start = slow(0) + fine(0)
    const end = slow(size) + fine(size)
    return pts.map(([x, y, s], i) => {
      const a = pts[Math.max(0, i - 1)] as Sample
      const b = pts[Math.min(pts.length - 1, i + 1)] as Sample
      const len = length([b[0] - a[0], b[1] - a[1]]) || 1
      let off = slow(s) + fine(s)
      if (closed) off -= ((end - start) * s) / size
      return [x - ((b[1] - a[1]) / len) * off, y + ((b[0] - a[0]) / len) * off]
    })
  }

  /** Run the first and last segment on past their ends (or stop short), as a quick hand does. */
  function overshoot(points: Point[]): Point[] {
    const pts = points.map((p) => [p[0], p[1]] as Point)
    const extend = (p: Point, q: Point) => {
      const len = dist(p, q) || 1
      const o = between(-0.25, 1) * hand.over
      p[0] += ((p[0] - q[0]) / len) * o
      p[1] += ((p[1] - q[1]) / len) * o
    }
    extend(pts[0] as Point, pts[1] as Point)
    extend(last(pts), pts[pts.length - 2] as Point)
    return pts
  }

  function round(c: Point, u: Point, v: Point, from: number, turn: number) {
    const span = snap(length(u) + length(v))
    const n = Math.max(12, Math.round(snap((span * turn) / 4)))
    return Array.from({ length: n + 1 }, (_, i): Point => {
      const t = from + (turn * i) / n
      return [
        c[0] + u[0] * Math.cos(t) + v[0] * Math.sin(t),
        c[1] + u[1] * Math.cos(t) + v[1] * Math.sin(t),
      ]
    })
  }

  return {
    hand: handName,
    next: rand,
    line: (a, b) => toPath(trace(overshoot([a, b]))),
    path: (points) => toPath(trace(overshoot(points))),
    edges(points, closed = true) {
      const ring = closed ? [...points, points[0] as Point] : points
      let d = ""
      for (let i = 1; i < ring.length; i++)
        d += toPath(trace(overshoot([ring[i - 1] as Point, ring[i] as Point])))
      return d
    },
    shape: (points) =>
      toPath(trace([...points, points[0] as Point], true), true),
    ring(c, u, v = [0, u[0]]) {
      const from = between(0, Math.PI * 2)
      const turn = Math.PI * 2 + between(0.3, 1) * hand.loop
      return toPath(trace(round(c, u, v, from, turn)))
    },
    disc(c, u, v = [0, u[0]]) {
      const pts = round(c, u, v, between(0, Math.PI * 2), Math.PI * 2)
      return toPath(trace([...pts.slice(0, -1), pts[0] as Point], true), true)
    },
    round,
  }
}
