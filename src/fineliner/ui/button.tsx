import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// The one thing to press is a pocket of solid ink with paper text; the others are drawn frames whose pen presses
// harder under the pointer, or pale washes. Labels are the reading serif at control size. Focus is the page's dashed
// ring. A disabled ink button is an empty pocket: its outline dashed, nothing filled in.
const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center font-ui text-ui leading-none whitespace-nowrap select-none press disabled:pointer-events-none disabled:text-pen-faint aria-invalid:text-correction [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: cn(
          "pocket",
          "text-paper before:bg-pen hover:before:-inset-px forced-colors:before:border disabled:before:border-(length:--pen-weight) disabled:before:border-dashed disabled:before:border-pen-faint disabled:before:bg-transparent",
        ),
        outline:
          "frame text-pen hover:[--pen-weight:var(--pen-weight-pressed)] aria-expanded:[--pen-weight:var(--pen-weight-pressed)]",
        secondary: cn(
          "pocket",
          "text-pen before:bg-tint hover:before:bg-pen/15 aria-expanded:before:bg-pen/15",
        ),
        ghost: cn(
          "pocket",
          "text-pen hover:before:bg-tint aria-expanded:before:bg-tint",
        ),
        destructive:
          "frame text-correction hover:[--pen-weight:var(--pen-weight-pressed)]",
        link: "h-auto! px-0! text-pen underline decoration-1 underline-offset-[0.25em] decoration-pen/45 hover:decoration-pen",
      },
      size: {
        default:
          "h-control gap-tight px-snug has-data-[icon=inline-end]:pr-tight has-data-[icon=inline-start]:pl-tight",
        xs: "h-7 gap-hair px-tight text-small [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-compact gap-hair px-tight text-small [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-tight px-line",
        icon: "size-control",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-control-compact",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  style,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={frameStyle([props.children, props["aria-label"]], style)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
