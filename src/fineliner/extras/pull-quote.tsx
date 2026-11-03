"use client"

import {
  useMemo,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"
import { wordsOf } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import type { Point } from "@/fineliner/pen/geometry"
import { sheet } from "@/fineliner/pen/layers"
import { seedOf, stream } from "@/fineliner/pen/seed"
import { pen, type HandName } from "@/fineliner/pen/stroke"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

// A line lifted out of the text and set large in the reading face, against a pen rule standing in its margin. The
// quotation marks are drawn by the pen (each comma a small pocket of ink with a tail): the opening pair hangs before
// the first word, the closing pair follows the last, and the source sits under the quote in the label voice. The
// marks' lean comes from the quote's words. Inside Typography it takes more room than a paragraph and drops the
// blockquote's own rule, inset and italic.

export interface PullQuoteProps extends ComponentProps<"figure"> {
  /** Who said it or where it is from, in the label voice under the quote. */
  cite?: ReactNode
  /** Same seed, same marks and rule. Defaults to the quote's words. */
  seed?: string | number
  hand?: HandName
  /** The quoted words: inline content, so the closing mark follows the last word. */
  children?: ReactNode
}

const W = 40
const H = 32

/** “ or ”: two commas, each a pocket of ink with a tail. The closing pair is the opening pair turned half round. */
function quoteMarks(seed: string, close: boolean, hand: HandName) {
  const key = `${seed}:pull-quote:${close ? "close" : "open"}`
  const s = sheet(`fl${seedOf(key).toString(36)}q`)
  const p = pen(key, hand)
  const lean = stream(seedOf(seed), "quote-lean")
  const turn = ([x, y]: Point): Point => (close ? [W - x, H - y] : [x, y])
  for (const cx of [9, 29]) {
    const tilt = lean.between(-1.6, 1.6)
    const rise = lean.between(2, 5)
    s.fill(p.disc(turn([cx, 24]), [5.6, 0], [0, 5.4]))
    s.stroke(
      p.path(
        [
          [cx - 5.2, 24],
          [cx - 5 + tilt, 15],
          [cx - 1 + tilt, 8],
          [cx + 5 + tilt, rise],
        ].map((pt) => turn(pt as Point)),
      ),
    )
  }
  return s.svg(W, H)
}

/** A large quotation with a drawn margin and quotation marks, and its source in the label voice. */
export function PullQuote({
  cite,
  seed,
  hand = "lively",
  className,
  children,
  ...props
}: PullQuoteProps) {
  const own = useOwnIds()
  const key = String(seed ?? (wordsOf(children).trim() || "pull-quote"))
  const marks = useMemo(
    () => ({
      open: quoteMarks(key, false, hand),
      close: quoteMarks(key, true, hand),
    }),
    [key, hand],
  )

  return (
    <figure
      data-slot="pull-quote"
      className={cn(
        "m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-tight text-pen",
        // Inside Typography: more room than a paragraph, none of the blockquote's rule, inset, quiet pen or italic.
        "[[data-slot=typography]>&]:my-line",
        "[&>blockquote]:relative [&>blockquote]:m-0 [&>blockquote]:max-w-[22em] [&>blockquote]:py-0 [&>blockquote]:pe-0 [&>blockquote]:ps-[2.05rem] [&>blockquote]:text-pen [&>blockquote]:not-italic [&>blockquote]:before:hidden sm:[&>blockquote]:ps-[2.6rem]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="pull-quote-rule"
        className="row-span-2 my-[0.3rem] rule-y text-pen-quiet"
        style={frameVars(seedOf(`${key}:rule`)) as CSSProperties}
      />
      <blockquote className="font-read text-lead leading-subhead font-normal text-balance sm:text-h2 sm:leading-[1.25]">
        {/* The opening mark hangs in the gap before the first word, so the words line up with the source. */}
        <span
          aria-hidden="true"
          data-slot="pull-quote-open"
          className="absolute start-0 top-[0.08em] w-[1.55rem] -rotate-2 rtl:-scale-x-100 calm:rotate-0 sm:w-8"
          dangerouslySetInnerHTML={{ __html: own(marks.open) }}
        />
        {children}
        <span
          aria-hidden="true"
          data-slot="pull-quote-close"
          className="ms-[0.12em] inline-block w-[0.62em] align-[0.35em] rtl:-scale-x-100"
          dangerouslySetInnerHTML={{ __html: own(marks.close) }}
        />
      </blockquote>
      {cite && (
        <figcaption
          data-slot="pull-quote-cite"
          className="m-0 mt-tight ps-[2.05rem] sm:ps-[2.6rem]"
        >
          <span className="label text-pen-quiet">{cite}</span>
        </figcaption>
      )}
    </figure>
  )
}
