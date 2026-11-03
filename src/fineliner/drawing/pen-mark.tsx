import { useMemo, type ComponentProps } from "react"
import { penMark, type HandName, type MarkName } from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

export interface PenMarkProps extends Omit<ComponentProps<"span">, "children"> {
  /** tick, ring, dot, underline, strike, arrow, chevron or pill. */
  name: MarkName
  seed: string | number
  hand?: HandName
}

/** One small pen mark, decorative: the element it marks carries the meaning. Size it with the span. */
export function PenMark({
  name,
  seed,
  hand,
  className,
  ...props
}: PenMarkProps) {
  const own = useOwnIds()
  const html = useMemo(() => penMark(name, seed, hand), [name, seed, hand])
  return (
    <span
      aria-hidden="true"
      data-slot="pen-mark"
      data-mark={name}
      className={cn("block [&>svg]:size-full", className)}
      dangerouslySetInnerHTML={{ __html: own(html) }}
      {...props}
    />
  )
}

/** A word or figure ringed by the pen, as a badge of note: the ring stretches to the text. */
export function Circled({
  seed,
  hand,
  className,
  children,
  ...props
}: Omit<ComponentProps<"span">, "seed"> & {
  seed: string | number
  hand?: HandName
}) {
  return (
    <span
      data-slot="circled"
      className={cn("relative inline-block px-[0.6em]", className)}
      {...props}
    >
      <PenMark
        name="ring"
        seed={seed}
        hand={hand}
        className="absolute -inset-x-[0.2em] -inset-y-[0.3em]"
      />
      {children}
    </span>
  )
}
