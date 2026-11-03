#!/usr/bin/env node
// Render Fineliner drawings large, as one contact sheet, so you can look at a new drawing before anyone else does.
// Run it from the project's root. It loads the kit's pen engine and your drawings module with jiti (TypeScript, the
// "@/" alias), draws every id at every seed and hand, and writes a PNG through sharp or a local Chrome or Edge, or an
// HTML page when neither is there. It warns about NaN coordinates and about objects that run off their tiles.
//
//   node render.mjs --module src/drawings/index.ts --ids stool,scene:shop --seeds a,b,c,d
//
//   --module  your drawings module (registers your objects and scenes); leave out to render kit drawings only
//   --ids     object ids, and scenes as scene:<name>; comma separated
//   --seeds   comma separated (default a,b,c,d)
//   --hands   lively, calm or both (default lively,calm)
//   --cell    size of one object cell in px (default 260; a scene takes two cells)
//   --out     .png or .html (default drawings-check.png)
//   --kit     the pen engine (default src/fineliner/pen/index.ts)
//   --src     what "@/" points at (default src)
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const list = (text) =>
  text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

const root = process.cwd()
const ids = list(arg("ids", ""))
const seeds = list(arg("seeds", "a,b,c,d"))
const hands = list(arg("hands", "lively,calm"))
const cell = Number(arg("cell", "260"))
const out = path.resolve(root, arg("out", "drawings-check.png"))
const kit = path.resolve(root, arg("kit", "src/fineliner/pen/index.ts"))
const src = path.resolve(root, arg("src", "src"))
const mod = arg("module")

if (!ids.length) {
  console.error("render.mjs: pass --ids, e.g. --ids stool,scene:shop")
  process.exit(1)
}

// Packages come from the project, so the script works wherever the skill is installed.
const projectRequire = createRequire(path.join(root, "package.json"))
const load = async (name) => {
  try {
    return await import(pathToFileURL(projectRequire.resolve(name)).href)
  } catch {
    return undefined
  }
}
const jitiModule = await load("jiti")
const createJiti = jitiModule?.createJiti ?? jitiModule?.default?.createJiti
if (!createJiti) {
  console.error(
    "render.mjs needs jiti in this project: npm install -D jiti (and sharp, for a PNG)",
  )
  process.exit(1)
}
const jiti = createJiti(pathToFileURL(path.join(root, "render.mjs")).href, {
  alias: { "@/": `${src.replaceAll("\\", "/")}/` },
})
const pen = await jiti.import(kit)
if (mod) await jiti.import(path.resolve(root, mod))

const PEN = "#263152"
const PAPER = "#f4f0e6"
const WASH = "#5b72a8"
const LABEL = 18

// Every cell becomes a nested <svg> in one sheet. Mask ids are made unique per cell, since the same drawing in two
// hands would otherwise share them.
const cells = []
const missing = []
for (const id of ids)
  for (const seed of seeds)
    for (const hand of hands) {
      const scene = id.startsWith("scene:") ? id.slice(6) : undefined
      let svg
      try {
        svg = pen.drawing(
          scene ? { scene, seed, hand } : { object: id, seed, hand },
        )[0]
      } catch (error) {
        missing.push(`${id}: ${error.message}`)
        break
      }
      if (svg.includes("NaN"))
        missing.push(`${id} at seed ${seed} (${hand}) has NaN coordinates`)
      else if (!scene) {
        const off = outside(svg)
        if (off) missing.push(`${id} at seed ${seed} (${hand}) ${off}`)
      }
      cells.push({
        id,
        seed,
        hand,
        svg,
        wide: scene ? 2 : 1,
        index: cells.length,
      })
    }
if (missing.length) console.error([...new Set(missing)].join("\n"))
if (!cells.length) process.exit(1)

const cols = Math.max(2, Math.min(6, seeds.length * hands.length))
let x = 0
let y = 0
const placed = cells.map((c) => {
  if (x + c.wide > cols) {
    x = 0
    y++
  }
  const at = { ...c, x: x * cell, y: y * (cell + LABEL) }
  x += c.wide
  return at
})
const width = cols * cell
const height = (y + 1) * (cell + LABEL)

