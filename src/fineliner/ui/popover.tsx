"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { clearOfShadow, frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A small sheet of paper drawn round by the pen, lifted off the page by the cartoonist's shadow: a second line along
// the right and bottom that follows the sheet in 40 ms later. It grows from its trigger. The popup takes focus
// programmatically, so it draws no ring of its own; the controls inside it keep the page's dashed ring. The shadow
// lies 7px right of and below the sheet, so a sheet that opens above or to the left of its trigger stands 7px further
// off, clear of the trigger's frame.

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = clearOfShadow,
  children,
  style,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "float-sheet frame z-50 flex w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-tight p-snug text-small leading-small outline-hidden duration-200 ease-(--ease-out) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            className,
          )}
          style={frameStyle("popover-content", style)}
          {...props}
        >
          <span aria-hidden="true" className="pen-shadow" />
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-small leading-small", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn(
        "m-0 font-read text-body leading-subhead font-medium text-pen",
        className,
      )}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("m-0 text-small leading-small text-pen-quiet", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
