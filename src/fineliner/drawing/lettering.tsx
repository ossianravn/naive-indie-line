import type { ComponentProps } from "react"
import { cn } from "@/fineliner/lib/utils"

/** The pen as typefaces: Naïve Indie Line Sans, Inline and Tramline. */
export type LetteringFace = "line" | "inline" | "tramline"

export interface LetteringProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** The words to letter. */
  text: string
  /**
   * "line" (the default) sets the words in Naïve Indie Line Sans. "inline" sets them in Naïve Indie Inline with its
   * tint in the wash under the outlines (import styles/inline.generated.css once); "tramline" in Naïve Indie Tramline,
   * every stroke three parallel lines (import styles/tramline.generated.css once). Size it with a text size.
   */
  face?: LetteringFace
}

const FONTS = {
  line: "font-line",
  inline: "font-inline",
  tramline: "font-tramline",
} satisfies Record<LetteringFace, string>

/**
 * Display lettering: words set in one of the pen's typefaces, whose three takes per letter rotate so a repeated letter
 * is never stamped. It is text, so search engines and screen readers read it as words. For words drawn by the pen as
 * an SVG from a seed, use lettering() from the pen engine.
 */
export function Lettering({
  text,
  face = "line",
  className,
  ...props
}: LetteringProps) {
  return (
    <span
      data-slot="lettering"
      data-face={face}
      data-text={face === "inline" ? text : undefined}
      className={cn(FONTS[face], "font-normal", className)}
      {...props}
    >
      {text}
    </span>
  )
}
