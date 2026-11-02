import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/fineliner/lib/utils"

// A line in the thread that is not a message: a date, where unread messages begin, someone joining. Label text in the
// quiet pen; the separator variant sits between two pen rules (each through its own wobble, so they never match), the
// border variant on one rule beneath. Write the whole marker in the full pen (text-pen) to call it out: the rules
// follow the text.
const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-hair label text-left text-pen-quiet [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:decoration-1 [a]:underline-offset-[0.25em] [a]:hover:text-pen",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "gap-tight before:rule before:min-w-0 before:flex-1 before:[filter:var(--wob-3)] after:rule after:min-w-0 after:flex-1 after:[filter:var(--wob-5)]",
        border:
          "pb-hair after:rule after:absolute after:inset-x-0 after:-bottom-1.5",
      },
    },
  },
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:decoration-1 *:[a]:underline-offset-[0.25em] *:[a]:hover:text-pen",
        className,
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
