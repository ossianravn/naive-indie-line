// Indie: the record shop's things. Each function draws one object; `at` is its anchor (bottom-left unless it says
// otherwise) and `k` its scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, lerp, rect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { depth, type Box } from "../shapes"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

/** A thin ring between two radii of a circle: the inner loop runs the other way, so it is a hole. */
const groove = (p: Pen, c: Point, a: number, b: number) =>
  p.disc(c, [b, 0], [0, b]) + p.disc(c, [a, 0], [0, -a])

/** A closed loop with its corners cut twice, so joined arcs flow into one another. */
function smooth(points: Point[]): Point[] {
  let pts = points
  for (let n = 0; n < 2; n++)
    pts = pts.flatMap((a, i) => {
      const b = pts[(i + 1) % pts.length] as Point
      return [lerp(a, b, 0.25), lerp(a, b, 0.75)]
    })
  return pts
}

/**
 * What stands in one cubby (top-left corner first): its inside corner, then sleeves standing from the left with the
 * last few leaning back on them, or nothing now and then. Lines start below the cubby's floor, where the shelf's
 * boards hide where they begin.
 */
function cubby(s: Sheet, p: Pen, r: Stream, cell: Point[], o: Point) {
  const [tl, tr, , bl] = cell as [Point, Point, Point, Point]
  const [w, h] = [tr[0] - tl[0], bl[1] - tl[1]]
  const corner = add(bl, o)
  s.stroke(p.path([bl, corner, [tr[0], corner[1]]]))
  s.stroke(p.line(corner, [corner[0], tl[1]]))
  if (r.chance(0.12)) return
  const floor = bl[1] + 0.5
  const tall = h * r.between(0.8, 0.88)
  const end = tl[0] + w * r.between(0.5, 1)
  let x = tl[0] + r.between(1, 3)
  const tops: Point[] = []
  while (x < end - 2) {
    tops.push([x, bl[1] - tall + r.signed() * 1.2])
    x += r.between(2.2, 3.4)
  }
  if (tops.length < 2) return
  const last = tops[tops.length - 1] as Point
  s.blank(p.shape([[tl[0], floor], ...tops, [last[0], floor]]))
  s.stroke(p.path(tops))
  for (const [tx, ty] of tops.slice(1))
    s.stroke(p.line([tx, floor], [tx, ty + 2.5]))
  for (let i = 1; i < 4; i++) {
    const a = i * 0.16
    const foot = last[0] + i * 3.2 + tall * Math.sin(a)
    if (foot > tr[0] - 1) break
    const lean: Point = [foot - tall * Math.sin(a), bl[1] - tall * Math.cos(a)]
    s.stroke(p.line([foot, floor], lean))
  }
}

/**
 * A shelf of records in six cubbies: boards round open cubbies, the records inside. The boards hide where lines in
 * the cubbies begin; then the outline and each opening are drawn in one stroke. Returns its box, so a scene can stand
 * things on top.
 */
export const shelf: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, h, d, t] = [180 * k, 92 * k, 44 * k, 5.5 * k]
  const [x, y] = at
  const face = rect(x, y - h, w, h)
  const [D, C, B, A] = face as [Point, Point, Point, Point]
  const back = (q: Point) => add(q, o, d)
  s.blank(p.shape([A, B, back(B), back(C), back(D), D]))
  const [cw, ch] = [(w - 4 * t) / 3, (h - 3 * t) / 2]
  const cells: Point[][] = []
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 3; col++)
      cells.push(
        rect(x + t + col * (cw + t), y - h + t + row * (ch + t), cw, ch),
      )
  for (const cell of cells) cubby(s, p, r, cell, add([0, 0], o, d * 0.7))
  // The boards: the front face, with the openings as holes drawn the other way round.
  s.blank(
    p.shape(face) + cells.map((cell) => p.shape([...cell].reverse())).join(""),
  )
  s.stroke(p.shape([A, B, C, D]))
  s.stroke(p.path([D, back(D), back(C), C]))
  s.stroke(p.path([back(C), back(B), B]))
  for (const cell of cells) s.stroke(p.shape(cell))
  const box: Box = {
    w,
    d,
    o,
    front: (u, v) => [x + w * u, y - h * v],
    top: (u, v) => add(lerp(D, C, u), o, d * v),
  }
  return box
}

/**
 * A disco ball hanging by its string from `top` (default: 40 above the ball), seen from a little below: rows and
 * columns of mirrors curve with it and end where they turn away, the caps at both poles are bare, and a few mirrors
 * catch the light as ink. `at` is the centre.
 */
