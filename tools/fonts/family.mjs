// One font file from a glyph set: every glyph in three takes that rotate through `calt` (after a first take comes the
// second, then the third, then the first again; a glyph without takes, such as a space, starts the cycle over), the
// cmap, class kerning as a GPOS table, and the OTF and WOFF2 bytes. Two families built from the same set and the same
// advances shape a string identically, so their layers line up.
import opentype from "opentype.js"
import wawoff2 from "wawoff2"
import { kerning } from "./kerning.mjs"
import { addTable, getTable } from "./sfnt.mjs"

const name = (c) =>
  `uni${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`

/**
 * spec: { family, postScript, description, chars, codes, takes, advance(c), path(c, take) → opentype.Path }.
 * Returns { otf, woff2 } as Uint8Arrays.
 */
export async function buildFamily(spec) {
  const { chars, codes, takes } = spec
  const glyphs = [
    new opentype.Glyph({
      name: ".notdef",
      advanceWidth: 500,
      path: new opentype.Path(),
    }),
    new opentype.Glyph({
      name: "space",
      unicodes: [32, 160],
      advanceWidth: spec.space ?? 250,
      path: new opentype.Path(),
    }),
  ]
  const ids = Array.from({ length: takes }, () => [])
  for (let take = 0; take < takes; take++)
    for (const c of chars) {
      ids[take].push(glyphs.length)
      glyphs.push(
        new opentype.Glyph({
          name: take ? `${name(c)}.take${take + 1}` : name(c),
          unicodes: take ? [] : [...codes.get(c)],
          advanceWidth: spec.advance(c),
          path: spec.path(c, take),
        }),
      )
    }

  const font = new opentype.Font({
    familyName: spec.family,
    styleName: "Regular",
    // CFF wants the PostScript name in plain ASCII, without the ï.
    postScriptName: spec.postScript,
    // A fixed date, so the same sources always build the same bytes.
    createdTimestamp: Date.UTC(2026, 10, 3) / 1000,
    fullName: `${spec.family} Regular`,
    unitsPerEm: 1000,
    ascender: 920,
    descender: -240,
    designer: "Fineliner",
    manufacturer: "Fineliner",
    manufacturerURL: "https://naiveindieline.com",
    version: "0.1",
    description: spec.description,
    license: "MIT License",
    licenseURL:
      "https://github.com/ossianravn/naive-indie-line/blob/main/LICENSE",
    glyphs,
  })

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

  const kerned = addTable(
    new Uint8Array(font.toArrayBuffer()),
    "GPOS",
    kerning(chars, ids),
  )
  // Line metrics from the design, not from the tallest glyph: opentype.js sets the Windows ascent from glyph bounds,
  // and browsers on Windows place the baseline by it unless USE_TYPO_METRICS (fsSelection bit 7) says otherwise.
  const os2 = getTable(kerned, "OS/2")
  const view = new DataView(os2.buffer)
  view.setUint16(62, view.getUint16(62) | 0x80)
  view.setUint16(74, 1000)
  view.setUint16(76, 300)
  const otf = addTable(kerned, "OS/2", os2)
  return { otf, woff2: await wawoff2.compress(otf) }
}

/** A path from fitted contours ([start, ...[c1, c2, end]]). */
export function toPath(contours) {
  const path = new opentype.Path()
  for (const [start, ...segments] of contours) {
    path.moveTo(...start)
    for (const [c1, c2, p] of segments) path.curveTo(...c1, ...c2, ...p)
    path.close()
  }
  return path
}

/** An @font-face rule carrying the WOFF2 inside it. */
export const fontFace = (family, woff2) => `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${Buffer.from(woff2).toString("base64")}) format("woff2");
}
`
