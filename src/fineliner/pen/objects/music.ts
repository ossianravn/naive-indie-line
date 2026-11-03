// Indie: the record shop's things. Each function draws one object; `at` is its anchor (bottom-left unless it says
// otherwise) and `k` its scale. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, lerp, rect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth, type Box } from "../shapes"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

/** Record spines in one cubby: upright, then a few leaning where the row runs out. */
function spines(
  s: Sheet,
  p: Pen,
  r: Stream,
  b: Box,
  u0: number,
  u1: number,
  v0: number,
  v1: number,
) {
  const gap = 0.022 + r.next() * 0.01
  const end = u0 + (u1 - u0) * (0.55 + r.next() * 0.45)
  let u = u0 + 0.012
  while (u < end) {
    const top = v1 - (0.08 + r.next() * 0.16) * (v1 - v0)
    s.stroke(p.line(b.front(u, v0 + 0.02), b.front(u, top)))
    u += gap
  }
  for (let lean = 0.04; u + lean < u1 - 0.01 && lean < 0.13; lean += 0.045) {
    s.stroke(
      p.line(b.front(u, v0 + 0.02), b.front(u + lean, v1 - 0.18 * (v1 - v0))),
    )
    u += gap
  }
}

/** A shelf of records in six cubbies. Returns its box, so a scene can stand things on top. */
export const shelf: Draw = (s, p, r, at, k = 1) => {
  const b = box(s, p, depth(r), at, 180 * k, 92 * k, 44 * k)
  for (let i = 1; i < 3; i++)
    s.stroke(p.line(b.front(i / 3, 0), b.front(i / 3, 1)))
  s.stroke(p.line(b.front(0, 0.5), b.front(1, 0.5)))
  for (let col = 0; col < 3; col++)
    for (let row = 0; row < 2; row++)
      spines(
        s,
        p,
        r,
        b,
        col / 3 + 0.01,
        (col + 1) / 3 - 0.01,
        row / 2 + 0.02,
        (row + 1) / 2 - 0.02,
      )
  return b
}

/** A disco ball hanging by its string from `top` (default: 40 above the ball). `at` is the centre. */
export const discoBall: Draw = (s, p, r, c, k = 1, { top } = {}) => {
  const R = 44 * k
  s.stroke(p.line([c[0], top ?? c[1] - R - 40 * k], [c[0], c[1] - R]))
  s.blank(p.disc(...dot(c, R)))
  const [rows, cols] = [7, 8]
  const at = (i: number, j: number): Point => {
    const th = -Math.PI / 2 + (i * Math.PI) / rows
    const ph = -Math.PI / 2 + (j * Math.PI) / cols
    return [c[0] + R * Math.cos(th) * Math.sin(ph), c[1] - R * Math.sin(th)]
  }
  const steps = Array.from({ length: 17 }, (_, n) => n / 2)
  for (let i = 1; i < rows; i++) s.stroke(p.path(steps.map((j) => at(i, j))))
  for (let j = 1; j < cols; j++)
    s.stroke(p.path(steps.map((n) => at((n * rows) / 8, j))))
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (!(r.chance(0.16) || ((i + j) % 4 === 0 && r.chance(0.55)))) continue
      const q = [at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j)]
      const mid = lerp(q[0] as Point, q[2] as Point, 0.5)
      s.fill(p.shape(q.map((pt) => lerp(mid, pt, 0.82))))
    }
  s.stroke(p.ring(...dot(c, R)))
  s.stroke(p.edges(rect(c[0] - 4 * k, c[1] - R - 4 * k, 8 * k, 5 * k)))
}

/** A record half out of its sleeve; the sleeve's art is one of a few marks. */
export const record: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const w = 70 * k
  const c: Point = [x + w * 0.78, y - w / 2]
  s.fill(p.disc(...dot(c, w * 0.46)))
  s.paper(p.disc(...dot(c, w * 0.12)))
  s.stroke(p.ring(...dot(c, w * 0.12)))
  const sleeve = rect(x, y - w, w, w)
  s.blank(p.shape(sleeve))
  s.stroke(p.edges(sleeve))
  const art = r.pick(["ring", "squiggle", "bars"] as const)
  const m: Point = [x + w / 2, y - w / 2]
  if (art === "ring") s.stroke(p.ring(...dot(m, w * 0.22)))
  else if (art === "squiggle")
    s.stroke(
      p.path(
        Array.from({ length: 7 }, (_, i): Point => [
          x + w * (0.2 + i * 0.1),
          m[1] + (i % 2 ? -6 : 6) * k,
        ]),
      ),
    )
  else
    for (let i = 0; i < 3; i++)
      s.stroke(
        p.line(
          [x + w * 0.22, y - w * (0.3 + i * 0.2)],
          [x + w * 0.78, y - w * (0.3 + i * 0.2)],
        ),
      )
}

export const guitar: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const lean = r.signed() * 8
  const P = (u: number, v: number): Point =>
    turn([x + u * k, y + v * k], at, lean)
  const ring = (c: Point, rr: number, a0: number, a1: number) =>
    arc(c, rr, rr, a0, a1, 14).map(([u, v]) => P(u, v))
  const outline = [
    ...ring([0, -78], 21, -70, 50),
    ...ring([0, -30], 29, -50, 230),
    ...ring([0, -78], 21, 130, 250),
  ]
  const neck = [P(-4, -94), P(4, -94), P(4, -158), P(-4, -158)]
  const head = [P(-6, -158), P(6, -158), P(7, -182), P(-7, -182)]
  s.blank(p.shape(outline))
  s.stroke(p.path([...outline, outline[0] as Point]))
  s.blank(p.shape(neck))
  s.stroke(p.edges(neck))
  for (let v = -102; v > -156; v -= 8) s.stroke(p.line(P(-4, v), P(4, v)))
  s.blank(p.shape(head))
  s.stroke(p.edges(head))
  for (const v of [-164, -171, -178])
    for (const side of [-1, 1]) s.fill(p.disc(...dot(P(side * 9, v), 1.4 * k)))
  s.fill(p.disc(...dot(P(0, -60), 8.5 * k)))
  s.stroke(p.edges([P(-9, -24), P(9, -24), P(9, -19), P(-9, -19)]))
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
  s.stroke(p.edges([Q(0, 0), Q(0, 1), Q(1, 1)], false))
  s.stroke(p.edges([inner(0, tv), inner(0, 1 - tv), inner(1, 1 - tv)], false))
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
    s.stroke(p.edges(sleeve))
  }
  const ring = [inner(1, 1 - tv), inner(1, tv), inner(0, tv)]
  s.blank(
    p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), ...ring, Q(0, 0)]),
  )
  s.stroke(p.edges([Q(0, 0, 0), Q(1, 0, 0), Q(1, 0), Q(0, 0)]))
  s.stroke(p.edges([Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), Q(1, 0)], false))
  s.stroke(p.edges(ring, false))
  s.stroke(p.line(Q(0, 0, h * 0.5), Q(1, 0, h * 0.5)))
  s.stroke(p.path([Q(1, 0, h * 0.5), Q(1, 1, h * 0.5)]))
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
