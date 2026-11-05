// Heads that are not looking at you: in profile, facing either way, and from behind (the face that looks straight out
// is in faces.ts). `c` is the head's centre and `k` its scale; hair is a pocket of ink, as on the face. A profile is
// the same egg as the face, with the nose standing out of its front, one eye and an ear; its hair is the face's eight
// cuts seen from the side. Composition comes from the caller's stream; these draw with the pen only.
import { arc, dot, type Point } from "../geometry"
import type { Sheet } from "../layers"
import type { Pen } from "../stroke"

/** Points on a head: u towards where it faces (side 1 right, -1 left), v down, both scaled by k. */
function frame(c: Point, k: number, side = 1) {
  const P = (u: number, v: number): Point => [c[0] + side * u * k, c[1] + v * k]
  const A = (rx: number, ry: number, a0: number, a1: number, n = 14) =>
    arc([0, 0], rx, ry, a0, a1, n).map(([u, v]) => P(u, v))
  const L = (pts: [number, number][]) => pts.map(([u, v]) => P(u, v))
  return { P, A, L }
}

/** Cuts short enough to show the ears. */
const EARS = ["crop", "bun", "ponytail", "waves", "curls"]

/** How a face looks: "joy" (mouth open, looking up a little) or "dreamy" (eyes closed); a smile otherwise. */
export interface Look {
  hair: string
  glasses?: boolean
  beard?: boolean
  mood?: string
}

/** What falls behind a head in profile, drawn before the clothes: a ponytail, or long hair down the back. */
export function profileBehind(
  s: Sheet,
  p: Pen,
  c: Point,
  k: number,
  side: number,
  hair: string,
) {
  const { L } = frame(c, k, side)
  if (hair === "ponytail")
    s.fill(
      p.shape(
        L([
          [-10, -7],
          [-15.5, -4],
          [-19, 6],
          [-18, 22],
          [-14.5, 12],
          [-11.5, 2],
        ]),
      ),
    )
  if (hair === "long")
    s.fill(
      p.shape(
        L([
          [-11, -8],
          [-16.5, 4],
          [-18, 30],
          [-6, 30],
          [-5, 14],
        ]),
      ),
    )
}

/** A head in profile centred at `c`, facing `side` (1 right, -1 left), with its hair, ear, eye and mouth. */
export function profile(
  s: Sheet,
  p: Pen,
  c: Point,
  k: number,
  side: number,
  { hair, glasses = false, beard = false, mood }: Look,
) {
  const { P, A, L } = frame(c, k, side)
  s.stroke(p.line(P(-4.5, 12), P(-4.5, 15.5)))
  s.stroke(p.line(P(4.5, 12.5), P(4, 15.5)))
  // The egg of the face, opened at the front for the nose.
  const head = [...A(12.5, 15, 22, 355, 22), P(15.8, 4.4)]
  s.blank(p.shape(head))
  s.stroke(p.shape(head))
  // From the forehead's hairline back past the ear to the nape: where short hair stops.
  const hairline: [number, number][] = [
    [11.2, -7.5],
    [7, -7],
    [3.5, -4],
    [1.5, 0],
    [-2, 1],
    [-6, 6],
    [-9, 9.5],
  ]
  const cap = (rx: number, ry: number, line = hairline) =>
    s.fill(p.shape([...A(rx, ry, 145, 322), ...L(line)]))
  if (hair === "bob" || hair === "long")
    s.fill(
      p.shape([
        ...A(14.5, 17.5, hair === "bob" ? 105 : 115, 322),
        ...L([
          [11.2, -7.5],
          [7.5, -6.5],
          [4.5, -3],
          [3.5, 4],
          [hair === "bob" ? 3 : 2.5, hair === "bob" ? 12.5 : 14],
        ]),
      ]),
    )
  else if (hair === "fringe")
    s.fill(
      p.shape([
        ...A(14, 17, 125, 335),
        ...L([
          [13.4, -3.6],
          [9, -2.6],
          [5.5, -2.8],
          [3.5, 2],
          [2.5, 9.5],
        ]),
      ]),
    )
  else if (hair === "waves") {
    // Short and a little tousled: the crown's outline swells and dips.
    const crown = Array.from({ length: 13 }, (_, i): Point => {
      const [f, a] = [i % 2 ? 1.07 : 1, 145 + (i * 177) / 12]
      return A(13.4 * f, 17 * f, a, a, 1)[0] as Point
    })
    s.fill(p.shape([...crown, ...L(hairline)]))
  } else cap(13.2, 16.5)
  if (hair === "curls")
    for (let a = 160; a <= 330; a += 24)
      s.fill(p.disc(...dot(A(13.6, 16.8, a, a, 1)[0] as Point, 5 * k)))
  if (hair === "bun") s.fill(p.disc(...dot(P(-9.5, -14), 6.5 * k)))
  if (beard)
    s.fill(
      p.shape(
        L([
          [1.5, 5],
          [4, 7.2],
          [11.2, 7],
          [10.4, 9.6],
          [8, 12.6],
          [3, 14.6],
          [-1, 13.8],
          [-1.5, 8.5],
        ]),
      ),
    )
  if (EARS.includes(hair)) {
    s.blank(p.disc(P(-1.5, 2), [2.6 * k, 0], [0, 3.8 * k]))
    s.stroke(p.ring(P(-1.5, 2), [2.6 * k, 0], [0, 3.8 * k]))
  }
  const up = mood === "joy" ? -1.5 : 0
  const eye = P(7.2, 0.6 + up)
  // Closed, the eye is a curve that dips like a smile.
  if (mood === "dreamy")
    s.stroke(p.path(arc(eye, 2.1 * k, 1.3 * k, 20, 160, 5)))
  else s.fill(p.disc(...dot(eye, 1.15 * k)))
  if (glasses) {
    s.stroke(p.ring(eye, [3.3 * k, 0], [0, 3 * k]))
    s.stroke(p.line(P(3.9, 0.2 + up), P(-0.6, -0.4)))
  }
  if (beard) return
  // Open in joy, the mouth is a small D set back from the edge of the face.
  if (mood === "joy")
    s.fill(
      p.shape(
        L([
          [5.6, 8.1],
          [8.8, 7.9],
          [7.9, 10.4],
          [6.3, 10.2],
        ]),
      ),
    )
  else
    s.stroke(
      p.path(
        L([
          [6.4, 8.8],
          [7.9, 9.7],
          [9.3, 9],
        ]),
      ),
    )
}

