"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

import { togglePocket, toggleVariants } from "@/fineliner/ui/toggle"

// Toggles in a row. Joined (spacing 0) outline toggles are a segmented control: the group shares one drawn frame, the
// items are divided by short pen strokes, and the chosen one takes a pocket of ink inset from the frame. Items are
// 6px shorter so the whole control stands as tall as a button. With spacing, each toggle keeps its own treatment.
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  style,
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  const gap = { "--gap": spacing } as React.CSSProperties
  const joined = spacing === 0 && variant === "outline"
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      style={frameStyle(
        props["aria-label"],
        typeof style === "function"
          ? (state: ToggleGroupPrimitive.State) => ({ ...gap, ...style(state) })
          : { ...gap, ...style },
      )}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] text-pen data-disabled:text-pen-faint data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        joined && "frame p-[3px]",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

// A short pen stroke on the leading edge of every item but the first, centred on the seam between two items.
const divider = {
  horizontal:
    "not-first:after:inset-y-[-3px] not-first:after:left-[-3px] not-first:after:w-1.5 not-first:after:bg-size-[var(--pen-weight)_100%]",
  vertical:
    "not-first:after:inset-x-[-3px] not-first:after:top-[-3px] not-first:after:h-1.5 not-first:after:bg-size-[100%_var(--pen-weight)]",
}
const joinedHeight = {
  default: "h-[calc(var(--control-height)-6px)]",
  sm: "h-[calc(var(--control-height-compact)-6px)]",
  lg: "h-[calc(3rem-6px)]",
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  style,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const itemVariant = context.variant || variant
  const itemSize = context.size || size || "default"
  const joined = context.spacing === 0 && itemVariant === "outline"

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={itemVariant}
      data-size={itemSize}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 focus:z-10 focus-visible:z-10",
        toggleVariants({
          variant: joined ? "default" : itemVariant,
          size: itemSize,
        }),
        joined && [
          joinedHeight[itemSize],
          divider[context.orientation ?? "horizontal"],
          "not-first:after:absolute not-first:after:bg-[linear-gradient(var(--toggle-ink),var(--toggle-ink))] not-first:after:bg-center not-first:after:bg-no-repeat not-first:after:[filter:var(--wob-5)]",
        ],
        className,
      )}
      style={frameStyle([children, props["aria-label"]], style)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          togglePocket,
          !joined && itemVariant === "outline" && "inset-[3px]",
        )}
      />
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
