// Checks every pen against every paper surface it can sit on, with the paper composited in: for each stock and theme
// it stacks the texture layers at their own tile sizes over paper and the recessed paper-2, blurs to about a glyph so
// single flecks average out, and measures each pen against the darkest and lightest 1% of the surface. Text needs
// 4.5:1; every pen is also the reading ink, so every pen is held to it. The custom pen is checked round the whole hue
// circle at full strength, converted from OKLCH and clipped to sRGB. The wash is art only and is not checked.
// Exits 1 if any pair falls below its floor. Ported from Patina UI's checker.
//
//   npm run check:contrast
import { readFileSync } from "node:fs"
import sharp from "sharp"

const STYLES = new URL("../src/fineliner/styles/", import.meta.url)
const css = ["stocks.css", "textures.generated.css"].map((f) =>
  readFileSync(new URL(f, STYLES), "utf8"),
)

const STOCKS = ["recycled", "kraft", "bond"]
const THEMES = ["day", "night"]
const SURFACES = ["paper", "paper-2"]
const TEXT = [
  "pen-navy",
  "pen-black",
  "pen-sepia",
  "pen-forest",
  "pen-oxblood",
  "correction",
]
const SIZES = {
  flecks: 719,
  fibres: 613,
  tooth: 353,
  relief: 541,
  mottle: 1201,
}
const LAYERS = Object.keys(SIZES)
const HUES = Array.from({ length: 36 }, (_, k) => k * 10)
const CANVAS = 1201

// Top-level rules only.
function rules(source, order) {
  const out = []
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "")
  let i = 0
  while (i < text.length) {
    const open = text.indexOf("{", i)
    if (open < 0) break
    const selector = text.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (depth && j < text.length)
      ((depth += text[j] === "{" ? 1 : text[j] === "}" ? -1 : 0), j++)
    if (!selector.startsWith("@")) {
      const decls = Object.fromEntries(
        [
          ...text
            .slice(open + 1, j - 1)
            .matchAll(/(--[\w-]+)\s*:\s*((?:url\("[^"]*"\)|[^;])+);/g),
        ].map((m) => [m[1], m[2].trim()]),
      )
      for (const s of selector.split(","))
        out.push({ selector: s.trim(), decls, order: order + out.length })
    }
    i = j
  }
  return out
}

const all = css.flatMap((source, n) => rules(source, n * 10000))

function tokens(stock, theme) {
  const attrs = { "data-stock": stock, "data-theme": theme }
  const matching = all.filter(
    ({ selector }) =>
      selector.startsWith(":root") &&
      [...selector.matchAll(/\[([\w-]+)="([^"]+)"\]/g)].every(
        ([, k, v]) => attrs[k] === v,
      ),
  )
  matching.sort(
    (a, b) =>
      a.selector.split("[").length - b.selector.split("[").length ||
      a.order - b.order,
  )
  const vars = Object.assign({}, ...matching.map((r) => r.decls))
  return (name) => vars[`--${name}`] ?? ""
}

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
const channel = (c) =>
  (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
// OKLCH to an sRGB hex, each channel clipped (Björn Ottosson's matrices).
function oklchHex(l, c, h) {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const [L, M, S] = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3)
  const linear = [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ]
  const encode = (v) => {
    const x = Math.min(1, Math.max(0, v))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  }
  return `#${linear
    .map((v) =>
      Math.round(encode(v) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`
}

const svgOf = (url) =>
  Buffer.from(
    decodeURIComponent(
      url.replace(/^url\("data:image\/svg\+xml;utf8,/, "").replace(/"\)$/, ""),
    ),
  )

async function extremes(color, t) {
  const [r, g, b] = hex(color)
  const overlays = []
  for (const name of [...LAYERS].reverse()) {
    const size = SIZES[name]
    const side = Math.min(size, CANVAS)
    const png = await sharp(svgOf(t(`tex-${name}`)))
      .resize(size, size)
      .extract({ left: 0, top: 0, width: side, height: side })
      .png()
      .toBuffer()
    overlays.push({ input: png, tile: true, gravity: "northwest" })
  }
  const { data, info } = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 3,
      background: { r, g, b },
    },
  })
    .composite(overlays)
    .blur(3)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const lum = []
  for (let p = 0; p < data.length; p += info.channels * 3)
    lum.push(luminance([data[p], data[p + 1], data[p + 2]]))
  lum.sort((x, y) => x - y)
  return [
    lum[Math.floor(lum.length * 0.01)],
    lum[Math.floor(lum.length * 0.99)],
  ]
}

let failures = 0
for (const stock of STOCKS)
  for (const theme of THEMES) {
    const t = tokens(stock, theme)
    const notes = []
    let min = Infinity
    const custom = HUES.map((hue) => [
      `custom@${hue}`,
      oklchHex(+t("custom-lightness"), +t("custom-chroma"), hue),
    ])
    const pens = [...TEXT.map((name) => [name, t(name)]), ...custom]
    for (const surface of SURFACES) {
      const [dark, light] = await extremes(t(surface), t)
      for (const [name, color] of pens) {
        const l = luminance(hex(color))
        const r = Math.min(ratio(l, dark), ratio(l, light))
        min = Math.min(min, r / 4.5)
        if (r < 4.5)
          (failures++, notes.push(`${surface}/${name} ${r.toFixed(2)}<4.5`))
      }
    }
    console.log(
      `${stock.padEnd(8)} ${theme.padEnd(5)} ${notes.length ? `FAIL ${notes.join(", ")}` : `ok (closest pair at ${min.toFixed(2)}× its floor)`}`,
    )
  }

console.log(
  failures
    ? `\n${failures} pairs below their floor`
    : "\nall pairs meet their floor",
)
process.exit(failures ? 1 : 0)
