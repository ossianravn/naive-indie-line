"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A disclosure. The panel opens and closes by animating its height (200 ms on the pen's curve), so it clips while it
// moves; give its content a little padding when it holds focusable things. CollapsibleChevron is the pen's chevron:
// put it in the trigger and it turns from pointing along the line to pointing down as the trigger opens.
const CHEVRON = penMark("chevron", "collapsible", "calm")
const VIEWBOX = /viewBox="([^"]+)"/.exec(CHEVRON)?.[1] ?? "0 0 14 10"
const STROKES = CHEVRON.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-(--ease-out) data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  )
}

function CollapsibleChevron({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="collapsible-chevron"
      viewBox={VIEWBOX}
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 -rotate-90 overflow-visible transition-transform duration-200 ease-(--ease-out) in-aria-expanded:rotate-0 motion-reduce:transition-none rtl:rotate-90 rtl:in-aria-expanded:rotate-0",
        className,
      )}
      {...props}
    >
      <g className="fl-drawing" dangerouslySetInnerHTML={{ __html: STROKES }} />
    </svg>
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleChevron,
}
