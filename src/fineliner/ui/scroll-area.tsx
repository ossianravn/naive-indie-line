"use client"

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@/fineliner/lib/utils"

// A pencil scrollbar on no track: a thin faint line that firms while the area is hovered or scrolled, and presses
// harder under the pointer or while dragged. The line is a background on a box wider than itself, so the wobble has
// room; the bar keeps a 10px hit area and nothing in it moves layout. The bar stands 4px in from the edge, so the
// pencil never runs into a frame drawn round the area. The viewport takes the page's dashed focus ring.

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none p-px select-none data-horizontal:mb-1 data-horizontal:h-2.5 data-horizontal:flex-col data-vertical:me-1 data-vertical:h-full data-vertical:w-2.5",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 text-pen-faint transition-colors duration-150 group-data-hovering/scrollbar:text-pen-quiet group-data-scrolling/scrollbar:text-pen-quiet before:absolute before:inset-0 before:bg-[linear-gradient(currentColor,currentColor)] before:bg-center before:bg-no-repeat before:transition-[background-size] before:duration-150 before:[filter:var(--wob,var(--wob-3))] hover:text-pen active:text-pen data-horizontal:before:bg-size-[100%_2px] data-vertical:before:bg-size-[2px_100%] data-horizontal:hover:before:bg-size-[100%_3px] data-vertical:hover:before:bg-size-[3px_100%] data-horizontal:active:before:bg-size-[100%_3px] data-vertical:active:before:bg-size-[3px_100%]"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
