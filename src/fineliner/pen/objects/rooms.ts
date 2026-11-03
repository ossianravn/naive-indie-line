// The kit's four rooms, composed from registered collections on the shared stage.
// Every object keeps its own fork of the seed, with the same composition across takes.
import type { Point } from "../geometry"
import { defineScene, stage, type Scene } from "../scenes"
import type { Box } from "../shapes"
import type { HandName } from "../stroke"
import "./indie"
import "./food"
import "./studio"
import "./people"

const W = 640
const H = 440
const M = 14

/**
 * The shop floor at Listening Room, seen straight on: a back wall of records face out on rails, a gig poster and a
 * pendant lamp; browser bins with someone flicking through one; the counter with the till and a turntable to try a
 * record on, and now and then someone behind it.
 */
function room(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, floor, border } = stage(seed, hand, take, "room")
  s.stroke(p.line([M, floor], [W - M, floor + r.signed() * 6]))
  const rails = r.chance(0.55) ? 2 : 1
  put("sleeve-rail", "rail", [r.between(0.05, 0.08) * W, floor - 96], 0.9, {
    w: r.between(270, 300),
  })
  if (rails === 2)
    put("sleeve-rail", "high", [r.between(0.08, 0.12) * W, floor - 162], 0.9, {
      w: r.between(190, 230),
    })
  put("pendant", "lamp", [r.between(0.5, 0.54) * W, H * 0.2], 0.95, { top: M })
  put("poster", "poster", [r.between(0.68, 0.72) * W, H * 0.27], 1)
  // The counter on the right, with whoever minds the shop behind it.
  const cx = r.between(0.61, 0.64) * W
  if (r.chance(0.75))
    put("visitor", "staff", [cx + r.between(110, 140), H - M - 52], 1.15, {
      pose: "stand",
    })
  const top = put("counter", "counter", [cx, H - M - 40], 0.95, {
    w: 196,
  }) as Box
  put("turntable", "deck", top.top(0.05, 0.22), 0.5)
  put("till", "till", top.top(0.64, 0.3), 0.9)
  // The bins, the far one first; someone stands behind the near one, hands in the records.
  const bx = r.between(0.08, 0.12) * W
  put("record-bin", "far", [bx + r.between(150, 165), H - M - 30], 0.9)
  put("visitor", "browser", [bx + 60, H - M - 16], 1.15, { pose: "browse" })
  put("record-bin", "near", [bx, H - M - 4], 0.95)
  if (r.chance(0.5))
    put("house-plant", "plant", [r.between(0.54, 0.57) * W, H - M - 6], 1)
  else put("crate", "crate", [r.between(0.47, 0.5) * W, H - M - 4], 0.7)
  border()
  return s
}

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
  put("visitor", "person", [r.between(0.13, 0.18) * W, H - M - 14], 1.25, {
    pose: "walk",
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
  put("visitor", "guest", [r.between(0.2, 0.25) * W, H - M - 14], 1.25, {
    pose: r.pick(["stand", "walk"]),
  })
  if (r.chance(0.5))
    put("visitor", "waiter", [r.between(0.84, 0.88) * W, H - M - 24], 1.1, {
      pose: "stand",
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
  // Someone at work, seen from behind on an office chair: only their clothes.
  put("visitor-seated", "worker", [x + r.between(130, 160), H - M - 20], 1.55)
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
      "A record shop floor: browser bins, records face out on the wall and the counter with its till",
    size: [W, H],
    compose: room,
  },
  studio: {
    name: "Studio",
    label:
      "A studio with a desk, a screen, sticky notes and a person with a coffee",
    size: [W, H],
    compose: studio,
  },
  bistro: {
    name: "Bistro",
    label:
      "A bistro table for two with wine, a candle and a plate, under a pendant lamp",
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
