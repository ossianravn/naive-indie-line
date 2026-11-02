// The object library's registry. Each object is drawn by its own function and filed in a collection, so the library,
// the scenes and (later) the kit's <Drawing> all find objects the same way. The library is meant to keep growing.
;(function (NIL) {
  "use strict"

  const all = []

  const COLLECTIONS = [
    ["indie", "Indie"],
    ["table", "Food & drink"],
    ["studio", "Studio"],
    ["people", "People"],
  ]

  /**
   * define({ id, name, collection, size: [w, h], at: [x, y], k, draw(s, p, r, at, k, options) })
   * `size` is the object's own tile; `at` and `k` are where and how large it draws there.
   */
  function define(...objects) {
    for (const o of objects) all.push({ k: 1, ...o })
  }

  const get = (id) => all.find((o) => o.id === id)
  const list = (collection) => all.filter((o) => !collection || o.collection === collection)

  /** Draw an object into a sheet with its own seed fork, at a place and scale the caller chooses. */
  function place(s, id, seed, hand, at, k, options) {
    const o = get(id)
    const key = `${seed}:${id}`
    return o.draw(s, NIL.pen(key, hand), NIL.stream(NIL.seedOf(key), "shape"), at, k, options)
  }

  /** One object alone on its tile. */
  function tile(o, seed, hand) {
    const s = NIL.sheet()
    place(s, o.id, seed, hand, o.at, o.k)
    return s.svg(o.size[0], o.size[1], o.name)
  }

  NIL.objects = { COLLECTIONS, define, get, list, place, tile }
})((window.NIL = window.NIL || {}))
