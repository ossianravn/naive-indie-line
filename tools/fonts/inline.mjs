// Naïve Indie Inline: the skeleton drawn as a contrasted serif. A broad nib held along the / diagonal decides how thick
// each part of a stroke is (verticals and \ diagonals thick, horizontals and / diagonals thin, curves swelling at their
// sides); a thick part is drawn as its two outlines with the tint between them, a thin part as one line. Free ends on
// the baseline or the cap line take a short serif, free arm ends a tick. Coordinates are font units, y up.
import { resample, wobble } from "./outline.mjs"

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const len = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1])
const unit = (v) => {
  const l = len(v) || 1
  return [v[0] / l, v[1] / l]
}
const step = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** How thick a stroke is (0 thin to 1 full) where it runs along direction d: the broad nib's rule. */
function nib([dx, dy]) {
  let phi = (Math.atan2(-dy, dx) * 180) / Math.PI
  if (phi < 0) phi += 180
  return step(0.5, 0.85, Math.abs(Math.sin(((phi - 160) * Math.PI) / 180)))
}

// Strokes that break the nib's rule, by the glyph's stroke index: N's stems and M's first stem are thin, Z's
// diagonal is thick, as in the classical capitals.
const RULES = { N: { 0: 0, 2: 0 }, M: { 0: 0 }, Z: { 1: 1 }, 1: { 0: 0 } }

/** A polyline offset sideways by w[i] at each point (sign picks the side); a closed one wraps round. */
function offset(pts, w, sign, closed = false) {
  const n = pts.length
  return pts.map((p, i) => {
    const before = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)]
    const after = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)]
    const d = unit(sub(after, before))
    return [p[0] - d[1] * w[i] * sign, p[1] + d[0] * w[i] * sign]
  })
}

/** The runs of a polyline between its sharp corners, as [first, last] index pairs. */
function corners(pts, sharp = 40) {
  const out = []
  let start = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b] = [
      unit(sub(pts[i], pts[i - 1])),
      unit(sub(pts[i + 1], pts[i])),
    ]
    if (
      (Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1]))) * 180) /
        Math.PI >
      sharp
    ) {
      out.push([start, i])
      start = i
    }
  }
  out.push([start, pts.length - 1])
  return out
}

/** The stretches of a stroke thick enough to tint, as [first, last] index pairs (wrapping round when closed). */
function thick(w, h, closed = false) {
  const n = closed ? w.length - 1 : w.length
  const on = (i) => w[i % n] > h * 0.75
  const out = []
  let start = -1
  const from = closed
    ? Math.max(
        0,
        w.findIndex((x, i) => i < n && !(x > h * 0.75)),
      )
    : 0
  for (let k = 0; k <= n; k++) {
    const i = from + k
    if (k < n && on(i)) {
      if (start < 0) start = i
    } else if (start >= 0) {
      if (i - 1 > start) out.push([start, i - 1])
      start = -1
    }
  }
  return out
}

/** Is a stroke end free, or does another stroke of the glyph meet it? Skeleton units. */
function free(end, strokes, self) {
  return strokes.every(
    (s, i) =>
      i === self ||
      s.every((p, j) => {
        if (j === 0) return len(sub(p, end)) > 4
        const [a, b] = [s[j - 1], p]
        const ab = sub(b, a)
        const t = Math.max(
          0,
          Math.min(
            1,
            ((end[0] - a[0]) * ab[0] + (end[1] - a[1]) * ab[1]) /
              (ab[0] * ab[0] + ab[1] * ab[1] || 1),
          ),
        )
        return len(sub(end, [a[0] + ab[0] * t, a[1] + ab[1] * t])) > 4
      }),
  )
}

/**
 * One glyph's inline drawing: { lines, fills } where lines are polylines for the pen and fills are polygons for the
 * tint. `toFont` maps skeleton points to font units; `face` has T (half the thick width), h (the pen's radius),
 * serif and tick lengths, and the hand.
 */
