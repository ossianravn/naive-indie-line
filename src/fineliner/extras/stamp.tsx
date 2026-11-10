import type { ComponentProps, CSSProperties } from "react"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf, stream } from "@/fineliner/pen/seed"

// A rubber-stamp mark: a word in typewriter capitals inside a doubled drawn frame, a few seeded degrees off true, as
// a stamp is never put down straight. It is put down as the kit's other marks are (the pen's 140 ms wipe), and fades
// in under reduced motion. In the pen; `tone="correction"` only for a destructive meaning (VOID, REJECTED).

export interface StampProps extends ComponentProps<"span"> {
  /** "correction" for a destructive meaning only. */
  tone?: "pen" | "correction"
  /** Same seed, same frame and angle. Defaults to the stamp's word. */
  seed?: string | number
}

/** A word stamped on the page: ESTIMATE, RECEIVED, PAID. */
export function Stamp({
  tone = "pen",
  seed,
  children,
  className,
  style,
  ...props
}: StampProps) {
  const key = String(
    seed ?? (typeof children === "string" ? children : "stamp"),
  )
  const r = stream(seedOf(key), "stamp")
  const turn = (r.chance(0.5) ? 1 : -1) * r.between(3, 7)
  return (
    <span
      data-slot="stamp"
      data-tone={tone}
      className={cn(
        "put-down frame inline-block rotate-(--stamp-turn) p-[0.22em] align-middle font-type text-small leading-none tracking-[0.18em] uppercase",
        tone === "correction" ? "text-correction" : "text-pen",
        className,
      )}
      style={
        {
          ...frameVars(seedOf(`${key}:outer`)),
          "--stamp-turn": `${turn.toFixed(2)}deg`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span
        className="frame block px-[0.7em] py-[0.5em] ps-[0.88em]"
        style={frameVars(seedOf(`${key}:inner`))}
      >
        {children}
      </span>
    </span>
  )
}
