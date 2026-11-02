"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A drawn box; checking it puts a tick down that runs past the box, the way a hand ticks a form. Partly checked (a
// header row over some selected rows) draws a short stroke instead. Both wipe in from the left as they appear.
const TICK = penMark("tick", "checkbox", "calm")
const DASH = penMark("strike", "checkbox", "calm")

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer frame relative flex size-[1.1rem] shrink-0 cursor-pointer items-center justify-center text-pen [--over:1.5px] hover:[--pen-weight:var(--pen-weight-pressed)] data-disabled:cursor-not-allowed data-disabled:text-pen-faint aria-invalid:text-correction",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="put-down pointer-events-none absolute -top-1.5 -left-0.5 size-[1.6rem] text-pen"
      >
        <span
          aria-hidden="true"
          className="block size-full in-data-indeterminate:hidden [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-[0.3rem] top-[0.85rem] hidden h-2 in-data-indeterminate:block [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: DASH }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
