import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/fineliner/lib/utils"

// A field with a steady pen line: text sits inside it, so it never wobbles. 16px text (no zoom on iOS) and the page's
// dashed focus ring. Width follows the value it holds; set it at the call site.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "control-field h-control w-full min-w-0 px-tight py-hair file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-type file:text-small file:text-pen",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
