import type { ComponentProps, CSSProperties } from "react"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf, stream } from "@/fineliner/pen/seed"

// A sticky note: a small square of paper in the hand voice, its outline drawn by the pen, a band of the wash along
// the glued edge at the top and its lower corner curling up. The wash stays in its band, above the words, never
// behind them. It is square at its size and grows taller for longer words rather than shrinking them. At the lively
// hand it sits a few seeded degrees off true, straight at the calm one.

export interface StickyNoteProps extends ComponentProps<"div"> {
  /** Same seed, same outline and angle. Defaults to the note's words. */
  seed?: string | number
}

/** A sticky note with words in the hand voice. */
export function StickyNote({
  seed,
  children,
  className,
  style,
  ...props
}: StickyNoteProps) {
  const key = String(seed ?? (typeof children === "string" ? children : "note"))
  const r = stream(seedOf(key), "sticky")
  const turn = (r.chance(0.5) ? 1 : -1) * r.between(0.8, 2.8)
  return (
    <div
      data-slot="sticky-note"
      className={cn(
        "frame relative flex min-h-[9.5rem] w-[9.5rem] rotate-(--note-turn) flex-col bg-paper text-pen calm:rotate-none",
        className,
      )}
      style={
        {
          ...frameVars(seedOf(key)),
          "--note-turn": `${turn.toFixed(2)}deg`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="sticky-note-band"
        className="block h-5 shrink-0 bg-wash opacity-55 [filter:var(--wob,var(--wob-2))] forced-colors:hidden"
      />
      <div className="flex-1 px-tight pt-tight pb-snug font-hand text-[1.3rem] leading-[1.15] text-balance">
        {children}
      </div>
      {/* The curl: paper over the frame's corner, and the fold's two edges drawn across it. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute -right-px -bottom-px size-5 overflow-visible"
      >
        <path d="M20 0.5 L20 20 L0.5 20 Z" className="fill-paper" />
        <path
          d="M19.5 1.5 L15 15.5 L1.5 19.5"
          className="fill-none stroke-current"
          strokeWidth="var(--pen-weight)"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: "var(--wob, var(--wob-2))",
            strokeWidth: "var(--pen-weight)",
          }}
        />
        <path
          d="M19.5 1.5 L1.5 19.5"
          className="fill-none stroke-current"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: "var(--wob, var(--wob-1))",
            strokeWidth: "var(--pen-weight)",
          }}
        />
      </svg>
    </div>
  )
}
