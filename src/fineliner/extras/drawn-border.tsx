import type { ComponentProps, CSSProperties } from "react"
import { wordsOf } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf } from "@/fineliner/pen/seed"

// The label's border round a region: four pen strokes whose ends run past or stop short of their corners, as on the
// reference label. It is the CSS frame (frames.css) with seeded overshoots and wobble, so it renders on the server
// and resizes with its content without measuring. Doubled, a second frame with its own seed stands a gap inside the
// first. The border draws in currentColor; the label's lines run further past their corners than a button's, and
// the calm hand pulls them in.

export interface DrawnBorderProps extends ComponentProps<"div"> {
  /** A second border inside the first, `--border-gap` (7px by default) in from it. */
  double?: boolean
  /** Same seed, same border. Defaults to the region's words. */
  seed?: string | number
}

/** A hand-drawn border round a region, single or doubled. */
export function DrawnBorder({
  double = false,
  seed,
  className,
  style,
  children,
  ...props
}: DrawnBorderProps) {
  const key = String(seed ?? (wordsOf(children).trim() || "drawn-border"))
  const outer = frameVars(seedOf(key)) as CSSProperties
  return (
    <div
      data-slot="drawn-border"
      data-double={double || undefined}
      className={cn(
        "frame block p-snug text-pen [--border-gap:var(--space-hair)] [--over:7px] calm:[--over:2px]",
        double && "p-[calc(var(--border-gap)+var(--space-snug))]",
        className,
      )}
      style={{ ...outer, ...style }}
      {...props}
    >
      {double && (
        <span
          aria-hidden="true"
          data-slot="drawn-border-inner"
          className="frame pointer-events-none absolute! inset-(--border-gap) [--over:4px] calm:[--over:1px]"
          style={frameVars(seedOf(`${key}:inner`)) as CSSProperties}
        />
      )}
      {children}
    </div>
  )
}
