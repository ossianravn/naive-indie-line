import * as React from "react"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

// The platform's own select inside the same steady field as Select's trigger, with the pen's chevron over it. The
// open list stays native and follows the page's colour scheme. Width goes on the wrapper, set at the call site.
const CHEVRON = penMark("chevron", "native-select", "calm")

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn("group/native-select relative w-fit", className)}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="control-field h-control w-full min-w-0 cursor-pointer appearance-none py-0 pr-9 pl-tight has-[option[value='']:checked]:text-pen-quiet data-[size=sm]:h-control-compact data-[size=sm]:text-small"
        {...props}
      />
      <span
        aria-hidden="true"
        data-slot="native-select-icon"
        className="pointer-events-none absolute top-1/2 right-tight h-2.5 w-3.5 -translate-y-1/2 text-pen select-none group-has-[select:disabled]/native-select:text-pen-faint [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: CHEVRON }}
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
