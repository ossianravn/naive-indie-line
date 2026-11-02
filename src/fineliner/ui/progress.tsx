"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/fineliner/lib/utils"

// A drawn frame for the track; the done part is a pocket of ink inset from the frame that grows as the task moves on.
// Indeterminate progress has the pen fill the track and lift again, slowly; under reduced motion it pulses instead.
// Label in the reading voice, value in the typewriter.

function Progress({
  className,
  children,
  value,
  locale = "en-US",
  ...props
}: ProgressPrimitive.Root.Props) {
  // A fixed locale by default, so the value reads the same on the server and in the browser (no hydration mismatch).
  return (
    <ProgressPrimitive.Root
      value={value}
      locale={locale}
      data-slot="progress"
      className={cn(
        "flex flex-wrap items-baseline gap-x-tight gap-y-hair",
        className,
      )}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "frame relative flex h-3.5 w-full items-stretch p-[3px] text-pen [--over:2px] calm:[--over:0.8px]",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-auto! rounded-[1px] bg-pen transition-[width] duration-200 ease-out [filter:var(--wob,var(--wob-2))] forced-colors:bg-[CanvasText] forced-colors:forced-color-adjust-none data-indeterminate:w-full data-indeterminate:motion-safe:animate-[fl-put-down_1.4s_ease-in-out_infinite_alternate] data-indeterminate:motion-reduce:animate-pulse data-indeterminate:motion-reduce:[animation-duration:2.4s]",
        className,
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn(
        "font-ui text-small leading-small font-medium text-pen",
        className,
      )}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto font-type text-small leading-small text-pen-quiet tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
