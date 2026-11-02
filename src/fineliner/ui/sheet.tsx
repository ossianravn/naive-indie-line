"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

import { Button } from "@/fineliner/ui/button"

// A sheet of paper laid along one edge of the window, over the page dimmed with paper (no blur). It stands a tight
// space off the window's edges, so all four drawn edges and the cartoonist's shadow show. Surfaces do not slide: the
// sheet fades in and grows a little from the edge it belongs to. Title in the reading face at lead size; the actions
// sit in the air at the foot, with no rule: at the end on a side sheet, under the words on a wide top or bottom one.
// The sheet never scrolls; a long body scrolls inside it (give the body min-h-0 and overflow-y-auto), so nothing clips
// the frame's overshoot or the shadow.

type Side = "top" | "right" | "bottom" | "left"

// Per side: where the sheet stands, how big it is, and the edge it grows from. A map rather than data-[side] variants,
// so a caller's width or height (the mobile sidebar's) merges over these instead of losing on specificity.
const SIDES: Record<Side, string> = {
  right:
    "inset-y-tight right-tight w-[calc(75%-var(--space-tight))] origin-right sm:max-w-sm",
  left: "inset-y-tight left-tight w-[calc(75%-var(--space-tight))] origin-left sm:max-w-sm",
  top: "inset-x-tight top-tight max-h-[85dvh] origin-top",
  bottom: "inset-x-tight bottom-tight max-h-[85dvh] origin-bottom",
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-paper/70 duration-200 ease-(--ease-out) data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  style,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: Side
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Viewport
        data-slot="sheet-viewport"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            "float-sheet frame pointer-events-auto fixed z-50 flex flex-col gap-snug text-small leading-small outline-hidden duration-200 ease-(--ease-out) has-[>[data-slot=sheet-close]]:*:data-[slot=sheet-header]:pr-12 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            SIDES[side],
            className,
          )}
          style={frameStyle(`sheet-${side}`, style)}
          {...props}
        >
          <span aria-hidden="true" className="pen-shadow" />
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot="sheet-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-tight right-tight"
                  size="icon-sm"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-hair p-snug pb-0", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-wrap-reverse justify-end gap-tight p-snug pt-0 in-data-[side=bottom]:justify-start in-data-[side=top]:justify-start",
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "m-0 font-read text-lead leading-subhead font-medium text-pen",
        className,
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("m-0 text-small leading-small text-pen-quiet", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
