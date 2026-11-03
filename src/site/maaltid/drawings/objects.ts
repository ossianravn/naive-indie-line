import {
  add,
  arc,
  box,
  define,
  depth,
  drum,
  objectsIn,
  type Box,
  type Draw,
  type Pen,
  type Point,
  type Sheet,
  type Stream,
} from "@/fineliner/pen"

function outline(s: Sheet, p: Pen, points: Point[]) {
  const d = p.shape(points)
  s.blank(d)
  s.stroke(d)
}

/** A communal table; `at` is its front-left floor point. Returns the plank top. */
export function longTable(s: Sheet, p: Pen, r: Stream, at: Point, k = 1): Box {
  const o = depth(r)
  const w = r.between(229, 235)
  const d = 70
  const benchWidth = w - 20
  const trestles: [number, number] = [w * 0.17, w * 0.81]
  const Q = (u: number, v: number, z: number): Point =>
    add([at[0] + u * k, at[1] - z * k], o, v * k)
  // A thick timber has two edges, joined in one outline.
  const timber = (a: Point, b: Point, t: number) => {
    const dx = b[0] - a[0],
      dy = b[1] - a[1]
    const length = Math.sqrt(dx * dx + dy * dy)
    const n: Point = [(-dy * t * k) / length / 2, (dx * t * k) / length / 2]
    outline(s, p, [add(a, n), add(b, n), add(b, n, -1), add(a, n, -1)])
  }
  const bench = (v: number) => {
    for (const u of [25, w - 35])
      outline(s, p, [Q(u, v, 0), Q(u + 6, v, 0), Q(u + 6, v, 42), Q(u, v, 42)])
    box(s, p, o, Q(10, v, 39), benchWidth * k, 5 * k, 22 * k)
  }
  // The equal-length rear seat is centred in projection, with only 3 units below the slab.
  // Its ends and legs are hidden; draw only the edge between the trestles.
  const back = 28 / -o[1]
  const shift = o[0] * (back + 11)
  const left = 10 - o[0] * 11
  const edge = (u: number, z: number) => Q(10 - shift + u, back, z)
  const start = Math.max(0, trestles[0] + (o[0] * d) / 2 - left)
  const end = Math.min(benchWidth, trestles[1] + (o[0] * d) / 2 - left)
  outline(s, p, [
    edge(start, 39),
    edge(end, 39),
    edge(end, 44),
    edge(start, 44),
  ])
  // Each trestle runs across the table's depth, with its crossbar between the legs.
  for (const u of trestles) {
    timber(Q(u, d + 3, 0), Q(u, d * 0.5, 71), 7)
    timber(Q(u, 6, 24), Q(u, d - 5, 24), 5)
    timber(Q(u, -3, 0), Q(u, d * 0.5, 71), 7)
  }
  const top = box(s, p, o, Q(0, 0, 70), w * k, 7 * k, d * k)
  for (const v of [1 / 3, 2 / 3])
    s.stroke(p.line(top.top(0.025, v), top.top(0.975, v)))
  bench(-23)
  return top
}

/** A low pot; `at` is beneath its centre, on the same floor as the leaning lid. */
export const castIronPot: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const o = depth(r)
  const e = 7 - o[1] * 9
  // The tilted lid rests against the far side; the pot and lug cover its left edge.
  const c = P(48, 24)
  const a: Point = [14 * k, -6 * k]
  const b: Point = [10 * k, 23 * k]
  const lid = p.disc(c, a, b)
  s.blank(lid)
  s.stroke(lid)
  s.fill(p.disc(c, [3.8 * k, 0], [0, 4.3 * k]))
  for (const f of [-1, 1])
    outline(s, p, [P(f * 29, 38), P(f * 45, 36), P(f * 44, 30), P(f * 29, 30)])
  drum(s, p, P(0, 38), [34 * k, 31 * k, 29 * k, e * k], () => {
    s.wash(p.disc(P(0, 38), [29 * k, 0], [0, (e - 2.5) * k]))
    const lean = r.between(-19, -15)
    outline(s, p, [P(-7, 36), P(lean, 82), P(lean + 4, 83), P(-3, 36)])
  })
}

/** An open wine crate; `at` is its front-left bottom corner. */
export const wineCrate: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [w, h, d, t] = [106, 45, 58, 4]
  const Q = (u: number, v: number, z = h): Point =>
    add([at[0] + w * u * k, at[1] - z * k], o, d * v * k)
  const inner = (u: number, v: number) => Q(t / w + u * (1 - (2 * t) / w), v)
  outline(s, p, [Q(0, 1, 0), Q(1, 1, 0), Q(1, 1), Q(0, 1)])
  outline(s, p, [Q(0, 0, 0), Q(0, 1, 0), Q(0, 1), Q(0, 0)])
  const slot = (u: number) =>
    p.shape(
      [
        ...arc([0.31, 36], 0.07, 2, 90, 270, 6),
        ...arc([0.65, 36], 0.07, 2, 270, 450, 6),
      ].map(([v, z]) => Q(u, v, z)),
    )
  s.fill(slot(0))
  const bare = r.chance(0.45)
  // Back row first. Each bottle continues below the rim, hidden by the front wall.
  for (const row of [0.76, 0.24]) {
    for (const [i, u] of [0.18, 0.49, 0.8].entries()) {
      const rise = r.between(-1.5, 1.5) + (row > 0.5 ? 2 : 0)
      const base = Q(u, row, 0)
      const B = (x: number, z: number): Point =>
        add(base, [x * k, -(z + rise) * k])
      const side: Point[] = [
        [11, 23],
        [11, 66],
        [10, 72],
        [7, 78],
        [4, 82],
        [4, 100],
      ]
      outline(s, p, [
        ...side.map(([x, z]) => B(-x, z)),
        ...side.toReversed().map(([x, z]) => B(x, z)),
      ])
      const capsule = p.shape([B(-4, 89), B(-4, 100), B(4, 100), B(4, 89)])
      if (!(bare && row < 0.5 && i === 1)) s.fill(capsule)
    }
  }
  const ring = [inner(1, 1 - t / d), inner(1, t / d), inner(0, t / d)]
  s.blank(
    p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), ...ring, Q(0, 0)]),
  )
  s.stroke(p.shape([Q(0, 0, 0), Q(1, 0, 0), Q(1, 0), Q(0, 0)]))
  s.stroke(p.path([Q(1, 0, 0), Q(1, 1, 0), Q(1, 1), Q(1, 0)]))
  s.stroke(p.path(ring))
  for (const z of [h / 3, (h * 2) / 3])
    s.stroke(p.path([Q(0.05, 0, z), Q(1, 0, z), Q(1, 0.88, z)]))
  s.fill(slot(1))
}

const T = objectsIn("maaltid")

define(
  T("maaltid-table", "Long table", [300, 138], [16, 118], 1, longTable, [
    "furniture",
    "restaurant",
    "table",
  ]),
  T("maaltid-pot", "Cast-iron pot", [140, 110], [57, 98], 1, castIronPot, [
    "kitchen",
    "stew",
    "restaurant",
  ]),
  T("maaltid-crate", "Wine crate", [170, 150], [17, 139], 1, wineCrate, [
    "wine",
    "natural wine",
    "restaurant",
  ]),
)
