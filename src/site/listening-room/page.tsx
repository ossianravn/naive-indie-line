import type { ReactNode } from "react"
import { cn } from "@/fineliner/lib/utils"

// Every Listening Room page in one frame: the same content edge, gutters and top inside the shell, and the same
// header (a kicker, the heading, an optional lede and an action at the end), so headings line up from page to page.

/** The shell's content column: one edge, one gutter, one top. */
export function ShellPage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[72rem] px-snug pt-section pb-page sm:px-line",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A page's kicker, heading, lede and one action at the end. */
export function PageHeader({
  kicker,
  title,
  lede,
  action,
}: {
  kicker: ReactNode
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-snug">
      <div className="min-w-0">
        <p className="label m-0 text-pen-quiet">{kicker}</p>
        <h1 className="m-0 mt-hair text-h1 wrap-anywhere">{title}</h1>
        {lede && (
          <p className="m-0 mt-hair max-w-measure text-lead leading-subhead text-pen-quiet">
            {lede}
          </p>
        )}
      </div>
      {action}
    </header>
  )
}
