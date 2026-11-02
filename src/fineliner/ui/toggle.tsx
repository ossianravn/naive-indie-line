import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A control that stays down. Pressed, the pen puts a pocket of ink under it and its words turn to paper as the ink
// wipes in, like the site's segmented controls; disabled and pressed, the pocket is left empty and dashed. The default
// variant takes a pale pocket under the pointer (::before); outline is a drawn frame that presses harder, with the
// ink pocket inset from it. The pocket is its own child, so it can be put down each time the toggle is pressed.
// --toggle-ink is the pen (faint when disabled, the correction pen when invalid): the words take it until pressed
// turns them to paper, and the frame keeps it throughout.
const toggleVariants = cva(
  "group/toggle relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-hair font-ui leading-none whitespace-nowrap text-(--toggle-ink) [--toggle-ink:var(--pen)] transition-[color,scale] duration-(--put-down) ease-(--ease-out) select-none active:not-disabled:scale-[0.97] disabled:pointer-events-none disabled:[--toggle-ink:var(--pen-faint)] aria-invalid:[--toggle-ink:var(--correction)] data-pressed:text-paper disabled:data-pressed:text-(--toggle-ink) motion-reduce:transition-none forced-colors:data-pressed:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "pocket hover:not-data-pressed:before:bg-tint",
        outline:
          "frame before:text-(--toggle-ink) after:text-(--toggle-ink) hover:[--pen-weight:var(--pen-weight-pressed)]",
      },
      size: {
        default:
          "h-control min-w-control px-tight text-ui has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        sm: "h-control-compact min-w-control-compact px-2.5 text-small has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 min-w-12 px-snug text-ui has-data-[icon=inline-end]:pr-tight has-data-[icon=inline-start]:pl-tight",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// The ink pocket under a pressed toggle: shown (and so put down) only while pressed. In forced colours it becomes the
// system highlight, so the pressed state still shows.
const togglePocket = cn(
  "put-down absolute inset-0 -z-10 hidden rounded-[1px] bg-pen [filter:var(--wob,var(--wob-2))] group-data-pressed/toggle:block",
  "group-disabled/toggle:border-(length:--pen-weight) group-disabled/toggle:border-dashed group-disabled/toggle:border-current group-disabled/toggle:bg-transparent",
  "forced-colors:[forced-color-adjust:none] forced-colors:bg-[Highlight]",
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  style,
  children,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      style={frameStyle([children, props["aria-label"]], style)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(togglePocket, variant === "outline" && "inset-[3px]")}
      />
      {children}
    </TogglePrimitive>
  )
}

export { Toggle, togglePocket, toggleVariants }
