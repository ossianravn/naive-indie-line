// Food & drink: the kitchen's things, from the morning coffee to a plate of lunch. `at` is bottom-centre unless a
// function says otherwise. Composition comes from `r` (the shape stream), never from the pen, so takes agree.
import { add, arc, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { cylinder, handle } from "../shapes"

/** A cup of coffee on its saucer, steaming. */
export const coffee: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  s.stroke(p.ring([x, y], [30 * k, 0], [0, 8 * k]))
  const cup = cylinder(s, p, [x, y - 26 * k], 17 * k, 5 * k, 22 * k)
  handle(s, p, x + 17 * k, y - 22 * k, y - 10 * k, 8 * k)
  s.fill(p.disc(cup.top, [14 * k, 0], [0, 3.6 * k]))
  for (const dx of [-6, 4])
    s.stroke(
      p.path(
        Array.from({ length: 9 }, (_, i): Point => [
          x + (dx + Math.sin(i * 0.9 + dx) * 3) * k,
          y - (36 + i * 3) * k,
        ]),
      ),
    )
}

export const teapot: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const body = [
    P(-34, 4),
    ...arc([0, 0], 36, 44, 180, 360, 18).map(([u, v]) => P(u, 4 - v)),
    P(34, 4),
  ]
  s.stroke(p.path([P(30, 18), P(46, 30), P(56, 46)]))
  s.stroke(p.path([P(32, 30), P(44, 38), P(51, 50)]))
  s.stroke(p.line(P(56, 46), P(51, 50)))
  s.stroke(
    p.path(
      arc([0, 0], 13, 16, -90, 90, 10).map(([u, v]) => P(-34 - u, 24 - v)),
    ),
  )
  s.blank(p.shape(body))
  s.stroke(p.path([...body, body[0] as Point]))
  s.stroke(
    p.path(arc([0, 0], 14, 7, 180, 360, 10).map(([u, v]) => P(u, 44 - v))),
  )
  s.fill(p.disc(...dot(P(0, 54), 3.4 * k)))
}

export const moka: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y - v * k]
  const lower = [P(-22, 0), P(22, 0), P(14, 40), P(-14, 40)]
  const upper = [P(-14, 40), P(14, 40), P(20, 80), P(-20, 80)]
  s.blank(p.shape([...lower, ...upper]))
  s.stroke(p.edges(lower))
  s.stroke(p.edges(upper))
  s.stroke(p.edges([P(20, 80), P(30, 82), P(20, 72)], false))
  s.fill(p.shape([P(-20, 72), P(-34, 68), P(-36, 48), P(-16, 46)]))
  s.stroke(p.edges([P(-12, 80), P(12, 80), P(9, 86), P(-9, 86)]))
  s.fill(p.disc(...dot(P(0, 90), 3.6 * k)))
}

/** A plate seen from above, with one of a few dishes on it. */
export const plate: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { dish = r.pick(["fish", "toast", "pasta", "salad"]) } = {},
) => {
  const [x, y] = at
  const c: Point = [x, y - 14 * k]
  s.blank(p.disc(c, [48 * k, 0], [0, 14 * k]))
  s.stroke(p.ring(c, [48 * k, 0], [0, 14 * k]))
  s.stroke(p.ring(c, [35 * k, 0], [0, 10 * k]))
  const P = (u: number, v: number): Point => [c[0] + u * k, c[1] + v * k]
  if (dish === "fish") {
    const body = [P(-24, 0), P(-10, -6), P(8, -6), P(18, 0), P(8, 6), P(-10, 6)]
    s.stroke(p.path([...body, body[0] as Point]))
    s.stroke(p.edges([P(18, 0), P(28, -6), P(28, 6)]))
    s.fill(p.disc(...dot(P(-16, -1), 1.3 * k)))
    s.stroke(p.path([P(-10, -5), P(-8, 0), P(-10, 5)]))
  } else if (dish === "toast") {
    s.stroke(p.edges([P(-20, -6), P(16, -8), P(20, 6), P(-16, 8)]))
    s.stroke(p.path(arc([2, 0], 11, 5, 0, 360, 14).map(([u, v]) => P(u, v))))
    s.fill(p.disc(P(3, 0), [4 * k, 0], [0, 2.4 * k]))
  } else if (dish === "pasta") {
    for (let i = 0; i < 5; i++)
      s.stroke(
        p.ring(
          P(r.signed() * 12, r.signed() * 3),
          [r.between(6, 12) * k, 0],
          [0, r.between(2, 4) * k],
        ),
      )
    s.fill(p.disc(P(r.signed() * 6, -1), [3 * k, 0], [0, 1.6 * k]))
  } else {
    for (let i = 0; i < 4; i++) {
      const a = P(r.signed() * 16, r.signed() * 4)
      s.stroke(
        p.path([
          a,
          add(a, [8 * k, -4 * k]),
          add(a, [14 * k, 0]),
          add(a, [6 * k, 3 * k]),
          a,
        ]),
      )
    }
    for (let i = 0; i < 3; i++)
      s.fill(p.disc(P(r.signed() * 18, r.signed() * 4), [3 * k, 0], [0, 2 * k]))
  }
}

