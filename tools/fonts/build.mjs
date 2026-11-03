// Builds Naïve Indie Line Sans, the kit's pen as a typeface: capitals only (lowercase types the same capitals), every
// Latin-script European language, three takes of each glyph that rotate through `calt` so a repeated letter is never
// stamped. The skeleton alphabet comes from the kit (src/fineliner/pen/glyphs.ts); tools/fonts/glyphs.mjs adds the
// rest. Writes public/fonts/naive-indie-line-sans.otf and .woff2 (for download and design tools), and the kit's
// src/fineliner/styles/line-sans.generated.css, which carries the WOFF2 inside it so an install needs no font files.
//
//   node tools/fonts/build.mjs
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"
import opentype from "opentype.js"
import wawoff2 from "wawoff2"
import { BARS, COMPOSED, EXTRA, MARKS, SAME } from "./glyphs.mjs"
import { outline, wobble } from "./outline.mjs"
import { kerning } from "./kerning.mjs"
import { addTable } from "./sfnt.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const jiti = createJiti(import.meta.url)
const { GLYPHS } = await jiti.import(
  path.join(root, "src/fineliner/pen/glyphs.ts"),
)
const { prng, seedOf } = await jiti.import(
  path.join(root, "src/fineliner/pen/seed.ts"),
)

const FAMILY = "Naïve Indie Line Sans"
const FILE = "naive-indie-line-sans"
const SCALE = 7 // skeleton cap height 100 → 700 units
const PEN = 16 // the pen's radius: a 32-unit monoline
const SIDE = 62 // air each side of the ink
const TAKES = 3
const HAND = { wave: 170, amp: 4.5, tremor: 0 }

// The skeleton's own accented letters are redrawn from the marks here, so every accent in the font matches.
const skeleton = Object.fromEntries(
  Object.entries(GLYPHS).filter(([c]) => !"ÄËÏÖÜÉÅ".includes(c)),
)
const composed = {
  ...COMPOSED,
  Ä: ["A", ["dieresis"]],
  Ë: ["E", ["dieresis"]],
  Ï: ["I", ["dieresis"]],
}
Object.assign(composed, {
  Ö: ["O", ["dieresis"]],
  Ü: ["U", ["dieresis"]],
  É: ["E", ["acute"]],
  Å: ["A", ["ring"]],
})
const minus = {
  w: 40,
  s: [
    [
      [0, 54],
      [40, 54],
    ],
  ],
}

/** Every glyph as skeleton strokes and dots: the kit's, the extras, then the composites built from them. */
const drawn = { ...skeleton, ...EXTRA, "−": minus }
for (const [char, [base, ...parts]] of Object.entries(composed)) {
  const g = drawn[base]
  const glyph = { w: g.w, s: [...g.s, ...(g.m ?? [])], d: [...(g.d ?? [])] }
  for (const part of parts) {
    const [name, x] = Array.isArray(part) ? part : [part]
    const extra = name in BARS ? BARS[name]() : MARKS[name](x ?? g.w / 2)
    glyph.s.push(...(extra.s ?? []))
    glyph.d.push(...(extra.d ?? []))
  }
  drawn[char] = glyph
}

const toFont = ([x, y]) => [x * SCALE + SIDE + PEN, (100 - y) * SCALE]

function glyphPath(g, rand) {
  const strokes = [...g.s, ...(g.m ?? [])].map((s) => {
    const pts = s.map(toFont)
    const closed =
      pts.length > 3 &&
      Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) < 1
    return wobble(pts, closed, rand, HAND)
  })
  const dots = (g.d ?? []).map(([x, y, r]) => [...toFont([x, y]), r])
  const path = new opentype.Path()
  for (const [start, ...segments] of outline(strokes, dots, PEN)) {
    path.moveTo(...start)
    for (const [c1, c2, p] of segments) path.curveTo(...c1, ...c2, ...p)
    path.close()
  }
  return path
}

// Which characters each glyph answers to: itself, its lowercase, and the look-alikes in SAME.
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

const name = (c) =>
  `uni${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`
