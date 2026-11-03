// Lettering: words drawn by the pen from the skeleton alphabet, in Tramline, three parallel lines per stroke. Each letter takes a small seeded tilt
// and lift, so the same word reads as hand-lettered and is the same on every render. Ported from the prototype in
// specimen/lettering/lettering.js; lengths go through snap() before they decide a count.
import { dist, last, snap, type Point } from "./geometry"
import { GLYPHS, type Glyph } from "./glyphs"
import { sheet, type Sheet } from "./layers"
import { seedOf, stream } from "./seed"
import { pen, type HandName, type Pen } from "./stroke"

interface Face {
  name: string
  /** Horizontal scale of the skeleton. */
  sx: number
  /** Space after each letter. */
  track: number
  /** Spacing of a tramline's three lines. */
  lines: number
}

/** The drawn faces. Naïve Indie Line Sans, the kit's other display face, is a real font (styles/line-sans.generated.css). */
export const FACES = {
  tramline: { name: "Tramline", sx: 1, track: 28, lines: 4.6 },
} satisfies Record<string, Face>

export type FaceName = keyof typeof FACES

const closed = (st: Point[]) =>
  st.length > 2 && dist(st[0] as Point, last(st)) < 0.5

/** Points every `step` units along a stroke. */
function resample(st: Point[], step = 2.5): Point[] {
  const out: Point[] = [st[0] as Point]
  for (let i = 1; i < st.length; i++) {
    const [a, b] = [st[i - 1] as Point, st[i] as Point]
    const n = Math.max(1, Math.round(snap(dist(a, b)) / step))
    for (let j = 1; j <= n; j++)
      out.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n])
  }
  return out
}

/** The stroke moved sideways by d along its normals (a ring stays a ring). */
function offset(st: Point[], d: number): Point[] {
  const pts = resample(st)
  const ring = closed(st)
  return pts.map((pt, i): Point => {
    const a = pts[i > 0 ? i - 1 : ring ? pts.length - 2 : 0] as Point
    const b = pts[
      i < pts.length - 1 ? i + 1 : ring ? 1 : pts.length - 1
    ] as Point
    const len = dist(a, b) || 1
    return [
      pt[0] - ((b[1] - a[1]) / len) * d,
      pt[1] + ((b[0] - a[0]) / len) * d,
    ]
  })
}

/** Each stroke as three parallel lines. */
function strokeLetter(s: Sheet, p: Pen, face: Face, strokes: Point[][]) {
  for (const st of strokes)
    for (const d of [-face.lines, 0, face.lines])
      s.stroke(p.path(offset(st, d)))
}

export interface LetteringOptions {
  face?: FaceName
  /** Defaults to the text, so a word always looks the same. */
  seed?: string | number
  hand?: HandName
  /** 1 for still lettering; 3 for line boil and settling. */
  takes?: number
}

/**
 * Draw a word or a line in one face, as one SVG per take, named by the text (only the first take is named). Letters
 * the alphabet lacks draw as a question mark.
 */
export function lettering(
  text: string,
  {
    face: faceName = "tramline",
    seed = text,
    hand = "lively",
    takes = 1,
  }: LetteringOptions = {},
): string[] {
  const face: Face = FACES[faceName]
  const key = `${seed}:${faceName}`
  const out: string[] = []
  for (let take = 0; take < Math.max(1, takes); take++) {
    const s = sheet(`fl${seedOf(key).toString(36)}l${take}`)
    const p = pen(key, hand, take)
    const r = stream(seedOf(key), "letters")
    let x = 14
    for (const ch of text.toUpperCase()) {
      const g: Glyph = GLYPHS[ch] ?? (GLYPHS["?"] as Glyph)
      const w = g.w * face.sx
      const tilt = (r.signed() * 2.2 * Math.PI) / 180
      const lift = r.signed() * 2
      const c: Point = [x + w / 2, 50]
      const at = ([u, v]: Point): Point => {
        const [dx, dy] = [x + u * face.sx - c[0], v + 22 + lift - c[1]]
        return [
          c[0] + dx * Math.cos(tilt) - dy * Math.sin(tilt),
          c[1] + dx * Math.sin(tilt) + dy * Math.cos(tilt),
        ]
      }
      strokeLetter(
        s,
        p,
        face,
        [...g.s, ...(g.m ?? [])].map((st) => st.map(at)),
      )
      for (const d of g.d ?? []) s.fill(p.disc(at(d), [3.2, 0], [0, 3.2]))
      x += w + face.track
    }
    out.push(
      s.svg(
        Math.round(x - face.track + 14),
        144,
        take === 0 ? text : undefined,
      ),
    )
  }
  return out
}
