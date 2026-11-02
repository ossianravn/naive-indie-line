"use client"

import { useMemo, type ComponentProps, type CSSProperties } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import type { Point } from "@/fineliner/pen/geometry"
import { sheet } from "@/fineliner/pen/layers"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { pen, type HandName } from "@/fineliner/pen/stroke"

// A hanging tag: a card with its top corners cut off, a punched hole with a reinforcing ring, and a loop of string
// it hangs from, the price in the typewriter, an old price struck through by the pen above it and a short line under
// it. At the lively hand it hangs a few seeded degrees off true, turning about the top of its string; at the calm
// hand it hangs straight. Nobody operates a tag, so it may tilt.
//
// The outline is drawn by the pen at its true size, without measuring: every line on the tag is in the typewriter,
// whose letters all advance 0.6em, so the tag's width and height follow from its words in em. The caption wraps at
// whole words, by the same count. Without a `hand` the outline follows the page: lively, and calm under data-hand.

const ADVANCE = 0.6 // em per typewriter character
const PRICE = 1.5 // the price's size, in the tag's em
const WAS = 0.95
const NOTE = 0.875
const PAD = 0.85
const STRING = 1.9 // room above the tag for the loop of string
const CHAMFER = 0.7
const HOLE = 1 // the hole's centre below the tag's top edge
const WORDS = 1.9 // where the words may start below the tag's top edge
const NAIL = 0.15 // the top of the loop, where the tag hangs from
const UNIT = 16 // drawing units per em

/** The caption's lines, broken at whole words to fit `chars` characters where they can. */
function wrap(text: string, chars: number) {
  const lines: string[] = []
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const line = lines[lines.length - 1]
    if (line !== undefined && line.length + 1 + word.length <= chars)
      lines[lines.length - 1] = `${line} ${word}`
    else lines.push(word)
  }
  return lines
}

/** The tag's size in em, and where its parts sit. */
function measure(price: string, was?: string, note?: string) {
  const inner = Math.max(
    price.length * ADVANCE * PRICE,
    (was?.length ?? 0) * ADVANCE * WAS,
    3.2,
  )
  const lines = note
    ? wrap(note, Math.max(14, Math.floor(inner / (ADVANCE * NOTE))))
    : []
  const longest = Math.max(0, ...lines.map((l) => l.length)) * ADVANCE * NOTE
  const width = Math.max(inner, longest) + PAD * 2
  const body =
    (was ? 1.25 : 0) + 1.6 + (lines.length ? 0.2 + lines.length * 1.3 : 0)
  // A tag stands a little taller than it is wide; the words sit in the middle of the room under the hole.
  const tag = Math.max(WORDS + body + PAD, width * 1.1)
  const top = STRING + WORDS + (tag - WORDS - PAD - body) / 2
  return { width, height: STRING + tag, top, lines }
}

/** The outline, the hole and the string, as one SVG string. */
function tagSvg(key: string, w: number, h: number, hand: HandName) {
  const u = (n: number) => n * UNIT
  const r = stream(seedOf(key), "tag-string")
  const s = sheet(`fl${seedOf(`${key}:tag`).toString(36)}g${hand[0]}`)
  const p = pen(`${key}:tag`, hand)
  const [W, H, top, c] = [u(w), u(h), u(STRING), u(CHAMFER)]
  const outline: Point[] = [
    [c, top],
    [W - c, top],
    [W, top + c],
    [W, H],
    [0, H],
    [0, top + c],
  ]
  s.stroke(p.edges(outline))
  const hole: Point = [W / 2, top + u(HOLE)]
  s.stroke(p.ring(hole, [u(0.42), 0], [0, u(0.42)]))
  s.stroke(p.ring(hole, [u(0.22), 0], [0, u(0.22)]))
  // The loop: a drop of string, pointed where it passes through the hole and round over the nail it hangs from, leaning
  // a little by its seed. Points crowd towards the top, where the curve turns fastest.
  const apex: Point = [W / 2 + r.between(-0.3, 0.3) * u(1), u(NAIL)]
  const bow = u(r.between(0.5, 0.62)) / 0.385
  const side = (dir: number) =>
    Array.from({ length: 13 }, (_, i): Point => {
      const t = 1 - (1 - i / 12) * (1 - i / 12)
      return [
        hole[0] + (apex[0] - hole[0]) * t + dir * bow * t * Math.sqrt(1 - t),
        hole[1] + (apex[1] - hole[1]) * t,
      ]
    })
  s.stroke(p.path([...side(-1), ...side(1).reverse().slice(1)]))
  return { svg: s.svg(W, H), apex: apex[0] / W }
}

