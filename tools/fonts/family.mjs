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
 * spec: { family, postScript, description, chars, codes, takes, advance(c), path(c, take) → opentype.Path, style? }.
 * style: { name, weight, italic } for a Bold, Italic or Bold Italic beside the Regular; the Regular's bytes are as before.
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
    styleName: spec.style?.name ?? "Regular",
    // CFF wants the PostScript name in plain ASCII, without the ï.
    postScriptName: spec.postScript,
    // A fixed date, so the same sources always build the same bytes.
    createdTimestamp: Date.UTC(2026, 10, 3) / 1000,
    fullName: `${spec.family} ${spec.style?.name ?? "Regular"}`,
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
  let otf = addTable(kerned, "OS/2", os2)
  if (spec.style && spec.style.name !== "Regular") otf = styled(otf, spec.style)
  // wawoff2 returns a view into its WebAssembly heap, which the next compress overwrites: keep a copy.
  return { otf, woff2: Uint8Array.from(await wawoff2.compress(otf)) }
}

/**
 * Mark a Bold, Italic or Bold Italic so apps link it to its Regular: the weight class and fsSelection in OS/2, macStyle
 * in head, and the italic angle (degrees, leaning right) in post.
 */
function styled(font, { weight, italic, angle = 10 }) {
  const bold = weight >= 700
  const os2 = getTable(font, "OS/2")
  const o = new DataView(os2.buffer)
  o.setUint16(4, weight)
  o.setUint16(
    62,
    (o.getUint16(62) & ~0x61) | (italic ? 0x01 : 0) | (bold ? 0x20 : 0),
  )
  font = addTable(font, "OS/2", os2)
  const head = getTable(font, "head")
  const h = new DataView(head.buffer)
  h.setUint16(44, (bold ? 1 : 0) | (italic ? 2 : 0))
  font = addTable(font, "head", head)
  if (!italic) return font
  const post = getTable(font, "post")
  new DataView(post.buffer).setInt32(4, -angle * 65536)
  return addTable(font, "post", post)
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
export const fontFace = (family, woff2, style) => `@font-face {
  font-family: "${family}";
  font-style: ${style?.italic ? "italic" : "normal"};
  font-weight: ${style?.weight ?? 400};
  font-display: swap;
  src: url(data:font/woff2;base64,${Buffer.from(woff2).toString("base64")}) format("woff2");
}
`
