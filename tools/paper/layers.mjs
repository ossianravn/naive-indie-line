// Paper layers as seamless SVG tiles, from Patina UI. Each layer has its own tile size, and the sizes share no
// factors, so the stacked paper never shows a repeat. Neutral layers (relief, fibres) draw light and dark at low
// alpha and work on any stock; tinted layers (mottle, specks) take the stock's colour.

const enc = (svg) =>
  `url("data:image/svg+xml;utf8,${svg.replace(/[%#<>"]/g, (c) => encodeURIComponent(c))}")`
const tile = (size, body) =>
  enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`,
  )
const r1 = (n) => Math.round(n * 10) / 10

export function prng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const filter = (id, body) =>
  `<filter id='${id}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>${body}</filter><rect width='100%' height='100%' filter='url(#${id})'/>`
const turbulence = (freq, octaves, seed) =>
  `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>`

/** Relief: noise as a height map, embossed with wrapped edges (no seams) into highlights and shadows. */
export function relief(size, freq, seed, depth, shade = [0.25, 0.19, 0.11]) {
  const emboss = `${turbulence(freq, 3, seed)}<feColorMatrix values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1'/><feConvolveMatrix order='3' kernelMatrix='-2 -1 0 -1 0 1 0 1 2' divisor='1' bias='0.5' edgeMode='wrap' preserveAlpha='true'/>`
  const light = `${emboss}<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.97  ${depth} 0 0 0 ${-depth * 0.5}'/>`
  const dark = `${emboss}<feColorMatrix values='0 0 0 0 ${shade[0]}  0 0 0 0 ${shade[1]}  0 0 0 0 ${shade[2]}  ${-depth} 0 0 0 ${depth * 0.5}'/>`
  return tile(size, filter("l", light) + filter("d", dark))
}

/** Fibres: short curved strands at seeded places and angles, drawn again across the edges so the tile wraps. */
export function fibres(size, count, seed, palette) {
  const r = prng(seed)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = r() * size
    const y = r() * size
    const a = r() * Math.PI * 2
    const len = 5 + r() ** 2 * 22
    const bend = (r() - 0.5) * len * 0.6
    const [color, alpha] = palette[Math.floor(r() * palette.length)]
    const ex = x + Math.cos(a) * len
    const ey = y + Math.sin(a) * len
    const cx = (x + ex) / 2 - Math.sin(a) * bend
    const cy = (y + ey) / 2 + Math.cos(a) * bend
    const style = `stroke='${color}' stroke-opacity='${Math.round(alpha * (0.5 + r() * 0.5) * 100) / 100}' stroke-width='${r1(0.35 + r() * 0.55)}'`
    for (const dx of [-size, 0, size])
      for (const dy of [-size, 0, size]) {
        const outside =
          Math.max(x, ex) + dx < -2 ||
          Math.min(x, ex) + dx > size + 2 ||
          Math.max(y, ey) + dy < -2 ||
          Math.min(y, ey) + dy > size + 2
        if (!outside)
          out.push(
            `<path d='M${r1(x + dx)} ${r1(y + dy)}Q${r1(cx + dx)} ${r1(cy + dy)} ${r1(ex + dx)} ${r1(ey + dy)}' ${style}/>`,
          )
      }
  }
  return tile(size, `<g fill='none' stroke-linecap='round'>${out.join("")}</g>`)
}

/** Tinted noise: alpha = a × noise + b, so low frequencies mottle and a steep slope keeps only rare specks. */
export function tinted(size, freq, octaves, seed, rgb, a, b) {
  return tile(
    size,
    filter(
      "n",
      `${turbulence(freq, octaves, seed)}<feColorMatrix values='0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  ${a} 0 0 0 ${b}'/>`,
    ),
  )
}

/** Flecks: dark inclusions in recycled paper, mostly specks with the odd larger chip, drawn again across the edges. */
export function flecks(size, count, seed, palette) {
  const r = prng(seed)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = r() * size
    const y = r() * size
    const chip = r() < 0.1
    const rx = chip ? 0.9 + r() * 1.3 : 0.3 + r() * 0.55
    const ry = rx * (0.45 + r() * 0.55)
    const turn = Math.round(r() * 180)
    const [color, alpha] = palette[Math.floor(r() * palette.length)]
    const opacity = Math.round(alpha * (0.55 + r() * 0.45) * 100) / 100
    for (const dx of [-size, 0, size])
      for (const dy of [-size, 0, size]) {
        const [cx, cy] = [x + dx, y + dy]
        if (cx < -4 || cx > size + 4 || cy < -4 || cy > size + 4) continue
        out.push(
          `<ellipse cx='${r1(cx)}' cy='${r1(cy)}' rx='${r1(rx)}' ry='${r1(ry)}' transform='rotate(${turn} ${r1(cx)} ${r1(cy)})' fill='${color}' fill-opacity='${opacity}'/>`,
        )
      }
  }
  return tile(size, out.join(""))
}
