// Strokes to outlines: a glyph's centre-line strokes, wobbled by one take of the hand, are swept by a round pen (round
// caps, round joins at corners), merged into one shape without overlaps, and fitted with cubic curves for CFF.
// Coordinates here are font units, y up.
import polygonClipping from "polygon-clipping"
import { fitClosed } from "./fit.mjs"

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const len = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1])
const unit = (v) => {
  const l = len(v) || 1
  return [v[0] / l, v[1] / l]
}
const normal = (v) => [-v[1], v[0]]

/** Points every `step` units along each segment, keeping every original point (corners stay corners). */
export function resample(points, step) {
  const out = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1], points[i]]
    const n = Math.max(1, Math.round(len(sub(b, a)) / step))
    for (let j = 1; j <= n; j++)
      out.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n])
  }
  return out
}

/** Slow eased noise along a stroke, as the pen's: offsets at knots `wave` apart, cosine-eased between them. */
function noise(rand, size, wave, amp) {
  const n = Math.ceil(size / wave) + 2
  const knots = Array.from({ length: n }, () => (rand() * 2 - 1) * amp)
  return (s) => {
    const t = Math.max(0, s) / wave
    const i = Math.min(Math.floor(t), n - 2)
    const u = (1 - Math.cos((t - i) * Math.PI)) / 2
    return knots[i] * (1 - u) + knots[i + 1] * u
  }
}

/** Wobble a stroke along its normals; a closed stroke's offsets meet where it starts, so a ring stays closed. */
export function wobble(points, closed, rand, hand) {
  const pts = resample(points, 10)
  const at = [0]
  for (let i = 1; i < pts.length; i++)
    at.push(at[i - 1] + len(sub(pts[i], pts[i - 1])))
  const size = at[at.length - 1] || 1
  const slow = noise(rand, size, hand.wave, hand.amp)
  const fine = noise(rand, size, hand.wave / 4, hand.tremor)
  const drift = closed ? slow(size) + fine(size) - slow(0) - fine(0) : 0
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const nv = normal(unit(sub(b, a)))
    const off = slow(at[i]) + fine(at[i]) - (drift * at[i]) / size
    return [p[0] + nv[0] * off, p[1] + nv[1] * off]
  })
}

/** Split a polyline where it turns sharply: each run is swept on its own and the round caps make the join. */
function runs(points, sharp = 40) {
  const out = [[points[0]]]
  for (let i = 1; i < points.length; i++) {
    out[out.length - 1].push(points[i])
    if (i < points.length - 1) {
      const [d0, d1] = [
        unit(sub(points[i], points[i - 1])),
        unit(sub(points[i + 1], points[i])),
      ]
      const turn =
        (Math.acos(Math.max(-1, Math.min(1, d0[0] * d1[0] + d0[1] * d1[1]))) *
          180) /
        Math.PI
      if (turn > sharp) out.push([points[i]])
    }
  }
  return out.filter((r) => r.length > 1)
}

const arcPoints = (c, r, a0, a1, n) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
  })

/** The offset of a run on one side, mitred a little at its gentle bends. */
function side(run, h) {
  return run.map((p, i) => {
    const before = i > 0 ? unit(sub(p, run[i - 1])) : null
    const after = i < run.length - 1 ? unit(sub(run[i + 1], p)) : null
    const d = unit([
      (before?.[0] ?? 0) + (after?.[0] ?? 0),
      (before?.[1] ?? 0) + (after?.[1] ?? 0),
    ])
    const cos =
      before && after ? Math.max(0.6, before[0] * d[0] + before[1] * d[1]) : 1
    const nv = normal(d)
    return [p[0] + (nv[0] * h) / cos, p[1] + (nv[1] * h) / cos]
  })
}

/** A run swept by a round pen of radius h: left side, end cap, right side back, start cap. */
function capsule(run, h) {
  const left = side(run, h)
  const right = side(run, -h)
  const end = unit(sub(run[run.length - 1], run[run.length - 2]))
  const start = unit(sub(run[1], run[0]))
  const ae = Math.atan2(end[1], end[0])
  const as = Math.atan2(start[1], start[0])
  const ring = [
    ...left,
    ...arcPoints(
      run[run.length - 1],
      h,
      ae + Math.PI / 2,
      ae - Math.PI / 2,
      10,
    ).slice(1, -1),
    ...right.reverse(),
    ...arcPoints(run[0], h, as - Math.PI / 2, as - (3 * Math.PI) / 2, 10).slice(
      1,
      -1,
    ),
  ]
  return [[...ring, ring[0]]]
}

