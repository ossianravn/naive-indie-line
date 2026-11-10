import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf, stream } from "@/fineliner/pen/seed"

// A sheet fixed to the wall: a framed paper surface holding anything, fixed by a pin (a dot of ink), two strips of
// tape (in the wash) or a clip. At the lively hand it hangs a few seeded degrees off true, turning about its fixing;
// at the calm hand it hangs straight. With `href` the whole sheet is one link: it never tilts further on hover or
// focus, the pen presses harder instead, so the target stays where the eye found it. Props go to the sheet.

export type Fixing = "pin" | "tape" | "clip"

export interface PinnedProps extends Omit<ComponentProps<"div">, "children"> {
  children?: ReactNode
  /** How it is fixed to the wall. */
  fix?: Fixing
  /** Same seed, same frame and tilt. Defaults to the sheet's text where it has some; pass one for anything else. */
  seed?: string | number
  /** Makes the whole sheet a link. */
  href?: string
  /** Off the wall: the sheet fades and leaves the tab order; its fixing stays. */
  away?: boolean
}

/** What fixes the sheet, at its top edge. */
function Fixing({ fix }: { fix: Fixing }) {
  if (fix === "tape")
    return (
      <>
        {[-1, 1].map((side) => (
          <span
            key={side}
            aria-hidden="true"
            data-slot="pinned-tape"
            className="pointer-events-none absolute -top-2.5 h-4 w-12 bg-wash opacity-55 forced-colors:hidden"
            style={{
              [side < 0 ? "left" : "right"]: "-0.75rem",
              rotate: `${side * -32}deg`,
            }}
          />
        ))}
      </>
    )
  if (fix === "clip")
    return (
      <span
        aria-hidden="true"
        data-slot="pinned-clip"
        className="pointer-events-none absolute -top-3 left-1/2 h-6 w-9 -translate-x-1/2"
      >
        <span className="absolute inset-x-1.5 top-0 h-3 rounded-t-full border-(length:--pen-weight) border-b-0 border-pen" />
        <span className="absolute inset-x-0 top-2.5 h-3.5 rounded-[2px] bg-pen [filter:var(--wob,var(--wob-2))] forced-colors:bg-[CanvasText]" />
      </span>
    )
  return (
    <span
      aria-hidden="true"
      data-slot="pinned-pin"
      className="pointer-events-none absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-pen forced-colors:bg-[CanvasText]"
    />
  )
}

/**
 * A sheet pinned, taped or clipped to the wall, holding any content. With `href` the whole sheet is a link; with
 * `onClick` (as a trigger's `render` passes it) the whole sheet is a button. `away` takes the sheet off the wall (it
 * fades and leaves the tab order) while its fixing stays.
 */
export function Pinned({
  children,
  fix = "pin",
  seed,
  href,
  away = false,
  className,
  style,
  ...props
}: PinnedProps) {
  const key = String(seed ?? (typeof children === "string" ? children : fix))
  const r = stream(seedOf(key), "pinned")
  const turn = (r.chance(0.5) ? 1 : -1) * r.between(0.8, 2.6)
  const operable = Boolean(href || props.onClick)
  const sheet = cn(
    "frame relative block w-full bg-paper p-snug text-start text-pen transition-opacity duration-200",
    operable &&
      "cursor-pointer no-underline hover:[--pen-weight:var(--pen-weight-pressed)] focus-visible:[--pen-weight:var(--pen-weight-pressed)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen",
    away && "opacity-0",
  )
  const shared = {
    "data-slot": "pinned-sheet",
    className: sheet,
    style: frameVars(seedOf(key)),
    inert: away || undefined,
    "aria-hidden": away || undefined,
  }
  return (
    <div
      data-slot="pinned"
      data-fix={fix}
      data-away={away ? "" : undefined}
      className={cn(
        "relative origin-top rotate-(--pin-turn) calm:rotate-none",
        className,
      )}
      style={
        { "--pin-turn": `${turn.toFixed(2)}deg`, ...style } as CSSProperties
      }
    >
      {href ? (
        <a {...(props as ComponentProps<"a">)} {...shared} href={href}>
          {children}
        </a>
      ) : operable ? (
        <button
          type="button"
          {...(props as ComponentProps<"button">)}
          {...shared}
        >
          {children}
        </button>
      ) : (
        <div {...props} {...shared}>
          {children}
        </div>
      )}
      <Fixing fix={fix} />
    </div>
  )
}
