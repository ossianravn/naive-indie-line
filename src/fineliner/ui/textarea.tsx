import * as React from "react"
import { cn } from "@/fineliner/lib/utils"

// A few lines of text inside the steady pen line of a field; it grows with what is written. Width follows the
// writing it expects (the 34rem measure for a note); set it at the call site. data-ruled="true" adds faint notebook
// lines on the text baseline.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "control-field flex field-sizing-content min-h-24 w-full px-tight py-hair data-[ruled=true]:bg-[linear-gradient(transparent_calc(1lh-1px),color-mix(in_srgb,var(--pen)_22%,transparent)_calc(1lh-1px))] data-[ruled=true]:bg-size-[100%_1lh] data-[ruled=true]:bg-local data-[ruled=true]:bg-origin-content",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