export const discoBall: Draw = (s, p, r, c, k = 1, { top } = {}) => {
  const R = 44 * k
  const [ct, st] = [Math.cos(0.1), Math.sin(0.1)]
  /** A point on the ball at latitude th and longitude ph (radians), and whether it faces us. */
  const on = (th: number, ph: number): [Point, boolean] => {
    const [x, y, z] = [
      Math.cos(th) * Math.sin(ph),
      Math.sin(th),
      Math.cos(th) * Math.cos(ph),
    ]
    const g = R * 0.97
    return [[c[0] + g * x, c[1] - g * (y * ct + z * st)], z * ct - y * st > 0]
  }
  const [rows, cols] = [8, 16]
  const lat = (i: number) => -Math.PI / 2 + (i * Math.PI) / rows
  const lon = (j: number) => ((j + 0.5) * 2 * Math.PI) / cols
  /** The part of a line on the ball that faces us, sampled n times along t in [0, 1]. */
  const seen = (n: number, f: (t: number) => [Point, boolean]) =>
    Array.from({ length: n + 1 }, (_, i) => f(i / n))
      .filter(([, v]) => v)
      .map(([q]) => q)
  // The string ends at the cap, which covers its end.
  s.stroke(p.line([c[0], top ?? c[1] - R - 40 * k], [c[0], c[1] - R - 4 * k]))
  s.blank(p.disc(...dot(c, R)))
  const lines = [
    ...Array.from({ length: rows - 1 }, (_, i) =>
      seen(48, (t) => on(lat(i + 1), Math.PI * (2 * t - 1))),
    ),
    ...Array.from({ length: cols }, (_, j) =>
      seen(24, (t) => on(lat(1) + (lat(rows - 1) - lat(1)) * t, lon(j))),
    ),
  ]
  for (const pts of lines) if (pts.length > 1) s.stroke(p.path(pts))
  for (let i = 1; i < rows - 1; i++)
    for (let j = 0; j < cols; j++) {
      if (!(r.chance(0.12) || ((i + j) % 4 === 0 && r.chance(0.45)))) continue
      const q = [
        [i, j],
        [i, j + 1],
        [i + 1, j + 1],
        [i + 1, j],
      ].map(([a, b]) => on(lat(a as number), lon(b as number)))
      if (!q.every(([, v]) => v)) continue
      const mid = lerp(q[0]![0], q[2]![0], 0.5)
      s.fill(p.shape(q.map(([pt]) => lerp(mid, pt, 0.72))))
    }
  // A thin ring just outside the ball hides where its lines run past the edge.
  s.blank(groove(p, c, R - 0.5, R + 5))
  s.stroke(p.ring(...dot(c, R)))
  const cap = rect(c[0] - 4 * k, c[1] - R - 4 * k, 8 * k, 5 * k)
  s.blank(p.shape(cap))
  s.stroke(p.shape(cap))
}

/** A record half out of its sleeve, its label showing; the sleeve's art is one of a few marks. */
export const record: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const w = 66 * k
  const c: Point = [x + w * r.between(0.88, 0.96), y - w / 2]
  const R = w * 0.47
  s.fill(p.disc(...dot(c, R)))
  s.paper(groove(p, c, R * 0.62, R * 0.65))
  s.paper(groove(p, c, R * 0.8, R * 0.83))
  s.paper(p.disc(...dot(c, R * 0.34)))
  s.fill(p.disc(...dot(c, 1.3 * k)))
  const sleeve = rect(x, y - w, w, w)
  s.blank(p.shape(sleeve))
  s.stroke(p.shape(sleeve))
  const art = r.pick(["ring", "squiggle", "bars"] as const)
  const m: Point = [x + w / 2, y - w / 2]
  const zig = (i: number): Point => [
    x + w * (0.2 + i * 0.1),
    m[1] + (i % 2 ? -6 : 6) * k,
  ]
  const bar = (i: number) => y - w * (0.3 + i * 0.2)
  if (art === "ring") s.stroke(p.ring(...dot(m, w * 0.22)))
  else if (art === "squiggle") s.stroke(p.path([0, 1, 2, 3, 4, 5, 6].map(zig)))
  else
    for (let i = 0; i < 3; i++)
      s.stroke(
        p.line(
          [x + w * 0.22, bar(i)],
          [x + w * (i === 1 ? 0.62 : 0.78), bar(i)],
        ),
      )
}

/**
 * An acoustic guitar leaning a little: one smooth body, a rosette round the sound hole and a bridge; the neck lies on
 * the body, its frets end at its edges, and the headstock carries its pegs.
 */
