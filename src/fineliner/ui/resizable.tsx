"use client"

import * as ResizablePrimitive from "react-resizable-panels"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// Panels divided by one pen line. The line is a background on a box wider than itself, so the wobble has room, and
// that box is also the handle's hit area. The pen presses harder while the line is hovered, focused or dragged.
// withHandle threads three inked dots on the line, the same dots every time; in a vertical group they turn on their
// side. Focus is the page's dashed ring. The group fills its parent (react-resizable-panels sets height: 100%
// inline), so size the parent rather than the group.
const GRIP = [0, 1, 2].map((i) => penMark("dot", `resizable-grip-${i}`, "calm"))

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative z-10 flex w-px shrink-0 items-center justify-center text-pen",
        "before:absolute before:inset-y-0 before:left-1/2 before:w-3 before:-translate-x-1/2 before:bg-[linear-gradient(currentColor,currentColor)] before:bg-size-[var(--pen-weight)_100%] before:bg-center before:bg-no-repeat before:[filter:var(--wob,var(--wob-3))]",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:inset-y-auto aria-[orientation=horizontal]:before:top-1/2 aria-[orientation=horizontal]:before:left-0 aria-[orientation=horizontal]:before:h-3 aria-[orientation=horizontal]:before:w-full aria-[orientation=horizontal]:before:translate-x-0 aria-[orientation=horizontal]:before:-translate-y-1/2 aria-[orientation=horizontal]:before:bg-size-[100%_var(--pen-weight)]",
        "data-[separator=active]:[--pen-weight:var(--pen-weight-pressed)] data-[separator=focus]:[--pen-weight:var(--pen-weight-pressed)] data-[separator=hover]:[--pen-weight:var(--pen-weight-pressed)] [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex shrink-0 flex-col items-center">
          {GRIP.map((dot, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="-my-0.5 block size-3 [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: dot }}
            />
          ))}
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
