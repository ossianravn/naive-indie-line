"use client"

import { useMemo, type ComponentProps } from "react"
import {
  lettering,
  type FaceName,
  type LetteringOptions,
} from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { useOwnIds } from "@/fineliner/lib/svg-ids"

/** "line" and "inline" are real fonts (Naïve Indie Line Sans and Inline); the others are drawn by the pen. */
export type LetteringFace = "line" | "inline" | FaceName

export interface LetteringProps
  extends
    Omit<ComponentProps<"span">, "children">,
    Omit<LetteringOptions, "takes" | "face"> {
  /** The words to letter. */
  text: string
  /**
   * "line" (the default) sets the words as text in Naïve Indie Line Sans, so search engines and screen readers read them
   * as words; size it with a text size. "inline" sets them in Naïve Indie Inline with its tint in the wash under the
   * outlines (import styles/inline.generated.css once). "tramline" draws them with the pen as an SVG; size it with a
   * height.
   */
  face?: LetteringFace
  /** One still drawing instead of three takes (drawn faces only). */
  still?: boolean
}

/**
 * Display lettering: words in Naïve Indie Line Sans or Inline, the pen as typefaces whose three takes per letter rotate
 * so a repeated letter is never stamped; or drawn by the pen in Tramline, named by their text for screen readers.
 */
export function Lettering({
  text,
  face = "line",
  seed,
  hand,
  still,
  className,
  ...props
}: LetteringProps) {
  const own = useOwnIds()
  const html = useMemo(
    () =>
      face === "line" || face === "inline"
        ? ""
        : lettering(text, { face, seed, hand, takes: still ? 1 : 3 }).join(""),
    [text, face, seed, hand, still],
  )
  if (face === "line" || face === "inline")
    return (
      <span
        data-slot="lettering"
        data-face={face}
        data-text={face === "inline" ? text : undefined}
        className={cn(
          face === "line" ? "font-line" : "font-inline",
          "font-normal",
          className,
        )}
        {...props}
      >
        {text}
      </span>
    )
  return (
    <span
      data-slot="lettering"
      data-face={face}
      className={cn("fl-takes", className)}
      dangerouslySetInnerHTML={{ __html: own(html) }}
      {...props}
    />
  )
}
