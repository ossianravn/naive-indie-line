// The middle floor, Studio: the long table with the pen pot, the paper stack and the lamp on it (the page's spots for
// pen, paper and light), someone seated in profile drawing at it, and the plotter with a sheet curling out while a
// colleague waits to take it. The whiteboard stands at the left, furniture a phone can lose.
import type { Box } from "@/fineliner/pen"
import { defineStrip, floor, FLOOR, stair } from "./strip"

defineStrip(
  "baghuset-studio",
  "The studio floor",
  "The studio floor: someone draws at the long table among pens, paper and a lamp, while a colleague waits for a sheet curling out of the plotter",
  (st) => {
    const { r, put, s, p } = st
    floor(st)
    stair(s, p, r.between(1290, 1300))
    put("whiteboard", "board", [r.between(200, 220), FLOOR - 4], 1.25, {
      w: 190,
      h: 120,
    })
    const top = put(
      "trestle-table",
      "table",
      [r.between(470, 480), FLOOR - 138],
      1.38,
      {
        w: 250,
        d: 80,
      },
    ) as Box
    // Back to front on the table: lamp at the back, then paper, then the pot nearest.
    put("desk-lamp", "lamp", top.top(0.84, 0.72), 1.1)
    put("paper-stack", "paper", top.top(0.36, 0.5), 0.85)
    put("pen-pot", "pot", top.top(0.12, 0.3), 0.8)
    put("person-sitting", "drawing", [r.between(420, 428), FLOOR - 2], 1.38, {
      pose: "draw",
      view: "right",
    })
    put("plotter", "plotter", [r.between(1060, 1072), FLOOR - 2], 1.05)
    // Waiting for the sheet, forearms ready, turned to the plotter.
    put("person-side", "waiting", [r.between(880, 890), FLOOR - 8], 1.45, {
      pose: "carry",
      view: "right",
    })
  },
)
