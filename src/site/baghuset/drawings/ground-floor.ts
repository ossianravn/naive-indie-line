// The ground floor, People: lunch at the long table. Two sit at its ends, one stands behind it with a mug, one is on
// the phone by the coat rack, one comes down the stair, the cat sleeps under the table and the clock says it is
// lunch. Each person is drawn with the hair, glasses and beard the people list gives them, so the person at the
// table is the person in the list.
import type { Box } from "@/fineliner/pen"
import { PEOPLE } from "../data"
import { defineStrip, floor, FLOOR, stair } from "./strip"

const look = (id: string) => {
  const p = PEOPLE.find((person) => person.id === id)
  return p ? { hair: p.hair, glasses: p.glasses, beard: p.beard } : {}
}

defineStrip(
  "baghuset-ground",
  "Lunch on the ground floor",
  "Lunch on the ground floor: two at the ends of the long table, one standing with a mug, one on the phone by the coat rack, one coming down the stairs, and the cat asleep under the table",
  (st) => {
    const { r, put, s, p } = st
    floor(st)
    stair(s, p, r.between(1290, 1300))
    put("wall-clock", "clock", [r.between(1040, 1060), 120], 1.2)
    put("coat-rack", "rack", [r.between(300, 315), FLOOR - 4], 1.35)
    put("person-side", "sille", [r.between(405, 415), FLOOR - 8], 1.45, {
      pose: "call",
      view: "left",
      ...look("sille"),
    })
    // Asta stands behind the table, so she is drawn before it.
    put(
      "person-mug",
      "asta",
      [r.between(745, 760), FLOOR - 40],
      1.32,
      look("asta"),
    )
    const top = put(
      "trestle-table",
      "table",
      [r.between(580, 590), FLOOR - 138],
      1.38,
      {
        w: 250,
        d: 80,
      },
    ) as Box
    put("bowl", "bowl", top.top(0.3, 0.45), 0.7)
    put("bread", "bread", top.top(0.55, 0.55), 0.6)
    put("mug", "mug-a", top.top(0.18, 0.2), 0.55)
    put("mug", "mug-b", top.top(0.82, 0.25), 0.55)
    put("cat", "tusse", [r.between(740, 760), FLOOR - 4], 0.8)
    put("person-sitting", "ingrid", [r.between(535, 545), FLOOR - 2], 1.38, {
      pose: "rest",
      view: "right",
      ...look("ingrid"),
    })
    put("person-sitting", "jonas", [r.between(980, 990), FLOOR - 2], 1.38, {
      pose: "mug",
      view: "left",
      ...look("jonas"),
    })
    put("person-side", "malik", [r.between(1150, 1165), FLOOR - 8], 1.45, {
      pose: "walk",
      view: "left",
      ...look("malik"),
    })
  },
)