/**
 * The back of a head centred at `c`: the hair covers the crown and stops at the nape, the ears stand out of it. `neck`
 * is where the neck's two lines run, down from the head (a seated worker's collar sits lower than a standing one's).
 */
export function backOfHead(
  s: Sheet,
  p: Pen,
  c: Point,
  k: number,
  hair: string,
  [n0, n1]: [number, number] = [15, 21],
) {
  const { P, A, L } = frame(c, k)
  s.stroke(p.line(P(-4, n0), P(-4, n1)))
  s.stroke(p.line(P(4, n0), P(4, n1)))
  s.blank(p.disc(c, [12 * k, 0], [0, 15 * k]))
  s.stroke(p.ring(c, [12 * k, 0], [0, 15 * k]))
  const nape = L([
    [12.5, 5],
    [6, 9.5],
    [0, 10.5],
    [-6, 9.5],
    [-12.5, 5],
  ])
  if (hair === "bob" || hair === "fringe") {
    const hem = hair === "bob" ? 12 : 9
    s.fill(p.shape([...A(15, 18, 165, 375), P(14.5, hem), P(-14.5, hem)]))
  } else if (hair === "long")
    s.fill(
      p.shape([
        ...A(15.5, 19, 160, 380),
        ...L([
          [16, 34],
          [5, 36],
          [-5, 35],
          [-16, 34],
        ]),
      ]),
    )
  else if (hair === "waves") {
    const crown = Array.from({ length: 13 }, (_, i): Point => {
      const [f, a] = [i % 2 ? 1.07 : 1, 175 + (i * 190) / 12]
      return A(13.5 * f, 18 * f, a, a, 1)[0] as Point
    })
    s.fill(p.shape([...crown, ...nape]))
  } else s.fill(p.shape([...A(13, 16.5, 175, 365), ...nape]))
  if (hair === "curls")
    for (let a = 165; a <= 375; a += 25)
      s.fill(p.disc(...dot(A(13.5, 16.5, a, a, 1)[0] as Point, 5 * k)))
  if (hair === "bun") s.fill(p.disc(...dot(P(0, -17), 6.5 * k)))
  if (hair === "ponytail")
    s.fill(
      p.shape(
        L([
          [-3, 4],
          [3, 4],
          [4.5, 19],
          [1, 30],
          [-2.5, 20],
        ]),
      ),
    )
  if (EARS.includes(hair) && hair !== "curls")
    for (const side of [-1, 1]) {
      const from = side > 0 ? -90 : 90
      const ear = arc([side * 12.5, 2], 2.8, 4, from, from + 180, 6)
      s.blank(p.shape(L(ear as [number, number][])))
      s.stroke(p.path(L(ear as [number, number][])))
    }
}
