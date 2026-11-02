import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A circle the pen draws (a round line bent by the wobble filter); choosing it puts down an inked dot. The circle
// presses harder under the pointer and dims with its text when disabled. The ::after inset keeps the hit area at 24px.
const DOT = penMark("dot", "radio-group", "calm")

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-tight", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative isolate flex aspect-square size-[1.15rem] shrink-0 cursor-pointer rounded-full text-pen before:absolute before:inset-0 before:-z-10 before:rounded-full before:border-(length:--pen-weight) before:border-current before:[filter:var(--wob,var(--wob-1))] after:absolute after:-inset-x-3 after:-inset-y-2 hover:[--pen-weight:var(--pen-weight-pressed)] data-disabled:cursor-not-allowed data-disabled:text-pen-faint aria-invalid:text-correction",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="put-down pointer-events-none absolute inset-0"
      >
        <span
          aria-hidden="true"
          className="block size-full [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: DOT }}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
