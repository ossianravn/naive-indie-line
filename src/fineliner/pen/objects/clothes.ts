// What people wear, shared by the people with faces and the visitors who are only their clothes: loose sweaters,
// hoodies, open overshirts and tees over wide trousers or a short skirt, and trainers. `at` is where they stand
// (bottom-centre) and `k` their scale. Composition comes from `r` (the shape stream), never from the pen.
import { add, arc, dot, lerp, length, turn, type Point } from "../geometry"
import type { Sheet } from "../layers"
import type { Stream } from "../seed"
import type { Pen } from "../stroke"

/** Tops anybody can wear; a tee shows bare arms, so only people with faces wear one. */
export const TOPS = ["sweater", "hoodie", "overshirt", "tee"]

// Sleeve and arm cuts from the shoulder: u runs outwards, v down the arm. Points 1 and 2 are the cuff.
const LONG: Point[] = [
  [8.5, 27],
  [11.5, 51],
  [0.5, 53],
  [-5.5, 23],
]
const SHORT: Point[] = [
  [7.5, 10],
  [10, 21.5],
  [-1.5, 23.5],
  [-5, 12],
]
const ARM: Point[] = [
  [7, 14],
  [9, 50],
  [2, 51.5],
  [-3.5, 15],
]

/** A sleeve or arm hanging from shoulder S, swung by a degrees; returns its outline, cuff and where the hand goes. */
function limb(S: Point, side: number, k: number, a: number, cut: Point[]) {
  const pts = cut.map(([u, v]) =>
    turn([S[0] + side * u * k, S[1] + v * k], S, a),
  )
  const [a0, a1, a2, a3] = pts as [Point, Point, Point, Point]
  const cuff: Point = lerp(a1, a2, 0.5)
  const out: Point = [
    cuff[0] - (a0[0] + a3[0]) / 2,
    cuff[1] - (a0[1] + a3[1]) / 2,
  ]
  const len = length(out) || 1
  const [b0, b1] = [lerp(a0, a1, 0.8), lerp(a3, a2, 0.8)]
  return {
    outline: [S, ...pts],
    band: [lerp(b0, b1, 0.15), lerp(b0, b1, 0.85)] as const,
    hand: add(cuff, out, (4.5 * k) / len),
  }
}

// A bent arm in two sleeves: the upper arm from the shoulder, the forearm from the elbow, its cuff and hand at the end.
const UPPER: Point[] = [
  [8.5, 6],
  [8.5, 27],
  [-4.5, 27],
  [-5.5, 8],
]
const FORE: Point[] = [
  [6.5, 2],
  [7, 25],
  [-4, 26],
  [-6, 2],
]

/** An arm bent at the elbow: swung `a` from hanging at the shoulder, then `b` further at the elbow. Returns the hand. */
function bent(
  s: Sheet,
  p: Pen,
  S: Point,
  side: number,
  k: number,
  a: number,
  b: number,
  ribbed: boolean,
) {
  const up = limb(S, side, k, a, UPPER)
  s.blank(p.shape(up.outline))
  s.stroke(p.path([...up.outline, up.outline[0] as Point]))
  const E = turn([S[0] + side * 2 * k, S[1] + 25 * k], S, a)
  const fore = limb(E, side, k, a + b, FORE)
  s.blank(p.shape(fore.outline.slice(1)))
  s.stroke(p.shape(fore.outline.slice(1)))
  if (ribbed) s.stroke(p.line(...fore.band))
  return fore.hand
}

/** What someone wears: a pose, a top, a bottom, how far apart the feet are, and whether anybody is inside. */
export interface Outfit {
  pose?: string
  top?: string
  bottom?: string
  stride?: number
  nobody?: boolean
  /** Each arm's swing from hanging, in degrees (left, right), in place of the pose's: both up is [150, -150]. */
  swing?: Point
  /** Seen from behind: no neckline, fronts or pocket, a plain collar, and a hood lying on the back. */
  back?: boolean
  /** Each arm's bend at the elbow, in degrees (left, right); an arm without one hangs straight from its swing. */
  bend?: [number | undefined, number | undefined]
}

