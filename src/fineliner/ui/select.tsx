"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import {
  clearOfShadow,
  frameStyle,
  shadowRoom,
} from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// The trigger is a steady field with a pen chevron. The list is a sheet of paper with a drawn frame and the
// cartoonist's shadow; the frame and shadow reach past the sheet's box, so the list inside scrolls, never the sheet.
// The highlighted option takes a pale pocket that wobbles with the frame, and the chosen one a tick, put down.
const TICK = penMark("tick", "select", "calm")
const CHEVRON = penMark("chevron", "select", "calm")

function Chevron({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none block h-2.5 w-3.5 shrink-0 [&>svg]:size-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: CHEVRON }}
    />
  )
}

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "control-field flex w-fit cursor-pointer items-center justify-between gap-tight py-0 pr-tight pl-tight whitespace-nowrap select-none data-placeholder:text-pen-quiet data-popup-open:shadow-[inset_0_0_0_0.65px_var(--input)] data-[size=default]:h-control data-[size=sm]:h-control-compact data-[size=sm]:text-small *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-hair [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="flex">
        <Chevron />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = clearOfShadow,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  style,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        collisionPadding={shadowRoom}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "float-sheet frame relative isolate z-50 flex max-h-(--available-height) w-[calc(var(--anchor-width)+6px)] min-w-36 origin-(--transform-origin) flex-col duration-150 ease-(--ease-out) data-[align-trigger=true]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            className,
          )}
          style={frameStyle("select-content", style)}
          {...props}
        >
          <span className="pen-shadow" aria-hidden="true" />
          <SelectScrollUpButton />
          <SelectPrimitive.List className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto py-0.5">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("label px-tight pt-hair pb-1 text-pen-quiet", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "group/select-item flex w-full cursor-default items-center gap-hair py-hair pr-9 pl-tight text-ui leading-ui text-pen outline-hidden select-none pocket data-highlighted:before:bg-tint data-disabled:pointer-events-none data-disabled:text-pen-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex shrink-0 gap-hair whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="put-down pointer-events-none absolute top-1/2 right-2.5 size-[1.15rem] -translate-y-[60%]" />
        }
      >
        <span
          aria-hidden="true"
          className="block size-full [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "rule pointer-events-none mx-tight text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "float-sheet top-0 z-10 flex w-full cursor-default items-center justify-center py-1 text-pen",
        className,
      )}
      {...props}
    >
      <Chevron className="rotate-180" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "float-sheet bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 text-pen",
        className,
      )}
      {...props}
    >
      <Chevron />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
