"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { frameVars } from "@/fineliner/pen/filters"
import { penMark } from "@/fineliner/pen/pen-marks"
import { seedOf } from "@/fineliner/pen/seed"
import { cn } from "@/fineliner/lib/utils"

// Rows on hand-drawn rules: each row's rule is one pen line bent by a wobble chosen from the row's value, so
// neighbouring rules bend differently. The trigger is a heading in the reading voice with a pen chevron at its end
// that turns as the row opens; the panel's height eases open and shut and its text keeps the reading measure. Focus
// is the page's dashed ring; a disabled row fades to the faint pen.
const CHEVRON = penMark("chevron", "accordion", "calm")

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  style,
  ...props
}: AccordionPrimitive.Item.Props) {
  // The rule's wobble only: --wob itself would reach the frames inside the panel.
  const wobble = React.useMemo(() => {
    const value = props.value == null ? "" : String(props.value)
    return value
      ? ({
          "--rule-wob": frameVars(seedOf(`accordion:${value}`))["--wob"],
        } as React.CSSProperties)
      : undefined
  }, [props.value])
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "relative not-last:after:pointer-events-none not-last:after:absolute not-last:after:inset-x-0 not-last:after:-bottom-1.5 not-last:after:h-3 not-last:after:bg-[linear-gradient(currentColor,currentColor)] not-last:after:bg-size-[100%_var(--pen-weight)] not-last:after:bg-center not-last:after:bg-no-repeat not-last:after:text-pen-faint not-last:after:[filter:var(--rule-wob,var(--wob-3))] forced-colors:not-last:after:[filter:none]",
        className,
      )}
      style={
        typeof style === "function" || !wobble ? style : { ...wobble, ...style }
      }
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="m-0 flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between gap-snug py-tight text-left font-read text-body leading-subhead font-medium text-pen decoration-pen/45 decoration-1 underline-offset-[0.25em] hover:underline aria-disabled:cursor-not-allowed aria-disabled:text-pen-faint aria-disabled:no-underline data-disabled:cursor-not-allowed data-disabled:text-pen-faint data-disabled:no-underline",
          className,
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="pointer-events-none mt-[0.55em] ml-auto block h-2.5 w-3.5 shrink-0 text-pen-quiet transition-transform duration-200 ease-(--ease-out) group-aria-expanded/accordion-trigger:rotate-180 group-data-disabled/accordion-trigger:text-pen-faint motion-reduce:transition-none [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: CHEVRON }}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-ui leading-body text-pen-quiet transition-[height] duration-200 ease-(--ease-out) data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        className={cn(
          "max-w-measure pb-snug [&_p]:m-0 [&_p:not(:last-child)]:mb-tight",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