/** A closed stroke (a ring): its outer and inner offsets, as a shape with a hole. */
function loop(points, h) {
  const pts = points.slice(0, -1)
  const wrap = [pts[pts.length - 1], ...pts, pts[0]]
  const at = (sign) =>
    pts.map((p, i) => {
      const d = unit(sub(wrap[i + 2], wrap[i]))
      const nv = normal(d)
      return [p[0] + nv[0] * h * sign, p[1] + nv[1] * h * sign]
    })
  const a = at(1)
  const b = at(-1)
  return [
    [...a, a[0]],
    [...b, b[0]],
  ]
}

/** Snap a polygon to a 1/32-unit grid, nudged by (dx, dy): near-coincident edges confuse the union less on a grid. */
const snapped = (polygon, dx = 0, dy = 0) =>
  polygon.map((ring) =>
    ring.map(([x, y]) => [
      Math.round((x + dx) * 32) / 32,
      Math.round((y + dy) * 32) / 32,
    ]),
  )

/**
 * Union of many shapes. polygon-clipping can fail on near-coincident edges (an inline stroke's two outlines where it
 * thins out); then the shapes merge one at a time, and a shape that still fails is nudged by a few hundredths of a
 * unit, the same nudge every build.
 */
function union(shapes) {
  try {
    return polygonClipping.union(...shapes)
  } catch {
    // fall through to the grid
  }
  try {
    return polygonClipping.union(...shapes.map((s) => snapped(s)))
  } catch {
    let acc = []
    shapes.forEach((shape, i) => {
      for (const nudge of [0, 0.03, 0.07, 0.13]) {
        try {
          acc = polygonClipping.union(
            acc,
            snapped(shape, nudge * ((i % 3) - 1), nudge),
          )
          return
        } catch {
          // try the next nudge
        }
      }
    })
    return acc
  }
}

const area = (ring) =>
  ring.reduce(
    (t, p, i) => (i ? t + (ring[i - 1][0] * p[1] - p[0] * ring[i - 1][1]) : t),
    0,
  ) / 2

/**
 * One glyph's outline: strokes (each a polyline, a ring when it closes) and dots, swept by a pen of radius h and
 * merged, with any ready-made shapes in `fills` (polygon-clipping polygons). Returns contours as cubic paths: outer contours counter-clockwise and holes clockwise, as CFF expects.
 */
export function outline(strokes, dots, h, fills = []) {
  const shapes = [...fills]
  for (const s of strokes) {
    const closed = s.length > 3 && len(sub(s[0], s[s.length - 1])) < 1
    if (closed && runs(s, 60).length === 1) {
      // polygon-clipping wants the hole the other way round to its outer ring.
      const [a, b] = loop(s, h)
      const [outer, inner] =
        Math.abs(area(a)) > Math.abs(area(b)) ? [a, b] : [b, a]
      shapes.push([
        area(outer) > 0 ? outer : outer.reverse(),
        area(inner) < 0 ? inner : inner.reverse(),
      ])
    } else for (const r of runs(s)) shapes.push(capsule(r, h))
  }
  for (const [x, y, r = 1.45] of dots) {
    const ring = arcPoints([x, y], h * r, 0, 2 * Math.PI, 28)
    ring[ring.length - 1] = ring[0]
    shapes.push([ring])
  }
  if (!shapes.length) return []
  const merged = union(shapes)
  const contours = []
  for (const polygon of merged)
    polygon.forEach((ring, i) => {
      const pts = ring.slice(0, -1)
      const ccw = area(ring) > 0
      contours.push(
        fitClosed(
          i === 0 ? (ccw ? pts : pts.reverse()) : ccw ? pts.reverse() : pts,
          2.5,
        ),
      )
    })
  return contours
}
