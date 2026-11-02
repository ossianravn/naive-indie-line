"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/fineliner/lib/utils"

// A pill the pen draws (::after, bent by the wobble filter). Off, a paper thumb with a drawn edge rests at the start;
// on, the pen fills the track with a pocket of ink (::before, put down from the left, gone at once when it turns off)
// and the thumb moves to the end. Both draw in currentColor, so disabled and invalid follow the text colour.
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative isolate inline-flex shrink-0 cursor-pointer items-center rounded-full px-1 text-pen hover:[--pen-weight:var(--pen-weight-pressed)] aria-invalid:text-correction data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-disabled:cursor-not-allowed data-disabled:text-pen-faint",
        "after:absolute after:inset-0 after:-z-10 after:rounded-full after:border-(length:--pen-weight) after:border-current after:[filter:var(--wob,var(--wob-1))]",
        "before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-current before:[clip-path:inset(-40%_100%_-40%_-40%)] before:[filter:var(--wob,var(--wob-2))] data-checked:before:[clip-path:inset(-40%)] data-checked:before:transition-[clip-path] data-checked:before:duration-(--put-down) data-checked:before:ease-(--ease-out) motion-reduce:before:transition-none",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full border-(length:--pen-weight) border-current bg-paper [filter:var(--wob-3)] transition-transform duration-150 ease-(--ease-out) motion-reduce:transition-none group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-unchecked:translate-x-0 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=sm]/switch:data-checked:translate-x-4"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
