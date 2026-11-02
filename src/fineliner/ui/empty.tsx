import { cva, type VariantProps } from "class-variance-authority"
import { Drawing } from "@/fineliner/drawing/drawing"
import { cn } from "@/fineliner/lib/utils"

// A quiet page for when there is nothing to show: a drawing from the library, a serif title, one line on why and one
// action, centred in a reading column, open on the page. Give EmptyMedia an `object` (and a `seed`) and it draws that
// object, stroke by stroke, the first time the state comes into view; after that the drawing follows the page's line
// boil setting. Children of EmptyMedia (any other drawing or picture) take its place. The icon variant sets a Lucide
// icon in a small tint pocket instead.

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-snug p-line text-center text-balance",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-[28rem] flex-col items-center gap-hair",
        className,
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-hair flex shrink-0 items-center justify-center text-pen [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent [&>[data-slot=drawing]]:w-32",
        icon: cn(
          "pocket",
          "size-10 before:bg-tint [&_svg:not([class*='size-'])]:size-5",
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function EmptyMedia({
  className,
  variant = "default",
  object,
  seed,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof emptyMediaVariants> & {
    /** An object from the drawing library (crate, record, turntable…), drawn on the first time it is seen. */
    object?: string
    /** Its seed; the object's own name when left out. */
    seed?: string | number
  }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    >
      {object ? (
        <Drawing
          object={object}
          seed={seed ?? `empty:${object}`}
          title=""
          drawOnView
        />
      ) : (
        children
      )}
    </div>
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-read text-lead leading-subhead font-medium text-pen",
        className,
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn("text-ui leading-small text-pen-quiet", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-[28rem] min-w-0 flex-col items-center gap-tight text-small leading-small text-balance",
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
