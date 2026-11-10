// The roof, over the hero: the ridge across the page and the roof falling to the eaves, which is where the building's
// walls begin. A chimney with a bird on it; an open skylight with someone leaning out, waving at the bird; the cat on
// the ridge; the sign hanging from the gable at the right, its board marked so the page can letter it.
import type { Point } from "@/fineliner/pen"
import { defineStrip, FLOOR } from "./strip"

const RIDGE = 250

defineStrip(
  "baghuset-roof",
  "The roof",
  "The roof of a back building: someone leans out of a skylight to wave at a bird on the chimney, a cat sits on the ridge, and a sign hangs from the gable",
  (st) => {
    const { s, p, r, put, mark } = st
    const gable = r.between(1236, 1250)
    // The ridge first, then the skylight's sash propped open behind whoever leans out of it, then them: the roof drawn
    // next hides them below the sill.
    s.stroke(p.line([-60, RIDGE], [gable, RIDGE + r.signed() * 2]))
    const sky = r.between(800, 820)
    const sill = RIDGE + 150
    const sash: Point[] = [
      [sky + 12, RIDGE + 40],
      [sky + 128, RIDGE + 40],
      [sky + 120, RIDGE - 30],
      [sky + 20, RIDGE - 30],
    ]
    s.blank(p.shape(sash))
    // Its lower edge is the frame's top, drawn with the frame; the rest goes up behind the person.
    s.stroke(
      p.path([
        sash[0] as Point,
        sash[3] as Point,
        sash[2] as Point,
        sash[1] as Point,
      ]),
    )
    put("person-side", "waving", [sky + 70, RIDGE + 288], 1.45, {
      pose: "wave",
      view: "left",
    })
    s.blank(
      p.shape([
        [-60, sill],
        [gable + 60, sill],
        [gable + 60, FLOOR + 90],
        [-60, FLOOR + 90],
      ]),
    )
    // The roof: eaves and gable, and three courses of tiles across it, broken by the skylight.
    s.stroke(p.line([-60, FLOOR], [gable + 40, FLOOR]))
    s.stroke(p.line([gable, RIDGE], [gable + 40, FLOOR]))
    for (const [i, y] of [RIDGE + 62, RIDGE + 124, RIDGE + 186].entries()) {
      const edge = gable + ((y - RIDGE) / (FLOOR - RIDGE)) * 40 - 4
      const start = -60 + i * 37
      if (y < sill) {
        s.stroke(p.line([start, y], [sky - 8, y]))
        s.stroke(p.line([sky + 150, y], [edge, y]))
      } else s.stroke(p.line([start, y], [edge, y]))
    }
    s.stroke(
      p.shape([
        [sky, sill],
        [sky + 140, sill],
        [sky + 128, RIDGE + 40],
        [sky + 12, RIDGE + 40],
      ]),
    )
    // The chimney on the ridge, the bird on its pot.
    const cx = r.between(470, 500)
    s.blank(
      p.shape([
        [cx, RIDGE + 30],
        [cx + 70, RIDGE + 30],
        [cx + 70, RIDGE - 120],
        [cx, RIDGE - 120],
      ]),
    )
    s.stroke(
      p.shape([
        [cx, RIDGE + 24],
        [cx + 70, RIDGE + 24],
        [cx + 70, RIDGE - 120],
        [cx, RIDGE - 120],
      ]),
    )
    s.stroke(
      p.shape([
        [cx - 6, RIDGE - 120],
        [cx + 76, RIDGE - 120],
        [cx + 76, RIDGE - 134],
        [cx - 6, RIDGE - 134],
      ]),
    )
    put("bird", "bird", [cx + 34, RIDGE - 134], 1.3)
    put("cat", "cat", [r.between(1040, 1080), RIDGE + 2], 0.95)
    // The sign hangs from a bracket on the gable, over the street side.
    const sign = put("hanging-sign", "sign", [gable + 10, RIDGE + 70], 1.5, {
      w: 170,
      h: 70,
    }) as {
      board: [number, number, number, number]
    }
    mark("sign-board", "board", sign.board)
  },
)
