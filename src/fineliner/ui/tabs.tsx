"use client"

import { useMemo } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// Labels in the reading voice on a pen rule (the line variant drops the rule; vertical tabs have it down their
// inline-end side). The active tab's words are underlined by a pen stroke, seeded by the tab's value and put down
// with a short wipe when it becomes active. Orientation is matched on data-orientation directly, so the classes work
// without shadcn's data-horizontal and data-vertical variants.

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-snug data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

// The rule is a pseudo-element taller (or wider) than the line, so the wobble filter has room to bend it.
const rule =
  "after:pointer-events-none after:absolute after:bg-[linear-gradient(currentColor,currentColor)] after:bg-center after:bg-no-repeat after:text-pen-faint after:[filter:var(--wob,var(--wob-3))]"

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex h-control w-full items-center justify-start text-pen-quiet group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:w-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: cn(
          rule,
          "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-1.5 group-data-[orientation=horizontal]/tabs:after:h-3 group-data-[orientation=horizontal]/tabs:after:bg-size-[100%_var(--pen-weight)] group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1.5 group-data-[orientation=vertical]/tabs:after:w-3 group-data-[orientation=vertical]/tabs:after:bg-size-[var(--pen-weight)_100%]",
        ),
        line: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  const underline = useMemo(
    () => penMark("underline", `tab:${String(props.value ?? "")}`, "calm"),
    [props.value],
  )
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "group/tabs-trigger relative inline-flex cursor-pointer items-center justify-center px-tight font-ui text-ui leading-ui whitespace-nowrap text-pen-quiet transition-colors select-none hover:text-pen data-active:text-pen data-disabled:cursor-not-allowed data-disabled:text-pen-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[orientation=horizontal]/tabs:h-full group-data-[orientation=vertical]/tabs:h-control-compact group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:pr-snug",
        className,
      )}
      {...props}
    >
      <span className="relative inline-flex items-center gap-hair">
        {children}
        <span
          aria-hidden="true"
          className="put-down pointer-events-none absolute inset-x-[-0.2em] -bottom-[0.4em] hidden h-[0.45em] text-pen group-data-active/tabs-trigger:block [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: underline }}
        />
      </span>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
