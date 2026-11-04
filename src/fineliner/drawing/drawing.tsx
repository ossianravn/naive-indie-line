"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
} from "react"
import { drawing, type DrawingOptions } from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { drawWhenSeen } from "./drawing-motion"
import { boilTakes } from "./drawing-takes"
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

const never = () => () => {}

/**
 * A seeded drawing from the object library, or a scene. Same seed, same drawing on the server and in the browser. Its
 * first take is named by `title` (or the object's own name), and title="" makes it decorative. Line boil cycles three
 * takes where data-boil allows: the server sends the first, and the browser draws the other two where boil can show
 * them (drawing-takes.ts); a drawing drawn in the browser, as after a reroll, has all three at once.
 */
export function Drawing({
  object,
  scene,
  format,
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
  // True on the server and while React hydrates the server's markup; false in a browser render.
  const hydrating = useSyncExternalStore(
    never,
    () => false,
    () => true,
  )
  // The server's markup is already this drawing, so hydration keeps it instead of drawing every take again (a scene
  // is a few hundred milliseconds of work on a phone). The pen draws in the browser once a prop changes.
  const asked = [
    object,
    scene,
    format,
    seed,
    hand,
    title,
    still,
    drawOnView,
  ].join("|")
  const [served] = useState(() =>
    hydrating && typeof window !== "undefined" ? asked : null,
  )
  const [moved, setMoved] = useState(false)
  if (served !== null && asked !== served && !moved) setMoved(true)
  const keep = !moved && asked === served
  const html = useMemo(() => {
    if (keep) return ""
    const svg = drawing({
      object,
      scene,
      format,
      seed,
      hand,
      title,
      takes: still || typeof window === "undefined" ? 1 : 3,
    })
    // Drawn in the browser, a drawing that is drawn on waits undrawn from its first paint. The server's copy shows at
    // once: a page never waits for its script to show its pictures (drawWhenSeen hides it only out of view).
    const waits = drawOnView && typeof window !== "undefined"
    return svg
      .map((s) =>
        waits
          ? s.replace('class="fl-drawing ', 'class="fl-drawing fl-unseen ')
          : s,
      )
      .join("")
  }, [keep, object, scene, format, seed, hand, title, still, drawOnView])
  const inner = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const el = inner.current
    return drawOnView && el ? drawWhenSeen(el) : undefined
  }, [drawOnView, html])
  useEffect(() => {
    if (!still && inner.current) boilTakes(inner.current)
  }, [still])
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
      data-format={format}
      // What the browser needs to draw the other takes (drawing-takes.ts).
      data-seed={still ? undefined : String(seed)}
      data-hand={hand}
      className={cn("fl-takes", className)}
      // Kept markup is left as the server sent it: React does not compare inner HTML when it hydrates.
      dangerouslySetInnerHTML={{ __html: own(html) }}
      suppressHydrationWarning
      {...props}
    />
  )
}
