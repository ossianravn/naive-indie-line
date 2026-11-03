"use client"

import { useEffect, useMemo, useRef, type ComponentProps } from "react"
import { drawing, type DrawingOptions } from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { drawWhenSeen } from "./drawing-motion"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

export interface DrawingProps
  extends
    Omit<ComponentProps<"span">, "children" | "title">,
    Omit<DrawingOptions, "takes"> {
  /** One still drawing instead of three takes: no line boil, no settling. */
  still?: boolean
  /** Draw it on, stroke by stroke, the first time it comes into view. For rare moments: a hero, an empty state. */
  drawOnView?: boolean
}

/**
 * A seeded drawing from the object library, or a scene. Same seed, same drawing on the server and in the browser. It
 * renders three takes, which line boil cycles where data-boil allows; the first is named by `title` (or the object's
 * own name), and title="" makes it decorative.
 */
export function Drawing({
  object,
  scene,
  seed,
  hand,
  title,
  still,
  drawOnView,
  className,
  ref: outer,
  ...props
}: DrawingProps) {
  const own = useOwnIds()
  const html = useMemo(() => {
    const svg = drawing({
      object,
      scene,
      seed,
      hand,
      title,
      takes: still ? 1 : 3,
    })
    // A drawing that is drawn on waits undrawn from the first paint, so the server's copy never flashes first.
    return svg
      .map((s) =>
        drawOnView
          ? s.replace('class="fl-drawing ', 'class="fl-drawing fl-unseen ')
          : s,
      )
      .join("")
  }, [object, scene, seed, hand, title, still, drawOnView])
  const inner = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const el = inner.current
    return drawOnView && el ? drawWhenSeen(el) : undefined
  }, [drawOnView, html])
  return (
    <span
      // A caller's ref is kept beside the drawing's own, which drawOnView needs.
      ref={(el) => {
        inner.current = el
        if (typeof outer === "function") outer(el)
        else if (outer) outer.current = el
      }}
      data-slot="drawing"
      data-object={object}
      data-scene={scene}
      className={cn("fl-takes", className)}
      dangerouslySetInnerHTML={{ __html: own(html) }}
      {...props}
    />
  )
}
