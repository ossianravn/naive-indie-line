import type { CSSProperties, ReactNode } from "react"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// Pieces for drawing parts on the Components index. A real popup opens in a portal, and only in the browser, so the
// index draws an open overlay with the kit's own utilities and classes instead (float-sheet, frame, the pen-shadow,
// the menu item's pocket, the tooltip's ink strip). Scaled shows a real part smaller when it is taller than the plate.

/** A floating sheet as the kit draws one: paper, a drawn frame and the cartoonist's shadow. */
export function Sheet({
  seed,
  className,
  style,
  children,
}: {
  seed: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "float-sheet frame relative isolate text-small leading-small text-pen",
        className,
      )}
      style={frameStyle(seed, style)}
    >
      <span aria-hidden="true" className="pen-shadow" />
      {children}
    </div>
  )
}

/** A menu item; `active` takes the pale pocket a highlighted item gets, `danger` the correction pen. */
export function MenuRow({
  children,
  active,
  shortcut,
  danger,
}: {
  children: ReactNode
  active?: boolean
  shortcut?: string
  danger?: boolean
}) {
  return (
    <div
      className={cn(
        "pocket flex items-center gap-tight px-tight py-hair font-ui text-ui leading-ui",
        danger ? "text-correction" : "text-pen",
        active && "before:bg-tint",
      )}
    >
      {children}
      {shortcut && (
        <span className="ms-auto ps-snug font-type text-small text-pen-quiet">
          {shortcut}
        </span>
      )}
    </div>
  )
}

export function MenuRule() {
  return <div className="rule mx-tight text-pen-faint" />
}

/** The tooltip's strip of solid ink, with its point underneath. */
export function Strip({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-col items-center">
      <span className="relative isolate z-10 px-tight py-1 font-type text-small leading-ui text-paper before:absolute before:inset-0 before:-z-10 before:rounded-[1px] before:bg-pen before:[filter:var(--wob,var(--wob-2))]">
        {children}
      </span>
      <span className="-mt-1.5 size-2.5 rotate-45 rounded-[1px] bg-pen [filter:var(--wob,var(--wob-2))]" />
    </span>
  )
}

/** Faint pen rules standing for a page's text behind a sheet or drawer. */
export function PageLines({ widths }: { widths: number[] }) {
  return (
    <div className="flex flex-col text-pen-faint">
      {widths.map((w, i) => (
        <span key={i} className="rule" style={{ width: `${w}%` }} />
      ))}
    </div>
  )
}

/** A real part drawn smaller, for one taller than the plate; drawings keep the pen's weight as they shrink. */
export function Scaled({
  by,
  className,
  children,
}: {
  by: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("w-fit", className)} style={{ zoom: by }}>
      {children}
    </div>
  )
}
