// Plants, pictures on the wall and the people who are not quite there: a shirt and trousers with nobody in them.
;(function (NIL) {
  "use strict"

  const { add, lerp, dot } = NIL.things
  const deg = Math.PI / 180

  /** A leaf from its base along `angle` (0 = straight up), drooping as it goes. */
  function leaf(s, p, base, angle, len) {
    const dir = [Math.sin(angle), -Math.cos(angle)]
    const nrm = [-dir[1], dir[0]]
    const width = len * 0.34
    const sag = len * 0.28
    const at = (t, side) =>
      add(add(base, dir, len * t), nrm, side * width * Math.sin(Math.PI * Math.pow(t, 0.8))).map((n, i) =>
        i ? n + sag * t * t : n,
      )
    const n = 10
    const one = Array.from({ length: n + 1 }, (_, i) => at(i / n, 1))
    const two = Array.from({ length: n + 1 }, (_, i) => at(1 - i / n, -1))
    s.blank(p.shape([...one, ...two.slice(1)]))
    s.stroke(p.path([...one, ...two.slice(1)]))
    s.stroke(p.path(Array.from({ length: 5 }, (_, i) => at((i / 4) * 0.8, 0))))
  }

  function plant(s, p, r, at, k = 1, kind = r.pick(["sunflower", "leafy"])) {
    const [x, y] = at
    const top = 25 * k
    const bot = 18 * k
    const h = 36 * k
    const rim = 8 * k
    const body = [
      [x - bot, y],
      [x + bot, y],
      [x + top, y - h + rim],
      [x - top, y - h + rim],
    ]
    const band = [
      [x - top - 2 * k, y - h + rim],
      [x + top + 2 * k, y - h + rim],
      [x + top + 2 * k, y - h],
      [x - top - 2 * k, y - h],
    ]
    const height = (kind === "sunflower" ? r.between(105, 135) : r.between(55, 75)) * k
    const bend = r.signed() * 16 * k
    const stem = (t) => [x + bend * t * t, y - h - height * t]
    s.stroke(p.path(Array.from({ length: 7 }, (_, i) => stem(i / 6))))
    const leaves = kind === "sunflower" ? 2 + Math.floor(r.next() * 2) : 5 + Math.floor(r.next() * 3)
    for (let i = 0; i < leaves; i++) {
      const side = i % 2 ? 1 : -1
      const t = kind === "sunflower" ? 0.22 + (i * 0.5) / leaves : 0.15 + (i * 0.85) / leaves
      const angle = side * r.between(45, kind === "sunflower" ? 100 : 80) * deg
      leaf(s, p, stem(t), angle, r.between(kind === "sunflower" ? 32 : 24, kind === "sunflower" ? 46 : 38) * k)
    }
    if (kind === "sunflower") {
      const c = stem(1)
      const n = 18 + Math.floor(r.next() * 6)
      const star = Array.from({ length: n * 2 }, (_, i) => {
        const a = (i * Math.PI) / n + r.next() * 0.05
        const rad = (i % 2 ? 11 : r.between(20, 24)) * k
        return add(c, [Math.cos(a), Math.sin(a)], rad)
      })
      s.blank(p.shape(star))
      s.stroke(p.path([...star, star[0]]))
      s.stroke(p.ring(...dot(c, 10 * k)))
      s.stroke(p.path(p.round(c, [4 * k, 0], [0, 4 * k], 0.6, 4.4)))
    }
    s.blank(p.shape(body))
    s.blank(p.shape(band))
    s.wash(p.shape(band))
    s.stroke(p.edges(body))
    s.stroke(p.edges(band))
  }

  /** A picture pinned to the wall: a slightly turned frame, pins at its corners and a small drawing inside. */
  function picture(s, p, r, c, w, h, k = 1, kind = r.pick(["treehouse", "moon", "hills"])) {
    const turn = r.signed() * 2.2 * deg
    const at = (u, v) => {
      const dx = (u - 0.5) * w
      const dy = (v - 0.5) * h
      return [c[0] + dx * Math.cos(turn) - dy * Math.sin(turn), c[1] + dx * Math.sin(turn) + dy * Math.cos(turn)]
    }
    s.blank(p.shape([at(0, 0), at(1, 0), at(1, 1), at(0, 1)]))
    s.stroke(p.edges([at(0, 0), at(1, 0), at(1, 1), at(0, 1)]))
    for (const [u, v] of [
      [0.05, 0.04],
      [0.95, 0.04],
      [0.95, 0.96],
      [0.05, 0.96],
    ])
      s.fill(p.disc(...dot(at(u, v), 1.6 * k)))
    if (kind === "treehouse") {
      const [b1, b2] = [at(0.47, 0.92), at(0.53, 0.92)]
      const [t1, t2] = [at(0.47, 0.42), at(0.53, 0.42)]
      s.stroke(p.line(b1, t1))
      s.stroke(p.line(b2, t2))
      for (let v = 0.88; v > 0.45; v -= 0.035) s.stroke(p.line(at(0.47, v), at(0.53, v)))
      s.fill(p.shape([at(0.38, 0.42), at(0.62, 0.42), at(0.62, 0.3), at(0.5, 0.2), at(0.38, 0.3)]))
      s.blank(p.shape([at(0.44, 0.36), at(0.48, 0.36), at(0.48, 0.31), at(0.44, 0.31)]))
      s.blank(p.shape([at(0.52, 0.36), at(0.56, 0.36), at(0.56, 0.31), at(0.52, 0.31)]))
      for (const side of [-1, 1]) {
        const from = at(0.5 + side * 0.12, 0.36)
        const to = at(0.5 + side * 0.3, 0.26 + r.next() * 0.08)
        s.stroke(p.path([from, lerp(from, to, 0.5), to]))
        s.fill(p.shape([to, add(to, [side * 5 * k, -3 * k]), add(to, [side * 3 * k, 3 * k])]))
      }
    } else if (kind === "moon") {
      const m = at(0.55, 0.42)
      s.fill(p.disc(...dot(m, w * 0.2)))
      s.blank(p.disc(...dot(add(m, [w * 0.09, -w * 0.05]), w * 0.18)))
      s.stroke(p.line(at(0.12, 0.8), at(0.88, 0.8)))
    } else {
      const hill = (u0, u1, v) => Array.from({ length: 9 }, (_, i) => at(u0 + ((u1 - u0) * i) / 8, 0.85 - v * Math.sin((Math.PI * i) / 8)))
      s.stroke(p.path(hill(0.08, 0.7, 0.4)))
      s.stroke(p.path(hill(0.4, 0.92, 0.28)))
      s.stroke(p.ring(...dot(at(0.72, 0.25), w * 0.08)))
    }
  }

  /** A shirt and trousers with nobody in them, standing with their feet (if any) at `at`. */
  function figure(s, p, r, at, k = 1, pose = r.pick(["stand", "walk", "record"])) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y + v * k]
    const swing = (pt, shoulder, a) => {
      const [dx, dy] = [pt[0] - shoulder[0], pt[1] - shoulder[1]]
      return [shoulder[0] + dx * Math.cos(a) - dy * Math.sin(a), shoulder[1] + dx * Math.sin(a) + dy * Math.cos(a)]
    }
    const sleeve = (side, a) => {
      const sh = P(22 * side, -155)
      return [P(30 * side, -128), P(33 * side, -104), P(23 * side, -102)].map((pt) => swing(pt, sh, a))
    }
    const stride = pose === "walk" ? 9 : r.signed() * 2
    const left = sleeve(-1, (pose === "walk" ? 14 : r.signed() * 5) * deg)
    const right = sleeve(1, (pose === "record" ? -38 : pose === "walk" ? -12 : r.signed() * 5) * deg)
    const legs = [P(-16, -90), P(-15 - stride, -2), P(-4 - stride, -2), P(0, -58), P(4 + stride, -2), P(15 + stride, -2), P(16, -90)]
    const shirt = [
      P(-8, -163),
      P(-22, -155),
      ...left,
      P(-17, -132),
      P(-20, -88),
      P(20, -88),
      P(17, -132),
      ...right.reverse(),
      P(22, -155),
      P(8, -163),
    ]
    s.blank(p.shape(legs))
    s.stroke(p.path(legs))
    for (const side of [-1, 1]) s.stroke(p.line(P((15 + stride) * side, -7), P((4 + stride) * side, -7)))
    s.blank(p.shape(shirt))
    s.stroke(p.path(shirt))
    s.stroke(p.ring(P(0, -162.5), [8 * k, 0], [0, 2.6 * k]))
    s.stroke(p.path([P(-8, -162), P(-3, -152), P(0, -158)]))
    s.stroke(p.path([P(8, -162), P(3, -152), P(0, -158)]))
    s.stroke(p.line(P(0, -156), P(0, -90)))
    if (r.chance(0.6)) s.stroke(p.edges([P(-14, -140), P(-6, -140), P(-6, -130), P(-14, -130)]))
    if (pose === "record") {
      const sleeveBox = [P(6, -128), P(34, -128), P(34, -100), P(6, -100)]
      s.blank(p.shape(sleeveBox))
      s.stroke(p.edges(sleeveBox))
      s.fill(p.shape(Array.from({ length: 9 }, (_, i) => add(P(6, -114), [Math.cos(Math.PI / 2 + (i * Math.PI) / 8), Math.sin(Math.PI / 2 + (i * Math.PI) / 8)], 12 * k))))
      s.stroke(p.path([P(12, -122), P(18, -118), P(14, -112), P(22, -108), P(28, -112)]))
    }
  }

  NIL.living = { leaf, plant, picture, figure }
})((window.NIL = window.NIL || {}))