let styles = `.lbl{font:12px ui-monospace,monospace;fill:#777}`
const body = placed
  .map((c) => {
    const [, vw, vh] = c.svg
      .match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
      .map(Number)
    const room = c.wide * cell - 24
    const scale = Math.min(room / vw, (cell - 24) / vh)
    // The kit's lines keep one screen weight at any size (non-scaling strokes); here the cell's scale does that.
    styles += `.c${c.index} .ln{fill:none;stroke:${PEN};stroke-width:${(1.35 / scale).toFixed(3)};stroke-linecap:round;stroke-linejoin:round}`
    styles += `.c${c.index} .ink{fill:${PEN};stroke:${PEN};stroke-width:${(1.35 / scale).toFixed(3)};stroke-linejoin:round}`
    const inner = c.svg
      .replace(/id="([^"]+)"/g, `id="c${c.index}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#c${c.index}-$1)`)
      .replace(
        /<svg[^>]*?(viewBox="[^"]+")[^>]*>/,
        (_, box) =>
          `<svg x="${c.x + 12}" y="${c.y + 12}" width="${(vw * scale).toFixed(1)}" height="${(vh * scale).toFixed(1)}" ${box} overflow="visible">`,
      )
    const label = `<text class="lbl" x="${c.x + 12}" y="${c.y + cell + 10}">${c.id} · ${c.seed} · ${c.hand}</text>`
    return `<g class="c${c.index}">${inner}${label}</g>`
  })
  .join("")
styles += `.wash{fill:${WASH}}.sheet-fill{fill:${PAPER}}`
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>${styles}</style><rect width="100%" height="100%" fill="${PAPER}"/>${body}</svg>`

const html = out.replace(/\.png$/, ".html")
fs.writeFileSync(
  html,
  `<!doctype html><meta charset="utf-8"><title>Drawings</title><body style="margin:0;background:${PAPER}">${sheet}`,
)

// A PNG through sharp if the project has it, or through a Chrome or Edge on this machine, headless. Otherwise the HTML.
if (out.endsWith(".png")) {
  const sharpModule = await load("sharp")
  const sharp = sharpModule?.default ?? sharpModule
  if (typeof sharp === "function") {
    await sharp(Buffer.from(sheet)).png().toFile(out)
    fs.rmSync(html)
    console.log(`wrote ${out} (${cells.length} drawings)`)
    process.exit(0)
  }
  const browser = findBrowser()
  if (browser) {
    // Its own throwaway profile, so a browser the user has open is left alone.
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), "fineliner-render-"))
    spawnSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        `--user-data-dir=${profile}`,
        `--window-size=${width},${height}`,
        `--screenshot=${out}`,
        pathToFileURL(html).href,
      ],
      { stdio: "ignore", timeout: 60_000 },
    )
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3 })
    if (fs.existsSync(out)) {
      fs.rmSync(html)
      console.log(
        `wrote ${out} (${cells.length} drawings, through ${path.basename(browser)})`,
      )
      process.exit(0)
    }
  }
  console.error(
    "no sharp in this project and no Chrome or Edge found (set CHROME_PATH), so the sheet is HTML only",
  )
}
console.log(`wrote ${html} (${cells.length} drawings); open it in a browser`)

/** Whether an object's ink comes closer than 4 px to its tile's edge (or past it), from the path coordinates. */
function outside(svg) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number)
  const body = svg.replace(/<defs>[\s\S]*?<\/defs>/, "")
  const xs = []
  const ys = []
  for (const [, d] of body.matchAll(/ d="([^"]+)"/g))
    for (const [, x, y] of d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)) {
      xs.push(Number(x))
      ys.push(Number(y))
    }
  if (!xs.length) return ""
  const box = [
    Math.min(...xs),
    Math.min(...ys),
    Math.max(...xs),
    Math.max(...ys),
  ]
  const air = Math.min(box[0], box[1], w - box[2], h - box[3])
  return air < 4
    ? `runs to ${air.toFixed(1)} px from its ${w}×${h} tile's edge (ink from ${box.map((n) => n.toFixed(0)).join(", ")}); widen the tile or move at`
    : ""
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ...[
      "google-chrome",
      "google-chrome-stable",
      "chromium",
      "chromium-browser",
      "microsoft-edge",
    ].flatMap((name) =>
      (process.env.PATH ?? "")
        .split(path.delimiter)
        .map((dir) => path.join(dir, name)),
    ),
  ]
  return candidates.find((file) => file && fs.existsSync(file))
}
