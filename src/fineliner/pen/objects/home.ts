// Indie: the room itself. A pinned picture, chairs, a lamp and a window. Each function draws one object; `at` is
// its anchor (bottom-left unless it says otherwise) and `k` its scale. Composition comes from `r` (the shape
// stream), never from the pen, so takes agree.
import { add, arc, dot, lerp, rect, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { box, depth } from "../shapes"

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

export const chair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const [w, d, seat] = [54 * k, 36 * k, 46 * k]
  const back = (u: number) => add([x + w * u, y - seat], o, d)
  const rail = (u: number) => add(back(u), [0, -52 * k])
  s.stroke(p.line(back(0), rail(0)))
  s.stroke(p.line(back(1), rail(1)))
  s.stroke(p.line(add(rail(0), [0, 8 * k]), add(rail(1), [0, 8 * k])))
  s.stroke(p.line(rail(0), rail(1)))
  for (let u = 0.25; u < 0.9; u += 0.25)
    s.stroke(p.line(add(back(u), [0, -2 * k]), add(rail(u), [0, 8 * k])))
  s.stroke(p.line(add(back(0), [0, 5 * k]), add(back(0), [0, seat])))
  s.stroke(p.line(add(back(1), [0, 5 * k]), add(back(1), [0, seat])))
  box(s, p, o, [x, y - seat + 5 * k], w, 5 * k, d)
  s.stroke(p.line([x + 3 * k, y - seat + 5 * k], [x + 3 * k, y]))
  s.stroke(p.line([x + w - 3 * k, y - seat + 5 * k], [x + w - 3 * k, y]))
}

export const armchair: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r)
  const [x, y] = at
  const legs = 8 * k
  box(s, p, o, add([x, y - legs - 30 * k], o, 38 * k), 94 * k, 52 * k, 12 * k)
  const seat = box(s, p, o, [x, y - legs], 94 * k, 30 * k, 48 * k)
  s.stroke(
    p.path([seat.top(0.15, 0.1), seat.top(0.5, 0.06), seat.top(0.85, 0.1)]),
  )
  box(s, p, o, [x - 4 * k, y - legs], 16 * k, 42 * k, 48 * k)
  box(s, p, o, [x + 82 * k, y - legs], 16 * k, 42 * k, 48 * k)
  for (const lx of [2, 92])
    s.stroke(p.line([x + lx * k, y - legs], [x + lx * k, y]))
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
  const side = r.chance(0.5) ? 0 : 1
  const cx = x + side * w
  s.stroke(p.line([x - 12 * k, y - h - 6 * k], [x + w + 12 * k, y - h - 6 * k]))
  for (let i = 0; i < 3; i++) {
    const off = (side ? -1 : 1) * (4 + i * 6) * k
    s.stroke(
      p.path(
        Array.from({ length: 6 }, (_, j): Point => [
          cx + off + (j % 2 ? 2 : -2) * k,
          y - h - 6 * k + (j * (h + 4 * k)) / 5,
        ]),
      ),
    )
  }
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