const advance = (c) => Math.round(drawn[c].w * SCALE + 2 * (SIDE + PEN))
const glyphs = [
  new opentype.Glyph({
    name: ".notdef",
    advanceWidth: 500,
    path: new opentype.Path(),
  }),
  new opentype.Glyph({
    name: "space",
    unicodes: [32, 160],
    advanceWidth: 250,
    path: new opentype.Path(),
  }),
]
const ids = Array.from({ length: TAKES }, () => [])
for (let take = 0; take < TAKES; take++)
  for (const c of chars) {
    const rand = prng(seedOf(`${FILE}:${c}:${take}`))
    ids[take].push(glyphs.length)
    glyphs.push(
      new opentype.Glyph({
        name: take ? `${name(c)}.take${take + 1}` : name(c),
        unicodes: take ? [] : [...codes.get(c)],
        advanceWidth: advance(c),
        path: glyphPath(drawn[c], rand),
      }),
    )
  }

const font = new opentype.Font({
  familyName: FAMILY,
  styleName: "Regular",
  // CFF wants the PostScript name in plain ASCII, without the ï.
  postScriptName: "NaiveIndieLineSans-Regular",
  // A fixed date, so the same sources always build the same bytes.
  createdTimestamp: Date.UTC(2026, 10, 3) / 1000,
  fullName: `${FAMILY} Regular`,
  unitsPerEm: 1000,
  ascender: 920,
  descender: -240,
  designer: "Fineliner",
  manufacturer: "Fineliner",
  manufacturerURL: "https://naiveindieline.com",
  version: "0.1",
  description:
    "The Fineliner pen as a typeface: monoline capitals with a gentle hand, three takes per letter.",
  license: "MIT License",
  licenseURL:
    "https://github.com/ossianravn/naive-indie-line/blob/main/LICENSE",
  glyphs,
})

// calt: after a first take comes the second, after the second the third, then the first again. Each rule looks back
// one glyph, and a glyph without takes (a space) starts the cycle over.
const coverage = (list) => ({ format: 1, glyphs: list })
const single = (to) => ({
  lookupType: 1,
  lookupFlag: 0,
  subtables: [{ substFormat: 2, coverage: coverage(ids[0]), substitute: to }],
})
const chain = (before, lookup) => ({
  substFormat: 3,
  backtrackCoverage: [coverage(before)],
  inputCoverage: [coverage(ids[0])],
  lookaheadCoverage: [],
  lookupRecords: [{ sequenceIndex: 0, lookupListIndex: lookup }],
})
const langSys = { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [0] }
font.tables.gsub = {
  version: 1,
  scripts: ["DFLT", "latn"].map((tag) => ({
    tag,
    script: { defaultLangSys: langSys, langSysRecords: [] },
  })),
  features: [
    { tag: "calt", feature: { featureParams: 0, lookupListIndexes: [2] } },
  ],
  lookups: [
    single(ids[1]),
    single(ids[2]),
    {
      lookupType: 6,
      lookupFlag: 0,
      subtables: [chain(ids[1], 1), chain(ids[0], 0)],
    },
  ],
}

const otf = addTable(
  new Uint8Array(font.toArrayBuffer()),
  "GPOS",
  kerning(chars, ids, drawn),
)
const out = path.join(root, "public/fonts")
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, `${FILE}.otf`), otf)
const woff2 = await wawoff2.compress(otf)
fs.writeFileSync(path.join(out, `${FILE}.woff2`), woff2)
fs.writeFileSync(
  path.join(root, "src/fineliner/styles/line-sans.generated.css"),
  `/* Generated by tools/fonts/build.mjs: ${FAMILY}, the pen as a typeface (MIT). Do not edit by hand. */
@font-face {
  font-family: "${FAMILY}";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${Buffer.from(woff2).toString("base64")}) format("woff2");
}
`,
)
const kb = (f) => (fs.statSync(path.join(out, f)).size / 1024).toFixed(0)
console.log(
  `${FAMILY}: ${chars.length} glyphs × ${TAKES} takes, otf ${kb(`${FILE}.otf`)} KB, woff2 ${kb(`${FILE}.woff2`)} KB`,
)
