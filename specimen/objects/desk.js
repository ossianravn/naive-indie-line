// Studio: the freelancer's desk and what collects on it.
;(function (NIL) {
  "use strict"

  const { add, lerp, dot, arc, rect, turn, depth, box, cylinder, handle, scribble } = NIL.shapes

  /** A desk whose front-left foot stands at `at`. Returns its top, for placing things on it. */
  function desk(s, p, r, at, k = 1, { w = 230 * k, d = 70 * k, legs = 70 * k } = {}) {
    const o = depth(r)
    const [x, y] = at
    const back = (u) => add([x + w * u, y - legs], o, d)
    s.stroke(p.line(add(back(0), [3 * k, 0]), add(back(0), [3 * k, legs])))
    s.stroke(p.line(add(back(1), [-3 * k, 0]), add(back(1), [-3 * k, legs])))
    const drawer = box(s, p, o, [x + w * 0.66, y - legs + 26 * k], w * 0.3, 20 * k, d * 0.9)
    s.stroke(p.line(drawer.front(0.4, 0.5), drawer.front(0.6, 0.5)))
    const top = box(s, p, o, [x, y - legs], w, 7 * k, d)
    s.stroke(p.line([x + 3 * k, y - legs], [x + 3 * k, y]))
    s.stroke(p.line([x + w - 3 * k, y - legs], [x + w - 3 * k, y]))
    return top
  }

  function officeChair(s, p, r, at, k = 1) {
    const [x, y] = at
    const hub = [x, y - 12 * k]
    for (let i = 0; i < 5; i++) {
      const a = 200 + i * 36
      const end = add(hub, [Math.cos((a * Math.PI) / 180) * 34 * k, Math.abs(Math.sin((a * Math.PI) / 180)) * 9 * k + 2 * k])
      s.stroke(p.line(hub, end))
      s.stroke(p.ring(add(end, [0, 3 * k]), [3 * k, 0], [0, 3 * k]))
    }
    s.stroke(p.line([x - 2.5 * k, y - 12 * k], [x - 2.5 * k, y - 50 * k]))
    s.stroke(p.line([x + 2.5 * k, y - 12 * k], [x + 2.5 * k, y - 50 * k]))
    const back = [[x - 22 * k, y - 66 * k], [x + 22 * k, y - 66 * k], [x + 24 * k, y - 120 * k], [x - 24 * k, y - 120 * k]]
    s.blank(p.shape(back))
    s.stroke(p.edges(back))
    s.stroke(p.line([x, y - 66 * k], [x, y - 58 * k]))
    const seat = [x, y - 58 * k]
    s.blank(p.shape([...arc(seat, 30 * k, 9 * k, 180, 360, 10), ...arc(add(seat, [0, 6 * k]), 30 * k, 9 * k, 0, 180, 10)]))
    s.stroke(p.ring(seat, [30 * k, 0], [0, 9 * k]))
    s.stroke(p.path(arc(add(seat, [0, 6 * k]), 30 * k, 9 * k, 0, 180, 12)))
  }

  function deskLamp(s, p, r, at, k = 1) {
    const [x, y] = at
    const flip = r.chance(0.5) ? 1 : -1
    const P = (u, v) => [x + flip * u * k, y - v * k]
    s.blank(p.disc(P(0, 4), [24 * k, 0], [0, 6 * k]))
    s.stroke(p.ring(P(0, 4), [24 * k, 0], [0, 6 * k]))
    const [joint, head] = [P(-18, 70), P(34, 104)]
    s.stroke(p.line(P(0, 6), joint))
    s.stroke(p.line(joint, head))
    s.stroke(p.ring(...dot(joint, 3.5 * k)))
    const shade = [head, P(28, 112), P(62, 86), P(50, 74)].map((pt) => turn(pt, head, flip * 6))
    s.fill(p.shape(shade))
    s.stroke(p.path(arc(lerp(shade[2], shade[3], 0.5), 7 * k, 5 * k, 0, 180, 8).map((pt) => turn(pt, lerp(shade[2], shade[3], 0.5), flip * -40))))
  }

  function books(s, p, r, at, k = 1) {
    const o = depth(r)
    let [x, y] = at
    for (let i = 0; i < 3; i++) {
      const w = r.between(70, 96) * k
      const h = r.between(9, 14) * k
      const b = box(s, p, o, [x, y], w, h, 50 * k)
      s.stroke(p.line(b.front(0.06, 0.15), b.front(0.06, 0.85)))
      if (r.chance(0.5)) s.stroke(p.line(b.front(0.8, 0.5), b.front(0.94, 0.5)))
      x += r.signed() * 8 * k
      y -= h
    }
    if (r.chance(0.6)) s.fill(p.shape([[x + 30 * k, y], [x + 36 * k, y], [x + 36 * k, y + 22 * k], [x + 33 * k, y + 18 * k], [x + 30 * k, y + 22 * k]]))
  }

  function sketchbook(s, p, r, at, k = 1) {
    const o = [0.28 + r.signed() * 0.06, -0.62]
    const [x, y] = at
    const [w, d] = [74 * k, 78 * k]
    const page = (x0) => [[x0, y], [x0 + w, y], add([x0 + w, y], o, d), add([x0, y], o, d)]
    const [left, right] = [page(x), page(x + w)]
    s.blank(p.shape([left[0], right[1], right[2], left[3]]))
    s.stroke(p.edges(left))
    s.stroke(p.edges(right))
    const q = (pg, u, v) => lerp(lerp(pg[0], pg[1], u), lerp(pg[3], pg[2], u), v)
    for (let v = 0.25; v < 0.85; v += 0.15) s.stroke(p.line(q(left, 0.15, v), q(left, r.between(0.6, 0.85), v)))
    const house = [q(right, 0.3, 0.3), q(right, 0.62, 0.3), q(right, 0.62, 0.55), q(right, 0.46, 0.72), q(right, 0.3, 0.55)]
    s.stroke(p.edges(house))
    s.fill(p.shape([q(right, 0.42, 0.3), q(right, 0.5, 0.3), q(right, 0.5, 0.42), q(right, 0.42, 0.42)]))
    const [tip, end] = [q(right, 0.55, 0.15), q(right, 1.15, 0.95)]
    const side = [0, 3 * k]
    const pencil = [lerp(tip, end, 0.08), end, add(end, side), add(lerp(tip, end, 0.08), side)]
    s.blank(p.shape([tip, ...pencil]))
    s.stroke(p.edges(pencil))
    s.fill(p.shape([tip, pencil[0], pencil[3]]))
    s.stroke(p.line(lerp(pencil[0], pencil[1], 0.86), lerp(pencil[3], pencil[2], 0.86)))
  }

  function stickyNotes(s, p, r, at, k = 1) {
    const [x, y] = at
    for (let i = 0; i < 3; i++) {
      const c = [x + (i * 46 + r.signed() * 4) * k, y - (26 + (i % 2) * 14) * k]
      const tilt = r.signed() * 7
      const note = rect(c[0] - 20 * k, c[1] - 20 * k, 40 * k, 40 * k).map((pt) => turn(pt, c, tilt))
      s.blank(p.shape(note))
      s.wash(p.shape(note))
      s.stroke(p.edges(note))
      s.fill(p.disc(...dot(turn([c[0], c[1] - 15 * k], c, tilt), 2 * k)))
      scribble(s, p, r, c[0] - 13 * k, c[1] - 4 * k, 26 * k, 3, 7 * k)
    }
  }

  function mug(s, p, r, at, k = 1) {
    const [x, y] = at
    const cup = cylinder(s, p, [x, y - 44 * k], 20 * k, 6 * k, 40 * k)
    handle(s, p, x + 20 * k, y - 36 * k, y - 14 * k, 11 * k)
    s.fill(p.disc(cup.top, [16.5 * k, 0], [0, 4.4 * k]))
    const m = [x - 2 * k, y - 22 * k]
    if (r.chance(0.5)) s.fill(p.shape([add(m, [0, 6 * k]), add(m, [-7 * k, -1 * k]), add(m, [-4 * k, -6 * k]), add(m, [0, -3 * k]), add(m, [4 * k, -6 * k]), add(m, [7 * k, -1 * k])]))
    else scribble(s, p, r, x - 12 * k, y - 26 * k, 22 * k, 2, 6 * k)
  }

  function coffeeToGo(s, p, r, at, k = 1) {
    const [x, y] = at
    const cup = [[x - 13 * k, y], [x + 13 * k, y], [x + 19 * k, y - 66 * k], [x - 19 * k, y - 66 * k]]
    s.blank(p.shape(cup))
    s.stroke(p.edges(cup))
    const sleeve = [[x - 15 * k, y - 18 * k], [x + 15 * k, y - 18 * k], [x + 17.5 * k, y - 46 * k], [x - 17.5 * k, y - 46 * k]]
    s.wash(p.shape(sleeve))
    s.stroke(p.edges(sleeve))
    s.stroke(p.ring([x, y - 32 * k], [6 * k, 0], [0, 6 * k]))
    s.stroke(p.edges(rect(x - 21 * k, y - 74 * k, 42 * k, 8 * k)))
    s.stroke(p.path([[x - 17 * k, y - 74 * k], [x - 13 * k, y - 82 * k], [x + 13 * k, y - 82 * k], [x + 17 * k, y - 74 * k]]))
  }

  const T = (id, name, size, at, k, draw) => ({ id, name, collection: "studio", size, at, k, draw })
  NIL.objects.define(
    T("desk", "Desk", [290, 150], [12, 140], 1, desk),
    T("office-chair", "Office chair", [100, 140], [50, 132], 1, officeChair),
    T("desk-lamp", "Desk lamp", [130, 130], [50, 122], 1, deskLamp),
    T("books", "Books", [140, 90], [20, 82], 1, books),
    T("sketchbook", "Sketchbook", [200, 110], [14, 100], 1, sketchbook),
    T("sticky-notes", "Sticky notes", [160, 90], [26, 74], 1, stickyNotes),
    T("mug", "Mug", [80, 80], [36, 72], 1, mug),
    T("coffee-to-go", "Coffee to go", [60, 100], [30, 92], 1, coffeeToGo),
  )
  NIL.desk = { desk, officeChair, deskLamp, mug, books }
})((window.NIL = window.NIL || {}))