/** The whole outfit, back to front: hood, trainers, trousers or skirt, the top and its sleeves. Returns the hands. */
export function clothes(
  s: Sheet,
  p: Pen,
  r: Stream,
  at: Point,
  k: number,
  {
    pose = "stand",
    top = "sweater",
    bottom = "trousers",
    stride = 0,
    nobody = false,
    swing: arms,
    back = false,
    bend,
  }: Outfit = {},
) {
  const [x, y] = at
  const P = (u: number, v: number): Point => [x + u * k, y + v * k]
  const path = (pts: [number, number][]) => pts.map(([u, v]) => P(u, v))
  const ribbed = top === "sweater" || top === "hoodie"
  if (top === "hoodie" && !back) {
    // The hood lies on the shoulders behind the neck; the body hides its lower half.
    const hood = path([
      [-16, -154],
      ...arc([0, -161], 15, 9, 180, 360, 10),
      [16, -154],
    ])
    s.blank(p.shape(hood))
    s.stroke(p.path(hood))
  }
  // Trainers: a rounded toe and a sole line, under the trouser hems.
  for (const side of [-1, 1]) {
    const fx = side * (10 + stride)
    const shoe = [
      P(fx - 8, 0),
      P(fx + 8, 0),
      ...arc([fx, -3], 8, 4.6, 0, -180, 8).map(([u, v]) => P(u, v)),
    ]
    s.blank(p.shape(shoe))
    s.stroke(p.shape(shoe))
    s.stroke(p.line(P(fx - 7.6, -1.8), P(fx + 7.6, -1.8)))
  }
  if (bottom === "skirt") {
    for (const side of [-1, 1])
      for (const dx of [5, 11])
        s.stroke(
          p.line(P(side * (dx + stride / 2), -52), P(side * (dx + stride), -5)),
        )
    const skirt = path([
      [-17, -90],
      [-25, -52],
      [25, -52],
      [17, -90],
    ])
    s.blank(p.shape(skirt))
    s.stroke(p.shape(skirt))
  } else {
    const legs = path([
      [-17, -90],
      [-19.5 - stride, -6],
      [-3 - stride, -6],
      [0, -60],
      [3 + stride, -6],
      [19.5 + stride, -6],
      [17, -90],
    ])
    s.blank(p.shape(legs))
    s.stroke(p.path(legs))
    // Rolled-up hems.
    for (const side of [-1, 1])
      s.stroke(
        p.line(P(side * (16.8 + stride), -13), P(side * (5.8 + stride), -13)),
      )
  }
  const body = path([
    [-8, -163],
    [-23, -154],
    [-19, -130],
    [-21.5, -87],
    [21.5, -87],
    [19, -130],
    [23, -154],
    [8, -163],
  ])
  s.blank(p.shape(body))
  s.stroke(p.path(body))
  const neck = path(arc([0, -163], 8, 4, 0, 180, 8) as [number, number][])
  if (back) {
    // The collar's back, nearly straight; a shirt's yoke across the shoulders; a hood lying over the back.
    s.stroke(
      p.path(path(arc([0, -163], 8, 1.6, 0, 180, 6) as [number, number][])),
    )
    if (top === "overshirt") s.stroke(p.line(P(-18, -150), P(18, -150)))
    if (ribbed) s.stroke(p.line(P(-18, -93), P(18, -93)))
    if (top === "hoodie") {
      const hood = path([
        [-12, -163],
        [-15, -152],
        [-8.5, -143],
        [8.5, -143],
        [15, -152],
        [12, -163],
      ])
      s.blank(p.shape(hood))
      s.stroke(p.shape(hood))
    }
  } else if (top === "overshirt") {
    // An open shirt over a tee: the tee's neckline, two lapels and the shirt's fronts falling apart.
    s.stroke(p.path(neck))
    for (const side of [-1, 1]) {
      s.stroke(
        p.path(
          path([
            [side * 8, -163],
            [side * 13, -150],
            [side * 5, -147],
          ]),
        ),
      )
      s.stroke(
        p.path(
          path([
            [side * 5, -147],
            [side * 6.5, -118],
            [side * 7, -87],
          ]),
        ),
      )
    }
    s.stroke(
      p.shape(
        path([
          [-17, -142],
          [-10, -142],
          [-10, -133],
          [-17, -133],
        ]),
      ),
    )
  } else {
    s.stroke(p.path(neck))
    // Bands sit a little inside the outline, so a run past their ends stays on the cloth.
    if (ribbed) s.stroke(p.line(P(-18, -93), P(18, -93)))
  }
  if (top === "hoodie" && !back) {
    s.stroke(
      p.path(
        path([
          [-13, -112],
          [-10, -97],
          [10, -97],
          [13, -112],
          [-13, -112],
        ]),
      ),
    )
    for (const side of [-1, 1])
      s.stroke(p.line(P(side * 3.5, -160), P(side * 4.5, -141)))
  }
  // Every pose's swing is drawn, in this order, whichever pose is used, so the draws after it stay put.
  const stand: Point = [r.signed() * 5, r.signed() * 5]
  const swings: Record<string, Point> = {
    stand,
    wave: [r.signed() * 5, -155],
    mug: [r.signed() * 5, 52],
    walk: [14, -12],
    // Both hands down in front, into a bin of records. Fixed, so it takes nothing from the stream.
    browse: [-11, 11],
  }
  const swing = arms ?? swings[pose] ?? stand
  const hands = [-1, 1].map((side, i) => {
    const S = P(side * 22, -155)
    const a = swing[i] as number
    const elbow = bend?.[i]
    if (elbow !== undefined) return bent(s, p, S, side, k, a, elbow, ribbed)
    const short = top === "tee" && !nobody
    const sl = limb(S, side, k, a, short ? SHORT : LONG)
    const arm = limb(S, side, k, a, ARM)
    if (short) {
      // The bare arm, its top tucked up under the short sleeve drawn next.
      s.blank(p.shape(arm.outline))
      s.stroke(p.path(arm.outline.slice(1)))
    }
    s.blank(p.shape(sl.outline))
    s.stroke(p.path([...sl.outline, sl.outline[0] as Point]))
    if (ribbed) s.stroke(p.line(...sl.band))
    return short ? arm.hand : sl.hand
  })
  for (const h of nobody ? [] : hands) {
    s.blank(p.disc(...dot(h, 3.6 * k)))
    s.stroke(p.ring(...dot(h, 3.6 * k)))
  }
  return { hands, neck: P(0, -163) }
}
