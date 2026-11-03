// Path data, written small and read back. Points are rounded to tenths and written as relative steps ("M12.3 4l3 -.1
// 2.9 0"), each step taken between rounded points so the sum never drifts: the same shape at about half the bytes of
// absolute "L" pairs. pathPoints reads any M/L/H/V/Z path back, absolute or relative; curves and arcs it leaves alone.
import type { Point } from "./geometry"

const tenths = (n: number) => Math.round(n * 10)
// 0.5 → ".5" and -0.5 → "-.5"; numbers need no space before a minus sign.
const num = (t: number) => String(t / 10).replace(/^(-?)0\./, "$1.")
const list = (nums: string[]) =>
  nums.reduce((s, n) => (s && !n.startsWith("-") ? `${s} ${n}` : s + n), "")

/** A polyline as compact path data; `closed` adds Z. */
export function pathOf(points: readonly Point[], closed = false) {
  let d = ""
  let px = 0
  let py = 0
  const steps: string[] = []
  points.forEach(([x, y], i) => {
    const tx = tenths(x)
    const ty = tenths(y)
    if (i) steps.push(num(tx - px), num(ty - py))
    else d = `M${list([num(tx), num(ty)])}`
    px = tx
    py = ty
  })
  if (steps.length) d += `l${list(steps)}`
  return closed ? `${d}Z` : d
}

const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi

/** Every vertex of an M/L/H/V/Z path, absolute; undefined for a path with curves or arcs. */
export function pathPoints(d: string): Point[] | undefined {
  if (/[AaCcSsQqTt]/.test(d)) return undefined
  const out: Point[] = []
  let x = 0
  let y = 0
  let start: Point = [0, 0]
  for (const [, cmd = "", args = ""] of d.matchAll(
    /([MmLlHhVvZz])([^MmLlHhVvZz]*)/g,
  )) {
    const n = (args.match(NUM) ?? []).map(Number)
    const rel = cmd === cmd.toLowerCase()
    const c = cmd.toUpperCase()
    if (c === "Z") {
      ;[x, y] = start
      continue
    }
    if (c === "H" || c === "V")
      for (const v of n) {
        if (c === "H") x = rel ? x + v : v
        else y = rel ? y + v : v
        out.push([x, y])
      }
    else
      for (let i = 0; i + 1 < n.length; i += 2) {
        x = rel ? x + (n[i] as number) : (n[i] as number)
        y = rel ? y + (n[i + 1] as number) : (n[i + 1] as number)
        if (c === "M" && i === 0) start = [x, y]
        out.push([x, y])
      }
  }
  return out
}

/** The box around a path's vertices as [x0, y0, x1, y1]; undefined when it cannot be read (curves, arcs). */
export function pathBox(d: string): Bounds | undefined {
  const points = pathPoints(d)
  if (!points?.length) return undefined
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const [x, y] of points) {
    x0 = Math.min(x0, x)
    y0 = Math.min(y0, y)
    x1 = Math.max(x1, x)
    y1 = Math.max(y1, y)
  }
  return [x0, y0, x1, y1]
}

export type Bounds = [x0: number, y0: number, x1: number, y1: number]