export const bowl: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const c: Point = [x, y - 26 * k]
  const body = arc(c, 34 * k, 26 * k, 0, 180, 16)
  s.blank(p.shape(body))
  s.stroke(p.path(body))
  s.wash(p.disc(add(c, [0, 2 * k]), [30 * k, 0], [0, 6 * k]))
  s.stroke(p.ring(c, [34 * k, 0], [0, 8 * k]))
  s.stroke(p.ring(add(c, [-8 * k, -2 * k]), [7 * k, 0], [0, 3 * k]))
  s.stroke(p.line(add(c, [-2 * k, -4 * k]), add(c, [24 * k, -26 * k])))
}

export const bread: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const loaf: Point[] = [
    [x - 44 * k, y],
    ...arc([x, y], 44 * k, 30 * k, 180, 360, 18),
    [x + 44 * k, y],
  ]
  s.blank(p.shape(loaf))
  s.stroke(p.path([...loaf, loaf[0] as Point]))
  for (let i = -1; i <= 1; i++)
    s.stroke(
      p.path([
        [x + (i * 22 - 7) * k, y - 16 * k],
        [x + (i * 22 + 2) * k, y - 24 * k],
        [x + (i * 22 + 9) * k, y - 22 * k],
      ]),
    )
}

/** A whole lemon and a cut half beside it. */
export const lemon: Draw = (s, p, _r, at, k = 1) => {
  const [x, y] = at
  const c: Point = [x - 14 * k, y - 18 * k]
  const whole = [
    add(c, [-26 * k, 0]),
    ...arc(c, 22 * k, 17 * k, 190, 350, 10),
    add(c, [26 * k, 0]),
    ...arc(c, 22 * k, 17 * k, 10, 170, 10),
  ]
  s.stroke(p.path([...whole, whole[0] as Point]))
  const half: Point = [x + 30 * k, y - 14 * k]
  s.blank(p.disc(half, [16 * k, 0], [0, 14 * k]))
  s.stroke(p.ring(half, [16 * k, 0], [0, 14 * k]))
  s.stroke(p.ring(half, [12.5 * k, 0], [0, 10.5 * k]))
  for (let i = 0; i < 6; i++)
    s.stroke(
      p.line(
        half,
        add(half, [Math.cos(i * 1.047) * 11 * k, Math.sin(i * 1.047) * 9 * k]),
      ),
    )
}

const T = objectsIn("food")

define(
  T("coffee", "Coffee", [90, 100], [45, 88], 1.1, coffee, [
    "drink",
    "coffee",
    "morning",
  ]),
  T("teapot", "Teapot", [140, 100], [62, 92], 1, teapot, [
    "drink",
    "tea",
    "kitchen",
  ]),
  T("moka", "Moka pot", [90, 110], [50, 102], 1, moka, [
    "drink",
    "coffee",
    "kitchen",
  ]),
  T("plate", "Plate", [120, 60], [60, 52], 1.1, plate, [
    "meal",
    "dish",
    "restaurant",
  ]),
  T("bowl", "Bowl", [100, 90], [50, 78], 1.1, bowl, [
    "meal",
    "soup",
    "kitchen",
  ]),
  T("bread", "Bread", [110, 60], [55, 52], 1, bread, [
    "food",
    "bakery",
    "breakfast",
  ]),
  T("lemon", "Lemons", [120, 60], [52, 50], 1, lemon, [
    "food",
    "fruit",
    "kitchen",
  ]),
)
