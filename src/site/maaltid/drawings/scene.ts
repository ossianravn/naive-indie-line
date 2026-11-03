import { box, defineScene, depth, stage, type HandName } from "@/fineliner/pen"
import { longTable } from "./objects"

function compose(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, m, floor, walls, border } = stage(
    seed,
    hand,
    take,
    "maaltid",
  )
  walls()
  put("window", "window", [r.between(160, 166), 183], 0.85, { view: "moon" })
  // One open plank shelf, with an uneven but quiet rhythm of bottles and jars.
  const shelf = box(s, p, depth(r), [291, 161], 288, 5, 20)
  for (const [i, u] of [0.09, 0.24, 0.42, 0.67].entries())
    put(
      "bottle",
      `shelf-wine-${i}`,
      shelf.top(u + r.signed() * 0.01, 0.55),
      0.43,
    )
  for (const [i, u] of [0.82, 0.96].entries())
    put("jar", `shelf-jar-${i}`, shelf.top(u, 0.5), 0.36)
  const x = r.between(176, 182)
  for (const [i, dx] of [113, 264].entries())
    put("pendant", `lamp-${i}`, [x + dx, r.between(210, 215)], 1, { top: m })
  const top = longTable(s, p, r, [x, floor + 100], 1.32)
  // Far settings first. All anchors are points on the returned plank top.
  put("carafe", "water", top.top(0.4, 0.88), 0.54)
  put("glass", "far-left-glass", top.top(0.15, 0.82), 0.57, { wine: false })
  put("glass", "far-right-glass", top.top(0.7, 0.82), 0.57, { wine: false })
  put("candle", "candle", top.top(0.93, 0.75), 0.53)
  put("glass", "near-glass", top.top(0.6, 0.15), 0.57, { wine: false })
  put("plate", "left-plate", top.top(0.15, 0.13), 0.57, { dish: "fish" })
  put("plate", "right-plate", top.top(0.77, 0.13), 0.57, { dish: "pasta" })
  put("bread", "bread", top.top(0.46, 0.1), 0.46)
  put("maaltid-crate", "floor-wine", [r.between(514, 520), floor + 128], 0.64)
  put("visitor", "waiter", [r.between(107, 116), floor + 109], 1.06, {
    pose: "stand",
  })
  border()
  return s
}

defineScene("maaltid", {
  name: "Dining room",
  label:
    "MÅLTID's dining room: a long table laid for supper under two pendant lamps, bottles on a shelf and a crate of wine on the floor",
  size: [640, 440],
  compose,
})