export interface PriceTagProps extends Omit<ComponentProps<"div">, "children"> {
  /** The price as printed, such as "320 kr". */
  price: string
  /** The old price, struck through by the pen. */
  was?: string
  /** A short line under the price, such as the record's title or its condition. */
  note?: string
  size?: "sm" | "default" | "lg"
  /** Same seed, same outline, string and tilt. Defaults to the tag's words. */
  seed?: string | number
  /** The pen's hand. Left out, the outline and tilt follow the page's hand. */
  hand?: HandName
}

/** A hanging price tag with an old price struck through. */
export function PriceTag({
  price,
  was,
  note,
  size = "default",
  seed,
  hand,
  className,
  style,
  ...props
}: PriceTagProps) {
  const key = String(seed ?? [price, was, note].filter(Boolean).join(" "))
  const { width, height, top, lines, drawn } = useMemo(() => {
    const size = measure(price, was, note)
    const hands = hand ? [hand] : (["lively", "calm"] as const)
    const drawn = hands.map((h) => ({
      hand: h,
      ...tagSvg(key, size.width, size.height, h),
    }))
    return { ...size, drawn }
  }, [price, was, note, key, hand])
  const tilt = stream(seedOf(key), "tag-tilt")
  const turn = (tilt.chance(0.5) ? 1 : -1) * tilt.between(1.5, 4.5)
  const apex = drawn[0]?.apex ?? 0.5
  const spoken = [`Price ${price}`, was && `was ${was}`, note]
    .filter(Boolean)
    .join(", ")

  return (
    <div
      data-slot="price-tag"
      data-size={size}
      className={cn(
        "relative inline-block shrink-0 align-top text-[1rem] text-pen data-[size=lg]:text-[1.25rem] data-[size=sm]:text-[0.8125rem]",
        !hand && "rotate-(--tag-turn) calm:rotate-none",
        hand === "lively" && "rotate-(--tag-turn)",
        className,
      )}
      style={
        {
          width: `${width.toFixed(3)}em`,
          height: `${height.toFixed(3)}em`,
          transformOrigin: `${(apex * 100).toFixed(1)}% ${((NAIL / height) * 100).toFixed(2)}%`,
          "--tag-turn": `${turn.toFixed(2)}deg`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {drawn.map((d) => (
        <span
          key={d.hand}
          aria-hidden="true"
          data-slot="price-tag-outline"
          className={cn(
            "absolute inset-0 block [&>svg]:size-full",
            !hand && (d.hand === "calm" ? "hidden calm:block" : "calm:hidden"),
          )}
          dangerouslySetInnerHTML={{ __html: d.svg }}
        />
      ))}
      <span className="sr-only">{spoken}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 flex flex-col items-center font-type leading-none whitespace-pre tabular-nums"
        style={{ top: `${top.toFixed(3)}em` }}
      >
        {was ? (
          <span
            data-slot="price-tag-was"
            className="relative flex items-center text-pen-quiet"
            style={{ fontSize: `${WAS}em`, height: `${1.25 / WAS}em` }}
          >
            {was}
            <PenMark
              name="strike"
              seed={`${key}:was`}
              className="absolute -inset-x-[0.25em] top-1/2 h-[0.6em] -translate-y-1/2 text-pen"
            />
          </span>
        ) : null}
        <span
          data-slot="price-tag-price"
          className="flex items-center"
          style={{ fontSize: `${PRICE}em`, height: `${1.6 / PRICE}em` }}
        >
          {price}
        </span>
        {lines.length ? (
          <span
            data-slot="price-tag-note"
            className="flex flex-col items-center text-pen-quiet"
            style={{ fontSize: `${NOTE}em`, marginTop: `${0.2 / NOTE}em` }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                className="flex items-center"
                style={{ height: `${1.3 / NOTE}em` }}
              >
                {line}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </div>
  )
}
