import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import {
  clearOfShadow,
  frameStyle,
  shadowRoom,
} from "@/fineliner/lib/frame-style"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// Links and triggers in the reading voice. A trigger takes a pale pocket under the pointer and keeps it while its
// panel is open; its pen chevron turns over. The current page (a link with `active` gets aria-current="page") is
// underlined by the pen, put down as it appears: under a top-level link's words, or under a panel link's first
// element, its title. Panels open on the dropdown menu's drawn sheet with the cartoonist's shadow; it grows from its
// trigger, and moving to another trigger swaps the panel in place, since surfaces do not slide.
const CHEVRON = penMark("chevron", "navigation-menu", "calm")

// The pen's underline as a mask in the link's own colour, so it can sit on the ::after of whichever element it marks.
// The mask has no access to the page's tokens, so it states the pen's weight.
const UNDERLINE = `url("data:image/svg+xml,${encodeURIComponent(
  penMark("underline", "navigation-menu", "calm")
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(
      /(<svg[^>]*>)/,
      "$1<style>.ln{fill:none;stroke:#000;stroke-width:1.35px;vector-effect:non-scaling-stroke;stroke-linecap:round}</style>",
    ),
)}")`

const underline =
  "data-active:*:first:relative data-active:*:first:after:pointer-events-none data-active:*:first:after:absolute data-active:*:first:after:inset-x-[-0.15em] data-active:*:first:after:top-[calc((1lh-1em)/2+1.1em)] data-active:*:first:after:h-[0.45em] data-active:*:first:after:bg-current data-active:*:first:after:[mask:var(--nav-underline)_center/100%_100%_no-repeat] data-active:*:first:after:animate-[fl-put-down_var(--put-down)_var(--ease-out)] motion-reduce:data-active:*:first:after:animate-none"

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger pocket inline-flex h-control-compact w-max cursor-pointer flex-row items-center justify-center gap-hair px-tight py-0 font-ui text-ui leading-none whitespace-nowrap text-pen no-underline select-none hover:before:bg-tint focus-visible:outline-offset-4 disabled:pointer-events-none disabled:text-pen-faint aria-disabled:pointer-events-none aria-disabled:text-pen-faint data-popup-open:before:bg-tint",
)

// A style prop that also carries the underline's mask; Base UI lets the style be a function of the link's state.
type LinkStyle = NavigationMenuPrimitive.Link.Props["style"]
const withUnderline = (style: LinkStyle): LinkStyle => {
  const vars = { "--nav-underline": UNDERLINE } as React.CSSProperties
  return typeof style === "function"
    ? (state) => ({ ...vars, ...style(state) })
    : { ...vars, ...style }
}

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group m-0 flex flex-1 list-none items-center justify-center gap-1 p-0",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <span
        aria-hidden="true"
        className="pointer-events-none block h-2 w-[0.7rem] shrink-0 text-pen-quiet transition-transform duration-200 ease-(--ease-out) group-data-popup-open/navigation-menu-trigger:rotate-180 motion-reduce:transition-none [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: CHEVRON }}
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-hair transition-opacity duration-150 ease-(--ease-out) data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = (state) => clearOfShadow(state) + 4,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        collisionPadding={shadowRoom}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          className="float-sheet frame relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) outline-hidden transition-[opacity,scale] duration-200 ease-(--ease-out) data-ending-style:scale-97 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-97 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100"
          style={frameStyle("navigation-menu-content")}
        >
          <span aria-hidden="true" className="pen-shadow" />
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  children,
  style,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "pocket flex items-center gap-tight px-tight py-hair font-ui text-small leading-small text-pen no-underline hover:before:bg-tint focus-visible:outline-offset-0 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        underline,
        className,
      )}
      style={withUnderline(style)}
      {...props}
    >
      {/* Words alone get an element of their own, so the underline can measure them. */}
      {typeof children === "string" ? <span>{children}</span> : children}
    </NavigationMenuPrimitive.Link>
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden text-pen-faint data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <span
        className="block h-1.5 w-2.5 rotate-180 [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: CHEVRON }}
      />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
