// What BAGHUSET's strips share: the size of a storey's floor (the kit's strip format), where the floor is, the
// staircase at the right end of every storey, and a way to register a strip. A strip draws no back wall (the page's
// wall is above it), only its floor past both edges and the moment on it; what matters stands between x 400 and 1200,
// so a phone loses only furniture. Each storey's flight rises out through the right edge towards the one above.
import {
  defineScene,
  stage,
  type HandName,
  type Pen,
  type Point,
  type Sheet,
  type Stage,
} from "@/fineliner/pen"

export const STRIP: [number, number] = [1600, 520]
export const FLOOR = 500

/** A flight of stairs in section, rising to the right from the floor at x0 and out through the strip's right edge. */
export function stair(s: Sheet, p: Pen, x0: number) {
  const [rise, run] = [31, 27]
  const tread: Point[] = [[x0, FLOOR]]
  let [x, y] = [x0, FLOOR]
  while (x < STRIP[0] + 40) {
    y -= rise
    tread.push([x, y])
    x += run
    tread.push([x, y])
  }
  s.stroke(p.path(tread))
  // The stringer's underside, parallel to the flight's line, and the handrail on its posts.
  const slope = rise / run
  const under = 46
  s.stroke(p.line([x0 + under / slope, FLOOR], [x + under / slope, y]))
  const rail = (u: number): Point => [u, FLOOR - (u - x0) * slope - 120]
  s.stroke(p.line(rail(x0 + 10), rail(x + 60)))
  for (let i = 1; i < tread.length - 1; i += 4) {
    const [tx, ty] = tread[i] as Point
    s.stroke(
      p.line([tx + run / 2, ty - 2], [tx + run / 2, rail(tx + run / 2)[1] + 2]),
    )
  }
}

/** The floor line past both edges. */
export function floor(st: Stage) {
  st.s.stroke(
    st.p.line([-60, FLOOR], [STRIP[0] + 60, FLOOR + st.r.signed() * 3]),
  )
}

/** Register a strip as a scene whose boxed and strip formats are the same open drawing. */
export function defineStrip(
  name: string,
  title: string,
  label: string,
  draw: (st: Stage) => void,
) {
  const compose = (seed: string, hand: HandName, take: number) => {
    const st = stage(seed, hand, take, `${name}:strip`, STRIP)
    draw(st)
    return st.s
  }
  defineScene(name, {
    name: title,
    label,
    size: STRIP,
    compose,
    open: { strip: { size: STRIP, compose } },
  })
}
