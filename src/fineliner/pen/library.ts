// The object library's registry. Each object is one draw function filed in a collection, so drawing(), scenes and
// the docs find objects the same way. The library is meant to keep growing; defining an object is all it takes.
import type { Point } from "./geometry"
import { seedOf, stream, type Stream } from "./seed"
import { sheet, type Sheet } from "./layers"
import { pen, type HandName, type Pen } from "./stroke"

export const COLLECTIONS = [
  ["indie", "Indie"],
  ["food", "Food & drink"],
  ["studio", "Studio"],
  ["people", "People"],
] as const

export type Collection = (typeof COLLECTIONS)[number][0]

/** Choices an object may take instead of drawing them from its seed. */
export interface DrawOptions {
  kind?: string
  pose?: string
  view?: string
  dish?: string
  hair?: string
  glasses?: boolean
  beard?: boolean
  black?: boolean
  wine?: boolean
  /** Where a hanging object's cord starts. */
  top?: number
  w?: number
  h?: number
  d?: number
  legs?: number
}

/** Draw one object into a sheet at `at`, scaled by `k`. What it returns (a box top, say) lets scenes stack things. */
export type Draw = (
  s: Sheet,
  p: Pen,
  r: Stream,
  at: Point,
  k: number,
  options: DrawOptions,
) => unknown

export interface DrawingObject {
  id: string
  name: string
  collection: Collection
  /** The object's own tile, and where and how large it draws there. */
  size: [number, number]
  at: Point
  k: number
  tags: string[]
  draw: Draw
}

/**
 * A collection's object maker, so each collection file writes one line per object:
 * `const T = objectsIn("studio")`, then `define(T("desk", "Desk", [290, 150], [12, 140], 1, desk, ["work"]))`.
 */
export const objectsIn =
  (collection: Collection) =>
  (
    id: string,
    name: string,
    size: [number, number],
    at: Point,
    k: number,
    draw: Draw,
    tags: string[],
  ): DrawingObject => ({ id, name, collection, size, at, k, draw, tags })

const all: DrawingObject[] = []

/** Register objects. Defining an id again replaces it in place, so an edited collection shows up on hot reload. */
export function define(...objects: DrawingObject[]) {
  for (const o of objects) {
    const i = all.findIndex((x) => x.id === o.id)
    if (i < 0) all.push(o)
    else all[i] = o
  }
}

export const getObject = (id: string) => all.find((o) => o.id === id)
export const listObjects = (collection?: Collection) =>
  all.filter((o) => !collection || o.collection === collection)

/**
 * Draw an object into an existing sheet with its own fork of the seed. The composition comes from the `shape`
 * stream and never changes between takes; only the pen does.
 */
export function place(
  s: Sheet,
  id: string,
  seed: string,
  hand: HandName,
  at: Point,
  k = 1,
  options: DrawOptions = {},
  take = 0,
): unknown {
  const o = getObject(id)
  if (!o) throw new Error(`No drawing object "${id}"`)
  const key = `${seed}:${id}`
  return o.draw(
    s,
    pen(key, hand, take),
    stream(seedOf(key), "shape"),
    at,
    k,
    options,
  )
}

/** One object alone on its tile, as an SVG string, named by `label` (the object's name by default); "" leaves it
 * decorative (aria-hidden). */
export function tile(
  o: DrawingObject,
  seed: string,
  hand: HandName,
  take = 0,
  label: string = o.name,
) {
  const s = sheet(`fl${seedOf(`${seed}:${o.id}`).toString(36)}t${take}`)
  place(s, o.id, seed, hand, o.at, o.k, {}, take)
  return s.svg(o.size[0], o.size[1], label || undefined)
}