export const guitar: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const lean = r.signed() * 8
  const P = (u: number, v: number): Point =>
    turn([x + u * k, y + v * k], at, lean)
  const outline = smooth([
    ...arc([0, -78], 21, 21, -70, 50, 14),
    ...arc([0, -30], 29, 29, -50, 230, 14),
    ...arc([0, -78], 21, 21, 130, 250, 14),
  ]).map(([u, v]) => P(u, v))
  s.blank(p.shape(outline))
  s.stroke(p.shape(outline))
  s.stroke(p.disc(...dot(P(0, -60), 11 * k)))
  s.fill(p.disc(...dot(P(0, -60), 8 * k)))
  /** A shape symmetric about the centre line, half-width a at v0 and b at v1; negative widths wind the other way. */
  const quad = (a: number, b: number, v0: number, v1: number) =>
    p.shape([P(-a, v0), P(a, v0), P(b, v1), P(-b, v1)])
  s.stroke(quad(10, 10, -25, -20))
  const neck = quad(4.5, 3.6, -74, -158)
  s.blank(neck)
  // Frets run past the neck's sides; a band beside the neck, above the body, hides what runs past.
  for (let v = -104; v > -156; v -= 8) s.stroke(p.line(P(-4.2, v), P(4.2, v)))
  s.blank(quad(11, 11, -101, -157) + quad(-4.1, -3.6, -101, -157))
  s.stroke(neck)
  const head = quad(4, 6.5, -157, -182)
  s.blank(head)
  s.stroke(head)
  for (const v of [-164, -171, -178])
    for (const e of [-1, 1]) s.fill(p.disc(...dot(P(e * 8.4, v), 1.5 * k)))
}

/**
 * An open wooden crate of records, built back to front: the back and left rims, the sleeves standing in rows from
 * the back, then the front and right walls, which hide the sleeves' lower halves. A hand-hole in the right wall.
 */
export const crate: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, h, d, t] = [100 * k, 50 * k, 54 * k, 4 * k]
  const tv = t / d
  /** A point inside the crate: u across, v from front to back, z up from the floor. */
  const Q = (u: number, v: number, z = h): Point =>
    add([at[0] + w * u, at[1] - z], o, d * v)
  const inner = (u: number, v: number) => Q(t / w + u * (1 - (2 * t) / w), v)
  s.stroke(p.path([Q(0, 0.06), Q(0, 1), Q(0.97, 1)]))
  s.stroke(p.path([inner(0, tv), inner(0, 1 - tv), inner(1, 1 - tv)]))
  // Sleeves start halfway down, out of sight behind the front wall, so no overshoot pokes out below the crate.
  for (let v = 0.86; v > 0.12; v -= r.between(0.1, 0.15)) {
    const lean = r.signed() * 3 * k
    const rise = h + r.between(14, 26) * k
    const [u0, u1] = [0.07, 0.93]
    const sleeve = [
      Q(u0, v, h * 0.45),
      Q(u1, v, h * 0.45),
      add(Q(u1, v, rise), [lean, 0]),
      add(Q(u0, v, rise), [lean, 0]),
    ]
    s.blank(p.shape(sleeve))
    s.stroke(p.shape(sleeve))
  }
  const ring = [inner(1, 1 - tv), inner(1, tv), inner(0, tv)]
  s.blank(
    p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), ...ring, Q(0, 0)]),
  )
  s.stroke(p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 0), Q(0, 0)]))
  s.stroke(p.path([Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), Q(1, 0)]))
  s.stroke(p.path(ring))
  // The plank seam round the front and side in one run, its ends a little inside the corners.
  s.stroke(p.path([Q(0.03, 0, h * 0.5), Q(1, 0, h * 0.5), Q(1, 0.95, h * 0.5)]))
  // The hand-hole: a slot with round ends in the right wall.
  const slot = [
    ...arc([0.36, 0.78], 0.08, 0.1, 90, 270, 6),
    ...arc([0.64, 0.78], 0.08, 0.1, -90, 90, 6),
  ].map(([v, z]) => Q(1, v, z * h))
  s.fill(p.shape(slot))
}

const T = objectsIn("indie")

define(
  T("shelf", "Record shelf", [220, 150], [12, 138], 1, shelf, [
    "music",
    "record",
    "furniture",
  ]),
  T("disco-ball", "Disco ball", [120, 150], [60, 88], 1, discoBall, [
    "party",
    "music",
    "night",
  ]),
  T("record", "Record", [120, 100], [14, 90], 1.05, record, [
    "music",
    "vinyl",
    "release",
  ]),
  T("guitar", "Guitar", [90, 200], [45, 192], 1, guitar, [
    "music",
    "instrument",
  ]),
  T("crate", "Record crate", [160, 130], [16, 118], 1, crate, [
    "music",
    "record",
    "storage",
  ]),
)
