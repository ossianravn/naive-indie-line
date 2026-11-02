// The small marks the interface draws with the pen: a tick that overshoots its box, a ring round a word, a dot, an
// underline, a strike, an arrow for a hand note, a chevron, a switch's pill and a border at a fixed size. Each is a
// fixed viewBox; marks that hug content (ring, underline, strike) stretch to their box with non-scaling strokes.
import type { Point } from "./geometry"
import { sheet, type Sheet } from "./layers"
import { seedOf } from "./seed"
import { pen, type HandName, type Pen } from "./stroke"

interface MarkSpec {
  size: [number, number]
  /** Stretch to the element's box (preserveAspectRatio="none") instead of keeping the drawing's proportions. */
  stretch?: boolean
  draw(s: Sheet, p: Pen): void
}

const wave = (y: number, amp: number, phase: number) =>
  Array.from({ length: 6 }, (_, i): Point => [
    2 + i * 19.2,
    y + Math.sin(i * 0.9 + phase) * amp,
  ])

export const MARKS = {
  tick: {
    size: [24, 24],
    draw: (s, p) =>
      s.stroke(
        p.path([
          [4, 12],
          [10, 19.5],
          [25, -3],
        ]),
      ),
  },
  ring: {
    size: [100, 40],
    stretch: true,
    draw: (s, p) => s.stroke(p.ring([50, 20], [48, 0], [0, 18])),
  },
  dot: {
    size: [20, 20],
    draw: (s, p) => s.fill(p.disc([10, 10], [4.2, 0], [0, 4.2])),
  },
  underline: {
    size: [100, 10],
    stretch: true,
    draw: (s, p) => s.stroke(p.path(wave(5, 1.2, 0))),
  },
  strike: {
    size: [100, 10],
    stretch: true,
    draw: (s, p) => s.stroke(p.path(wave(5, 0.8, 1.7))),
  },
  arrow: {
    size: [76, 50],
    draw(s, p) {
      s.stroke(
        p.path([
          [4, 6],
          [22, 4],
          [44, 12],
          [60, 28],
          [66, 42],
        ]),
      )
      s.stroke(
        p.path([
          [57, 36],
          [66, 43],
          [70, 32],
        ]),
      )
    },
  },
  chevron: {
    size: [14, 10],
    draw: (s, p) =>
      s.stroke(
        p.path([
          [2, 2],
          [7, 7.5],
          [12, 2],
        ]),
      ),
  },
  pill: {
    size: [44, 24],
    draw(s, p) {
      const r = 11
      const right = p.round([32, 12], [r, 0], [0, r], -Math.PI / 2, Math.PI)
      const left = p.round([12, 12], [r, 0], [0, r], Math.PI / 2, Math.PI)
      s.stroke(p.path([...right, ...left, right[0] as Point]))
    },
  },
} satisfies Record<string, MarkSpec>

export type MarkName = keyof typeof MARKS

/** One mark as SVG. Decorative: the element it marks carries the meaning. */
export function penMark(
  name: MarkName,
  seed: string | number,
  hand: HandName = "lively",
  take = 0,
) {
  const spec: MarkSpec = MARKS[name]
  const key = `${seed}:${name}`
  const s = sheet(`fl${seedOf(key).toString(36)}k${take}`)
  spec.draw(s, pen(key, hand, take))
  const svg = s.svg(spec.size[0], spec.size[1])
  return spec.stretch
    ? svg.replace("<svg ", '<svg preserveAspectRatio="none" ')
    : svg
}

/** A border drawn edge by edge at a known size, so its corners cross like the reference label's. */
export function penBorder(
  seed: string | number,
  width: number,
  height: number,
  hand: HandName = "lively",
) {
  const key = `${seed}:border`
  const s = sheet(`fl${seedOf(key).toString(36)}b`)
  s.stroke(
    pen(key, hand).edges([
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ]),
  )
  return s.svg(width, height)
}
