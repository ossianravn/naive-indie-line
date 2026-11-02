import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// Notes passed across the counter. The person's own bubbles (default) sit in a pocket of tint; the other side
// (secondary) is drawn round with the pen. Muted is quieter words in a pocket of the paper's deeper stock, tinted a
// firmer tint, outline a quieter line that firms under the pointer (suggestions), ghost plain words, destructive the
// correction pen. Each bubble wobbles by its own words. Pockets draw a plain border in forced colours, where fills
// vanish.

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[min(100%,max(80%,18rem))] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:pocket *:data-[slot=bubble-content]:before:bg-tint *:data-[slot=bubble-content]:forced-colors:before:border [&>[data-slot=bubble-content]:is(button,a):hover]:before:bg-pen/15",
        secondary:
          "*:data-[slot=bubble-content]:frame [&>[data-slot=bubble-content]:is(button,a):hover]:[--pen-weight:var(--pen-weight-pressed)]",
        muted:
          "*:data-[slot=bubble-content]:pocket *:data-[slot=bubble-content]:text-pen-quiet *:data-[slot=bubble-content]:before:bg-paper-2 *:data-[slot=bubble-content]:forced-colors:before:border [&>[data-slot=bubble-content]:is(button,a):hover]:before:bg-tint",
        tinted:
          "*:data-[slot=bubble-content]:pocket *:data-[slot=bubble-content]:before:bg-pen/15 *:data-[slot=bubble-content]:forced-colors:before:border [&>[data-slot=bubble-content]:is(button,a):hover]:before:bg-pen/22",
        outline:
          "*:data-[slot=bubble-content]:frame *:data-[slot=bubble-content]:before:text-pen-faint *:data-[slot=bubble-content]:after:text-pen-faint [&>[data-slot=bubble-content]:is(button,a):hover]:before:text-pen [&>[data-slot=bubble-content]:is(button,a):hover]:after:text-pen",
        ghost:
          "*:data-[slot=bubble-content]:px-0 *:data-[slot=bubble-content]:py-0 [&>[data-slot=bubble-content]:is(button,a):hover]:underline",
        destructive:
          "*:data-[slot=bubble-content]:frame *:data-[slot=bubble-content]:text-correction [&>[data-slot=bubble-content]:is(button,a):hover]:[--pen-weight:var(--pen-weight-pressed)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-hair", className)}
      {...props}
    />
  )
}

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  style,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 px-tight py-hair font-read text-body leading-lead wrap-break-word group-data-[align=end]/bubble:self-end [button]:cursor-pointer [button]:text-left [button,a]:no-underline [button,a]:transition-colors",
          className,
        ),
        style: frameStyle(props.children, style) as React.CSSProperties,
      },
      props,
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "frame float-sheet absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 px-1.5 py-px font-type text-label leading-[1.45] text-pen tabular-nums [--over:1.5px] has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-tight",
        end: "right-tight",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
