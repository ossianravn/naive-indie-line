// The top floor, Work: the pin-up is the page's wall above, so the strip is its floor. Someone on the stepladder pins
// up the last sheet while a colleague points at where it goes; the plan chest (the archive) and a bin of rolled
// drawings stand by, and the stair rises at the right.
import type { Point } from "@/fineliner/pen"
import { defineStrip, floor, FLOOR, stair } from "./strip"

defineStrip(
  "baghuset-top",
  "The top floor",
  "The top floor of a drawing office: someone on a stepladder pins up the last sheet while a colleague points at where it goes, beside a plan chest and a bin of rolled drawings",
  (st) => {
    const { r, put, s, p } = st
    floor(st)
    stair(s, p, r.between(1284, 1296))
    put("house-plant", "plant", [r.between(130, 150), FLOOR - 4], 1.25)
    put("paper-rolls", "rolls", [r.between(266, 280), FLOOR - 6], 1.35)
    put("plan-chest", "chest", [r.between(410, 422), FLOOR - 4], 1.25, {
      w: 232,
    })
    const steps = put(
      "stepladder",
      "ladder",
      [r.between(926, 936), FLOOR - 2],
      1.6,
    ) as Point[]
    const foot = steps[1] as Point
    put("person-back", "pinning", [foot[0] - 2, foot[1] + 4], 1.5, {
      pose: "reach",
    })
    // The colleague turned to the ladder, pointing at where the sheet should go.
    put("person-side", "pointing", [r.between(774, 790), FLOOR - 8], 1.5, {
      pose: "point",
      view: "right",
    })
  },
)
