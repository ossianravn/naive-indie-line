"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/fineliner/lib/utils"

// One wobbling pen line across its box (the rule utility), or the same line turned to run down. The box is a little
// wider than the line so the wobble is never clipped; it draws in currentColor, so it takes the colour of its context.
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "rule shrink-0 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-3 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:bg-size-[var(--pen-weight)_100%]",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
