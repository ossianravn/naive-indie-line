// Studio: the tools a drawing office works with. Each function draws one object; `at` is its anchor and `k` its scale.
// Composition comes from `r`, never from the pen, so takes agree. Pens and rulers have real thickness at the size of
// use, so each is one closed outline; the one pocket of ink per object is a cap or nothing.
import { arc, turn, type Point } from "../geometry"
import { define, type Draw, objectsIn } from "../library"
import type { Sheet } from "../layers"
import { drum } from "../shapes"
import type { Pen } from "../stroke"

/** A closed outline over what is behind it. */
function solid(s: Sheet, p: Pen, pts: Point[]) {
  s.blank(p.shape(pts))
  s.stroke(p.shape(pts))
}

/**
 * A pen or pencil standing at `foot`, tilted `a` degrees from upright, `len` long and `w` wide, its tip `kind`:
 * "cap" (a capped fineliner, the cap filled when `ink`), "nib" (uncapped), "pencil" (sharpened) or "ruler" (flat, with
 * ticks). Drawn as it stands in a pot: the pot's front hides its foot.
 */
function stick(
  s: Sheet,
  p: Pen,
  foot: Point,
  a: number,
  len: number,
  w: number,
  k: number,
  kind: "cap" | "nib" | "pencil" | "ruler",
  ink = false,
) {
  const P = (u: number, v: number): Point =>
    turn([foot[0] + u * k, foot[1] - v * k], foot, a)
  const h = w / 2
  if (kind === "ruler") {
    solid(s, p, [P(-h, 0), P(h, 0), P(h, len), P(-h, len)])
    for (let v = len - 8; v > 20; v -= 8)
      s.stroke(p.line(P(-h + 0.6, v), P(-h + (v % 16 < 8 ? 6 : 3.5), v)))
    return
  }
  if (kind === "pencil") {
    solid(s, p, [P(-h, 0), P(h, 0), P(h, len), P(0, len + 11), P(-h, len)])
    s.fill(p.shape([P(-1.4, len + 7), P(1.4, len + 7), P(0, len + 11)]))
    return
  }
  if (kind === "nib") {
    solid(s, p, [
      P(-h, 0),
      P(h, 0),
      P(h, len),
      P(h * 0.55, len + 6),
      P(0.8, len + 10),
      P(-0.8, len + 10),
      P(-h * 0.55, len + 6),
      P(-h, len),
    ])
    s.stroke(p.line(P(-h + 0.5, len - 9), P(h - 0.5, len - 9)))
    return
  }
  solid(s, p, [P(-h, 0), P(h, 0), P(h, len - 18), P(-h, len - 18)])
  const cap = [
    P(-h - 0.6, len - 20),
    P(h + 0.6, len - 20),
    P(h + 0.6, len - 2),
    ...arc([0, len - 2], h + 0.6, 2.5, 0, 180, 6).map(([u, v]) =>
      P(u, 2 * (len - 2) - v),
    ),
    P(-h - 0.6, len - 2),
  ]
  if (ink) s.fill(p.shape(cap))
  else solid(s, p, cap)
}

/**
 * A pot of fineliners and pencils with a ruler standing in it; one fineliner stands uncapped, and one cap is ink.
 * `at` is the middle of the pot's foot.
 */
export const penPot: Draw = (s, p, r, at, k = 1) => {
  const [x, y] = at
  const rim: Point = [x, y - 50 * k]
  const sway = () => r.signed() * 3
  const inked = Math.floor(r.between(0, 2.99))
  drum(s, p, rim, [25 * k, 21 * k, 50 * k, 7 * k], () => {
    const foot = (u: number): Point => [x + u * k, y - 34 * k]
    stick(s, p, foot(9), 12 + sway(), 88, 7, k, "ruler")
    stick(s, p, foot(-12), -16 + sway(), 66, 5.5, k, "pencil")
    const pens: [number, number, number][] = [
      [-4, -6, 74],
      [5, 4, 70],
      [13, 18, 62],
    ]
    pens.forEach(([u, a, len], i) =>
      stick(s, p, foot(u), a + sway(), len, 6, k, "cap", i === inked),
    )
    stick(s, p, foot(-1), -1 + sway(), 60, 6, k, "nib")
  })
}

/** An uncapped fineliner lying beside its cap and the squiggle it just drew. `at` is the bottom-left of the group. */
export const fineliner: Draw = (s, p, r, at, k = 1) => {
  const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k]
  const lean = r.between(-14, -8)
  // The test squiggle first, behind the pen: loops running along a slightly rising line.
  const loops = Math.round(r.between(4, 5.99))
  const pts: Point[] = []
  for (let i = 0; i <= loops * 10; i++) {
    const t = i / 10
    const a = t * Math.PI * 2
    pts.push(P(14 + t * 17 - Math.sin(a) * 6, 56 + t * 2 + Math.cos(a) * 8))
  }
  s.stroke(p.path(pts))
  const foot = P(30, 14)
  stick(s, p, foot, 90 + lean, 104, 8, k, "nib")
  // The cap lies loose, pointing the other way: the one pocket of ink.
  const c = P(70 + r.signed() * 6, -2)
  const cap = [
    [-13, -4.5],
    [11, -4.5],
    [14, -2],
    [14, 2],
    [11, 4.5],
    [-13, 4.5],
  ].map(([u, v]) =>
    turn([c[0] + (u ?? 0) * k, c[1] + (v ?? 0) * k], c, -8 - lean / 3),
  )
  s.fill(p.shape(cap))
}

/** Five colour chips fanned open on a rivet; one chip carries the wash. `at` is the rivet's foot. */
export const swatchFan: Draw = (s, p, r, at, k = 1) => {
  const pivot: Point = [at[0], at[1] - 10 * k]
  const spread = r.between(15, 19)
  const start = -2 * spread + r.signed() * 4
  const washed = Math.floor(r.between(1, 4.99))
  for (let i = 0; i < 5; i++) {
    const a = start + i * spread
    const P = (u: number, v: number): Point =>
      turn([pivot[0] + u * k, pivot[1] - v * k], pivot, a)
    const chip = [P(-9, -4), P(9, -4), P(11, 112), P(-11, 112)]
    s.blank(p.shape(chip))
    if (i === washed)
      s.wash(p.shape([P(-11, 64), P(11, 64), P(11, 112), P(-11, 112)]))
    s.stroke(p.shape(chip))
    // The band where the colour ends and the chip's name begins.
    s.stroke(p.line(P(-10.4, 64), P(10.4, 64)))
    s.stroke(p.line(P(-6, 52), P(5, 52)))
  }
  s.blank(p.disc(pivot, [7 * k, 0], [0, 7 * k]))
  s.stroke(p.disc(pivot, [6 * k, 0], [0, 6 * k]))
  s.fill(p.disc(pivot, [1.6 * k, 0], [0, 1.6 * k]))
}

const T = objectsIn("studio")
define(
  T("pen-pot", "Pot of pens", [132, 178], [66, 166], 1, penPot, [
    "drawing",
    "identity",
    "tools",
  ]),
  T("fineliner", "Fineliner", [200, 100], [12, 84], 1, fineliner, [
    "drawing",
    "type",
    "tools",
  ]),
  T("swatch-fan", "Swatch fan", [230, 150], [115, 140], 1, swatchFan, [
    "colour",
    "identity",
    "tools",
  ]),
)
