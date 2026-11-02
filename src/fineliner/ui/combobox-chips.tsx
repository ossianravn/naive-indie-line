"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { XIcon } from "lucide-react"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

import { Button } from "@/fineliner/ui/button"

// A multiple combobox's chosen values, collected as small tags drawn round by the pen inside a steady field line.
// The field takes the page's dashed ring while its input has focus, the correction pen's underline when invalid and
// the dashed line when disabled. Tags are seeded by their words, so neighbours wobble differently; each keeps a
// remove button with a 24px hit area, and arrow keys move focus onto the tags themselves.
function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "control-field flex min-h-control flex-wrap items-center gap-x-2 gap-y-1.5 px-tight py-1.5 has-data-[slot=combobox-chip]:pl-2",
        "has-[input:focus-visible]:outline-[1.5px] has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-pen has-[input:focus-visible]:outline-dashed",
        "has-aria-invalid:border-correction has-aria-invalid:shadow-[inset_0_-1.5px_0_var(--correction)]",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-dashed has-[input:disabled]:text-pen-faint has-[input:disabled]:hover:shadow-none",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  style,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "frame label flex h-7 w-fit items-center justify-center gap-0.5 px-hair pb-px whitespace-nowrap text-pen [--over:2px] calm:[--over:0.8px] data-disabled:cursor-not-allowed data-disabled:text-pen-faint has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      style={frameStyle(children, style)}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="size-6 text-pen-quiet hover:text-pen in-data-disabled:pointer-events-none"
          data-slot="combobox-chip-remove"
          aria-label="Remove"
        >
          <XIcon className="pointer-events-none size-3" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "h-7 min-w-16 flex-1 bg-transparent px-1 font-ui text-ui text-pen outline-none placeholder:text-pen-quiet disabled:cursor-not-allowed disabled:text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export { ComboboxChip, ComboboxChips, ComboboxChipsInput, useComboboxAnchor }
