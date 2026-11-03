// Food & drink: the market's produce for a kitchen table. `at` is bottom-centre unless a function says otherwise.
// Composition comes from `r` (the shape stream), never from the pen, so takes agree. Parts are drawn in the object's
// own units (`units.ts`), back to front with blanks.
import { deg, dot, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import { pot } from "./plants"
import { ell, outline, place, pts, type Map } from "./units"

/** Three tomatoes joined by a gently curving vine; `at` is bottom centre. */
export const tomatoes: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const fruit = [
    [-28, 28, r.between(21, 23)],
    [26, 33, r.between(19, 21)],
    [1, 21, r.between(23, 25)],
  ] satisfies [number, number, number][]
  for (const [u, v, radius] of fruit)
    outline(s, p, ell(P, [u, v, radius, radius * 0.86], 0, 360, 24))
  const vine = (u: number) => 56 + 0.0023 * u * u
  const run = Array.from({ length: 19 }, (_, i) =>
    P(i * 5 - 44, vine(i * 5 - 44)),
  )
  for (const [u, v, radius] of fruit) {
    const top = v + radius * 0.67
    s.stroke(
      p.path([P(u - 3, vine(u - 3) + 1), P(u, (vine(u) + top) / 2), P(u, top)]),
    )
    const spin = r.between(-20, 20) * deg
    const star = Array.from({ length: 10 }, (_, i) => {
      const a = spin + (i * Math.PI) / 5
      const reach = i % 2 ? 2.5 : 7.5
      return P(u + Math.cos(a) * reach, top + Math.sin(a) * reach * 0.65)
    })
    s.fill(p.shape(star))
  }
  s.blank(p.shape([...run, P(46, 74), P(-44, 74)]))
  s.stroke(p.path(run))
}

/** Basil with paired rounded leaves in the shared pot; `at` is bottom centre. */
export const herbs: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const lean = r.between(-2, 2)
  const nodes = [
    [-13, 65],
    [7 + lean, 87],
    [10, 60],
  ] satisfies [number, number][]
  pot(s, p, at, k, () => {
    s.fill(p.disc(P(0, 35.8), [19 * k, 0], [0, 2.8 * k]))
    for (const [u, v] of nodes)
      s.stroke(p.path(pts(P, [u * 0.2, 35, u * 0.5, 51, u, v])))
  })
  for (const [i, [x, y]] of nodes.entries()) {
    for (const side of [-1, 1]) {
      const a = side * r.between(63, 76) * deg
      const len = i === 2 && side === 1 ? 34 : r.between(22, 26)
      const B: Map = (u, v) =>
        P(
          x + (u * Math.cos(a) + v * Math.sin(a)) * len,
          y + (v * Math.cos(a) - u * Math.sin(a)) * len,
        )
      outline(
        s,
        p,
        Array.from({ length: 24 }, (_, j) => {
          const t = (j * Math.PI) / 12
          const v = 0.5 - 0.5 * Math.cos(t)
          return B(0.42 * Math.sin(t) * (0.6 + 0.4 * v), v)
        }),
      )
      s.stroke(p.line(B(0, 0.08), B(0, 0.74)))
    }
  }
}

/** Two standing porcini, the smaller one in front; `at` is bottom centre. */
export const mushrooms: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const h = r.between(44, 46)
  outline(s, p, [
    ...ell(P, [-16, 26, 20, 25], 180, 360, 24),
    ...ell(P, [-16, 11, 20, 9], 0, 180, 16),
  ])
  const cap = p.shape([
    ...ell(P, [-16, h, 39, 18], 180, 360, 24),
    ...ell(P, [-16, h, 39, 6], 0, 180, 18).slice(1, -1),
  ])
  s.blank(cap)
  s.wash(cap)
  s.stroke(cap)
  outline(s, p, [
    ...ell(P, [-16, h, 39, 1.5], 180, 0, 18),
    ...ell(P, [-16, h, 39, 6], 0, 180, 18).slice(1, -1),
  ])
  const L: Map = (u, v) => P(36 + u * 0.65, v * 0.65 - 1.3)
  outline(s, p, [
    ...ell(L, [-16, 26, 20, 25], 180, 360, 24),
    ...ell(L, [-16, 11, 20, 9], 0, 180, 16),
  ])
  outline(s, p, [
    ...ell(L, [-16, h, 39, 18], 180, 360, 24),
    ...ell(L, [-16, h, 39, 6], 0, 180, 18).slice(1, -1),
  ])
  s.stroke(p.path(ell(L, [-16, h, 35, 1.5], 175, 5, 16)))
}

