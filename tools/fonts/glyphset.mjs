// The glyph set every Naïve Indie font draws: the kit's skeleton alphabet (src/fineliner/pen/glyphs.ts), the extras
// and composites in glyphs.mjs, and which characters each glyph answers to (itself, its lowercase, look-alikes).
// A glyph is { w, s, m, d }: strokes, marks (accents and bars, which a face may draw lighter) and dots.
import path from "node:path"
import { createJiti } from "jiti"
import { BARS, COMPOSED, EXTRA, MARKS, SAME } from "./glyphs.mjs"

export async function glyphSet(root) {
  const jiti = createJiti(import.meta.url)
  const { GLYPHS } = await jiti.import(
    path.join(root, "src/fineliner/pen/glyphs.ts"),
  )
  // The skeleton's own accented letters are redrawn from the marks here, so every accent in the fonts matches.
  const skeleton = Object.fromEntries(
    Object.entries(GLYPHS).filter(([c]) => !"ÄËÏÖÜÉÅ".includes(c)),
  )
  const composed = {
    ...COMPOSED,
    Ä: ["A", ["dieresis"]],
    Ë: ["E", ["dieresis"]],
    Ï: ["I", ["dieresis"]],
    Ö: ["O", ["dieresis"]],
    Ü: ["U", ["dieresis"]],
    É: ["E", ["acute"]],
    Å: ["A", ["ring"]],
  }
  const minus = {
    w: 40,
    s: [
      [
        [0, 54],
        [40, 54],
      ],
    ],
  }

  const drawn = { ...skeleton, ...EXTRA, "−": minus }
  for (const [char, [base, ...parts]] of Object.entries(composed)) {
    const g = drawn[base]
    const glyph = {
      w: g.w,
      s: [...g.s],
      m: [...(g.m ?? [])],
      d: [...(g.d ?? [])],
      base,
    }
    for (const part of parts) {
      const [name, x] = Array.isArray(part) ? part : [part]
      const extra = name in BARS ? BARS[name]() : MARKS[name](x ?? g.w / 2)
      glyph.m.push(...(extra.s ?? []))
      glyph.d.push(...(extra.d ?? []))
    }
    drawn[char] = glyph
  }

  const chars = Object.keys(drawn)
    .filter((c) => c !== " ")
    .sort((a, b) => a.codePointAt(0) - b.codePointAt(0))
  const codes = new Map(chars.map((c) => [c, new Set([c.codePointAt(0)])]))
  for (const c of chars) {
    const lower = c.toLowerCase()
    if (lower !== c && [...lower].length === 1)
      codes.get(c).add(lower.codePointAt(0))
  }
  for (const [alias, glyph] of SAME)
    if (codes.has(glyph)) {
      codes.get(glyph).add(alias.codePointAt(0))
      const lower = alias.toLowerCase()
      if ([...lower].length === 1) codes.get(glyph).add(lower.codePointAt(0))
    }
  return { drawn, chars, codes }
}
