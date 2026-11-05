// The kit's four rooms, composed from registered collections on the shared stage.
// Every object keeps its own fork of the seed, with the same composition across takes.
import { add, type Point } from "../geometry"
import type { Sheet } from "../layers"
import { defineScene, stage, type Scene, type Stage } from "../scenes"
import type { Stream } from "../seed"
import type { Box } from "../shapes"
import type { HandName, Pen } from "../stroke"
import { soundLines } from "./parts"
import "./indie"
import "./food"
import "./studio"
import "./people"

const W = 640
const H = 440
const M = 14

/**
 * The shop floor at Listening Room, seen straight on, at the moment someone finds the record: they hold it high under
 * the pendant lamp while whoever minds the counter raises a hand to them, a record plays on the turntable and someone
 * at the bin, headphones on, sways to their own. Records face out on rails on the back wall; a gig poster; the cat.
 */
function room(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, floor, border } = stage(seed, hand, take, "room")
  s.stroke(p.line([M, floor], [W - M, floor + r.signed() * 6]))
  const lx = r.between(0.05, 0.08) * W
  put("sleeve-rail", "rail", [lx, floor - 112], 0.9, { w: r.between(190, 210) })
  if (r.chance(0.55))
    put("sleeve-rail", "high", [lx + 20, floor - 176], 0.9, { w: 150 })
  put("pendant", "lamp", [r.between(0.52, 0.55) * W, H * 0.2], 0.95, { top: M })
  put("poster", "poster", [r.between(0.86, 0.88) * W, H * 0.2], 1)
  shopCounter(put, s, p, r, [r.between(0.63, 0.65) * W, H - M - 40], 0.95, 130)
  const bx = r.between(0.04, 0.07) * W
  put("person-listening", "listener", [bx + 62, H - M - 16], 0.95)
  put("record-bin", "bin", [bx, H - M - 4], 0.95)
  put("cat", "cat", [r.between(0.33, 0.36) * W, H - M - 6], 0.8)
  put("person-cheer", "finder", [r.between(0.47, 0.49) * W, H - M - 12], 0.95)
  border()
  return s
}

/**
 * The counter, its left end at `at` (front foot), with whoever minds it standing `behind` along it, raising a hand to
 * the find; the turntable plays at its left end and the till sits in the middle. `w` is its width before scaling.
 */
function shopCounter(
  put: Stage["put"],
  s: Sheet,
  p: Pen,
  r: Stream,
  at: Point,
  k: number,
  behind: number,
  w = 196,
) {
  // Turned to the find, so the room's three people do not all look out.
  put("person-side", "staff", [at[0] + behind * k, at[1] - 12 * k], k * 1.2, {
    pose: "hail",
    view: "left",
  })
  const top = put("counter", "counter", at, k, { w }) as Box
  const deck = top.top(0.05, 0.22)
  put("turntable", "deck", deck, k * 0.53)
  soundLines(s, p, r, add(deck, [30 * k, -60 * k]), k * 0.95)
  put("till", "till", top.top(0.62, 0.3), k * 0.95)
}

/**
 * The same moment open, for a desktop's first screen: no border, the floor past both edges, the lamp hung from above
 * the sheet (from the page's own top rule), the left of the wall kept clear for the page's text, the counter running
 * off the right edge. A page crops it like a photograph, so nothing that matters sits near the sides.
 */
function roomWide(seed: string, hand: HandName, take: number) {
  const [w, h] = WIDE
  const { s, p, r, put } = stage(seed, hand, take, "room:wide", WIDE)
  const floor = 640
  s.stroke(p.line([-60, floor], [w + 60, floor + r.signed() * 6]))
  put("sleeve-rail", "rail", [800, floor - 250], 1.3, { w: 210 })
  if (r.chance(0.6))
    put("sleeve-rail", "high", [830, floor - 370], 1.3, { w: 160 })
  put("poster", "poster", [1420, 280], 1.45)
  put("pendant", "lamp", [1190, 250], 1.4, { top: -20 })
  shopCounter(put, s, p, r, [1270, h - 40], 1.4, 145, 300)
  put("person-listening", "listener", [880, h - 64], 1.6)
  put("record-bin", "bin", [790, h - 46], 1.32)
  put("cat", "cat", [1040, h - 14], 1.15)
  put("person-cheer", "finder", [1170, h - 22], 1.7)
  return s
}

/** The moment open and tall, for a phone, under the page's text: the bin and the counter cropped by the sides. */
function roomTall(seed: string, hand: HandName, take: number) {
  const [w, h] = TALL
  const { s, p, r, put } = stage(seed, hand, take, "room:tall", TALL)
  const floor = 480
  s.stroke(p.line([-60, floor], [w + 60, floor + r.signed() * 6]))
  put("sleeve-rail", "rail", [30, floor - 150], 1.3, { w: 300 })
  put("poster", "poster", [640, 170], 1.45)
  put("pendant", "lamp", [430, 170], 1.4, { top: -20 })
  shopCounter(put, s, p, r, [560, h - 40], 1.4, 155, 300)
  put("person-listening", "listener", [30, h - 64], 1.6)
  put("record-bin", "bin", [-60, h - 46], 1.32)
  put("cat", "cat", [250, h - 14], 1.15)
  put("person-cheer", "finder", [380, h - 22], 1.7)
  return s
}

const WIDE: [number, number] = [1600, 860]
const TALL: [number, number] = [800, 900]

