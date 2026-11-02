// The pen through data. A chart's line must pass exactly through every data point and a bar's corners must sit
// exactly on its value, so here the wobble fades to nothing at each point and lives only on the stretch between two:
// the pen still draws the line, and the data does not move. Same cross-engine rules as the stroke engine.
import { dist, snap, type Point } from "./geometry"
import { fork, prng, seedOf } from "./seed"
import { HANDS, noise, resample, type HandName } from "./stroke"

const r1 = (n: number) => Math.round(n * 10) / 10

export interface Plot {
  /**
   * One stroke through runs of points. Each run goes from one data point to the next (a straight pair, or a curve
   * sampled densely); the stroke wobbles inside a run and passes exactly through its ends.
   */
  through(runs: Point[][]): Point[]
  /** The same, as SVG path data. */
  path(runs: Point[][]): string
  /** A polygon edge by edge: every corner exact, each edge running a little past its corners (or short of them). */
  edges(corners: Point[], closed?: boolean): string
}

/** A pen for data, seeded from the series and its values (never from layout), so a chart draws the same each time. */
export function plot(seed: string | number, handName: HandName = "calm"): Plot {
  const hand = HANDS[handName] ?? HANDS.calm
  const rand = prng(fork(seedOf(seed), "plot"))

  function run(points: Point[]): Point[] {
    const pts = resample(
      points.map(([x, y]) => [snap(x), snap(y)]),
      3,
    )
    const size = pts[pts.length - 1]?.[2] || 1
    const slow = noise(rand, size, hand.wave, hand.amp)
    const fine = noise(rand, size, 7, hand.tremor)
    return pts.map(([x, y, s], i): Point => {
      if (i === 0 || i === pts.length - 1) return [x, y]
      const a = pts[i - 1] as [number, number, number]
      const b = pts[i + 1] as [number, number, number]
      const len = dist([a[0], a[1]], [b[0], b[1]]) || 1
      // Zero at both data points, full in the middle of the stretch.
      const off = (slow(s) + fine(s)) * Math.sin((Math.PI * s) / size)
      return [x - ((b[1] - a[1]) / len) * off, y + ((b[0] - a[0]) / len) * off]
    })
  }

  const toPath = (points: Point[]) =>
    points.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`).join("")

  function through(runs: Point[][]): Point[] {
    const out: Point[] = []
    for (const points of runs) {
      if (points.length < 2) continue
      const drawn = run(points)
      out.push(...(out.length ? drawn.slice(1) : drawn))
    }
    return out
  }

  return {
    through,
    path: (runs) => toPath(through(runs)),
    edges(corners, closed = true) {
      const ring = closed ? [...corners, corners[0] as Point] : corners
      let d = ""
      for (let i = 1; i < ring.length; i++) {
        const a = ring[i - 1] as Point
        const b = ring[i] as Point
        const len = dist(a, b) || 1
        const past = (from: Point, to: Point): Point => {
          const o = (rand() * 1.25 - 0.25) * hand.over
          return [
            from[0] + ((from[0] - to[0]) / len) * o,
            from[1] + ((from[1] - to[1]) / len) * o,
          ]
        }
        d += toPath([past(a, b), ...run([a, b]), past(b, a)])
      }
      return d
    },
  }
}

// d3's monotoneX tangents, so a drawn line and its area follow the same curve and never overshoot the data.
function slope3([x0, y0]: Point, [x1, y1]: Point, [x2, y2]: Point) {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = (y1 - y0) / (h0 || (h1 < 0 ? -0 : 0))
  const s1 = (y2 - y1) / (h1 || (h0 < 0 ? -0 : 0))
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)
  const sign = (v: number) => (v < 0 ? -1 : 1)
  return (
    (sign(s0) + sign(s1)) *
      Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
  )
}
function slope2([x0, y0]: Point, [x1, y1]: Point, t: number) {
  const h = x1 - x0
  return h ? ((3 * (y1 - y0)) / h - t) / 2 : t
}

/** The curve from one data point to the next, as a dense run of points (a straight pair when linear). */
export function curveRuns(
  points: Point[],
  interpolation: "monotone" | "linear" = "monotone",
) {
  const n = points.length
  if (interpolation === "linear" || n < 3)
    return points.slice(1).map((to, i) => [points[i]!, to])
  const t: number[] = new Array(n).fill(0)
  for (let i = 1; i < n - 1; i++)
    t[i] = slope3(points[i - 1]!, points[i]!, points[i + 1]!)
  t[0] = slope2(points[0]!, points[1]!, t[1]!)
  t[n - 1] = slope2(points[n - 2]!, points[n - 1]!, t[n - 2]!)
  return points.slice(1).map((to, i) => {
    const from = points[i]!
    const dx = (to[0] - from[0]) / 3
    const c1: Point = [from[0] + dx, from[1] + dx * t[i]!]
    const c2: Point = [to[0] - dx, to[1] - dx * t[i + 1]!]
    const steps = Math.max(2, Math.round(snap(Math.abs(to[0] - from[0])) / 4))
    return Array.from({ length: steps + 1 }, (_, j): Point => {
      const u = j / steps
      const v = 1 - u
      const a = v * v * v
      const b = 3 * v * v * u
      const c = 3 * v * u * u
      const d = u * u * u
      return [
        a * from[0] + b * c1[0] + c * c2[0] + d * to[0],
        a * from[1] + b * c1[1] + c * c2[1] + d * to[1],
      ]
    })
  })
}
