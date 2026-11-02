"use client"

import * as React from "react"
import { pen } from "@/fineliner/pen/stroke"
import { cn } from "@/fineliner/lib/utils"

// A ledger with no boxes: heads in the label voice over a pen rule, rows divided by hand-drawn rules in the faint pen,
// numbers in tabular figures (set them in font-type and right-align them on their head and cells). The rules are
// drawn once by the pen engine as small SVG masks, carried as custom properties on the container, so a 200-row table
// costs no filter per row. Rows cycle through five rules and every other row mirrors its rule, so the pattern repeats
// every ten rows; a calm hand squashes the same rules flatter. The heading row sticks to the top of a container that
// scrolls (size the container from outside: `*:data-[slot=table-container]:h-96`) and takes its paper only once rows
// pass under it. A hovered or selected row (data-state="selected") is a tint pocket that wobbles like other fills.
//
// The rule and the pocket hang off the row's first cell (its ::after and ::before), with the row as their containing
// block, so they span the whole row: browsers wrap a row's own pseudo-elements in an extra cell. Leave the first cell
// unpositioned.

const RULE_W = 480
const RULE_H = 6

/**
 * One rule as a mask image: a lively pen line across a 480 × 6 box, every second sample kept to stay small. The row
 * paints it 12px tall, so the hand's wobble reads at twice its drawn height while the stroke keeps the pen's width.
 */
function ruleMask(seed: string) {
  const d = pen(`table-rule:${seed}`, "lively")
    .line([6, RULE_H / 2], [RULE_W - 6, RULE_H / 2])
    .split("L")
    .filter((_, i, all) => i % 2 === 0 || i === all.length - 1)
    .join("L")
  // The stroke width is the pen's (--pen-weight); a mask image cannot read custom properties.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${RULE_W} ${RULE_H}' preserveAspectRatio='none'><path d='${d}' fill='none' stroke='black' stroke-width='1.35' stroke-linecap='round' vector-effect='non-scaling-stroke'/></svg>`
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E")}")`
}

const RULES = Object.fromEntries(
  ["0", "1", "2", "3", "4", "head"].map((name) => [
    `--rule-${name}`,
    ruleMask(name),
  ]),
) as React.CSSProperties

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto [container-type:scroll-state]"
      style={RULES}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-collapse font-ui text-ui leading-ui text-pen tabular-nums",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "sticky top-0 z-10 bg-paper [background-image:var(--paper-texture)] [background-size:var(--paper-texture-size)] [@container_not_scroll-state(scrollable:top)]:bg-transparent [@container_not_scroll-state(scrollable:top)]:bg-none",
        "[&>tr>:first-child]:after:bg-pen [&>tr>:first-child]:after:[--row-rule:var(--rule-head)] [&>tr:hover>:first-child]:before:content-none forced-colors:[&>tr>:first-child]:after:bg-[CanvasText]",
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&>tr:nth-child(5n+2)]:[--row-rule:var(--rule-1)] [&>tr:nth-child(5n+3)]:[--row-rule:var(--rule-2)] [&>tr:nth-child(5n+4)]:[--row-rule:var(--rule-3)] [&>tr:nth-child(5n+5)]:[--row-rule:var(--rule-4)]",
        "[&>tr:nth-child(even)>:first-child]:after:-scale-x-100 [&>tr:last-child>:first-child]:after:hidden",
        className,
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "font-medium [&>tr:hover>:first-child]:before:content-none",
        "[&>tr>:first-child]:after:-top-1.5 [&>tr>:first-child]:after:bottom-auto [&>tr>:first-child]:after:-scale-x-100 [&>tr>:first-child]:after:bg-pen [&>tr>:first-child]:after:[--row-rule:var(--rule-head)] [&>tr:not(:first-child)>:first-child]:after:hidden forced-colors:[&>tr>:first-child]:after:bg-[CanvasText]",
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "relative",
        // The rule: a drawn line as a mask, painted in the faint pen.
        "[&>:first-child]:after:pointer-events-none [&>:first-child]:after:absolute [&>:first-child]:after:inset-x-0 [&>:first-child]:after:-bottom-1.5 [&>:first-child]:after:h-3 [&>:first-child]:after:bg-pen-faint [&>:first-child]:after:[mask:var(--row-rule,var(--rule-0))_center/100%_100%_no-repeat] calm:[&>:first-child]:after:[mask-size:100%_45%] forced-colors:[&>:first-child]:after:bg-[CanvasText] forced-colors:[&>:first-child]:after:[forced-color-adjust:none]",
        // The pocket: only a hovered or selected row has one, so resting rows carry no filter.
        "[&>:first-child]:before:pointer-events-none [&>:first-child]:before:absolute [&>:first-child]:before:inset-x-0 [&>:first-child]:before:inset-y-px [&>:first-child]:before:-z-1 [&>:first-child]:before:content-none [&>:first-child]:before:[filter:var(--wob,var(--wob-2))]",
        "hover:isolate hover:[&>:first-child]:before:bg-tint/60 hover:[&>:first-child]:before:content-[''] has-aria-expanded:isolate has-aria-expanded:[&>:first-child]:before:bg-tint/60 has-aria-expanded:[&>:first-child]:before:content-['']",
        "data-[state=selected]:isolate data-[state=selected]:[&>:first-child]:before:bg-tint data-[state=selected]:[&>:first-child]:before:content-[''] forced-colors:data-[state=selected]:[&>:first-child]:before:border",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "label h-control-compact px-tight text-left align-middle whitespace-nowrap text-pen-quiet [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-tight py-hair align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-snug text-left text-small leading-small text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
