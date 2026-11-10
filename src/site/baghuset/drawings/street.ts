// The street, Write to us: the pavement past both walls, the building's front door with its letterbox, a bicycle on
// its stand and a courier arriving with a parcel, seen from behind as they walk up to the door.
import { defineStrip, floor, FLOOR } from "./strip"

defineStrip(
  "baghuset-street",
  "The street",
  "The street outside: the front door with its letterbox, a bicycle on its stand, and a courier arriving with a parcel",
  (st) => {
    const { r, put } = st
    floor(st)
    put("street-door", "door", [r.between(740, 750), FLOOR], 1.55)
    put("bicycle", "bicycle", [r.between(420, 440), FLOOR - 2], 1.5)
    put("person-carrying", "courier", [r.between(930, 945), FLOOR - 8], 1.45, {
      view: "back",
    })
  },
)
