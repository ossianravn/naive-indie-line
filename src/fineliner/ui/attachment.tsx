import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { Button } from "@/fineliner/ui/button"

// Files as small tickets: a drawn frame, seeded by the ticket's own words, round a typed file name. With media and a
// name, the media is the ticket's stub, torn off along a dashed perforation. Idle (waiting to go) is a dashed frame,
// error draws the frame in the correction pen, and uploading and processing pulse the name. A ticket you can open
// presses its line harder under the pointer.

const attachmentVariants = cva(
  [
    "group/attachment frame relative isolate flex w-fit max-w-full min-w-0 shrink-0 flex-wrap gap-(--ticket-gap) text-pen [--over:2.5px] calm:[--over:1px]",
    "[--ticket-perf:0px] has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:[--ticket-perf:var(--pen-weight)] [--ticket-stub:calc(var(--ticket-pad)+var(--ticket-media)+var(--ticket-gap)/2)]",
    "data-[state=error]:before:text-correction data-[state=error]:after:text-correction data-[state=idle]:before:border-dashed data-[state=idle]:after:border-dashed has-data-[slot=attachment-trigger]:hover:[--pen-weight:var(--pen-weight-pressed)]",
  ],
  {
    variants: {
      size: {
        default:
          "text-small [--ticket-gap:0.75rem] [--ticket-media:2.5rem] [--ticket-pad:0.5rem] has-data-[slot=attachment-content]:px-tight has-data-[slot=attachment-content]:py-hair has-data-[slot=attachment-media]:p-(--ticket-pad)",
        sm: "text-small [--ticket-gap:0.625rem] [--ticket-media:2rem] [--ticket-pad:0.375rem] has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-(--ticket-pad)",
        xs: "text-label [--ticket-gap:0.5rem] [--ticket-media:1.75rem] [--ticket-pad:0.25rem] has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-(--ticket-pad)",
      },
      orientation: {
        horizontal:
          "min-w-40 items-center has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:pe-tight",
        vertical:
          "w-(--ticket-w) flex-col [--ticket-stub:calc(var(--ticket-w)-var(--ticket-pad)+var(--ticket-gap)/2)] [--ticket-w:6rem] has-data-[slot=attachment-content]:[--ticket-w:7.5rem]",
      },
    },
  },
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  style,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      style={frameStyle(props.children, style)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-(--ticket-media) shrink-0 items-center justify-center text-pen-quiet group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:text-correction group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "pocket before:bg-tint forced-colors:before:border group-data-[state=error]/attachment:before:bg-correction/10",
        image:
          "overflow-hidden text-pen opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:data-[slot=drawing]:w-full *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // The perforation is the content's ::before, placed against the ticket rather than the content box.
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        "before:pointer-events-none before:absolute before:border-dashed before:border-pen-faint before:[filter:var(--wob-3)]",
        "group-data-[orientation=horizontal]/attachment:before:inset-y-[0.4rem] group-data-[orientation=horizontal]/attachment:before:start-[calc(var(--ticket-stub)-0.5px)] group-data-[orientation=horizontal]/attachment:before:border-s-(length:--ticket-perf)",
        "group-data-[orientation=vertical]/attachment:before:inset-x-[0.4rem] group-data-[orientation=vertical]/attachment:before:top-[calc(var(--ticket-stub)-0.5px)] group-data-[orientation=vertical]/attachment:before:border-t-(length:--ticket-perf)",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-type leading-[1.45] text-pen group-data-[orientation=vertical]/attachment:text-label group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block max-w-full min-w-0 truncate label text-pen-quiet group-data-[state=error]/attachment:text-correction",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:end-[calc(var(--ticket-pad)+0.25rem)] group-data-[orientation=vertical]/attachment:top-[calc(var(--ticket-pad)+0.25rem)] group-data-[orientation=vertical]/attachment:gap-1 group-data-[orientation=vertical]/attachment:*:before:bg-paper",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn("text-pen-quiet hover:text-pen", className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 cursor-pointer", className),
      },
      props,
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "-mx-2 flex min-w-0 snap-x snap-mandatory scroll-px-2 gap-tight overflow-x-auto overscroll-x-contain p-2 [scrollbar-width:none] *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className,
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
