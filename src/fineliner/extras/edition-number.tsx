import type { ComponentProps } from "react"
import { cn } from "@/fineliner/lib/utils"

// "Nº 0412": a numbered copy in the typewriter, zero padded so a run of numbers lines up, with tabular figures, and
// "of 500" when the size of the run matters. With `spine` it stands up an edge, bottom to top, in the reading serif
// (the spine voice), as the words on a label do. It takes the size and colour of its context. Screen readers hear
// "Number 412 of 500" instead of the sign and the padding.
//
// The spine is writing-mode vertical-rl turned 180°, which every engine draws the same way. Inside another spine
// (anything marked data-spine, such as a LabelCard's) it takes the spine voice and leaves the turning to that spine.

export interface EditionNumberProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  value: number
  /** How many digits to pad the number to. */
  digits?: number
  /** The size of the run: "Nº 0412 of 500". */
  of?: number
  /** The printed sign before the number. */
  prefix?: string
  /** What assistive technology reads in place of the sign. */
  label?: string
  /** Set it up the edge, bottom to top, in the spine voice. */
  spine?: boolean
}

const NBSP = " "
const whole = (n: number) => Math.max(0, Math.trunc(Number.isFinite(n) ? n : 0))

/** A copy's number in a run: "Nº 0412", "Nº 0412 of 500", or the same up a spine. */
export function EditionNumber({
  value,
  digits = 4,
  of,
  prefix = "Nº",
  label = "Number",
  spine = false,
  className,
  ...props
}: EditionNumberProps) {
  const n = String(whole(value)).padStart(digits, "0")
  const total = of === undefined ? "" : `${NBSP}of${NBSP}${whole(of)}`
  const spoken = `${label} ${whole(value)}${of === undefined ? "" : ` of ${whole(of)}`}`
  return (
    <span
      data-slot="edition-number"
      data-spine={spine ? "" : undefined}
      className={cn(
        "whitespace-nowrap tabular-nums",
        spine
          ? "inline-block font-read tracking-[0.04em] [writing-mode:vertical-rl] rotate-180 in-data-spine:rotate-none"
          : "font-type in-data-spine:font-read in-data-spine:tracking-[0.04em]",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">
        {prefix ? `${prefix}${NBSP}` : ""}
        {n}
        {total}
      </span>
      <span className="sr-only">{spoken}</span>
    </span>
  )
}
