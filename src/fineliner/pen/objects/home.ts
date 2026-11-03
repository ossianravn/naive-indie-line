// Indie: the room itself. A pinned picture, chairs, a lamp and a window. Each function draws one object; `at` is
// its anchor (bottom-left unless it says otherwise) and `k` its scale. Composition comes from `r` (the shape
// stream), never from the pen, so takes agree.
import { add, arc, dot, lerp, rect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth, pad } from "../shapes"

/** A picture pinned to the wall, centred on `at`: a slightly turned frame, corner pins and a small drawing inside. */
export const picture: Draw = (
  s,
  p,
  r,
  c,
  k = 1,
  {
    w = 96 * k,
    h = 120 * k,
    kind = r.pick(["treehouse", "moon", "hills"]),
  } = {},
) => {
  const tilt = r.signed() * 2.2
  const at = (u: number, v: number) =>
    turn([c[0] + (u - 0.5) * w, c[1] + (v - 0.5) * h], c, tilt)
  const frame = [at(0, 0), at(1, 0), at(1, 1), at(0, 1)]
  s.blank(p.shape(frame))
  s.stroke(p.edges(frame))
  const pins: Point[] = [
    [0.05, 0.04],
    [0.95, 0.04],
    [0.95, 0.96],
    [0.05, 0.96],
  ]
  for (const [u, v] of pins) s.fill(p.disc(...dot(at(u, v), 1.6 * k)))
  if (kind === "treehouse") {
    s.stroke(p.line(at(0.47, 0.92), at(0.47, 0.42)))
    s.stroke(p.line(at(0.53, 0.92), at(0.53, 0.42)))
    for (let v = 0.88; v > 0.45; v -= 0.035)
      s.stroke(p.line(at(0.47, v), at(0.53, v)))
    s.fill(
      p.shape([
        at(0.38, 0.42),
        at(0.62, 0.42),
        at(0.62, 0.3),
        at(0.5, 0.2),
        at(0.38, 0.3),
      ]),
    )
    s.blank(
      p.shape([at(0.44, 0.36), at(0.48, 0.36), at(0.48, 0.31), at(0.44, 0.31)]),
    )
    s.blank(
      p.shape([at(0.52, 0.36), at(0.56, 0.36), at(0.56, 0.31), at(0.52, 0.31)]),
    )
    for (const side of [-1, 1]) {
      const [from, to] = [
        at(0.5 + side * 0.12, 0.36),
        at(0.5 + side * 0.3, 0.26 + r.next() * 0.08),
      ]
      s.stroke(p.path([from, lerp(from, to, 0.5), to]))
      s.fill(
        p.shape([
          to,
          add(to, [side * 5 * k, -3 * k]),
          add(to, [side * 3 * k, 3 * k]),
        ]),
      )
    }
  } else if (kind === "moon") {
    const m = at(0.55, 0.42)
    s.fill(p.disc(...dot(m, w * 0.2)))
    s.blank(p.disc(...dot(add(m, [w * 0.09, -w * 0.05]), w * 0.18)))
    s.stroke(p.line(at(0.12, 0.8), at(0.88, 0.8)))
  } else {
    const hill = (u0: number, u1: number, v: number) =>
      Array.from({ length: 9 }, (_, i) =>
        at(u0 + ((u1 - u0) * i) / 8, 0.85 - v * Math.sin((Math.PI * i) / 8)),
      )
    s.stroke(p.path(hill(0.08, 0.7, 0.4)))
    s.stroke(p.path(hill(0.4, 0.92, 0.28)))
    s.stroke(p.ring(...dot(at(0.72, 0.25), w * 0.08)))
  }
}

/**
 * A slat-back chair in three-quarter view, as on the object sheet: back legs that rise into the back posts, a top
 * rail and three slats, a seat with real thickness, and front legs. Legs, posts and slats are thin closed outlines,
 * so their ends stay square instead of running past.
 */
