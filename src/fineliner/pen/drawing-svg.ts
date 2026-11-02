// drawing(): an object or a scene as SVG, once or as several takes. Takes are the same composition drawn with another
// pen each (line boil and settling); CSS cycles them, so a server-rendered page boils without a script. Only the
// first take is named for screen readers; the others are decorative copies.
import { getObject, tile } from "./library"
import { SCENES, type SceneName } from "./scenes"
import type { HandName } from "./stroke"

export interface DrawingOptions {
  /** An object id from the library, such as "turntable". */
  object?: string
  /** A scene: "room", "studio" or "bistro". */
  scene?: SceneName
  /** Same seed, same drawing, on the server, in the browser and in every build. */
  seed: string | number
  hand?: HandName
  /** 1 for a still drawing; 3 for line boil and settling. */
  takes?: number
  /** The accessible name. Defaults to the object's or scene's own; pass "" for a decorative drawing. */
  title?: string
}

/** The drawing's takes, each a complete SVG string. */
export function drawing({
  object,
  scene,
  seed,
  hand = "lively",
  takes = 1,
  title,
}: DrawingOptions): string[] {
  const key = String(seed)
  const out: string[] = []
  for (let take = 0; take < Math.max(1, takes); take++) {
    const named = take === 0 ? title : ""
    if (scene) {
      const sc = SCENES[scene]
      const label = named ?? sc.label
      out.push(
        sc
          .compose(key, hand, take)
          .svg(sc.size[0], sc.size[1], label || undefined),
      )
    } else {
      const o = object ? getObject(object) : undefined
      if (!o)
        throw new Error(
          `drawing() needs a known object or scene, got "${object ?? scene}"`,
        )
      const label = named ?? o.name
      // Pass "" through: an undefined label would fall back to the object's name and name every take.
      out.push(tile(o, key, hand, take, label))
    }
  }
  return out
}
