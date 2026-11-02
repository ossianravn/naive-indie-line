"use client"

import { useMemo, type ComponentProps } from "react"
import { lettering, type LetteringOptions } from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"

export interface LetteringProps
  extends
    Omit<ComponentProps<"span">, "children">,
    Omit<LetteringOptions, "takes"> {
  /** The words to letter. Letters outside the alphabet draw as a question mark. */
  text: string
  /** One still drawing instead of three takes. */
  still?: boolean
}

/**
 * Words drawn by the pen in one of four faces (Liner, Stilt, Ribbon, Tramline), named by their text for screen
 * readers. Size it with a height class: the drawing keeps its proportions.
 */
export function Lettering({
  text,
  face,
  seed,
  hand,
  still,
  className,
  ...props
}: LetteringProps) {
  const html = useMemo(
    () => lettering(text, { face, seed, hand, takes: still ? 1 : 3 }).join(""),
    [text, face, seed, hand, still],
  )
  return (
    <span
      data-slot="lettering"
      data-face={face ?? "liner"}
      className={cn("fl-takes", className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}
