import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { Separator } from "@/fineliner/ui/separator"

// An open row for one thing in a list: a drawing or an icon as media, the title in the reading voice, a description in
// the quiet pen and actions at the end. Outline rows are drawn round by the pen, seeded by their words so neighbours
// wobble differently; muted rows sit in a tint pocket. A row rendered as a link takes a tint pocket on hover (an
// outline row presses its pen harder instead); focus is the page's dashed ring.

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-tight has-data-[size=sm]:gap-hair has-data-[size=xs]:gap-1 has-data-[slot=item-separator]:gap-0",
        className,
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      // An item group is a list, which may own only list items: the rule is for the eye, hidden from assistive tech.
      aria-hidden="true"
      className={cn("my-0 text-pen-faint", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center text-small leading-small text-pen transition-colors duration-100 [a]:no-underline",
  {
    variants: {
      variant: {
        default: cn("pocket", "[a]:hover:before:bg-tint"),
        outline:
          "frame [a]:hover:[--pen-weight:var(--pen-weight-pressed)] calm:[--over:1.5px]",
        muted: cn("pocket", "before:bg-tint [a]:hover:before:bg-pen/15"),
      },
      size: {
        default: "gap-snug px-snug py-tight",
        sm: "gap-tight px-tight py-hair",
        xs: "gap-hair px-hair py-1 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  style,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
        style:
          variant === "outline" ? frameStyle(props.children, style) : style,
      },
      props,
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-hair group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "text-pen-quiet group-has-data-[slot=item-description]/item:translate-y-0.5 [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-12 overflow-hidden rounded-[2px] group-data-[size=sm]/item:size-9 group-data-[size=xs]/item:size-6 has-data-[slot=drawing]:overflow-visible [&_img]:size-full [&_img]:object-cover [&>[data-slot=drawing]]:w-full",
        number:
          "min-w-[2.6ch] justify-start font-type text-small leading-none text-pen-quiet tabular-nums group-has-data-[slot=item-description]/item:translate-y-[0.3rem] group-data-[size=sm]/item:text-label group-data-[size=xs]/item:text-label",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-hair font-read text-body leading-subhead font-medium text-pen group-data-[size=sm]/item:text-ui group-data-[size=xs]/item:text-small",
        className,
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "m-0 line-clamp-2 text-left text-small leading-small font-normal text-pen-quiet group-data-[size=xs]/item:text-label",
        className,
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-hair", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
