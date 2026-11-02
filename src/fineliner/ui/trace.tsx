"use client"

import * as React from "react"
import { wordsOf } from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/fineliner/ui/collapsible"
import { Spinner } from "@/fineliner/ui/spinner"

// A timeline of typed numbers, each ringed by the pen and joined to the next by a standing pen rule that runs down
// through any open detail. The line's status changes the ring: running turns it (the spinner's ring), done puts a tick
// down over the number, error writes it in the correction pen, pending leaves it faint. Rings are seeded by their
// number, so each step is drawn its own way and always the same way.

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "flex w-full min-w-0 flex-col gap-tight [--trace-ring:1.5rem] *:relative",
        "*:not-last:before:pointer-events-none *:not-last:before:absolute *:not-last:before:start-[calc(var(--trace-ring)/2-0.375rem)] *:not-last:before:top-[calc(var(--trace-ring)+2px)] *:not-last:before:-bottom-[calc(var(--space-tight)-2px)] *:not-last:before:rule-y *:not-last:before:text-pen-faint",
        "*:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:no-underline",
        className,
      )}
      {...props}
    />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending" | "done"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "group/trace-line flex w-fit max-w-full min-w-0 items-center gap-hair font-ui text-small leading-small text-pen-quiet transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-pen data-[status=error]:text-correction data-[status=error]:in-[a:hover,button:hover]:text-correction data-[status=running]:text-pen",
        className,
      )}
      {...props}
    />
  )
}

function TraceIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const seed = `trace:${wordsOf(children)}`
  const marks = React.useMemo(
    () => ({
      ring: penMark("ring", seed, "calm"),
      tick: penMark("tick", seed, "calm"),
    }),
    [seed],
  )
  const mark = "pointer-events-none absolute [&>svg]:size-full"
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "relative flex size-(--trace-ring) shrink-0 items-center justify-center font-type text-label leading-none text-pen tabular-nums group-data-[status=error]/trace-line:text-correction group-data-[status=pending]/trace-line:text-pen-faint [&_svg]:pointer-events-none",
        "[[data-slot=trace-title]~&]:-ms-1 [[data-slot=trace-title]~&]:size-4 [[data-slot=trace-title]~&]:*:opacity-100! [[data-slot=trace-title]~&]:*:data-trace-mark:hidden!",
        className,
      )}
      {...props}
    >
      <span
        data-trace-mark=""
        className={cn(
          mark,
          "inset-0 group-data-[status=running]/trace-line:hidden",
        )}
        dangerouslySetInnerHTML={{ __html: marks.ring }}
      />
      <Spinner
        data-trace-mark=""
        className="absolute inset-0 hidden size-full group-data-[status=running]/trace-line:block"
      />
      <span className="relative flex items-center justify-center group-data-[status=done]/trace-line:opacity-0 [&_svg:not([class*='size-'])]:size-3.5">
        {children}
      </span>
      <span
        data-trace-mark=""
        className={cn(
          mark,
          "put-down -top-[0.2rem] left-[0.1rem] hidden size-[1.25rem] group-data-[status=done]/trace-line:block",
        )}
        dangerouslySetInnerHTML={{ __html: marks.tick }}
      />
    </span>
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn("min-w-0 truncate", className)}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "shrink-0 font-type text-label leading-[1.45] text-pen-quiet tabular-nums group-data-[status=error]/trace-line:text-correction",
        className,
      )}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "open"> &
  (
    | { open?: undefined }
    | {
        open: boolean
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 text-left text-pen-quiet transition-colors hover:text-pen has-[[data-status=error]]:text-correction",
        className,
      )}
      {...props}
    >
      {children}
      <CollapsibleChevron className="size-3.5" />
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="min-w-0"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "ms-[calc(var(--trace-ring)+var(--space-hair))] mt-1 mb-hair max-w-measure min-w-0 pe-1 font-read text-small leading-small wrap-break-word text-pen-quiet",
          className,
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
