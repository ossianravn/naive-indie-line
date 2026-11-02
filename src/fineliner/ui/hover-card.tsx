"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import {
  clearOfShadow,
  frameStyle,
  shadowRoom,
} from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A small sheet of paper drawn round by the pen, lifted off the page by the cartoonist's shadow, like the popover: a
// glance at what a link points to, opened by hovering or focusing it. It grows from its trigger and can carry a
// drawing (a record's sleeve, a person's portrait). The shadow lies 7px right of and below the sheet, so a card that
// opens above or to the left of its trigger stands 7px further off.

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = clearOfShadow,
  align = "center",
  alignOffset = 4,
  children,
  style,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        collisionPadding={shadowRoom}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "float-sheet frame z-50 w-64 max-w-(--available-width) origin-(--transform-origin) p-snug text-small leading-small outline-hidden duration-200 ease-(--ease-out) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            className,
          )}
          style={frameStyle("hover-card-content", style)}
          {...props}
        >
          <span aria-hidden="true" className="pen-shadow" />
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
