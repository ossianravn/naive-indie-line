import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A typewriter keycap: the key's name in Courier inside a small drawn frame whose bottom edge is drawn heavier, the
// way a key stands on the board. Seeded by its name, so a row of keys wobbles key by key. Inside a tooltip's slip of
// ink the frame and the letters turn paper.
function Kbd({ className, style, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "frame pointer-events-none inline-flex h-[1.375rem] w-fit min-w-[1.375rem] items-center justify-center gap-1 px-[0.3rem] pb-px align-[0.1em] font-type text-small leading-none text-pen select-none [--over:1.5px] calm:[--over:0.6px] before:border-b-[calc(var(--pen-weight)*2)]! in-data-[slot=tooltip-content]:text-paper [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      style={frameStyle(props.children, style) as React.CSSProperties}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
