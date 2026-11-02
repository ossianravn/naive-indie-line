import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A pen ring in currentColor, turning gently. A quarter of it is left out, so the gap shows the turn. Under reduced
// motion it turns slower, in eight steps, like a clock's hand, rather than not at all: it still has to say "working".
const RING = penMark("ring", "spinner", "lively")
const VIEWBOX = /viewBox="([^"]+)"/.exec(RING)?.[1] ?? "0 0 100 40"
const STROKES = RING.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      fill="none"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin overflow-visible [animation-duration:1.4s] [clip-path:polygon(50%_50%,50%_-25%,-25%_-25%,-25%_125%,125%_125%,125%_50%)] motion-reduce:[animation-duration:3.2s] motion-reduce:[animation-timing-function:steps(8,end)]",
        className,
      )}
      {...props}
    >
      <g className="fl-drawing" dangerouslySetInnerHTML={{ __html: STROKES }} />
    </svg>
  )
}

export { Spinner }
