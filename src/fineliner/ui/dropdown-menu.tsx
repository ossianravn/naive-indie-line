"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  clearOfShadow,
  frameStyle,
  shadowRoom,
} from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A drawn sheet with the cartoonist's shadow, as wide as its longest item; the items scroll inside it, so the frame's
// overshoot and the shadow are never clipped. The highlighted item sits in a pale wobbling pocket, which is also its
// focus mark (items take roving focus, so no dashed ring). Checked items get a pen tick, the chosen radio item a dot;
// a submenu a pen chevron; shortcuts are typed; separators are a rule. The shadow lies 7px right of and below the
// sheet, so a sheet above or left of its trigger stands 7px further off, clear of the trigger's frame.
const TICK = penMark("tick", "dropdown-menu", "calm")
const DOT = penMark("dot", "dropdown-menu", "calm")
const CHEVRON = penMark("chevron", "dropdown-menu-sub", "calm")

const item =
  "pocket flex cursor-default items-center gap-tight px-tight py-hair font-ui text-ui leading-ui text-pen outline-hidden select-none data-highlighted:before:bg-tint data-inset:ps-[calc(var(--space-tight)*2+1rem)] data-disabled:pointer-events-none data-disabled:text-pen-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = clearOfShadow,
  className,
  children,
  style,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        collisionPadding={shadowRoom}
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "float-sheet frame z-50 flex max-h-(--available-height) w-max max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col outline-hidden duration-150 ease-(--ease-out) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            className,
          )}
          style={frameStyle("dropdown-menu-content", style)}
          {...props}
        >
          <span aria-hidden="true" className="pen-shadow" />
          <div className="min-h-0 overflow-x-hidden overflow-y-auto p-1">
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "label px-tight pt-hair pb-1 text-pen-quiet data-inset:ps-[calc(var(--space-tight)*2+1rem)]",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item",
        item,
        "data-[variant=destructive]:text-correction data-[variant=destructive]:data-highlighted:before:bg-correction/10 data-[variant=destructive]:*:[svg]:text-correction",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(item, "data-popup-open:before:bg-tint", className)}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="ms-auto block h-2.5 w-3.5 -rotate-90 text-pen-quiet rtl:rotate-90 [&>svg]:size-full!"
        dangerouslySetInnerHTML={{ __html: CHEVRON }}
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("min-w-36", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

/** The pen's mark at a checked or chosen item's trailing edge, put down as it appears. */
const markSlot =
  "pointer-events-none absolute end-tight flex size-4 items-center justify-center"
const mark = (svg: string) => (
  <span
    aria-hidden="true"
    className="put-down block size-full [&>svg]:size-full"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
)

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(item, "pe-9", className)}
      checked={checked}
      {...props}
    >
      <span
        className={markSlot}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator className="size-full">
          {mark(TICK)}
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(item, "pe-9", className)}
      {...props}
    >
      <span className={markSlot} data-slot="dropdown-menu-radio-item-indicator">
        <MenuPrimitive.RadioItemIndicator className="size-full">
          {mark(DOT)}
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("rule mx-tight text-pen-faint", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto ps-snug font-type text-small text-pen-quiet",
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
