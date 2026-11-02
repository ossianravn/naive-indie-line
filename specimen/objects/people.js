// People: visitors who are only their clothes, people with faces, portraits for avatars, and a cat.
;(function (NIL) {
  "use strict"

  const { add, dot, arc, turn } = NIL.shapes
  const HAIR = ["bob", "crop", "short", "bun", "curls", "long", "bald"]

  /** A sleeve hanging from shoulder S, swung by a degrees; returns its outline and where the hand goes. */
  function sleeve(S, side, k, a) {
    const pts = [[8, 27], [11, 51], [1, 53], [-5, 23]].map(([u, v]) => turn([S[0] + side * u * k, S[1] + v * k], S, a))
    const cuff = [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2]
    const out = [cuff[0] - (pts[0][0] + pts[3][0]) / 2, cuff[1] - (pts[0][1] + pts[3][1]) / 2]
    const len = Math.hypot(...out) || 1
    return { outline: [S, ...pts], hand: add(cuff, out, (4.5 * k) / len) }
  }

  /** Shirt or sweater and trousers or skirt; returns the hands and shoulders. */
  function clothes(s, p, r, at, k, { pose = "stand", top = "shirt", bottom = "trousers", stride = 0, nobody = false } = {}) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y + v * k]
    const legs =
      bottom === "skirt"
        ? [P(-16, -90), P(-24, -40), P(24, -40), P(16, -90)]
        : [P(-16, -90), P(-15 - stride, -4), P(-4 - stride, -4), P(0, -58), P(4 + stride, -4), P(15 + stride, -4), P(16, -90)]
    if (bottom === "skirt") for (const side of [-1, 1]) for (const dx of [5, 11]) s.stroke(p.line(P(side * dx, -40), P(side * dx, -5)))
    if (!nobody) for (const side of [-1, 1]) s.fill(p.disc(P(side * (9.5 + stride), -2.5), [7 * k, 0], [0, 3 * k]))
    s.blank(p.shape(legs))
    s.stroke(p.path(legs))
    const body = [P(-8, -163), P(-22, -155), P(-17, -132), P(-20, -88), P(20, -88), P(17, -132), P(22, -155), P(8, -163)]
    s.blank(p.shape(body))
    s.stroke(p.path(body))
    if (top === "shirt") {
      s.stroke(p.path([P(-8, -162), P(-3, -152), P(0, -158)]))
      s.stroke(p.path([P(8, -162), P(3, -152), P(0, -158)]))
      s.stroke(p.line(P(0, -156), P(0, -90)))
    } else {
      s.stroke(p.path(arc([0, -163], 8, 4, 0, 180, 8).map(([u, v]) => P(u, v))))
      s.stroke(p.line(P(-19.5, -95), P(19.5, -95)))
    }
    const swing = { stand: [r.signed() * 5, r.signed() * 5], wave: [r.signed() * 5, -155], mug: [r.signed() * 5, 52], walk: [14, -12] }[pose]
    const hands = [-1, 1].map((side, i) => {
      const sl = sleeve(P(side * 22, -155), side, k, swing[i])
      s.blank(p.shape(sl.outline))
      s.stroke(p.path([...sl.outline, sl.outline[0]]))
      return sl.hand
    })
    for (const h of nobody ? [] : hands) {
      s.blank(p.disc(...dot(h, 3.6 * k)))
      s.stroke(p.ring(...dot(h, 3.6 * k)))
    }
    return { hands, neck: P(0, -163) }
  }

  /** A head centred at c: face, ears, features and hair, all from the seed unless given. */
  function head(s, p, r, c, k = 1, { hair = r.pick(HAIR), glasses = r.chance(0.3), beard = r.chance(0.2) } = {}) {
    const P = (u, v) => [c[0] + u * k, c[1] + v * k]
    const A = (rx, ry, a0, a1, n = 14, dy = 0) => arc([0, dy], rx, ry, a0, a1, n).map(([u, v]) => P(u, v))
    if (hair === "long") {
      const back = [P(-15, 30), ...A(15.5, 19, 160, 380, 18), P(15, 30)]
      s.blank(p.shape(back))
      s.stroke(p.path(back))
    }
    s.stroke(p.line(P(-4, 13), P(-4, 21)))
    s.stroke(p.line(P(4, 13), P(4, 21)))
    s.blank(p.disc(c, [12 * k, 0], [0, 15 * k]))
    s.stroke(p.ring(c, [12 * k, 0], [0, 15 * k]))
    if (!["bob", "long"].includes(hair)) {
      s.stroke(p.path(A(3, 4, 270, 450, 6).map((pt) => add(pt, [12 * k, 2 * k]))))
      s.stroke(p.path(A(3, 4, 90, 270, 6).map((pt) => add(pt, [-12 * k, 2 * k]))))
    }
    if (hair === "bob") s.fill(p.shape([P(-14.5, 11), ...A(15, 18, 170, 370, 16), P(14.5, 11), P(11, 11), P(11, -4), P(-11, -4), P(-11, 11)]))
    else if (hair === "crop") s.fill(p.shape([...A(13, 16.5, 175, 365, 14), P(9, -7), P(4, -5), P(-2, -8), P(-8, -5), P(-12.5, -3)]))
    else if (hair === "short" || hair === "bun") {
      s.stroke(p.path([P(-12, -2), ...A(13.5, 17, 190, 350, 12), P(12, -2)]))
      s.stroke(p.path([P(-6, -14), P(-2, -8), P(3, -13)]))
      if (hair === "bun") s.fill(p.disc(...dot(P(0, -20), 5.5 * k)))
    } else if (hair === "curls") for (let a = 165; a <= 375; a += 26) s.stroke(p.ring(...dot(A(14, 17, a, a, 1)[0], 4.2 * k)))
    else if (hair === "long") s.stroke(p.path([P(-12, 4), ...A(13, 16, 190, 350, 12), P(12, 4)]))
    if (glasses) {
      for (const side of [-1, 1]) s.stroke(p.ring(...dot(P(side * 5, 1), 3.8 * k)))
      s.stroke(p.line(P(-1.2, 0.5), P(1.2, 0.5)))
    }
    for (const side of [-1, 1]) s.fill(p.disc(...dot(P(side * 5, 1), 1.15 * k)))
    s.stroke(p.path([P(0.6, 2), P(-1.4, 7.2), P(1.4, 7.6)]))
    if (beard && hair !== "long") s.fill(p.shape([P(-12, 3), ...A(12.5, 16.5, 170, 10, 14), P(12, 3), P(5, 9), P(-5, 9)]))
    else s.stroke(p.path(A(3.4, 1.8, 20, 160, 6, 10.5)))
  }

  /** A shirt and trousers with nobody in them. */
  function visitor(s, p, r, at, k = 1, { pose = r.pick(["stand", "walk", "record"]) } = {}) {
    const P = (u, v) => [at[0] + u * k, at[1] + v * k]
    const { hands } = clothes(s, p, r, at, k, { pose: pose === "record" ? "mug" : pose, stride: pose === "walk" ? 9 : r.signed() * 2, nobody: true })
    s.stroke(p.ring(P(0, -162.5), [8 * k, 0], [0, 2.6 * k]))
    if (pose === "record") {
      const h = hands[1]
      const sleeveBox = [add(h, [-24 * k, -14 * k]), add(h, [4 * k, -14 * k]), add(h, [4 * k, 14 * k]), add(h, [-24 * k, 14 * k])]
      s.fill(p.shape(arc(add(h, [-24 * k, 0]), 12 * k, 12 * k, 90, 270, 8)))
      s.blank(p.shape(sleeveBox))
      s.stroke(p.edges(sleeveBox))
      s.stroke(p.path([add(h, [-18 * k, -6 * k]), add(h, [-12 * k, -2 * k]), add(h, [-16 * k, 4 * k]), add(h, [-6 * k, 6 * k])]))
    }
  }

  function person(s, p, r, at, k = 1, { pose = r.pick(["stand", "wave", "mug"]), hair = r.pick(HAIR), glasses, beard } = {}) {
    const top = r.pick(["shirt", "sweater"])
    const bottom = r.chance(0.3) ? "skirt" : "trousers"
    if (hair === "long") head(s, p, r, [at[0], at[1] - 178 * k], k, { hair, glasses, beard })
    const { hands } = clothes(s, p, r, at, k, { pose, top, bottom, stride: r.signed() * 2 })
    if (hair !== "long") head(s, p, r, [at[0], at[1] - 178 * k], k, { hair, glasses, beard })
    if (pose === "mug") NIL.desk.mug(s, p, r, add(hands[1], [-3 * k, 4 * k]), 0.45 * k)
  }

  /** Head and shoulders, for avatars: `at` is the centre of the tile. */
  function portrait(s, p, r, at, k = 1, options = {}) {
    const P = (u, v) => [at[0] + u * k, at[1] + v * k]
    const shoulders = [P(-36, 46), P(-31, 26), P(-12, 16), P(12, 16), P(31, 26), P(36, 46)]
    s.stroke(p.path(shoulders))
    s.stroke(p.path(r.chance(0.5) ? [P(-7, 16), P(0, 25), P(7, 16)] : arc([0, 16], 8, 5, 0, 180, 8).map(([u, v]) => P(u, v))))
    head(s, p, r, P(0, -6), k, options)
  }

  function cat(s, p, r, at, k = 1, { black = r.chance(0.4) } = {}) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const tail = r.chance(0.5) ? 1 : -1
    s.stroke(p.path([P(tail * 18, 4), P(tail * 34, 10), P(tail * 36, 28), P(tail * 28, 40)]))
    const body = [P(-12, 44), P(-20, 26), P(-23, 8), P(-19, 0), P(19, 0), P(23, 8), P(20, 26), P(12, 44)]
    s.blank(p.shape(body))
    if (black) s.fill(p.shape(body))
    s.stroke(p.path([...body, body[0]]))
    const c = P(0, 60)
    const face = [...arc(c, 16 * k, 14 * k, -20, 200, 16), add(c, [-14 * k, -19 * k]), add(c, [-6 * k, -12 * k]), add(c, [6 * k, -12 * k]), add(c, [14 * k, -19 * k])]
    s.blank(p.shape(face))
    if (black) s.fill(p.shape(face))
    s.stroke(p.path([...face, face[0]]))
    const eye = black ? (pt) => s.paper(p.disc(...dot(pt, 1.6 * k))) : (pt) => s.fill(p.disc(...dot(pt, 1.4 * k)))
    eye(add(c, [-6 * k, 0]))
    eye(add(c, [6 * k, 0]))
    if (!black) {
      s.fill(p.shape([add(c, [-1.6 * k, 4 * k]), add(c, [1.6 * k, 4 * k]), add(c, [0, 6 * k])]))
      for (const side of [-1, 1]) for (const dy of [5, 8]) s.stroke(p.line(add(c, [side * 5 * k, dy * k]), add(c, [side * 17 * k, (dy + (dy - 6.5) * 1.5) * k])))
      for (let i = 0; i < 3; i++) s.stroke(p.line(P(-14 + i * 3, 14 + i * 9), P(-6 + i * 3, 16 + i * 9)))
    }
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "people", size, at, k, draw })
  NIL.objects.define(
    T("person", "Person", [110, 240], [55, 232], 1.15, person),
    T("person-wave", "Waving", [110, 240], [55, 232], 1.15, (s, p, r, at, k) => person(s, p, r, at, k, { pose: "wave" })),
    T("person-mug", "With a mug", [110, 240], [55, 232], 1.15, (s, p, r, at, k) => person(s, p, r, at, k, { pose: "mug" })),
    T("portrait", "Portrait", [100, 100], [50, 46], 1, portrait),
    T("visitor", "Visitor", [110, 220], [50, 212], 1.15, visitor),
    T("visitor-record", "Visitor with a record", [110, 220], [50, 212], 1.15, (s, p, r, at, k) => visitor(s, p, r, at, k, { pose: "record" })),
    T("cat", "Cat", [100, 110], [50, 100], 1.1, cat),
  )
  NIL.people = { head, clothes, person, portrait, visitor, cat, HAIR }
})((window.NIL = window.NIL || {}))
