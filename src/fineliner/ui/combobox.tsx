"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { XIcon } from "lucide-react"
import {
  clearOfShadow,
  frameStyle,
  shadowRoom,
} from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/fineliner/ui/input-group"
import {
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/fineliner/ui/combobox-chips"

// A typed field in the input group's steady line, with a pen chevron that opens the list and a clear button once
// something is chosen. The list is the select's sheet: paper drawn round by the pen, lifted by the cartoonist's
// shadow, growing from the field; the list inside scrolls, never the sheet, so nothing clips the frame. The
// highlighted option takes a pale pocket that wobbles with the frame and the chosen one a tick, put down. Several
// choices collect as small framed tags inside the field (combobox-chips.tsx).
const TICK = penMark("tick", "combobox", "calm")
const CHEVRON = penMark("chevron", "combobox", "calm")

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none block h-2.5 w-3.5 shrink-0 [&>svg]:size-full!"
        dangerouslySetInnerHTML={{ __html: CHEVRON }}
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  return (
    <InputGroup
      className={cn(
        "w-auto has-data-popup-open:shadow-[inset_0_0_0_0.65px_var(--input)]",
        className,
      )}
    >
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden aria-expanded:before:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = clearOfShadow,
  align = "start",
  alignOffset = 0,
  anchor,
  children,
  style,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={shadowRoom}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content float-sheet frame relative isolate flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+2.25rem)] origin-(--transform-origin) flex-col duration-150 ease-(--ease-out) data-[chips=true]:min-w-(--anchor-width) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100 *:data-[slot=input-group]:m-1.5 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-control-compact *:data-[slot=input-group]:w-auto",
            className,
          )}
          style={frameStyle("combobox-content", style)}
          {...props}
        >
          <span className="pen-shadow" aria-hidden="true" />
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(18rem,calc(var(--available-height)-2.25rem))] min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain py-1 data-empty:p-0",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "flex w-full cursor-default items-center gap-hair py-hair pr-9 pl-tight text-ui leading-ui text-pen outline-hidden select-none pocket data-highlighted:before:bg-tint data-disabled:pointer-events-none data-disabled:text-pen-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="put-down pointer-events-none absolute top-1/2 right-2.5 size-[1.15rem] -translate-y-[60%]" />
        }
      >
        <span
          aria-hidden="true"
          className="block size-full [&>svg]:size-full!"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("label px-tight pt-hair pb-1 text-pen-quiet", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center px-tight py-snug text-center text-small leading-small text-pen-quiet group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "rule pointer-events-none mx-tight text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
