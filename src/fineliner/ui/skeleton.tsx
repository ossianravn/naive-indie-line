import { cn } from "@/fineliner/lib/utils"

// A quiet pocket of tint in the shape of the content it stands in for, with a slow pulse. Its edges wobble like any
// pocket, so it reads as drawn, not as a grey box. Give it that content's own geometry at the call site: a line of
// text, a circle for an avatar, a sleeve's square.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-[2px] bg-tint [animation-duration:2.6s] [filter:var(--wob,var(--wob-2))]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
