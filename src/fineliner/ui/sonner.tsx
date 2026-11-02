"use client"

import type * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { sheet } from "@/fineliner/pen/layers"
import { penMark } from "@/fineliner/pen/pen-marks"
import { pen } from "@/fineliner/pen/stroke"
import { cn } from "@/fineliner/lib/utils"
import { useAppearance } from "@/fineliner/theme/use-appearance"
import { buttonVariants } from "@/fineliner/ui/button"
import { Spinner } from "@/fineliner/ui/spinner"

// A slip of paper drawn round by the pen, with the cartoonist's shadow along its right and bottom. A pen mark names
// the kind: a tick for success, a cross in the correction pen for an error, a stroke and a dot for a warning, a ringed
// "i" for information, the turning pen ring while loading. The action is an ink button. A slip fades in and grows a
// little where it lands, and shrinks away as it goes; it never slides in. Only a swipe moves it, under the finger.
//
// Sonner keeps the slip's ::after for the gap between expanded slips and borrows its ::before while a slip is swiped
// or leaves, so the frame and the shadow are all drawn on ::before (six pen lines as background layers, one wobble
// filter) and hold their geometry against sonner's rules. The theme follows Fineliner's day or night paper.

/** A small pen glyph in a 24 × 24 box, drawn once. */
function glyph(seed: string, draw: (s: ReturnType<typeof sheet>) => void) {
  const s = sheet(`fl-toast-${seed}`)
  draw(s)
  return s.svg(24, 24)
}
const ERROR = glyph("error", (s) => {
  const p = pen("toast:error", "calm")
  s.stroke(p.line([6, 6], [18.5, 18.5]))
  s.stroke(p.line([18.2, 5.6], [5.8, 18.4]))
})
const WARNING = glyph("warning", (s) => {
  const p = pen("toast:warning", "calm")
  s.stroke(p.line([12.2, 3.5], [11.8, 14.5]))
  s.fill(p.disc([12, 19.5], [1.6, 0], [0, 1.6]))
})
const INFO = glyph("info", (s) => {
  const p = pen("toast:info", "calm")
  s.stroke(p.ring([12, 12], [10, 0], [0, 10]))
  s.fill(p.disc([12, 7.4], [1.3, 0], [0, 1.3]))
  s.stroke(p.line([12.1, 10.8], [11.9, 17.2]))
})
const SUCCESS = penMark("tick", "toast:success", "calm")

const mark = (svg: string, className?: string) => (
  <span
    aria-hidden="true"
    className={cn("block size-5 [&>svg]:size-full", className)}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
)

// The slip's four edges (each running past its corners by the seeded --o1…4, as a frame's do) and the shadow's two
// lines, 7px right of and below the slip. The ::before box reaches --over beyond the slip, and 7px more right and down.
const LINE = "linear-gradient(currentColor, currentColor)"
const ACROSS =
  "calc(100% - 7px - var(--over) * (2 - var(--o2, 0.5) - var(--o4, 0.5))) var(--pen-weight)"
const DOWN =
  "var(--pen-weight) calc(100% - 7px - var(--over) * (2 - var(--o1, 0.5) - var(--o3, 0.5)))"
const FROM_LEFT = "left calc(var(--over) * (1 - var(--o4, 0.5)))"
const FROM_TOP = "top calc(var(--over) * (1 - var(--o1, 0.5)))"
const SLIP_LINES = [
  `${LINE} ${FROM_LEFT} top var(--over) / ${ACROSS} no-repeat`,
  `${LINE} ${FROM_LEFT} bottom calc(var(--over) + 7px) / ${ACROSS} no-repeat`,
  `${LINE} left var(--over) ${FROM_TOP} / ${DOWN} no-repeat`,
  `${LINE} right calc(var(--over) + 7px) ${FROM_TOP} / ${DOWN} no-repeat`,
  `${LINE} right var(--over) top calc(var(--over) + 7px) / var(--pen-weight) calc(100% - 2 * var(--over) - 7px) no-repeat`,
  `${LINE} left calc(var(--over) + 7px) bottom var(--over) / calc(100% - 2 * var(--over) - 7px) var(--pen-weight) no-repeat`,
].join(", ")

const THEME = { system: "system", day: "light", night: "dark" } as const

const Toaster = ({ style, ...props }: ToasterProps) => {
  const [{ theme }] = useAppearance()

  return (
    <Sonner
      theme={THEME[theme]}
      className="toaster group"
      icons={{
        success: mark(SUCCESS, "-translate-y-0.5"),
        info: mark(INFO),
        warning: mark(WARNING),
        error: mark(ERROR, "text-correction"),
        loading: <Spinner className="size-[1.125rem] text-pen-quiet" />,
      }}
      style={{ "--width": "22rem", ...style } as React.CSSProperties}
      toastOptions={{
        unstyled: true,
        style: frameStyle("toast", {
          "--slip-lines": SLIP_LINES,
        } as React.CSSProperties),
        classNames: {
          toast: cn(
            "float-sheet flex w-(--width) items-start gap-tight py-tight pr-tight pl-snug font-ui text-small leading-small text-pen data-[expanded=false]:data-[front=false]:*:opacity-0",
            // The drawn slip and its shadow, held against sonner's swipe and exit rules.
            "before:pointer-events-none before:absolute! before:-z-1! before:h-auto! before:w-auto! before:transform-none! before:content-['']! before:[background:var(--slip-lines)] before:[filter:var(--wob,var(--wob-1))] forced-colors:before:[filter:none]",
            "before:inset-[calc(-1*var(--over))_calc(-1*var(--over)_-_7px)_calc(-1*var(--over)_-_7px)_calc(-1*var(--over))]!",
            // Fade and grow in, shrink and fade out, on the pen's curve.
            "[transition-duration:var(--overlay)]! [transition-timing-function:var(--ease-out)]! data-[mounted=false]:[--y:scale(0.97)]! data-[removed=true]:data-[front=true]:data-[swipe-out=false]:[--y:scale(0.97)]! data-[removed=true]:data-[front=false]:data-[swipe-out=false]:data-[expanded=true]:[--y:translateY(calc(var(--lift)*var(--offset)))_scale(0.97)]!",
          ),
          icon: "relative mt-px flex size-5 shrink-0 items-center justify-center",
          content: "flex min-w-0 flex-1 flex-col gap-0.5 py-px",
          title: "font-ui text-ui leading-ui font-medium text-pen",
          description: "text-small leading-small text-pen-quiet",
          actionButton: buttonVariants({
            size: "xs",
            className: "shrink-0 self-center",
          }),
          cancelButton: buttonVariants({
            variant: "ghost",
            size: "xs",
            className: "shrink-0 self-center",
          }),
          closeButton:
            "absolute -top-2.5 -left-2.5 z-10 grid size-6 cursor-pointer place-items-center rounded-full bg-paper text-pen press after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border-(length:--pen-weight) after:border-current after:[filter:var(--wob,var(--wob-1))] hover:after:border-(length:--pen-weight-pressed) [&_svg]:size-3",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