function studio(seed: string, hand: HandName, take: number) {
  const { s, r, put, floor, walls, border } = stage(seed, hand, take, "studio")
  walls()
  put("window", "window", [r.between(0.24, 0.3) * W, floor - 120], 0.9)
  put("sticky-notes", "notes", [r.between(0.58, 0.62) * W, H * 0.3], 0.8)
  if (r.chance(0.6))
    put("picture", "picture", [r.between(0.84, 0.88) * W, H * 0.24], 0.65)
  const top = put("desk", "desk", [r.between(0.34, 0.4) * W, floor + 74], 1, {
    w: 280,
    d: 74,
    legs: 80,
  }) as Box
  put("books", "books", top.top(0.02, 0.62), 0.62)
  put("house-plant", "plant", top.top(0.32, 0.75), 0.65)
  if (r.chance(0.5)) put("monitor", "screen", top.top(0.62, 0.62), 1)
  else put("laptop", "screen", top.top(0.4, 0.3), 0.85)
  put("desk-lamp", "lamp", top.top(0.92, 0.7), 0.75)
  put("mug", "mug", top.top(0.2, 0.18), 0.62)
  // Walking over to the desk, looking at it.
  put("person-side", "person", [r.between(0.13, 0.18) * W, H - M - 14], 1.25, {
    pose: "walk",
    view: "right",
  })
  if (r.chance(0.6))
    put("cat", "cat", [r.between(0.82, 0.9) * W, H - M - 18], 0.9)
  border()
  return s
}

function bistro(seed: string, hand: HandName, take: number) {
  const { s, r, put, floor, walls, rug, border } = stage(
    seed,
    hand,
    take,
    "bistro",
  )
  walls()
  rug()
  put("picture", "picture", [r.between(0.72, 0.78) * W, H * 0.24], 0.8)
  put("window", "window", [r.between(0.28, 0.33) * W, floor - 128], 0.85, {
    view: "moon",
  })
  const x = r.between(0.5, 0.55) * W
  const y = H - M - 36
  put("pendant", "lamp", [x, H * 0.24], 1.05, { top: M })
  put("chair", "far", [x + 34, y - 22], 0.95)
  put("bistro-table", "table", [x, y], 1.1)
  const t: Point = [x, y - 114]
  put("bottle", "wine", [t[0] - 34, t[1] + 2], 0.62)
  put("candle", "candle", [t[0] + 44, t[1] - 2], 0.55)
  put("glass", "left", [t[0] - 12, t[1] + 8], 0.75)
  put("glass", "right", [t[0] + 22, t[1] + 4], 0.75)
  put("plate", "plate", [t[0] - 2, t[1] + 22], 0.62)
  // A guest coming in, seen from behind; the waiter, if there is one, turns to the table.
  put("person-back", "guest", [r.between(0.2, 0.25) * W, H - M - 14], 1.25, {
    pose: r.pick(["stand", "walk"]),
  })
  if (r.chance(0.5))
    put("person-side", "waiter", [r.between(0.84, 0.88) * W, H - M - 24], 1.1, {
      pose: "stand",
      view: "left",
    })
  else put("cat", "cat", [r.between(0.84, 0.88) * W, H - M - 24], 0.9)
  border()
  return s
}

function work(seed: string, hand: HandName, take: number) {
  const { s, r, put, floor, walls, border } = stage(seed, hand, take, "work")
  walls()
  put("window", "window", [r.between(0.27, 0.32) * W, floor - 124], 0.85)
  put("picture", "picture", [r.between(0.8, 0.84) * W, H * 0.22], 0.7)
  const x = r.between(0.27, 0.31) * W
  const top = put("desk", "desk", [x, floor + 62], 1, {
    w: 300,
    d: 70,
    legs: 84,
  }) as Box
  // Back to front: the cactus stands behind the books, clear of the screen.
  put("cactus", "plant", top.top(0.15, 0.9), 0.5)
  put("books", "books", top.top(0.02, 0.45), 0.58)
  if (r.chance(0.65)) put("monitor", "screen", top.top(0.5, 0.6), 0.95)
  else put("laptop", "screen", top.top(0.36, 0.3), 0.8)
  put("mug", "mug", top.top(0.72, 0.2), 0.55)
  put("desk-lamp", "lamp", top.top(0.9, 0.65), 0.75)
  // Someone at work, seen from behind on an office chair.
  put("person-seated", "worker", [x + r.between(130, 160), H - M - 20], 1.55)
  if (r.chance(0.5))
    put("cat", "cat", [r.between(0.84, 0.9) * W, H - M - 18], 0.85)
  else put("house-plant", "floor", [r.between(0.86, 0.9) * W, H - M - 6], 1.1)
  border()
  return s
}

const BUILT_IN = {
  room: {
    name: "Listening room",
    label:
      "A record shop: someone holds up the record they just found, the shopkeeper raises a hand, a record plays",
    size: [W, H],
    compose: room,
    open: {
      wide: { size: WIDE, compose: roomWide },
      tall: { size: TALL, compose: roomTall },
    },
  },
  studio: {
    name: "Studio",
    label:
      "A studio with a desk, a screen and sticky notes, and someone walking over to it",
    size: [W, H],
    compose: studio,
  },
  bistro: {
    name: "Bistro",
    label:
      "A bistro table for two with wine, a candle and a plate under a pendant lamp, and a guest coming in",
    size: [W, H],
    compose: bistro,
  },
  work: {
    name: "At work",
    label:
      "Someone at work at a desk under a window, seen from behind on an office chair",
    size: [W, H],
    compose: work,
  },
} satisfies Record<string, Scene>

for (const [name, scene] of Object.entries(BUILT_IN)) defineScene(name, scene)

/** The kit's own rooms, for listing them apart from scenes a project adds. */
export const ROOMS = Object.keys(BUILT_IN) as (keyof typeof BUILT_IN)[]
