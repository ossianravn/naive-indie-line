// Renders the kit's four scenes, two by two on bond paper in the navy pen, as docs/style/scenes.webp for the README.
// The same seeds draw the same picture, so the image only changes when a scene or an object does.
//   node tools/render-scenes.mjs
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const { drawing } = await createJiti(import.meta.url).import(
  path.join(root, "src/fineliner/pen/index.ts"),
)

// Bond paper and the navy pen and wash (src/fineliner/styles/stocks.css).
const [PAPER, PEN, WASH] = ["#f4f0e6", "#263152", "#5b72a8"]
const SCENES = [
  ["room", "corner-shop"],
  ["studio", "readme-studio"],
  ["bistro", "readme-bistro"],
  ["work", "readme-work"],
]
const [W, H, SCALE, GAP] = [640, 440, 1.2, 36]
const style = `<style>.ln{fill:none;stroke:${PEN};stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.ink{fill:${PEN};stroke:${PEN};stroke-width:1.5;stroke-linejoin:round}.wash{fill:${WASH}}.sheet-fill{fill:${PAPER}}</style>`

const tiles = await Promise.all(
  SCENES.map(async ([scene, seed]) => {
    const svg = drawing({ scene, seed, title: "" })[0]
      .replace(
        /^<svg /,
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W * SCALE}" height="${H * SCALE}" `,
      )
      .replace(/(<svg[^>]*>)/, `$1${style}`)
    return sharp(Buffer.from(svg)).png().toBuffer()
  }),
)
const [cw, ch] = [Math.round(W * SCALE), Math.round(H * SCALE)]
const out = path.join(root, "docs/style/scenes.webp")
await sharp({
  create: {
    width: cw * 2 + GAP * 3,
    height: ch * 2 + GAP * 3,
    channels: 3,
    background: PAPER,
  },
})
  .composite(
    tiles.map((input, i) => ({
      input,
      left: GAP + (i % 2) * (cw + GAP),
      top: GAP + Math.floor(i / 2) * (ch + GAP),
    })),
  )
  .webp({ quality: 88 })
  .toFile(out)
console.log(`wrote ${path.relative(root, out)}`)
