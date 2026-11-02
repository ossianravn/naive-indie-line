import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/fineliner/lib/utils"

// The track is one pen line (a rule, bent by the wobble filter); the range is the same line drawn heavier; each thumb
// is a paper circle with a drawn edge that presses harder under the pointer. The thumb's focus lives on a hidden range
// input, so the page's dashed ring is drawn with has-focus-visible, on the thumb itself, which is never filtered.
// Orientation is matched on data-orientation; the root's width stays a plain class so a call-site width replaces it,
// and a vertical slider takes its height from the call site (at least 10rem).
const line =
  "bg-[linear-gradient(currentColor,currentColor)] bg-center bg-no-repeat"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("w-full data-[orientation=vertical]:w-auto", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center py-hair text-pen select-none data-disabled:cursor-not-allowed data-disabled:text-pen-faint data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-hair data-[orientation=vertical]:py-0">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            line,
            "relative grow [filter:var(--wob-3)] select-none data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:bg-size-[100%_var(--pen-weight)] data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3 data-[orientation=vertical]:bg-size-[var(--pen-weight)_100%]",
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              line,
              "select-none data-[orientation=horizontal]:h-full data-[orientation=horizontal]:bg-size-[100%_3px] data-[orientation=vertical]:w-full data-[orientation=vertical]:bg-size-[3px_100%]",
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative isolate block size-5 shrink-0 cursor-grab rounded-full select-none before:absolute before:inset-0 before:-z-10 before:rounded-full before:border-(length:--pen-weight) before:border-current before:bg-paper before:[filter:var(--wob,var(--wob-2))] after:absolute after:-inset-2 hover:[--pen-weight:var(--pen-weight-pressed)] has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-4 has-focus-visible:outline-pen has-focus-visible:outline-dashed data-dragging:cursor-grabbing data-dragging:[--pen-weight:var(--pen-weight-pressed)] data-disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
