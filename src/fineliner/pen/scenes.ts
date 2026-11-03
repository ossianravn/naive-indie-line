// Scenes: rooms composed from the object library, back to front, inside the hand-drawn border. Every object gets its
// own fork of the scene's seed, so two speakers in one room are drawn differently; the room's layout comes from the
// scene's `room` stream, so every take of a scene has the same composition.
import type { Point } from "./geometry"
import { place, type DrawOptions } from "./library"
import type { Box } from "./shapes"
import { seedOf, stream, type Stream } from "./seed"
import { sheet, type Sheet } from "./layers"
import { pen, type HandName, type Pen } from "./stroke"

const W = 640
const H = 440
const M = 14

interface Stage {
  s: Sheet
  p: Pen
  r: Stream
  put: (
    id: string,
    key: string,
    at: Point,
    k?: number,
    options?: DrawOptions,
  ) => unknown
  corner: number
  floor: number
  walls(): void
  rug(): void
  border(): void
}

/**
 * What every room shares: the scene's pen and stream, a way to place objects, walls, a rug and the border. The sheet's
 * mask ids include the scene and hand, so two scenes drawn from one seed on the same page do not share masks.
 */
function stage(
  seed: string,
  hand: HandName,
  take: number,
  scene: string,
): Stage {
  const s = sheet(
    `fl${seedOf(`${seed}:${scene}:${hand}`).toString(36)}s${take}`,
  )
  const p = pen(seed, hand, take)
  const r = stream(seedOf(seed), "room")
  const put = (
    id: string,
    key: string,
    at: Point,
    k = 1,
    options: DrawOptions = {},
  ) => place(s, id, `${seed}:${key}`, hand, at, k, options, take)
  const corner = r.between(0.13, 0.22) * W
  const floor = r.between(0.6, 0.66) * H
  return {
    s,
    p,
    r,
    put,
    corner,
    floor,
    walls() {
      s.stroke(p.line([corner, M], [corner, floor]))
      s.stroke(p.line([corner, floor], [W - M, floor + r.signed() * 6]))
      s.stroke(p.line([corner, floor], [M, floor + (corner - M) * 0.62]))
    },
    rug() {
      const y = H - M - r.between(34, 56)
      const sway = r.next() * 3
      s.stroke(
        p.path(
          Array.from({ length: 9 }, (_, i): Point => [
            M + 40 + (i * (W - 2 * M - 80)) / 8,
            y + Math.sin((i / 8) * 4 + sway) * 14,
          ]),
        ),
      )
    },
    border: () =>
      s.stroke(
        p.edges([
          [M, M],
          [W - M, M],
          [W - M, H - M],
          [M, H - M],
        ]),
      ),
  }
}

function room(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, corner, floor, walls, rug, border } = stage(
    seed,
    hand,
    take,
    "room",
  )
  walls()
  if (r.chance(0.6)) {
    const [x0, x1] = [M + 12, corner - 14]
    s.stroke(
      p.edges(
        [
          [x0, floor + (corner - x0) * 0.62 + 4],
          [x0, H * 0.2],
          [x1, H * 0.12],
          [x1, floor + (corner - x1) * 0.62],
        ],
        false,
      ),
    )
    s.fill(p.disc([x1 - 7, H * 0.42], [1.8, 0], [0, 1.8]))
  }
  rug()
  put("picture", "picture", [r.between(0.62, 0.7) * W, H * 0.2], 0.875)
  put("disco-ball", "ball", [r.between(0.28, 0.36) * W, H * 0.25], 0.95, {
    top: M,
  })
  const b = put(
    "shelf",
    "shelf",
    [r.between(0.4, 0.45) * W, floor + 44],
    1.15,
  ) as Box
  put("speaker", "left", b.top(0.01, 0.22), 0.95)
  put("speaker", "right", b.top(0.83, 0.22), 0.95)
  put("turntable", "turntable", b.top(0.2, 0.08), 0.84)
  put("sunflower", "plant", [r.between(0.86, 0.89) * W, floor + 80], 1.35)
  // Everyone in a room is only their clothes, as on the label: here someone looking at a record.
  put("visitor", "second", [r.between(0.27, 0.31) * W, H - M - 34], 1.25, {
    pose: "record",
  })
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
  // Someone at work, seen from behind on an office chair, as in the label's rooms: only their clothes.
  put("visitor-seated", "worker", [x + r.between(130, 160), H - M - 20], 1.55)
  if (r.chance(0.5))
    put("cat", "cat", [r.between(0.84, 0.9) * W, H - M - 18], 0.85)
  else put("house-plant", "floor", [r.between(0.86, 0.9) * W, H - M - 6], 1.1)
  border()
  return s
}

export interface Scene {
  name: string
  /** The accessible name of a drawing of this scene. */
  label: string
  size: [number, number]
  compose: (seed: string, hand: HandName, take: number) => Sheet
}

export const SCENES = {
  room: {
    name: "Listening room",
    label: "A room corner with a record shelf, a disco ball and visitors",
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

export type SceneName = keyof typeof SCENES
