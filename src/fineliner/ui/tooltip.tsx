"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type SyntheticEvent,
} from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A slip of ink: paper letters in the typewriter on a pocket of solid pen, its edge bent by the same wobble as a drawn
// frame (the fill is on ::before, so the letters stay straight) and seeded by its words. It grows from its trigger and
// never boils: it explains a control rather than decorating the page. A defined term in running text takes the `term`
// utility.
//
// Base UI opens a tooltip for a mouse or the keyboard only, so a tap does what the control does. On a touch screen a
// long press shows a control's tooltip instead, as Android does, and it goes 1.5 s after the finger lifts; the press
// does not also press the control. A trigger that does nothing when tapped (a defined term) opens and closes on a tap.

type Handle = TooltipPrimitive.Handle<unknown>
const TooltipHandle = createContext<Handle | null>(null)
const HOLD = 500
const LINGER = 1500
// What a tap already does something with; any other trigger is a term, which a tap opens.
const ACTS =
  "button, a[href], input, select, textarea, summary, [role=button], [role=link], [role=menuitem], [role=tab], [role=switch], [role=checkbox], [role=radio], [role=option]"

/** Long press, and tap on a term, for touch. Capture handlers, so they run before the trigger's own. */
function useTouchOpen(handle: Handle | null) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const press = useRef({ touch: false, held: false, wasOpen: false })
  useEffect(() => () => clearTimeout(timer.current), [])
  if (!handle) return {}
  const lift = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "touch") return
    clearTimeout(timer.current)
    if (press.current.held)
      timer.current = setTimeout(() => handle.close(), LINGER)
  }
  const swallow = (e: SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  return {
    onPointerDownCapture(e: PointerEvent<HTMLElement>) {
      const touch = e.pointerType === "touch"
      press.current = { touch, held: false, wasOpen: handle.isOpen }
      clearTimeout(timer.current)
      const el = e.currentTarget
      if (touch && el.matches(ACTS))
        timer.current = setTimeout(() => {
          press.current.held = true
          handle.open(el.id)
        }, HOLD)
    },
    onPointerUpCapture: lift,
    // The page scrolled under the finger: no press.
    onPointerCancelCapture: lift,
    // Android's long-press menu and text selection.
    onContextMenuCapture(e: SyntheticEvent) {
      if (press.current.touch && press.current.held) swallow(e)
    },
    onClickCapture(e: SyntheticEvent<HTMLElement>) {
      const { touch, held, wasOpen } = press.current
      if (!touch) return
      if (held) return swallow(e)
      if (e.currentTarget.matches(ACTS)) return
      // A term's tap goes no further: the trigger's own click would close what it just opened.
      swallow(e)
      if (wasOpen) handle.close()
      else handle.open(e.currentTarget.id)
    },
  }
}

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ handle, ...props }: TooltipPrimitive.Root.Props) {
  // Every tooltip gets a handle, which is how a touch on its trigger opens it.
  const [own] = useState(() => TooltipPrimitive.createHandle())
  const used = handle ?? own
  return (
    <TooltipHandle.Provider value={used}>
      <TooltipPrimitive.Root data-slot="tooltip" handle={used} {...props} />
    </TooltipHandle.Provider>
  )
}

function TooltipTrigger({ handle, ...props }: TooltipPrimitive.Trigger.Props) {
  const root = useContext(TooltipHandle)
  const touch = useTouchOpen(handle ?? root)
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      handle={handle}
      {...touch}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  style,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "relative isolate z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-hair px-tight py-1 font-type text-small leading-ui text-paper duration-150 ease-(--ease-out) before:absolute before:inset-0 before:-z-10 before:rounded-[1px] before:bg-pen before:[filter:var(--wob,var(--wob-2))] has-data-[slot=kbd]:pr-1 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
            className,
          )}
          style={frameStyle(children, style)}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[1px] bg-pen fill-pen [filter:var(--wob,var(--wob-2))] data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