export function inlineGlyph(g, char, rand, toFont, face) {
  const { T, h, serif, tick, hand } = face
  const rules = RULES[g.base ?? char] ?? {}
  const lines = []
  const fills = []
  /** The tint between two outlines over one thick stretch: a band that never pinches to a point. */
  const tint = (left, right) => {
    if (left.length > 1)
      fills.push([[...left, ...right.slice().reverse(), left[0]]])
  }
  const all = [...g.s, ...(g.m ?? [])]
  all.forEach((skel, index) => {
    const mark = index >= g.s.length
    const pts0 = skel.map(toFont)
    const closed =
      pts0.length > 3 && len(sub(pts0[0], pts0[pts0.length - 1])) < 1
    const pts = wobble(pts0, closed, rand, hand)
    const n = pts.length
    const dir = pts.map((_, i) =>
      unit(sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)])),
    )
    // Thickness follows the clean skeleton's direction (the same points the wobble starts from), so the hand moves the
    // lines without making the width flicker.
    const base = resample(pts0, 10)
    const baseDir = base.map((_, i) =>
      unit(sub(base[Math.min(n - 1, i + 1)], base[Math.max(0, i - 1)])),
    )
    const raw = baseDir.map((d) => (mark ? 0 : (rules[index] ?? nib(d))))
    // A little smoothing, so a corner between a thick and a thin part tapers instead of stepping.
    const g5 = raw.map((_, i) => {
      let t = 0
      let c = 0
      for (let k = -3; k <= 3; k++) {
        const j = closed ? (i + k + n) % n : Math.min(n - 1, Math.max(0, i + k))
        t += raw[j]
        c++
      }
      return t / c
    })
    const w = g5.map((x) => x * T)
    if (Math.max(...w) < h * 0.8) lines.push(pts)
    else if (closed) {
      const [left, right] = [offset(pts, w, 1, true), offset(pts, w, -1, true)]
      lines.push([...left, left[0]], [...right, right[0]])
      for (const [a, b] of thick(w, h, true)) {
        const idx = Array.from({ length: b - a + 1 }, (_, k) => (a + k) % n)
        tint(
          idx.map((i) => left[i]),
          idx.map((i) => right[i]),
        )
      }
    } else {
      // Each run between sharp corners is offset on its own: offsetting round a corner crosses itself.
      for (const [a, b] of corners(pts)) {
        const run = pts.slice(a, b + 1)
        const rw = w.slice(a, b + 1)
        const [left, right] = [offset(run, rw, 1), offset(run, rw, -1)]
        lines.push(left, right)
        for (const [c, d] of thick(rw, h))
          tint(left.slice(c, d + 1), right.slice(c, d + 1))
      }
      const [left, right] = [offset(pts, w, 1), offset(pts, w, -1)]
      if (w[0] > h) lines.push([left[0], right[0]])
      if (w[n - 1] > h) lines.push([left[n - 1], right[n - 1]])
    }
    if (mark || closed) return
    // Serifs: a free end on the baseline or the cap line takes a short bar across it; a free arm end, a tick toward
    // the middle of the letter.
    for (const k of [0, n - 1]) {
      const end = skel[k === 0 ? 0 : skel.length - 1]
      if (!free(end, g.s, index)) continue
      const p = pts[k]
      const d = dir[k]
      const onLine = Math.abs(end[1]) < 6 || Math.abs(end[1] - 100) < 6
      if (Math.abs(d[1]) >= Math.abs(d[0]) * 0.8) {
        if (onLine)
          lines.push([
            [p[0] - w[k] - serif, p[1]],
            [p[0] + w[k] + serif, p[1]],
          ])
      } else {
        const toward = end[1] < 50 ? -1 : 1 // font units point up: a top arm ticks down
        const reach = Math.abs(end[1] - 50) < 8 ? tick / 2 : tick
        lines.push([p, [p[0], p[1] + toward * reach]])
      }
    }
  })
  for (const [x, y, r = 1] of g.d ?? []) {
    const [cx, cy] = toFont([x, y])
    const radius = face.dot * r
    const ring = Array.from({ length: 29 }, (_, i) => {
      const a = (i / 28) * 2 * Math.PI
      return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)]
    })
    lines.push(ring)
    fills.push([ring])
  }
  return { lines, fills }
}
