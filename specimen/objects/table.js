// Food & drink: a bistro's table, from the wine to the bread. `at` is bottom-centre unless a function says otherwise.
;(function (NIL) {
  "use strict"

  const { add, dot, arc, cylinder, handle, scribble } = NIL.shapes

  function bottle(s, p, r, at, k = 1) {
    const [x, y] = at
    const half = 10 + r.next() * 2
    const P = (u, v) => [x + u * k, y - v * k]
    const outline = [P(-half, 0), P(-half, 66), P(-half + 2, 76), P(-3.6, 86), P(-3.6, 112), P(3.6, 112), P(3.6, 86), P(half - 2, 76), P(half, 66), P(half, 0)]
    s.blank(p.shape(outline))
    s.stroke(p.path([...outline, outline[0]]))
    s.fill(p.shape([P(-4, 98), P(4, 98), P(4, 112), P(-4, 112)]))
    s.stroke(p.edges([P(-half + 2.5, 18), P(half - 2.5, 18), P(half - 2.5, 48), P(-half + 2.5, 48)]))
    s.stroke(p.ring(...dot(P(0, 33), 4 * k)))
  }

  function glass(s, p, r, at, k = 1, { wine = true } = {}) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    s.stroke(p.ring(P(0, 1.5), [11 * k, 0], [0, 2.5 * k]))
    s.stroke(p.line(P(0, 2), P(0, 26)))
    const bowl = arc([0, 44], 14, 20, 180, 360, 14).map(([u, v]) => P(u, v))
    const rim = [P(-11, 56), ...bowl, P(11, 56)]
    s.blank(p.shape(rim))
    if (wine) s.fill(p.shape([...bowl.slice(3, 12), P(12, 37), P(-12, 37)]))
    s.stroke(p.path(rim))
    s.stroke(p.ring(P(0, 56), [11 * k, 0], [0, 2.6 * k]))
  }

  function carafe(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = [P(-6, 92), P(-6, 70), ...arc([0, 36], 24, 34, 250, -70, 18).map(([u, v]) => P(u, 72 - v)), P(6, 70), P(6, 92)]
    s.blank(p.shape(body))
    s.wash(p.shape([...arc([0, 36], 23, 33, 20, 160, 12).map(([u, v]) => P(u, 72 - v))]))
    s.stroke(p.path(body))
    s.stroke(p.ring(P(0, 92), [6 * k, 0], [0, 1.8 * k]))
  }

  function coffee(s, p, r, at, k = 1) {
    const [x, y] = at
    s.stroke(p.ring([x, y], [30 * k, 0], [0, 8 * k]))
    const cup = cylinder(s, p, [x, y - 26 * k], 17 * k, 5 * k, 22 * k)
    handle(s, p, x + 17 * k, y - 22 * k, y - 10 * k, 8 * k)
    s.fill(p.disc(cup.top, [14 * k, 0], [0, 3.6 * k]))
    for (const dx of [-6, 4]) s.stroke(p.path(Array.from({ length: 9 }, (_, i) => [x + (dx + Math.sin(i * 0.9 + dx) * 3) * k, y - (36 + i * 3) * k])))
  }

  function teapot(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = [P(-34, 4), ...arc([0, 0], 36, 44, 180, 360, 18).map(([u, v]) => P(u, 4 - v)), P(34, 4)]
    s.stroke(p.path([P(30, 18), P(46, 30), P(56, 46)]))
    s.stroke(p.path([P(32, 30), P(44, 38), P(51, 50)]))
    s.stroke(p.line(P(56, 46), P(51, 50)))
    s.stroke(p.path(arc([0, 0], 13, 16, -90, 90, 10).map(([u, v]) => P(-34 - u, 24 - v))))
    s.blank(p.shape(body))
    s.stroke(p.path([...body, body[0]]))
    s.stroke(p.path(arc([0, 0], 14, 7, 180, 360, 10).map(([u, v]) => P(u, 44 - v))))
    s.fill(p.disc(...dot(P(0, 54), 3.4 * k)))
  }

  /** A plate seen from above, with one of a few dishes on it. */
  function plate(s, p, r, at, k = 1, { dish = r.pick(["fish", "toast", "pasta", "salad"]) } = {}) {
    const [x, y] = at
    const c = [x, y - 14 * k]
    s.blank(p.disc(c, [48 * k, 0], [0, 14 * k]))
    s.stroke(p.ring(c, [48 * k, 0], [0, 14 * k]))
    s.stroke(p.ring(c, [35 * k, 0], [0, 10 * k]))
    const P = (u, v) => [c[0] + u * k, c[1] + v * k]
    if (dish === "fish") {
      const body = [P(-24, 0), P(-10, -6), P(8, -6), P(18, 0), P(8, 6), P(-10, 6)]
      s.stroke(p.path([...body, body[0]]))
      s.stroke(p.edges([P(18, 0), P(28, -6), P(28, 6)]))
      s.fill(p.disc(...dot(P(-16, -1), 1.3 * k)))
      s.stroke(p.path([P(-10, -5), P(-8, 0), P(-10, 5)]))
    } else if (dish === "toast") {
      s.stroke(p.edges([P(-20, -6), P(16, -8), P(20, 6), P(-16, 8)]))
      s.stroke(p.path([...arc([2, 0], 11, 5, 0, 360, 14).map(([u, v]) => P(u, v))]))
      s.fill(p.disc(P(3, 0), [4 * k, 0], [0, 2.4 * k]))
    } else if (dish === "pasta") {
      for (let i = 0; i < 5; i++) s.stroke(p.ring(P(r.signed() * 12, r.signed() * 3), [r.between(6, 12) * k, 0], [0, r.between(2, 4) * k]))
      s.fill(p.disc(P(r.signed() * 6, -1), [3 * k, 0], [0, 1.6 * k]))
    } else {
      for (let i = 0; i < 4; i++) {
        const a = P(r.signed() * 16, r.signed() * 4)
        s.stroke(p.path([a, add(a, [8 * k, -4 * k]), add(a, [14 * k, 0]), add(a, [6 * k, 3 * k]), a]))
      }
      for (let i = 0; i < 3; i++) s.fill(p.disc(P(r.signed() * 18, r.signed() * 4), [3 * k, 0], [0, 2 * k]))
    }
  }

  function bowl(s, p, r, at, k = 1) {
    const [x, y] = at
    const c = [x, y - 26 * k]
    const body = arc(c, 34 * k, 26 * k, 0, 180, 16)
    s.blank(p.shape(body))
    s.stroke(p.path(body))
    s.wash(p.disc(add(c, [0, 2 * k]), [30 * k, 0], [0, 6 * k]))
    s.stroke(p.ring(c, [34 * k, 0], [0, 8 * k]))
    s.stroke(p.ring(add(c, [-8 * k, -2 * k]), [7 * k, 0], [0, 3 * k]))
    s.stroke(p.line(add(c, [-2 * k, -4 * k]), add(c, [24 * k, -26 * k])))
  }

  function bread(s, p, r, at, k = 1) {
    const [x, y] = at
    const loaf = [[x - 44 * k, y], ...arc([x, y], 44 * k, 30 * k, 180, 360, 18), [x + 44 * k, y]]
    s.blank(p.shape(loaf))
    s.stroke(p.path([...loaf, loaf[0]]))
    for (let i = -1; i <= 1; i++) s.stroke(p.path([[x + (i * 22 - 7) * k, y - 16 * k], [x + (i * 22 + 2) * k, y - 24 * k], [x + (i * 22 + 9) * k, y - 22 * k]]))
  }

  function lemon(s, p, r, at, k = 1) {
    const [x, y] = at
    const c = [x - 14 * k, y - 18 * k]
    const whole = [add(c, [-26 * k, 0]), ...arc(c, 22 * k, 17 * k, 190, 350, 10), add(c, [26 * k, 0]), ...arc(c, 22 * k, 17 * k, 10, 170, 10)]
    s.stroke(p.path([...whole, whole[0]]))
    const half = [x + 30 * k, y - 14 * k]
    s.blank(p.disc(half, [16 * k, 0], [0, 14 * k]))
    s.stroke(p.ring(half, [16 * k, 0], [0, 14 * k]))
    s.stroke(p.ring(half, [12.5 * k, 0], [0, 10.5 * k]))
    for (let i = 0; i < 6; i++) s.stroke(p.line(half, add(half, [Math.cos(i * 1.047) * 11 * k, Math.sin(i * 1.047) * 9 * k])))
  }

  function candle(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const body = [P(-15, 0), P(-15, 38), P(-6, 50), P(-6, 62), P(6, 62), P(6, 50), P(15, 38), P(15, 0)]
    s.blank(p.shape(body))
    s.stroke(p.path([...body, body[0]]))
    s.stroke(p.edges([P(-5, 62), P(5, 62), P(5, 92), P(-5, 92)]))
    for (const [u, v] of [[-5, 80], [5, 74]]) s.stroke(p.path([P(u, v + 10), P(u + Math.sign(u) * 1.5, v + 4), P(u, v)]))
    s.stroke(p.line(P(0, 92), P(0, 96)))
    s.fill(p.shape([P(0, 97), P(3.4, 103), P(0, 112), P(-3.4, 103)]))
  }

  function moka(s, p, r, at, k = 1) {
    const [x, y] = at
    const P = (u, v) => [x + u * k, y - v * k]
    const lower = [P(-22, 0), P(22, 0), P(14, 40), P(-14, 40)]
    const upper = [P(-14, 40), P(14, 40), P(20, 80), P(-20, 80)]
    s.blank(p.shape([...lower, ...upper]))
    s.stroke(p.edges(lower))
    s.stroke(p.edges(upper))
    s.stroke(p.edges([P(20, 80), P(30, 82), P(20, 72)], false))
    s.fill(p.shape([P(-20, 72), P(-34, 68), P(-36, 48), P(-16, 46)]))
    s.stroke(p.edges([P(-12, 80), P(12, 80), P(9, 86), P(-9, 86)]))
    s.fill(p.disc(...dot(P(0, 90), 3.6 * k)))
  }

  function cutlery(s, p, r, at, k = 1) {
    const [x, y] = at
    const fork = (c) => {
      s.stroke(p.edges([add(c, [-2 * k, 0]), add(c, [2 * k, 0]), add(c, [2.5 * k, -62 * k]), add(c, [-2.5 * k, -62 * k])], false))
      s.stroke(p.path([add(c, [-2.5 * k, -62 * k]), add(c, [-8 * k, -70 * k]), add(c, [-8 * k, -92 * k])]))
      s.stroke(p.path([add(c, [2.5 * k, -62 * k]), add(c, [8 * k, -70 * k]), add(c, [8 * k, -92 * k])]))
      for (const dx of [-2.6, 2.6]) s.stroke(p.line(add(c, [dx * k, -72 * k]), add(c, [dx * k, -92 * k])))
    }
    const knife = (c) => s.stroke(p.path([add(c, [-3 * k, 0]), add(c, [-3 * k, -54 * k]), add(c, [-4 * k, -94 * k]), add(c, [4 * k, -78 * k]), add(c, [3 * k, -54 * k]), add(c, [3 * k, 0]), add(c, [-3 * k, 0])]))
    fork([x - 14 * k, y])
    knife([x + 14 * k, y])
    s.stroke(p.line([x + 11 * k, y - 54 * k], [x + 17 * k, y - 54 * k]))
  }

  function menuCard(s, p, r, at, k = 1) {
    const [x, y] = at
    const face = [[x - 34 * k, y], [x + 34 * k, y], [x + 28 * k, y - 96 * k], [x - 28 * k, y - 96 * k]]
    s.stroke(p.line([x + 34 * k, y], [x + 46 * k, y - 10 * k]))
    s.stroke(p.line([x + 28 * k, y - 96 * k], [x + 40 * k, y - 104 * k]))
    s.stroke(p.line([x + 46 * k, y - 10 * k], [x + 40 * k, y - 104 * k]))
    s.blank(p.shape(face))
    s.stroke(p.edges(face))
    s.stroke(p.ring([x, y - 80 * k], [10 * k, 0], [0, 5 * k]))
    scribble(s, p, r, x - 20 * k, y - 62 * k, 40 * k, 6, 8 * k)
  }

  function bistroTable(s, p, r, at, k = 1) {
    const [x, y] = at
    const top = [x, y - 104 * k]
    s.stroke(p.line([x - 2 * k, top[1] + 8 * k], [x - 2 * k, y - 6 * k]))
    s.stroke(p.line([x + 2 * k, top[1] + 8 * k], [x + 2 * k, y - 6 * k]))
    s.stroke(p.path([[x - 30 * k, y], [x - 4 * k, y - 8 * k], [x + 4 * k, y - 8 * k], [x + 30 * k, y]]))
    s.blank(p.shape([...arc(top, 70 * k, 18 * k, 180, 360, 14), ...arc(add(top, [0, 6 * k]), 70 * k, 18 * k, 0, 180, 14)]))
    s.stroke(p.ring(top, [70 * k, 0], [0, 18 * k]))
    s.stroke(p.path(arc(add(top, [0, 6 * k]), 70 * k, 18 * k, 0, 180, 14)))
    s.stroke(p.line([x - 70 * k, top[1]], [x - 70 * k, top[1] + 6 * k]))
    s.stroke(p.line([x + 70 * k, top[1]], [x + 70 * k, top[1] + 6 * k]))
  }

  /** A pendant lamp hanging from `top` (default 60 above the shade); `at` is the bottom-centre of the shade. */
  function pendant(s, p, r, at, k = 1, { top } = {}) {
    const [x, y] = at
    s.stroke(p.line([x, top ?? y - 90 * k], [x, y - 30 * k]))
    s.fill(p.shape([[x - 5 * k, y - 30 * k], [x + 5 * k, y - 30 * k], [x + 26 * k, y], [x - 26 * k, y]]))
    s.stroke(p.path(arc([x, y], 8 * k, 7 * k, 0, 180, 8)))
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "table", size, at, k, draw })
  NIL.objects.define(
    T("bottle", "Wine bottle", [60, 140], [30, 132], 1.05, bottle),
    T("glass", "Wine glass", [60, 80], [30, 74], 1.15, glass),
    T("carafe", "Carafe", [70, 120], [35, 112], 1, carafe),
    T("coffee", "Coffee", [90, 100], [45, 88], 1.1, coffee),
    T("teapot", "Teapot", [140, 100], [62, 92], 1, teapot),
    T("plate", "Plate", [120, 60], [60, 52], 1.1, plate),
    T("bowl", "Bowl", [100, 90], [50, 78], 1.1, bowl),
    T("bread", "Bread", [110, 60], [55, 52], 1, bread),
    T("lemon", "Lemons", [120, 60], [52, 50], 1, lemon),
    T("candle", "Candle", [50, 130], [25, 122], 1, candle),
    T("moka", "Moka pot", [90, 110], [50, 102], 1, moka),
    T("cutlery", "Fork and knife", [70, 110], [35, 102], 1, cutlery),
    T("menu", "Menu card", [100, 120], [44, 112], 1, menuCard),
    T("bistro-table", "Bistro table", [160, 130], [80, 124], 1, bistroTable),
    T("pendant", "Pendant lamp", [80, 120], [40, 108], 1, pendant),
  )
  NIL.table = { bottle, glass, coffee, plate, bistroTable, pendant, candle }
})((window.NIL = window.NIL || {}))
