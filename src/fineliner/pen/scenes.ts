// The stage and scene registry: shared walls, a rug, a border and a way to place registered objects.
// A project adds its own scenes with defineScene(); importing the engine registers no rooms.
import type { Point } from "./geometry"
import { place, type DrawOptions } from "./library"
import { seedOf, stream, type Stream } from "./seed"
import { sheet, type Region, type Sheet } from "./layers"
import type { Bounds } from "./path"
import { pen, type HandName, type Pen } from "./stroke"

const M = 14

/**
 * How a scene is drawn: boxed in its border (the default, 640 by 440), or open, without a border, its floor running
 * past both edges so it can fill a page section: wide for a desktop's first screen, tall for a phone's. A strip
 * (about 1600 by 520) is the floor of a page section whose wall is the page above it: no border and no back wall,
 * composed to be cropped from the centre, with the moment and everything operable between x 400 and 1200, so one
 * drawing serves a wide container whole and a narrow one by its middle half.
 */
export type SceneFormat = "boxed" | "wide" | "tall" | "strip"

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
  /** Record a part a page should address (a whiteboard's face, a sign's board) under its own key. */
  mark(key: string, id: string, box: Bounds | undefined): void
  walls(): void
  rug(): void
  border(): void
}

/**
 * What every room shares: the scene's pen and stream, a way to place objects, walls, a rug and the border. The sheet's
 * mask ids include the scene and hand, so two scenes drawn from one seed on the same page do not share masks (an open
 * format passes its own name, such as "room:wide"). `size` is the sheet's, 640 by 440 unless an open format says.
 */
export function stage(
  seed: string,
  hand: HandName,
  take: number,
  scene: string,
  [W, H]: [number, number] = [640, 440],
): Stage {
  const s = sheet(
    `fl${seedOf(`${seed}:${scene}:${hand}`).toString(36)}s${take}`,
  )
  const p = pen(seed, hand, take)
  const r = stream(seedOf(seed), "room")
  const mark = (key: string, id: string, box: Bounds | undefined) => {
    if (box) s.regions.push({ key, id, box })
  }
  // Each placed object is measured as it is drawn, so a page can find it by its key; the SVG is unchanged.
  const put = (
    id: string,
    key: string,
    at: Point,
    k = 1,
    options: DrawOptions = {},
  ) => {
    let out: unknown
    mark(
      key,
      id,
      s.measure(() => {
        out = place(s, id, `${seed}:${key}`, hand, at, k, options, take)
      }),
    )
    return out
  }
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
    mark,
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

type Compose = (seed: string, hand: HandName, take: number) => Sheet

export interface Scene {
  name: string
  /** The accessible name of a drawing of this scene. */
  label: string
  size: [number, number]
  compose: Compose
  /** The scene open, for a page section: no border, the floor past both edges, the wall's left kept clear for text. */
  open?: Partial<
    Record<
      Exclude<SceneFormat, "boxed">,
      { size: [number, number]; compose: Compose }
    >
  >
}

/** The size and composer of a scene in a format; a scene without that open format is drawn boxed. */
export function sceneIn(scene: Scene, format: SceneFormat = "boxed") {
  return (format !== "boxed" && scene.open?.[format]) || scene
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

/**
 * Where each placed object (and each part a scene marked) lands in a scene, keyed by the key it was put under, in the
 * drawing's own units, with the drawing's size. Composition never comes from the pen, so take 0's regions hold for
 * every take. A page turns them into percentages to put a button over the lamp without measuring anything.
 */
export function sceneRegions({
  scene,
  format,
  seed,
  hand = "lively",
}: {
  scene: SceneName
  format?: SceneFormat
  seed: string | number
  hand?: HandName
}): { size: [number, number]; regions: Record<string, Region> } {
  const sc = SCENES[scene]
  if (!sc) throw new Error(`sceneRegions() needs a known scene, got "${scene}"`)
  const { size, compose } = sceneIn(sc, format)
  const regions: Record<string, Region> = {}
  for (const region of compose(String(seed), hand, 0).regions)
    regions[region.key] = region
  return { size, regions }
}
