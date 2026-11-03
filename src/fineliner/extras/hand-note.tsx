"use client"

import { useMemo, type ComponentProps, type CSSProperties } from "react"
import { wordsOf } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import type { Point } from "@/fineliner/pen/geometry"
import { sheet } from "@/fineliner/pen/layers"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { pen, type HandName } from "@/fineliner/pen/stroke"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

// An aside in the hand voice with a drawn arrow toward what it is about. Under its line by default; with
// placement="margin" it hangs in the margin of its nearest positioned ancestor on screens 64rem and wider, level with
// that ancestor's top, and drops under its line (arrow pointing up) on narrower screens. The arrow is drawn by the pen
// from the note's words and mirrors in right-to-left text; the words lean a seeded degree or so at the lively hand
// and stand straight at the calm one.

export type HandNotePoint = "up" | "down" | "start" | "end" | "curl"

export interface HandNoteProps extends ComponentProps<"div"> {
  /** Where the arrow points: up or down at the line above or below, back to the start or on to the end of the line,
   * or a curl that loops before it points up and back. Defaults to up (under its line), or start in the margin. */
  point?: HandNotePoint
  /** inline: a block under its line. margin: in the margin beside its positioned parent at 64rem and wider. */
  placement?: "inline" | "margin"
  /** Same seed, same arrow and lean. Defaults to the note's words. */
  seed?: string | number
  /** The arrow's hand. The lean follows the page's hand setting. */
  hand?: HandName
}

// Each arrow: the shaft through its points, then the head as one stroke through the tip. Coordinates are written out,
// so no trigonometry can differ between engines. Boxes are in px at 1×.
const ARROWS: Record<
  HandNotePoint,
  { box: [number, number]; shaft: Point[]; head: Point[] }
> = {
  start: {
    box: [52, 30],
    shaft: [
      [48, 24],
      [38, 23],
      [26, 18],
      [14, 12],
      [5, 9],
    ],
    head: [
      [10, 15.5],
      [5, 9],
      [12.5, 6.5],
    ],
  },
  end: {
    box: [52, 30],
    shaft: [
      [4, 24],
      [14, 23],
      [26, 18],
      [38, 12],
      [47, 9],
    ],
    head: [
      [42, 15.5],
      [47, 9],
      [39.5, 6.5],
    ],
  },
  up: {
    box: [32, 40],
    shaft: [
      [27, 37],
      [24, 26],
      [17, 14],
      [7, 4],
    ],
    head: [
      [8.4, 11.9],
      [7, 4],
      [14.9, 5.4],
    ],
  },
  down: {
    box: [32, 40],
    shaft: [
      [27, 3],
      [24, 14],
      [17, 26],
      [7, 36],
    ],
    head: [
      [8.4, 28.1],
      [7, 36],
      [14.9, 34.6],
    ],
  },
  curl: {
    box: [64, 48],
    shaft: [
      [61, 45],
      [49, 44],
      [39, 39],
      [33, 30],
      [35, 20],
      [43, 15],
      [51, 19],
      [53, 28],
      [46, 35],
      [35, 35],
      [24, 29],
      [15, 18],
      [8, 7],
    ],
    head: [
      [7.6, 15],
      [8, 7],
      [15.4, 10.1],
    ],
  },
}

/** One arrow as SVG, decorative. */
function arrow(point: HandNotePoint, seed: string, hand: HandName) {
  const { box, shaft, head } = ARROWS[point]
  const key = `${seed}:hand-note:${point}`
  const s = sheet(`fl${seedOf(key).toString(36)}n`)
  const p = pen(key, hand)
  s.stroke(p.path(shaft))
  s.stroke(p.path(head))
  return s.svg(box[0], box[1])
}

// Where the arrow sits beside the words, and how far it rises or falls past the note's box (a transform, so layout
// is untouched). Sizes are the boxes above, in rem.
const ARROW_PLACE: Record<HandNotePoint, string> = {
  start: "w-[3.25rem] mt-[0.1em]",
  end: "order-last w-[3.25rem] mt-[0.1em]",
  up: "w-8 -translate-y-[0.7em]",
  down: "w-8 self-end translate-y-[0.7em]",
  curl: "w-16 -mt-[0.35em]",
}

// In the margin: beside the parent, on the side the arrow points away from.
const MARGIN = {
  end: "min-[64rem]:absolute min-[64rem]:top-0 min-[64rem]:start-[calc(100%+var(--space-line))] min-[64rem]:mt-0 min-[64rem]:w-[13rem]",
  start:
    "min-[64rem]:absolute min-[64rem]:top-0 min-[64rem]:end-[calc(100%+var(--space-line))] min-[64rem]:mt-0 min-[64rem]:w-[13rem] min-[64rem]:justify-end min-[64rem]:text-end",
}

/** A handwritten aside with a drawn arrow toward what it is about. */
export function HandNote({
  point,
  placement = "inline",
  seed,
  hand = "lively",
  className,
  style,
  children,
  ...props
}: HandNoteProps) {
  const own = useOwnIds()
  const margin = placement === "margin"
  const wide: HandNotePoint = point ?? (margin ? "start" : "up")
  const key = String(seed ?? (wordsOf(children).trim() || "hand-note"))
  // In the margin the note falls back under its line on narrow screens, pointing up; draw that arrow too.
  const narrow: HandNotePoint | undefined =
    margin && wide !== "up" ? "up" : undefined
  const svgs = useMemo(
    () => ({
      wide: arrow(wide, key, hand),
      narrow: narrow ? arrow(narrow, key, hand) : "",
    }),
    [wide, narrow, key, hand],
  )
  const turn = {
    "--note-turn": `${stream(seedOf(key), "lean").between(-1.8, 0.6).toFixed(2)}deg`,
  } as CSSProperties

  return (
    <div
      role="note"
      data-slot="hand-note"
      data-point={wide}
      data-placement={placement}
      className={cn(
        "mt-hair flex max-w-[24rem] items-start gap-hair text-pen",
        margin && MARGIN[wide === "end" ? "start" : "end"],
        className,
      )}
      style={{ ...turn, ...style }}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="hand-note-arrow"
        className={cn(
          "shrink-0 rtl:-scale-x-100",
          ARROW_PLACE[wide],
          narrow && "max-[64rem]:hidden",
        )}
        dangerouslySetInnerHTML={{ __html: own(svgs.wide) }}
      />
      {narrow && (
        <span
          aria-hidden="true"
          data-slot="hand-note-arrow"
          className={cn(
            "shrink-0 rtl:-scale-x-100 min-[64rem]:hidden",
            ARROW_PLACE[narrow],
          )}
          dangerouslySetInnerHTML={{ __html: own(svgs.narrow) }}
        />
      )}
      <span
        data-slot="hand-note-text"
        className="min-w-0 origin-[0_50%] rotate-(--note-turn) font-hand text-lead leading-[1.1] text-balance rtl:origin-[100%_50%] calm:rotate-0"
      >
        {children}
      </span>
    </div>
  )
}