/** Three tapering carrots with feathery tops lying together; `at` is bottom centre. */
export const carrots: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const crop = [
    [-77, 22, 82, 32, [18, 78], [39, 78]],
    [-63, 7, 84, 34, [58, 78], [69, 65]],
    [-46, 5, 74, 24, [78, 58], [86, 40]],
  ] satisfies [number, number, number, number, Point, Point][]
  for (const [x, y, dx, dy, first, second] of crop) {
    const length = Math.sqrt(dx * dx + dy * dy)
    const [w, bend] = [r.between(12, 14), r.between(1.8, 3.5)]
    const C: Map = (t, b) =>
      P(
        x + dx * t - (dy * b) / length,
        y + dy * t + (dx * b) / length + bend * Math.sin(t * Math.PI),
      )
    const side = (t: number, f: number) => C(t, f * w * t * (1.4 - 0.4 * t))
    for (const [u, v] of [first, second]) {
      const [fx, fy] = [x + dx * 1.1, y + dy * 1.1]
      const [a, b] = [u - fx, v - fy]
      const span = Math.sqrt(a * a + b * b)
      const F: Map = (t, n) =>
        P(fx + a * t - (b * n) / span, fy + b * t + (a * n) / span)
      s.stroke(p.path([C(1, 0), F(0, 0), F(1, 0)]))
      // Two long shoots a frond, not many short ones: at this size short ones knot into scribble.
      for (let j = 0; j < 2; j++) {
        const t = 0.4 + j * 0.3
        const shoot = Array.from({ length: 7 }, (_, i) => {
          const q = i / 6
          return F(t + (9 * q) / span, (j % 2 ? -10 : 10) * q * q)
        })
        s.stroke(p.path(shoot))
      }
    }
    outline(s, p, [
      ...Array.from({ length: 13 }, (_, i) => side(i / 12, 1)),
      ...ell((u, v) => C(1 + v / length, u), [0, 0, w, 4], 0, -180, 8).slice(1),
      ...Array.from({ length: 11 }, (_, i) => side((11 - i) / 12, -1)),
    ])
    for (const t of [0.68, 0.88]) {
      const ring = Array.from({ length: 9 }, (_, j) => {
        const b = (j - 4) * 0.85
        return C(t + 0.012 * (1 - (b * b) / 11.56), b)
      })
      s.stroke(p.path(ring))
    }
  }
}

