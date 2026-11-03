// The stage and scene registry: shared walls, a rug, a border and a way to place registered objects.
// A project adds its own scenes with defineScene(); importing the engine registers no rooms.
import type { Point } from "./geometry"
import { place, type DrawOptions } from "./library"
import { seedOf, stream, type Stream } from "./seed"
import { sheet, type Sheet } from "./layers"
import { pen, type HandName, type Pen } from "./stroke"

const W = 640
const H = 440
const M = 14

export interface Stage {
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
  /** The sheet's size and the border's margin. */
  w: number
  h: number
  m: number
  /** Where the side wall meets the back wall, and where the back wall meets the floor. */
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
export function stage(
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
    w: W,
    h: H,
    m: M,
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

export interface Scene {
  name: string
  /** The accessible name of a drawing of this scene. */
  label: string
  size: [number, number]
  compose: (seed: string, hand: HandName, take: number) => Sheet
}

/** The kit's four rooms live in objects/rooms.ts; a project can add its own with defineScene. */
export type SceneName = "room" | "studio" | "bistro" | "work" | (string & {})

// Shared per realm, as the object library is (library.ts).
export const SCENES = ((globalThis as { [key: symbol]: unknown })[
  Symbol.for("fineliner.scenes")
] ??= {}) as Record<string, Scene>

/** Add a scene, or replace one with the same name, so drawing({ scene }) and <Drawing scene> find it. */
export function defineScene(name: string, scene: Scene) {
  SCENES[name] = scene
}
