import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"

// A small label in the label voice inside a drawn frame. The default is the rare loud one, a pocket of solid ink with
// paper words; destructive draws in the correction pen. Badges sit in lists and tables, so their edges run only a
// little past the corners. Seeded by their words, so neighbours wobble differently.
const badgeVariants = cva(
  "group/badge label relative isolate inline-flex h-[1.375rem] w-fit shrink-0 items-center justify-center gap-1 px-[0.45rem] pb-px whitespace-nowrap no-underline [--over:2px] calm:[--over:0.8px] has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: cn(
          "pocket",
          "text-paper before:bg-pen forced-colors:before:border aria-invalid:before:bg-correction [a]:hover:before:-inset-px",
        ),
        secondary: cn(
          "pocket",
          "text-pen before:bg-tint aria-invalid:text-correction [a]:hover:before:bg-pen/15",
        ),
        destructive:
          "frame text-correction [a]:hover:[--pen-weight:var(--pen-weight-pressed)]",
        outline:
          "frame text-pen aria-invalid:text-correction [a]:hover:[--pen-weight:var(--pen-weight-pressed)]",
        ghost: cn(
          "pocket",
          "text-pen-quiet hover:text-pen hover:before:bg-tint aria-invalid:text-correction",
        ),
        link: "px-0 text-pen underline decoration-1 underline-offset-[0.25em] decoration-pen/45 hover:decoration-pen aria-invalid:text-correction",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  render,
  style,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        style: frameStyle(props.children, style) as React.CSSProperties,
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
