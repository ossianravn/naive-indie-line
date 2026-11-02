"use client"

import * as React from "react"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf } from "@/fineliner/pen/seed"

// A pen line along the top of the page that draws itself, from the start of the line, as the reader scrolls through
// an article. It is the kit's `rule` (one wobbling pen line, in CSS) revealed by a clip, so the line stays where it is
// and only more of it shows: drawn, not slid. Scroll sets one custom property from a passive listener, at most once a
// frame, so the page never re-renders while you read. It lies on a strip of paper, so text scrolling under it is
// covered rather than struck through. Under reduced motion it is a plain line that follows the scroll with no glide
// and no wobble.
//
// It is aria-hidden on purpose: it repeats the scroll position, which assistive technology already reports.

export interface ReadingProgressProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The article to track. Defaults to the first <article> in the container or the document. */
  target?: React.RefObject<HTMLElement | null>
  /** A scrolling element to track instead of the window. The line then sticks to the top of it. */
  container?: React.RefObject<HTMLElement | null>
  /** Same seed, same wobble. */
  seed?: string | number
}

/** How far through the article the reader is, from 0 to 1. */
function progressOf(article: HTMLElement, scroller: HTMLElement | null) {
  const box = article.getBoundingClientRect()
  const top = scroller
    ? box.top - scroller.getBoundingClientRect().top
    : box.top
  const view = scroller ? scroller.clientHeight : window.innerHeight
  const span = box.height - view
  if (span <= 0) return top <= 0 ? 1 : 0
  return Math.min(1, Math.max(0, -top / span))
}

function ReadingProgress({
  target,
  container,
  seed = "reading-progress",
  className,
  style,
  ...props
}: ReadingProgressProps) {
  const bar = React.useRef<HTMLDivElement>(null)
  const sticky = container !== undefined

  React.useEffect(() => {
    const scroller = container?.current ?? null
    const article =
      target?.current ??
      (scroller ?? document).querySelector<HTMLElement>("article")
    const el = bar.current
    if (!article || !el) return
    let frame = 0
    const update = () => {
      frame = 0
      el.style.setProperty("--read", progressOf(article, scroller).toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const source = scroller ?? window
    source.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const resize = new ResizeObserver(schedule)
    resize.observe(article)
    update()
    return () => {
      cancelAnimationFrame(frame)
      source.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      resize.disconnect()
    }
  }, [target, container])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      data-slot="reading-progress"
      className={cn(
        "float-sheet pointer-events-none z-40 h-3 text-pen",
        sticky ? "sticky top-0 -mb-3" : "fixed inset-x-0 top-0",
        className,
      )}
      style={{ ...(frameVars(seedOf(seed)) as React.CSSProperties), ...style }}
      {...props}
    >
      <span
        data-slot="reading-progress-line"
        className={cn(
          "rule block w-full",
          // Revealed from the inline start: the clip's far edge moves back as --read grows.
          "[clip-path:inset(-50%_calc((1_-_var(--read,0))*100%)_-50%_0)] rtl:[clip-path:inset(-50%_0_-50%_calc((1_-_var(--read,0))*100%))]",
          "motion-safe:transition-[clip-path] motion-safe:duration-150 motion-safe:ease-(--ease-out) motion-reduce:[--wob:none]",
        )}
      />
    </div>
  )
}

export { ReadingProgress }