export const chair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [w, d, seat, t, g] = [56 * k, 40 * k, 46 * k, 7 * k, 4 * k]
  const tall = r.between(52, 60) * k
  /** A thin member from a up to b, `width` wide, seen face on. */
  const stick = (a: Point, b: Point, width = g) => {
    const q = [a, add(a, [width, 0]), add(b, [width, 0]), b]
    s.blank(p.shape(q))
    s.stroke(p.shape(q))
  }
  const back = (u: number, v: number): Point => add([x + u, y - v], o, d - g)
  const inner = w - 2 * k - 2 * g
  stick(back(1 * k, 0), back(1 * k, seat + tall))
  stick(back(w - g - 1 * k, 0), back(w - g - 1 * k, seat + tall))
  for (const u of [0.25, 0.5, 0.75]) {
    const sx = 1 * k + g + inner * u - 1.5 * k
    stick(back(sx, seat), back(sx, seat + tall - 12 * k), 3 * k)
  }
  stick(
    back(1 * k + g, seat + tall - 12 * k),
    back(1 * k + g, seat + tall - 3 * k),
    inner,
  )
  box(s, p, o, [x, y - seat + t], w, t, d)
  stick([x + 1 * k, y], [x + 1 * k, y - seat + t])
  stick([x + w - g - 1 * k, y], [x + w - g - 1 * k, y - seat + t])
}

/**
 * A padded club armchair, built back to front: the back, the left arm, the seat and its cushion between the arms,
 * then the right arm, each hiding what it stands in front of. Short solid legs.
 */
export const armchair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [W, D, legs] = [96 * k, 50 * k, 7 * k]
  const arm = r.between(15, 19) * k
  const [armH, backH] = [r.between(40, 46) * k, r.between(66, 74) * k]
  const thick = 13 * k
  const y0 = y - legs
  pad(s, p, o, add([x, y0], o, D - thick), W, backH, thick, 10 * k)
  pad(s, p, o, [x, y0], arm, armH, D - thick, 7 * k)
  box(s, p, o, [x + arm, y0], W - 2 * arm, 22 * k, D - thick)
  pad(s, p, o, [x + arm, y0 - 22 * k], W - 2 * arm, 9 * k, D - thick, 4 * k)
  pad(s, p, o, [x + W - arm, y0], arm, armH, D - thick, 7 * k)
  const leg = (q: Point) =>
    s.fill(
      p.shape([
        add(q, [-2 * k, 0]),
        add(q, [2 * k, 0]),
        add(q, [1.2 * k, legs]),
        add(q, [-1.2 * k, legs]),
      ]),
    )
  leg([x + 5 * k, y0])
  leg([x + W - 5 * k, y0])
  leg(add([x + W - 3 * k, y0], o, D - 6 * k))
}

/** A standing lamp; `at` is the centre of its foot. */
export const floorLamp: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const H = r.between(160, 180) * k
  s.stroke(p.ring([x, y], [20 * k, 0], [0, 5 * k]))
  s.stroke(p.line([x, y], [x, y - H + 30 * k]))
  const [top, bot]: [Point, Point] = [
    [x, y - H],
    [x, y - H + 34 * k],
  ]
  s.blank(
    p.shape([
      ...arc(top, 17 * k, 4 * k, 180, 360, 8),
      ...arc(bot, 27 * k, 6 * k, 0, 180, 8),
    ]),
  )
  s.stroke(p.ring(top, [17 * k, 0], [0, 4 * k]))
  s.stroke(p.line([x - 17 * k, y - H], [x - 27 * k, bot[1]]))
  s.stroke(p.line([x + 17 * k, y - H], [x + 27 * k, bot[1]]))
  s.stroke(p.path(arc(bot, 27 * k, 6 * k, 0, 180, 10)))
  s.stroke(p.line([x + 8 * k, bot[1] + 4 * k], [x + 8 * k, bot[1] + 16 * k]))
}

