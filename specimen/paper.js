// Unbleached recycled paper as a seamless SVG tile: soft clouding, fine tooth, short fibres and dark flecks, all
// drawn from fixed seeds. A quick stand-in for Patina's layered paper generator (tools/paper/), which Phase 0 ports.
;(function (NIL) {
  "use strict"

  const r1 = (n) => Math.round(n * 10) / 10
  const enc = (svg) => `url("data:image/svg+xml;utf8,${svg.replace(/[%#<>"]/g, (c) => encodeURIComponent(c))}")`
  const SIZE = 480

  /** Draw at (x, y) and again across any edge it is near, so the tile wraps without a seam. */
  function wrapped(x, y, reach, draw) {
    const xs = [0, x < reach ? SIZE : x > SIZE - reach ? -SIZE : null].filter((n) => n !== null)
    const ys = [0, y < reach ? SIZE : y > SIZE - reach ? -SIZE : null].filter((n) => n !== null)
    return xs.flatMap((dx) => ys.map((dy) => draw(x + dx, y + dy))).join("")
  }

  function tile(night) {
    const r = NIL.prng(NIL.seedOf(night ? "paper:night" : "paper:day"))
    const between = (a, b) => a + r() * (b - a)
    const cloud = night ? "1 1 1" : "0.36 0.28 0.16"
    const parts = [
      `<filter id='c' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.006' numOctaves='3' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${cloud.split(" ")[0]}  0 0 0 0 ${cloud.split(" ")[1]}  0 0 0 0 ${cloud.split(" ")[2]}  ${night ? 0.1 : 0.22} 0 0 0 ${night ? -0.04 : -0.08}'/></filter><rect width='100%' height='100%' filter='url(#c)'/>`,
      `<filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${night ? 1 : 0.25}  0 0 0 0 ${night ? 1 : 0.2}  0 0 0 0 ${night ? 1 : 0.12}  ${night ? 0.07 : 0.14} 0 0 0 ${night ? -0.03 : -0.06}'/></filter><rect width='100%' height='100%' filter='url(#t)'/>`,
    ]
    const fibres = night ? 140 : 220
    for (let i = 0; i < fibres; i++) {
      const [x, y] = [r() * SIZE, r() * SIZE]
      const len = between(4, 15)
      const a = r() * Math.PI
      const bend = between(-3, 3)
      const light = r() < (night ? 0.7 : 0.45)
      const colour = light ? (night ? "#e8e2d2" : "#fffaf0") : night ? "#000" : "#6e5a3c"
      const alpha = (light ? between(0.05, night ? 0.12 : 0.4) : between(0.08, 0.2)).toFixed(2)
      parts.push(
        wrapped(x, y, 18, (px, py) => {
          const [dx, dy] = [Math.cos(a) * len, Math.sin(a) * len]
          return `<path d='M${r1(px)} ${r1(py)}q${r1(dx / 2 - dy * bend * 0.08)} ${r1(dy / 2 + dx * bend * 0.08)} ${r1(dx)} ${r1(dy)}' stroke='${colour}' stroke-opacity='${alpha}' stroke-width='${r1(between(0.5, 0.9))}' fill='none' stroke-linecap='round'/>`
        }),
      )
    }
    const flecks = night ? 50 : 90
    for (let i = 0; i < flecks; i++) {
      const [x, y] = [r() * SIZE, r() * SIZE]
      const big = r() < 0.12
      const rx = big ? between(1, 2.2) : between(0.35, 0.9)
      const ry = rx * between(0.5, 1)
      const colour = night ? (r() < 0.5 ? "#d9cfb8" : "#000") : r() < 0.7 ? "#3b2c1b" : "#7a5a32"
      const alpha = between(night ? 0.2 : 0.35, night ? 0.45 : 0.8).toFixed(2)
      const turn = Math.round(r() * 180)
      parts.push(
        wrapped(x, y, 4, (px, py) => `<ellipse cx='${r1(px)}' cy='${r1(py)}' rx='${r1(rx)}' ry='${r1(ry)}' transform='rotate(${turn} ${r1(px)} ${r1(py)})' fill='${colour}' fill-opacity='${alpha}'/>`),
      )
    }
    return enc(`<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>${parts.join("")}</svg>`)
  }

  /** Six wobble filters per hand. Lively variants displace about three times as far as calm ones. */
  function filters() {
    let out = ""
    for (let v = 0; v < 6; v++) {
      const freq = (0.011 + (v % 3) * 0.005).toFixed(3)
      for (const [id, scale] of [
        [`wob-${v + 1}`, 2.4 + (v % 4) * 0.35],
        [`wobc-${v + 1}`, 0.8 + (v % 3) * 0.2],
      ])
        out += `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="1" seed="${v * 7 + 4}"/><feDisplacementMap in="SourceGraphic" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G"/></filter>`
    }
    return out
  }

  NIL.paper = { tile, filters }
})((window.NIL = window.NIL || {}))
