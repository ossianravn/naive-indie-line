// Naïve Indie Tramline: the drawn Tramline as a font. Every stroke of the skeleton becomes three parallel lines a little
// apart, each wobbled on its own by the hand, running a little past its ends or stopping short of them (so the lines
// cross at corners, as the pen's do), and swept by a fine round pen; accents and bars draw their lines closer. Each take tilts and
// lifts its letter a little, as the drawn lettering does letter by letter. Skeleton units in, font units out.
import { resample, wobble } from "./outline.mjs"

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

/** A stroke moved sideways by d along its normals; a ring stays a ring. */
function offset(points, d, closed) {
  const pts = resample(points, 2.5)
  return pts.map((p, i) => {
    const a = pts[i > 0 ? i - 1 : closed ? pts.length - 2 : 0]
    const b = pts[i < pts.length - 1 ? i + 1 : closed ? 1 : pts.length - 1]
    const l = dist(a, b) || 1
    return [p[0] - ((b[1] - a[1]) / l) * d, p[1] + ((b[0] - a[0]) / l) * d]
  })
}

/** An open line run past its ends (by up to `over`) or stopped short of them (by up to a third of it). */
function overshoot(pts, rand, over) {
  const ends = [rand(), rand()].map((r) => (r * 1.3 - 0.3) * over)
  const run = (line, by) => {
    if (by < 0)
      return line.slice(Math.min(line.length - 2, Math.round(-by / 2.5)))
    const [a, b] = line
    const l = dist(a, b) || 1
    return [
      [a[0] + ((a[0] - b[0]) / l) * by, a[1] + ((a[1] - b[1]) / l) * by],
      ...line,
    ]
  }
  return run(run(pts, ends[0]).reverse(), ends[1]).reverse()
}

/**
 * One take of a glyph as centre lines and dots for outline(): `face` gives the lines' spacing (gap), how far they may
 * overshoot (over), the tilt (degrees) and lift a take may take, all in skeleton units but the tilt, the hand, and the
 * dots' size as a multiple of the pen.
 */
export function tramlineGlyph(g, rand, toFont, face) {
  const tilt = ((rand() * 2 - 1) * face.tilt * Math.PI) / 180
  const lift = (rand() * 2 - 1) * face.lift
  const c = [g.w / 2, 50]
  const at = ([u, v]) => {
    const [dx, dy] = [u - c[0], v + lift - c[1]]
    return [
      c[0] + dx * Math.cos(tilt) - dy * Math.sin(tilt),
      c[1] + dx * Math.sin(tilt) + dy * Math.cos(tilt),
    ]
  }
  const strokes = []
  const draw = (st, gaps) => {
    const pts = st.map(at)
    const closed = pts.length > 2 && dist(pts[0], pts.at(-1)) < 0.5
    for (const d of gaps) {
      const line = offset(pts, d, closed)
      const drawn = closed ? line : overshoot(line, rand, face.over)
      strokes.push(wobble(drawn.map(toFont), closed, rand, face.hand))
    }
  }
  for (const st of g.s) draw(st, [-face.gap, 0, face.gap])
  for (const st of g.m ?? []) draw(st, [-face.gap * 0.6, 0, face.gap * 0.6])
  const dots = (g.d ?? []).map(([x, y]) => [...toFont(at([x, y])), face.dot])
  return { strokes, dots }
}
