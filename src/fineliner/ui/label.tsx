import * as React from "react"
import { cn } from "@/fineliner/lib/utils"

// A label in the reading voice at control size, beside the control it names. Field labels above a control use
// FieldLabel, which sets them in the label voice.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-tight text-ui leading-ui text-pen select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-pen-faint peer-disabled:cursor-not-allowed peer-disabled:text-pen-faint has-data-disabled:cursor-not-allowed has-data-disabled:text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