/** A window with a curtain at one side and a view: the moon, rooftops or a tree. `at` is the glass's bottom-left. */
export const roomWindow: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { view = r.pick(["moon", "roofs", "tree"]) } = {},
) => {
  const [x, y] = at
  const [w, h] = [92 * k, 112 * k]
  const glass = rect(x, y - h, w, h)
  s.stroke(p.edges(glass))
  s.stroke(p.line([x + w / 2, y - h], [x + w / 2, y]))
  s.stroke(p.line([x, y - h * 0.55], [x + w, y - h * 0.55]))
  s.stroke(p.edges(rect(x - 6 * k, y, w + 12 * k, 5 * k)))
  if (view === "moon") {
    const m: Point = [x + w * 0.72, y - h * 0.8]
    s.fill(p.disc(...dot(m, 8 * k)))
    s.blank(p.disc(...dot(add(m, [4 * k, -3 * k]), 7 * k)))
    const stars: Point[] = [
      [0.2, 0.8],
      [0.35, 0.66],
      [0.12, 0.62],
    ]
    for (const [u, v] of stars)
      s.fill(p.disc(...dot([x + w * u, y - h * v], 1.2 * k)))
  } else if (view === "roofs") {
    s.stroke(
      p.path([
        [x, y - h * 0.25],
        [x + w * 0.15, y - h * 0.38],
        [x + w * 0.3, y - h * 0.25],
        [x + w * 0.3, y - h * 0.32],
        [x + w * 0.62, y - h * 0.32],
        [x + w * 0.62, y - h * 0.2],
        [x + w * 0.8, y - h * 0.36],
        [x + w, y - h * 0.22],
      ]),
    )
    s.fill(p.shape(rect(x + w * 0.4, y - h * 0.28, 4 * k, 4 * k)))
  } else {
    const c: Point = [x + w * 0.25, y - h * 0.72]
    s.fill(
      p.shape(
        Array.from({ length: 14 }, (_, i) =>
          add(
            c,
            [Math.cos(i * 0.45), Math.sin(i * 0.45)],
            (16 + r.signed() * 3) * k,
          ),
        ),
      ),
    )
    s.stroke(p.line(add(c, [0, 14 * k]), [c[0], y - h * 0.55]))
  }
  // A curtain hanging from the rod at one side: gathered at a tie-back, flaring to a scalloped hem, with two folds.
  const side = r.chance(0.5) ? 0 : 1
  const dir = side ? -1 : 1
  const cx = x + side * w
  const [top, bottom] = [y - h - 6 * k, y + 9 * k]
  const rod: [Point, Point] = [
    [x - 12 * k, top],
    [x + w + 12 * k, top],
  ]
  s.stroke(p.line(...rod))
  for (const end of rod) s.stroke(p.ring(...dot(end, 2.6 * k)))
  const tie = r.between(0.58, 0.66)
  /** How far the curtain reaches into the window at t, from the rod (0) to the hem (1). */
  const reach = (t: number) => {
    const q = t < tie ? (tie - t) / tie : (t - tie) / (1 - tie)
    return (10 + (t < tie ? 15 : 12) * q * q) * k
  }
  const cloth = (t: number, f: number): Point => [
    cx + dir * (-7 * k + (reach(t) + 7 * k) * f),
    top + (bottom - top) * t,
  ]
  const steps = Array.from({ length: 13 }, (_, i) => i / 12)
  const hem = Array.from({ length: 7 }, (_, i): Point => {
    const f = 1 - i / 6
    return add(cloth(1, f), [0, (i % 2 ? -2.2 : 0) * k])
  })
  const panel = [
    ...steps.map((t) => cloth(t, 0)),
    ...hem.slice(1, -1).reverse(),
    ...steps.map((t) => cloth(t, 1)).reverse(),
  ]
  s.blank(p.shape(panel))
  s.stroke(p.shape(panel))
  for (const f of [0.36, 0.7])
    s.stroke(p.path(steps.slice(1, -1).map((t) => cloth(t, f))))
  s.fill(p.disc(...dot(cloth(tie, 1), 2.4 * k)))
}

const T = objectsIn("indie")

define(
  T("picture", "Pinned picture", [130, 150], [65, 75], 1, picture, [
    "art",
    "wall",
    "home",
  ]),
  T("chair", "Chair", [110, 140], [20, 130], 1, chair, [
    "furniture",
    "seat",
    "cafe",
  ]),
  T("armchair", "Armchair", [150, 120], [16, 110], 1, armchair, [
    "furniture",
    "seat",
    "home",
  ]),
  T("floor-lamp", "Floor lamp", [80, 200], [40, 190], 1, floorLamp, [
    "light",
    "furniture",
    "home",
  ]),
  T("window", "Window", [130, 150], [18, 140], 1, roomWindow, [
    "wall",
    "view",
    "home",
  ]),
)
