// The pen. Every line in Naive Indie Line is one thin monoline stroke with a slow hand wobble, drawn from a seed,
// so the same seed always draws the same line. A specimen prototype of the Phase 1 engine; the seed functions are
// Patina UI's (src/patina/ink/seed.ts).
;(function (NIL) {
  "use strict"

  /** FNV-1a over UTF-16 code units, reduced to 31 bits. */
  function seedOf(text) {
    let h = 2166136261
    for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    return (h >>> 0) % 2147483648
  }

  /** A small seeded PRNG (mulberry32 family) returning values in [0, 1). */
  function prng(seed) {
    let s = seed >>> 0
    return () => {
      s = (s + 0x6d2b79f5) >>> 0
      let t = s
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const fork = (seed, label) => seedOf(`${seed}:${label}`)

  function stream(seed, label) {
    const next = prng(fork(seed, label))
    return {
      next,
      between: (a, b) => a + next() * (b - a),
      signed: () => next() * 2 - 1,
      pick: (items) => items[Math.floor(next() * items.length)],
      chance: (p) => next() < p,
    }
  }

  // How far a hand strays. amp: slow wobble in px; wave: its wavelength; tremor: fine shake; over: how far a line
  // may run past its end (negative values stop short); loop: extra turn on a drawn circle, in radians.
  const HANDS = {
    calm: { amp: 0.35, wave: 60, tremor: 0.08, over: 1.2, loop: 0.12 },
    lively: { amp: 1.1, wave: 40, tremor: 0.18, over: 4.5, loop: 0.45 },
  }

  const r1 = (n) => Math.round(n * 10) / 10
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])

  /** Slow 1D noise along a line: random offsets at knots `wave` apart, eased between them. */
  function noise(rand, length, wave, amp) {
    const n = Math.ceil(length / wave) + 2
    const knots = Array.from({ length: n }, () => (rand() * 2 - 1) * amp)
    return (s) => {
      const t = Math.max(0, s) / wave
      const i = Math.min(Math.floor(t), n - 2)
      const u = (1 - Math.cos((t - i) * Math.PI)) / 2
      return knots[i] * (1 - u) + knots[i + 1] * u
    }
  }

  /** Points every `step` px along a polyline, with their distance from the start. */
  function resample(points, step) {
    const out = [[points[0][0], points[0][1], 0]]
    let s = 0
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1]
      const b = points[i]
      const len = dist(a, b)
      const n = Math.max(1, Math.round(len / step))
      for (let j = 1; j <= n; j++) {
        const f = j / n
        out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, s + len * f])
      }
      s += len
    }
    return out
  }

  function toPath(points, closed) {
    const d = points.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`).join("")
    return closed ? `${d}Z` : d
  }

  /** A pen with a hand. Each call draws the next stroke from the pen's own stream. */
  function pen(seed, handName = "lively") {
    const hand = HANDS[handName] ?? HANDS.lively
    const rand = prng(fork(seedOf(seed), "pen"))
    const between = (a, b) => a + rand() * (b - a)

    /** Offset a polyline along its normals by slow wobble plus tremor. `closed` makes the offsets meet. */
    function trace(points, closed = false) {
      const pts = resample(points, 3)
      const length = pts[pts.length - 1][2] || 1
      const slow = noise(rand, length, hand.wave * between(0.8, 1.25), hand.amp)
      const fine = noise(rand, length, 7, hand.tremor)
      const end = slow(length) + fine(length)
      const start = slow(0) + fine(0)
      return pts.map(([x, y, s], i) => {
        const a = pts[Math.max(0, i - 1)]
        const b = pts[Math.min(pts.length - 1, i + 1)]
        const len = dist(a, b) || 1
        let off = slow(s) + fine(s)
        if (closed) off -= ((end - start) * s) / length
        return [x - ((b[1] - a[1]) / len) * off, y + ((b[0] - a[0]) / len) * off]
      })
    }

    /** Run the first and last segment on past their ends (or stop short), as a quick hand does. */
    function overshoot(points) {
      const pts = points.map((p) => [...p])
      const extend = (p, q) => {
        const len = dist(p, q) || 1
        const o = between(-0.25, 1) * hand.over
        p[0] += ((p[0] - q[0]) / len) * o
        p[1] += ((p[1] - q[1]) / len) * o
      }
      extend(pts[0], pts[1])
      extend(pts[pts.length - 1], pts[pts.length - 2])
      return pts
    }

    /** Points round an ellipse given as centre plus two axis vectors (any affine circle). */
    function round(c, u, v, from, turn) {
      const span = Math.hypot(...u) + Math.hypot(...v)
      const n = Math.max(12, Math.round((span * turn) / 4))
      return Array.from({ length: n + 1 }, (_, i) => {
        const t = from + (turn * i) / n
        return [c[0] + u[0] * Math.cos(t) + v[0] * Math.sin(t), c[1] + u[1] * Math.cos(t) + v[1] * Math.sin(t)]
      })
    }

    return {
      hand: handName,
      next: rand,
      /** One straight stroke. */
      line: (a, b) => toPath(trace(overshoot([a, b]))),
      /** A smooth open stroke through points. */
      path: (points) => toPath(trace(overshoot(points))),
      /** A closed polygon drawn edge by edge, so corners cross or fall short. */
      edges(points, closed = true) {
        const ring = closed ? [...points, points[0]] : points
        let d = ""
        for (let i = 1; i < ring.length; i++) d += toPath(trace(overshoot([ring[i - 1], ring[i]])))
        return d
      },
      /** A closed outline in one stroke, for fills and blanks. */
      shape: (points) => toPath(trace([...points, points[0]], true), true),
      /** A drawn ellipse: the pen goes a little past where it started. */
      ring(c, u, v = [0, u[0]]) {
        const from = between(0, Math.PI * 2)
        return toPath(trace(round(c, u, v, from, Math.PI * 2 + between(0.3, 1) * hand.loop)))
      },
      /** A closed ellipse outline, for solid discs. */
      disc(c, u, v = [0, u[0]]) {
        const pts = round(c, u, v, between(0, Math.PI * 2), Math.PI * 2)
        return toPath(trace(pts.slice(0, -1).concat([pts[0]]), true), true)
      },
      round,
    }
  }

  let sheets = 0

  /**
   * A drawing in layers of paths. `blank` hides everything drawn before it inside a shape (a mask, so the paper's
   * texture still shows), which is how a figure stands in front of a wall line. Paths drawn between two blanks form
   * one layer, masked once by every blank that came after it.
   */
  function sheet() {
    const id = `nil-${++sheets}`
    const layers = [[]]
    const blanks = []
    const add = (cls) => (d) => layers[layers.length - 1].push(`<path class="${cls}" d="${d}"/>`)
    return {
      stroke: add("ln"),
      fill: add("ink"),
      wash: add("wash"),
      paper: add("sheet-fill"),
      /** Markup the helpers above cannot express, such as an even-odd ring. */
      raw: (markup) => layers[layers.length - 1].push(markup),
      blank(d) {
        if (layers.every((l) => !l.length)) return
        blanks.push(d)
        layers.push([])
      },
      svg(width, height, label) {
        const name = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`
        const pad = 24
        const box = `x="${-pad}" y="${-pad}" width="${width + 2 * pad}" height="${height + 2 * pad}"`
        let defs = ""
        let body = ""
        layers.forEach((paths, i) => {
          if (!paths.length) return
          const after = blanks.slice(i)
          if (!after.length) return void (body += paths.join(""))
          const holes = after.map((d) => `<path d="${d}"/>`).join("")
          defs += `<mask id="${id}-m${i}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><g fill="#000">${holes}</g></mask>`
          body += `<g mask="url(#${id}-m${i})">${paths.join("")}</g>`
        })
        return `<svg class="doodle" viewBox="0 0 ${width} ${height}" ${name}><defs>${defs}</defs>${body}</svg>`
      },
    }
  }

  NIL.seedOf = seedOf
  NIL.prng = prng
  NIL.fork = fork
  NIL.stream = stream
  NIL.pen = pen
  NIL.sheet = sheet
  NIL.HANDS = HANDS
})((window.NIL = window.NIL || {}))
