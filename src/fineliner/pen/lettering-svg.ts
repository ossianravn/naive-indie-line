// Lettering: words drawn by the pen from the skeleton alphabet, in four faces. Each letter takes a small seeded tilt
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
  /** Serif length at free stroke ends. */
  serif?: number
  /** Half the width of a ribbon stroke. */
  ribbon?: number
  /** Spacing of a tramline's three lines. */
  lines?: number
}

export const FACES = {
  liner: { name: "Liner", sx: 1, track: 24, serif: 12 },
  stilt: { name: "Stilt", sx: 0.54, track: 15, serif: 9 },
  ribbon: { name: "Ribbon", sx: 1.04, track: 26, ribbon: 5.5 },
  tramline: { name: "Tramline", sx: 1, track: 28, lines: 4.6 },
} satisfies Record<string, Face>

export type FaceName = keyof typeof FACES

/** Marks that never take serifs. */
const PLAIN = new Set(["-", "–", "/", "+", "'", ",", "&"])

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

/** Is this end of a stroke free, or does it meet another stroke of the same letter? */
const free = (end: Point, strokes: Point[][], self: number) =>
  strokes.every(
    (st, i) => i === self || resample(st, 2).every((pt) => dist(pt, end) > 4),
  )

/** A short tick across a stroke's free end: the serif. */
function serif(end: Point, toward: Point, len: number): [Point, Point] {
  const d = dist(end, toward) || 1
  const [nx, ny] = [-(toward[1] - end[1]) / d, (toward[0] - end[0]) / d]
  return [
    [end[0] - (nx * len) / 2, end[1] - (ny * len) / 2],
    [end[0] + (nx * len) / 2, end[1] + (ny * len) / 2],
  ]
}

function strokeLetter(
  s: Sheet,
  p: Pen,
  face: Face,
  strokes: Point[][],
  plain = false,
) {
  strokes.forEach((st, i) => {
    if (face.ribbon) {
      const [L, R] = [offset(st, face.ribbon), offset(st, -face.ribbon)]
      if (closed(st)) {
        s.raw(
          `<path class="wash" fill-rule="evenodd" d="${p.shape(L)}${p.shape(R)}"/>`,
        )
      } else {
        s.wash(p.shape([...L, ...R.slice().reverse()]))
        s.stroke(p.line(L[0] as Point, R[0] as Point))
        s.stroke(p.line(last(L), last(R)))
      }
      s.stroke(p.path(L))
      s.stroke(p.path(R))
    } else if (face.lines) {
      for (const d of [-face.lines, 0, face.lines])
        s.stroke(p.path(offset(st, d)))
    } else {
      s.stroke(p.path(st))
      if (!face.serif || plain || closed(st)) return
      const ends: [Point, Point][] = [
        [st[0] as Point, st[1] as Point],
        [last(st), st[st.length - 2] as Point],
      ]
      for (const [end, toward] of ends)
        if (free(end, strokes, i))
          s.stroke(p.line(...serif(end, toward, face.serif)))
    }
  })
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
    face: faceName = "liner",
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
        g.s.map((st) => st.map(at)),
        PLAIN.has(ch),
      )
      strokeLetter(
        s,
        p,
        face,
        (g.m ?? []).map((st) => st.map(at)),
        true,
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
