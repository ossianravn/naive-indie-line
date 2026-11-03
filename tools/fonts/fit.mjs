// Curve fitting for outlines: a closed polygon becomes cubic Béziers (Schneider's algorithm, "An Algorithm for
// Automatically Fitting Digitized Curves", Graphics Gems, 1990), split at its corners so corners stay sharp. A dense
// polygon of a few hundred points comes out as a few dozen curves, which keeps the font small.

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, f) => [a[0] * f, a[1] * f]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const dist = (a, b) => Math.sqrt(dot(sub(a, b), sub(a, b)))
const unit = (v) => {
  const l = Math.sqrt(dot(v, v)) || 1
  return [v[0] / l, v[1] / l]
}

const bez = (b, t) => {
  const s = 1 - t
  return add(
    add(mul(b[0], s * s * s), mul(b[1], 3 * s * s * t)),
    add(mul(b[2], 3 * s * t * t), mul(b[3], t * t * t)),
  )
}
const bezD1 = (b, t) => {
  const s = 1 - t
  return add(
    add(mul(sub(b[1], b[0]), 3 * s * s), mul(sub(b[2], b[1]), 6 * s * t)),
    mul(sub(b[3], b[2]), 3 * t * t),
  )
}
const bezD2 = (b, t) =>
  add(
    mul(add(sub(b[2], mul(b[1], 2)), b[0]), 6 * (1 - t)),
    mul(add(sub(b[3], mul(b[2], 2)), b[1]), 6 * t),
  )

function chordParams(d) {
  const u = [0]
  for (let i = 1; i < d.length; i++) u.push(u[i - 1] + dist(d[i], d[i - 1]))
  const total = u[u.length - 1] || 1
  return u.map((x) => x / total)
}

function generate(d, u, t1, t2) {
  const [p0, p3] = [d[0], d[d.length - 1]]
  let c00 = 0
  let c01 = 0
  let c11 = 0
  let x0 = 0
  let x1 = 0
  u.forEach((t, i) => {
    const s = 1 - t
    const a1 = mul(t1, 3 * s * s * t)
    const a2 = mul(t2, 3 * s * t * t)
    c00 += dot(a1, a1)
    c01 += dot(a1, a2)
    c11 += dot(a2, a2)
    const tmp = sub(
      d[i],
      add(
        mul(p0, s * s * s + 3 * s * s * t),
        mul(p3, 3 * s * t * t + t * t * t),
      ),
    )
    x0 += dot(a1, tmp)
    x1 += dot(a2, tmp)
  })
  const det = c00 * c11 - c01 * c01
  let a = det ? (x0 * c11 - x1 * c01) / det : 0
  let b = det ? (c00 * x1 - c01 * x0) / det : 0
  const seg = dist(p0, p3)
  if (a < seg * 1e-6 || b < seg * 1e-6) a = b = seg / 3
  return [p0, add(p0, mul(t1, a)), add(p3, mul(t2, b)), p3]
}

function maxError(d, b, u) {
  let max = 0
  let split = Math.floor(d.length / 2)
  for (let i = 1; i < d.length - 1; i++) {
    const v = sub(bez(b, u[i]), d[i])
    const e = dot(v, v)
    if (e >= max) [max, split] = [e, i]
  }
  return [max, split]
}

const newton = (b, p, t) => {
  const d = sub(bez(b, t), p)
  const d1 = bezD1(b, t)
  const den = dot(d1, d1) + dot(d, bezD2(b, t))
  return den ? Math.min(1, Math.max(0, t - dot(d, d1) / den)) : t
}

function fitCubic(d, t1, t2, error, out) {
  if (d.length === 2) {
    const l = dist(d[0], d[1]) / 3
    out.push([d[0], add(d[0], mul(t1, l)), add(d[1], mul(t2, l)), d[1]])
    return
  }
  let u = chordParams(d)
  let b = generate(d, u, t1, t2)
  let [max, split] = maxError(d, b, u)
  if (max < error) return void out.push(b)
  if (max < error * 16)
    for (let k = 0; k < 6; k++) {
      u = u.map((t, i) => newton(b, d[i], t))
      b = generate(d, u, t1, t2)
      ;[max, split] = maxError(d, b, u)
      if (max < error) return void out.push(b)
    }
  const centre = unit(sub(d[split - 1], d[split + 1]))
  fitCubic(d.slice(0, split + 1), t1, centre, error, out)
  fitCubic(d.slice(split), mul(centre, -1), t2, error, out)
}

/** Fit a closed polygon (no repeated last point). Returns [start, ...segments], each segment [c1, c2, end]. */
export function fitClosed(pts, error = 1.2, corner = 42) {
  const n = pts.length
  const at = (i) => pts[((i % n) + n) % n]
  const turn = (i) => {
    const [a, b] = [unit(sub(at(i), at(i - 1))), unit(sub(at(i + 1), at(i)))]
    return (Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180) / Math.PI
  }
  const corners = pts.map((_, i) => i).filter((i) => turn(i) > corner)
  const sections = []
  if (!corners.length) {
    const ring = [...pts, pts[0]]
    const t = unit(sub(at(1), at(-1)))
    sections.push({ d: ring, t1: t, t2: mul(t, -1) })
  } else
    corners.forEach((c, k) => {
      const next = corners[(k + 1) % corners.length]
      const span = (next - c + n) % n || n
      const d = Array.from({ length: span + 1 }, (_, j) => at(c + j))
      sections.push({
        d,
        t1: unit(sub(d[1], d[0])),
        t2: unit(sub(d[d.length - 2], d[d.length - 1])),
      })
    })
  const curves = []
  for (const s of sections) fitCubic(s.d, s.t1, s.t2, error, curves)
  return [curves[0][0], ...curves.map((b) => [b[1], b[2], b[3]])]
}
