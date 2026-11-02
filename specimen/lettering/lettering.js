// Lettering: words drawn by the pen from the skeleton alphabet, in four faces. Each letter takes a small seeded tilt
// and lift, so the same word reads as hand-lettered and stays the same on every render.
;(function (NIL) {
  "use strict"

  const FACES = {
    liner: { name: "Liner", sx: 1, track: 24, serif: 12 },
    stilt: { name: "Stilt", sx: 0.54, track: 15, serif: 9 },
    ribbon: { name: "Ribbon", sx: 1.04, track: 26, ribbon: 5.5 },
    tramline: { name: "Tramline", sx: 1, track: 28, lines: 4.6 },
  }

  /** Marks that never take serifs. */
  const PLAIN = new Set(["-", "–", "/", "+", "'", ",", "&"])

  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
  const closed = (st) => st.length > 2 && dist(st[0], st[st.length - 1]) < 0.5

  /** Points every `step` units along a stroke. */
  function resample(st, step = 2.5) {
    const out = [st[0]]
    for (let i = 1; i < st.length; i++) {
      const n = Math.max(1, Math.round(dist(st[i - 1], st[i]) / step))
      for (let j = 1; j <= n; j++) out.push([st[i - 1][0] + ((st[i][0] - st[i - 1][0]) * j) / n, st[i - 1][1] + ((st[i][1] - st[i - 1][1]) * j) / n])
    }
    return out
  }

  /** The stroke moved sideways by d along its normals (a ring stays a ring). */
  function offset(st, d) {
    const pts = resample(st)
    const ring = closed(st)
    return pts.map((pt, i) => {
      const a = pts[i > 0 ? i - 1 : ring ? pts.length - 2 : 0]
      const b = pts[i < pts.length - 1 ? i + 1 : ring ? 1 : pts.length - 1]
      const len = dist(a, b) || 1
      return [pt[0] - ((b[1] - a[1]) / len) * d, pt[1] + ((b[0] - a[0]) / len) * d]
    })
  }

  /** Is this end of a stroke free, or does it meet another stroke of the same letter? */
  function free(end, strokes, self) {
    return strokes.every((st, i) => i === self || resample(st, 2).every((pt) => dist(pt, end) > 4))
  }

  /** A short tick across a stroke's free end: the serif. */
  function serif(end, toward, len) {
    const d = dist(end, toward) || 1
    const [nx, ny] = [-(toward[1] - end[1]) / d, (toward[0] - end[0]) / d]
    return [[end[0] - (nx * len) / 2, end[1] - (ny * len) / 2], [end[0] + (nx * len) / 2, end[1] + (ny * len) / 2]]
  }

  function strokeLetter(s, p, face, strokes, plain = false) {
    strokes.forEach((st, i) => {
      if (face.ribbon) {
        const [L, R] = [offset(st, face.ribbon), offset(st, -face.ribbon)]
        if (closed(st)) {
          s.raw(`<path class="wash" fill-rule="evenodd" d="${p.shape(L)}${p.shape(R)}"/>`)
          s.stroke(p.path(L))
          s.stroke(p.path(R))
        } else {
          s.wash(p.shape([...L, ...R.slice().reverse()]))
          s.stroke(p.path(L))
          s.stroke(p.path(R))
          s.stroke(p.line(L[0], R[0]))
          s.stroke(p.line(L[L.length - 1], R[R.length - 1]))
        }
      } else if (face.lines) {
        for (const d of [-face.lines, 0, face.lines]) s.stroke(p.path(offset(st, d)))
      } else {
        s.stroke(p.path(st))
        if (face.serif && !plain && !closed(st))
          for (const [end, toward] of [[st[0], st[1]], [st[st.length - 1], st[st.length - 2]]])
            if (free(end, strokes, i)) s.stroke(p.line(...serif(end, toward, face.serif)))
      }
    })
  }

  /** Draw a word or line in one face. Returns an SVG string named by the text. */
  function draw(text, { face: faceName = "liner", seed = text, hand = "lively" } = {}) {
    const face = FACES[faceName]
    const s = NIL.sheet()
    const p = NIL.pen(`${seed}:${faceName}`, hand)
    const r = NIL.stream(NIL.seedOf(`${seed}:${faceName}`), "letters")
    let x = 14
    for (const ch of text.toUpperCase()) {
      const g = NIL.glyphs[ch] ?? NIL.glyphs["?"]
      const w = g.w * face.sx
      const tilt = (r.signed() * 2.2 * Math.PI) / 180
      const lift = r.signed() * 2
      const c = [x + w / 2, 50]
      const place = ([u, v]) => {
        const [dx, dy] = [x + u * face.sx - c[0], v + 22 + lift - c[1]]
        return [c[0] + dx * Math.cos(tilt) - dy * Math.sin(tilt), c[1] + dx * Math.sin(tilt) + dy * Math.cos(tilt)]
      }
      strokeLetter(s, p, face, g.s.map((st) => st.map(place)), PLAIN.has(ch))
      strokeLetter(s, p, face, (g.m ?? []).map((st) => st.map(place)), true)
      for (const d of g.d ?? []) s.fill(p.disc(place(d), [3.2, 0], [0, 3.2]))
      x += w + face.track
    }
    return s.svg(Math.round(x - face.track + 14), 144, text)
  }

  NIL.lettering = { FACES, draw }
})((window.NIL = window.NIL || {}))