/** A whole mackerel in profile, nose left and tail forked; `at` is bottom centre. */
export const fish: Draw = (s, p, r, at, k = 1) => {
  const lean = r.between(-0.015, 0.015)
  const P: Map = (u, v) => place(at, k)(u, v + u * lean)
  outline(s, p, pts(P, [-43, 40, -31, 55, -17, 41]))
  outline(s, p, pts(P, [18, 38, 26, 48, 36, 34]))
  const back = (u: number) =>
    26 + 18 * Math.sqrt(1 - ((u + 10) * (u + 10)) / 4900)
  for (const u of [40, 48, 56]) {
    const v = back(u)
    s.stroke(p.line(P(u, v - 2), P(u - 2, v + 8)))
  }
  const contour = p.shape([
    ...ell(P, [-10, 26, 70, 18], 180, 350, 24),
    ...pts(P, [63, 25, 82, 43, 75, 25, 83, 8, 63, 20]),
    ...ell(P, [-10, 26, 70, 17], 10, 180, 24),
  ])
  s.blank(contour)
  const lateral = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24
    return P(-47 + 110 * t, 25.5 - 3 * t + 1.1 * Math.sin(t * Math.PI * 2))
  })
  s.wash(
    p.shape([
      ...ell(P, [-10, 25.3, 69, 17.5], 230, 350, 24),
      P(63, 25),
      ...lateral.toReversed(),
    ]),
  )
  s.stroke(contour)
  s.stroke(p.path(lateral))
  s.stroke(p.path(pts(P, [-55, 34, -50, 27, -54, 18])))
  s.fill(p.disc(...dot(P(-67, 28), 1.8 * k)))
  s.stroke(p.shape(pts(P, [-43, 25, -25, 18, -33, 29])))
}

/** An opened oyster in its deep shell beside a lemon wedge; `at` is bottom centre. */
export const oyster: Draw = (s, p, r, at, k = 1) => {
  const P = place(at, k)
  const phase = r.between(-0.2, 0.2)
  const shell = (scale: number) =>
    Array.from({ length: 60 }, (_, i) => {
      const a = (i * Math.PI) / 30
      const b = (1 + Math.cos(a)) / 2
      const ripple = 1 + 0.07 * b * Math.sin(6 * a + phase)
      return P(
        -16 + scale * (-40 + 80 * b + 2.2 * b * Math.sin(7 * a + phase)),
        35 + scale * (-4 + 8 * b - 27 * Math.sin(a) * Math.sqrt(b) * ripple),
      )
    })
  outline(s, p, shell(1))
  s.stroke(p.shape(shell(0.82)))
  const meat = Array.from({ length: 48 }, (_, i) => {
    const a = (i * Math.PI) / 24
    return P(
      -12 + Math.cos(a) * (20 + 1.4 * Math.sin(7 * a)),
      34.5 - Math.sin(a) * (10.5 + 1.1 * Math.sin(6 * a)),
    )
  })
  outline(s, p, meat)
  const wedge = (L: Map) => [
    L(29, 25),
    ...ell(L, [29, 25, 39, 25], 300, 420, 20),
  ]
  outline(
    s,
    p,
    wedge((u, v) => P(u + 6, v + 5)),
  )
  outline(s, p, wedge(P))
  const ray = (a: number) =>
    P(29 + Math.cos(a * deg) * 32, 25 - Math.sin(a * deg) * 20)
  for (const a of [-45, 15]) s.stroke(p.path([ray(a), P(30, 25), ray(a + 30)]))
}

const T = objectsIn("food")

define(
  T("tomatoes", "Tomatoes on the vine", [140, 90], [70, 78], 1, tomatoes, [
    "tomato",
    "vegetables",
    "market",
    "summer",
    "italian",
  ]),
  T("herbs", "Basil", [110, 130], [55, 120], 1, herbs, [
    "herbs",
    "basil",
    "kitchen",
    "garden",
    "italian",
  ]),
  T("mushrooms", "Porcini", [130, 100], [64, 90], 1, mushrooms, [
    "mushrooms",
    "forage",
    "autumn",
    "nordic",
    "market",
  ]),
  T("carrots", "Carrots", [190, 100], [90, 90], 1, carrots, [
    "carrots",
    "vegetables",
    "market",
    "nordic",
    "roots",
  ]),
  T("fish", "Mackerel", [190, 80], [94, 68], 1, fish, [
    "fish",
    "seafood",
    "catch",
    "market",
    "nordic",
  ]),
  T("oyster", "Oyster", [150, 90], [64, 78], 1, oyster, [
    "oyster",
    "seafood",
    "raw bar",
    "wine bar",
    "restaurant",
  ]),
)
