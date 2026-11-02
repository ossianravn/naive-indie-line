// Indie: the room itself. Plants, a pinned picture, chairs, a lamp and a window.
;(function (NIL) {
  "use strict"

  const { deg, add, lerp, dot, arc, rect, turn, depth, box } = NIL.shapes

  /** A leaf from its base along `angle` (0 = straight up, in radians), drooping as it goes. */
  function leaf(s, p, base, angle, len) {
    const dir = [Math.sin(angle), -Math.cos(angle)]
    const nrm = [-dir[1], dir[0]]
    const [width, sag] = [len * 0.34, len * 0.28]
    const at = (t, side) => {
      const pt = add(add(base, dir, len * t), nrm, side * width * Math.sin(Math.PI * Math.pow(t, 0.8)))
      return [pt[0], pt[1] + sag * t * t]
    }
    const one = Array.from({ length: 11 }, (_, i) => at(i / 10, 1))
    const two = Array.from({ length: 11 }, (_, i) => at(1 - i / 10, -1))
    s.blank(p.shape([...one, ...two.slice(1)]))
    s.stroke(p.path([...one, ...two.slice(1)]))
    s.stroke(p.path(Array.from({ length: 5 }, (_, i) => at((i / 4) * 0.8, 0))))
  }

  /** A flowerpot with its rim in the wash, standing at `at` (bottom centre). Returns the top of the soil. */
  function pot(s, p, at, k) {
    const [x, y] = at
    const [top, bot, h, rim] = [25 * k, 18 * k, 36 * k, 8 * k]
    const body = [[x - bot, y], [x + bot, y], [x + top, y - h + rim], [x - top, y - h + rim]]
    const band = rect(x - top - 2 * k, y - h, 2 * (top + 2 * k), rim)
    s.blank(p.shape(body))
    s.blank(p.shape(band))
    s.wash(p.shape(band))
    s.stroke(p.edges(body))
    s.stroke(p.edges(band))
    return [x, y - h]
  }

  function plant(s, p, r, at, k = 1, { kind = r.pick(["sunflower", "leafy"]) } = {}) {
    const [x, y] = [at[0], at[1] - 36 * k]
    const tall = kind === "sunflower"
    const height = (tall ? r.between(105, 135) : r.between(55, 75)) * k
    const bend = r.signed() * 16 * k
    const stem = (t) => [x + bend * t * t, y - height * t]
    s.stroke(p.path(Array.from({ length: 7 }, (_, i) => stem(i / 6))))
    const leaves = tall ? 2 + Math.floor(r.next() * 2) : 5 + Math.floor(r.next() * 3)
    for (let i = 0; i < leaves; i++) {
      const side = i % 2 ? 1 : -1
      const t = tall ? 0.22 + (i * 0.5) / leaves : 0.15 + (i * 0.85) / leaves
      leaf(s, p, stem(t), side * r.between(45, tall ? 100 : 80) * deg, r.between(tall ? 32 : 24, tall ? 46 : 38) * k)
    }
    if (tall) {
      const c = stem(1)
      const n = 18 + Math.floor(r.next() * 6)
      const star = Array.from({ length: n * 2 }, (_, i) => add(c, [Math.cos((i * Math.PI) / n), Math.sin((i * Math.PI) / n)], (i % 2 ? 11 : r.between(20, 24)) * k))
      s.blank(p.shape(star))
      s.stroke(p.path([...star, star[0]]))
      s.stroke(p.ring(...dot(c, 10 * k)))
      s.stroke(p.path(p.round(c, [4 * k, 0], [0, 4 * k], 0.6, 4.4)))
    }
    pot(s, p, at, k)
  }

  function cactus(s, p, r, at, k = 1) {
    const [x, y] = [at[0], at[1] - 36 * k]
    const h = r.between(64, 84) * k
    const w = 11 * k
    const column = [[x - w, y], ...arc([x, y - h], w, w, 180, 360, 10), [x + w, y]]
    const side = r.chance(0.5) ? 1 : -1
    const armY = y - h * r.between(0.4, 0.55)
    const arm = [[x + side * w, armY + 7 * k], [x + side * 31 * k, armY + 7 * k], ...arc([x + side * 24 * k, armY - 14 * k], 7 * k, 7 * k, side > 0 ? 0 : 180, side > 0 ? -180 : 360, 8), [x + side * 17 * k, armY - 3 * k], [x + side * w, armY - 3 * k]]
    s.stroke(p.path(arm))
    s.blank(p.shape(column))
    s.stroke(p.path(column))
    for (let i = 0; i < 9; i++) {
      const pt = [x + r.signed() * w * 0.7, y - r.next() * h * 0.95]
      s.stroke(p.line(pt, add(pt, [r.signed() * 3 * k, -3 * k])))
    }
    if (r.chance(0.5)) s.fill(p.disc(...dot([x, y - h - w - 2 * k], 3.5 * k)))
    pot(s, p, at, k)
  }

  /** A picture pinned to the wall: a slightly turned frame, pins at its corners and a small drawing inside. */
  function picture(s, p, r, c, k = 1, { w = 96 * k, h = 120 * k, kind = r.pick(["treehouse", "moon", "hills"]) } = {}) {
    const tilt = r.signed() * 2.2
    const at = (u, v) => turn([c[0] + (u - 0.5) * w, c[1] + (v - 0.5) * h], c, tilt)
    const frame = [at(0, 0), at(1, 0), at(1, 1), at(0, 1)]
    s.blank(p.shape(frame))
    s.stroke(p.edges(frame))
    for (const [u, v] of [[0.05, 0.04], [0.95, 0.04], [0.95, 0.96], [0.05, 0.96]]) s.fill(p.disc(...dot(at(u, v), 1.6 * k)))
    if (kind === "treehouse") {
      s.stroke(p.line(at(0.47, 0.92), at(0.47, 0.42)))
      s.stroke(p.line(at(0.53, 0.92), at(0.53, 0.42)))
      for (let v = 0.88; v > 0.45; v -= 0.035) s.stroke(p.line(at(0.47, v), at(0.53, v)))
      s.fill(p.shape([at(0.38, 0.42), at(0.62, 0.42), at(0.62, 0.3), at(0.5, 0.2), at(0.38, 0.3)]))
      s.blank(p.shape([at(0.44, 0.36), at(0.48, 0.36), at(0.48, 0.31), at(0.44, 0.31)]))
      s.blank(p.shape([at(0.52, 0.36), at(0.56, 0.36), at(0.56, 0.31), at(0.52, 0.31)]))
      for (const side of [-1, 1]) {
        const [from, to] = [at(0.5 + side * 0.12, 0.36), at(0.5 + side * 0.3, 0.26 + r.next() * 0.08)]
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

  function chair(s, p, r, at, k = 1) {
    const o = depth(r)
    const [x, y] = at
    const [w, d, seat] = [54 * k, 36 * k, 46 * k]
    const back = (u) => add([x + w * u, y - seat], o, d)
    const rail = (u) => add(back(u), [0, -52 * k])
    s.stroke(p.line(back(0), rail(0)))
    s.stroke(p.line(back(1), rail(1)))
    s.stroke(p.line(add(rail(0), [0, 8 * k]), add(rail(1), [0, 8 * k])))
    s.stroke(p.line(rail(0), rail(1)))
    for (let u = 0.25; u < 0.9; u += 0.25) s.stroke(p.line(add(back(u), [0, -2 * k]), add(rail(u), [0, 8 * k])))
    s.stroke(p.line(add(back(0), [0, 5 * k]), add(back(0), [0, seat])))
    s.stroke(p.line(add(back(1), [0, 5 * k]), add(back(1), [0, seat])))
    box(s, p, o, [x, y - seat + 5 * k], w, 5 * k, d)
    s.stroke(p.line([x + 3 * k, y - seat + 5 * k], [x + 3 * k, y]))
    s.stroke(p.line([x + w - 3 * k, y - seat + 5 * k], [x + w - 3 * k, y]))
  }

  function armchair(s, p, r, at, k = 1) {
    const o = depth(r)
    const [x, y] = at
    const legs = 8 * k
    box(s, p, o, add([x, y - legs - 30 * k], o, 38 * k), 94 * k, 52 * k, 12 * k)
    const seat = box(s, p, o, [x, y - legs], 94 * k, 30 * k, 48 * k)
    s.stroke(p.path([seat.top(0.15, 0.1), seat.top(0.5, 0.06), seat.top(0.85, 0.1)]))
    box(s, p, o, [x - 4 * k, y - legs], 16 * k, 42 * k, 48 * k)
    box(s, p, o, [x + 82 * k, y - legs], 16 * k, 42 * k, 48 * k)
    for (const lx of [2, 92]) s.stroke(p.line([x + lx * k, y - legs], [x + lx * k, y]))
  }

  function floorLamp(s, p, r, at, k = 1) {
    const [x, y] = at
    const H = r.between(160, 180) * k
    s.stroke(p.ring([x, y], [20 * k, 0], [0, 5 * k]))
    s.stroke(p.line([x, y], [x, y - H + 30 * k]))
    const [top, bot] = [[x, y - H], [x, y - H + 34 * k]]
    s.blank(p.shape([...arc(top, 17 * k, 4 * k, 180, 360, 8), ...arc(bot, 27 * k, 6 * k, 0, 180, 8)]))
    s.stroke(p.ring(top, [17 * k, 0], [0, 4 * k]))
    s.stroke(p.line([x - 17 * k, y - H], [x - 27 * k, bot[1]]))
    s.stroke(p.line([x + 17 * k, y - H], [x + 27 * k, bot[1]]))
    s.stroke(p.path(arc(bot, 27 * k, 6 * k, 0, 180, 10)))
    s.stroke(p.line([x + 8 * k, bot[1] + 4 * k], [x + 8 * k, bot[1] + 16 * k]))
  }

  function window_(s, p, r, at, k = 1, { view = r.pick(["moon", "roofs", "tree"]) } = {}) {
    const [x, y] = at
    const [w, h] = [92 * k, 112 * k]
    const glass = rect(x, y - h, w, h)
    s.stroke(p.edges(glass))
    s.stroke(p.line([x + w / 2, y - h], [x + w / 2, y]))
    s.stroke(p.line([x, y - h * 0.55], [x + w, y - h * 0.55]))
    s.stroke(p.edges(rect(x - 6 * k, y, w + 12 * k, 5 * k)))
    if (view === "moon") {
      const m = [x + w * 0.72, y - h * 0.8]
      s.fill(p.disc(...dot(m, 8 * k)))
      s.blank(p.disc(...dot(add(m, [4 * k, -3 * k]), 7 * k)))
      for (const [u, v] of [[0.2, 0.8], [0.35, 0.66], [0.12, 0.62]]) s.fill(p.disc(...dot([x + w * u, y - h * v], 1.2 * k)))
    } else if (view === "roofs") {
      s.stroke(p.path([[x, y - h * 0.25], [x + w * 0.15, y - h * 0.38], [x + w * 0.3, y - h * 0.25], [x + w * 0.3, y - h * 0.32], [x + w * 0.62, y - h * 0.32], [x + w * 0.62, y - h * 0.2], [x + w * 0.8, y - h * 0.36], [x + w, y - h * 0.22]]))
      s.fill(p.shape(rect(x + w * 0.4, y - h * 0.28, 4 * k, 4 * k)))
    } else {
      const c = [x + w * 0.25, y - h * 0.72]
      s.fill(p.shape(Array.from({ length: 14 }, (_, i) => add(c, [Math.cos(i * 0.45), Math.sin(i * 0.45)], (16 + r.signed() * 3) * k))))
      s.stroke(p.line(add(c, [0, 14 * k]), [c[0], y - h * 0.55]))
    }
    const side = r.chance(0.5) ? 0 : 1
    const cx = x + side * w
    s.stroke(p.line([x - 12 * k, y - h - 6 * k], [x + w + 12 * k, y - h - 6 * k]))
    for (let i = 0; i < 3; i++) {
      const off = (side ? -1 : 1) * (4 + i * 6) * k
      s.stroke(p.path(Array.from({ length: 6 }, (_, j) => [cx + off + (j % 2 ? 2 : -2) * k, y - h - 6 * k + (j * (h + 4 * k)) / 5])))
    }
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "indie", size, at, k, draw })
  NIL.objects.define(
    T("sunflower", "Sunflower", [120, 220], [60, 212], 1, (s, p, r, at, k) => plant(s, p, r, at, k, { kind: "sunflower" })),
    T("house-plant", "House plant", [120, 140], [60, 132], 1, (s, p, r, at, k) => plant(s, p, r, at, k, { kind: "leafy" })),
    T("cactus", "Cactus", [100, 150], [50, 142], 1, cactus),
    T("picture", "Pinned picture", [130, 150], [65, 75], 1, picture),
    T("chair", "Chair", [110, 140], [20, 130], 1, chair),
    T("armchair", "Armchair", [150, 120], [16, 110], 1, armchair),
    T("floor-lamp", "Floor lamp", [80, 200], [40, 190], 1, floorLamp),
    T("window", "Window", [130, 150], [18, 140], 1, window_),
  )
  NIL.home = { leaf, pot, plant, picture }
})((window.NIL = window.NIL || {}))
