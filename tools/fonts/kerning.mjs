// Kerning for the capitals, as a GPOS table (opentype.js writes none): class-based pairs (PairPos format 2), so an
// accented letter kerns as its base and every take of a glyph kerns the same. Values are font units, negative closes.
import { COMPOSED } from "./glyphs.mjs"

// The letter shapes a pair is about: what the first glyph's right side and the second glyph's left side look like.
const LEFT = {
  A: "AÆ",
  L: "L",
  T: "T",
  V: "VW",
  Y: "Y",
  F: "F",
  P: "PÞ",
  K: "KX",
  O: "ODQØÐĐ",
  R: "R",
  dot: ".,…",
  quote: "'\"’”",
}
const RIGHT = {
  A: "AÆ",
  T: "T",
  V: "VW",
  Y: "Y",
  O: "OCGQØŒ",
  J: "J",
  dot: ".,…",
  quote: "'\"‘“",
  X: "X",
}
// prettier-ignore
const PAIRS = {
  A: { T: -64, V: -72, Y: -72, O: -16, quote: -70 },
  L: { T: -76, V: -76, Y: -76, O: -22, quote: -100 },
  T: { A: -64, dot: -86, O: -12, J: -64 },
  V: { A: -72, dot: -92, O: -16, J: -40 },
  Y: { A: -72, dot: -92, O: -22, J: -40 },
  F: { A: -52, dot: -92, J: -52 },
  P: { A: -44, dot: -104, J: -44 },
  K: { O: -24 },
  O: { A: -16, T: -12, V: -16, Y: -22, dot: -22, X: -12, J: -12 },
  R: { T: -16, V: -16, Y: -22, O: -8 },
  dot: { T: -86, V: -92, Y: -92, quote: -60 },
  quote: { A: -70, dot: -60 },
}

/** The character a glyph's shape comes from: an accented letter's base, or itself. */
const baseOf = (c) =>
  COMPOSED[c]?.[0] ?? (c === "Ä" || c === "Å" ? "A" : c === "Ö" ? "O" : c)

function classes(table, chars, ids) {
  const names = Object.keys(table)
  const byGlyph = new Map()
  chars.forEach((c, i) => {
    const k = names.findIndex((n) => table[n].includes(baseOf(c)))
    if (k >= 0) for (const take of ids) byGlyph.set(take[i], k + 1)
  })
  return { names, byGlyph }
}

const u16 = (n) => [(n >> 8) & 255, n & 255]
const i16 = (n) => u16(n < 0 ? n + 65536 : n)
const tag = (t) => [...t].map((c) => c.charCodeAt(0))

/** ClassDef format 1 over the range of classed glyphs. */
function classDef(byGlyph) {
  const gids = [...byGlyph.keys()].sort((a, b) => a - b)
  const [first, last] = [gids[0], gids[gids.length - 1]]
  const values = Array.from(
    { length: last - first + 1 },
    (_, i) => byGlyph.get(first + i) ?? 0,
  )
  return [
    ...u16(1),
    ...u16(first),
    ...u16(values.length),
    ...values.flatMap(u16),
  ]
}

/** The GPOS table's bytes: one kern feature for DFLT and latn, one class-pair lookup. */
export function kerning(chars, ids) {
  const left = classes(LEFT, chars, ids)
  const right = classes(RIGHT, chars, ids)
  const covered = [...left.byGlyph.keys()].sort((a, b) => a - b)
  const coverage = [...u16(1), ...u16(covered.length), ...covered.flatMap(u16)]
  const c1 = left.names.length + 1
  const c2 = right.names.length + 1
  const records = []
  for (let a = 0; a < c1; a++)
    for (let b = 0; b < c2; b++)
      records.push(
        ...i16(
          a && b ? (PAIRS[left.names[a - 1]]?.[right.names[b - 1]] ?? 0) : 0,
        ),
      )
  const cd1 = classDef(left.byGlyph)
  const cd2 = classDef(right.byGlyph)
  const head = 16 + records.length
  const pairPos = [
    ...u16(2),
    ...u16(head),
    ...u16(0x0004),
    ...u16(0),
    ...u16(head + coverage.length),
    ...u16(head + coverage.length + cd1.length),
    ...u16(c1),
    ...u16(c2),
    ...records,
    ...coverage,
    ...cd1,
    ...cd2,
  ]
  const lookup = [...u16(2), ...u16(0), ...u16(1), ...u16(8), ...pairPos]
  const lookupList = [...u16(1), ...u16(4), ...lookup]
  const feature = [...u16(0), ...u16(1), ...u16(0)]
  const featureList = [...u16(1), ...tag("kern"), ...u16(8), ...feature]
  const langSys = [...u16(0), ...u16(0xffff), ...u16(1), ...u16(0)]
  const script = [...u16(4), ...u16(0), ...langSys]
  const scriptList = [
    ...u16(2),
    ...tag("DFLT"),
    ...u16(14),
    ...tag("latn"),
    ...u16(14 + script.length),
    ...script,
    ...script,
  ]
  const header = 10
  return new Uint8Array([
    ...u16(1),
    ...u16(0),
    ...u16(header),
    ...u16(header + scriptList.length),
    ...u16(header + scriptList.length + featureList.length),
    ...scriptList,
    ...featureList,
    ...lookupList,
  ])
}
