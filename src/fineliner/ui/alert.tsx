import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"

// A note open on the page, as in a margin: a short pen rule down its inline-start edge and a pen mark by the title.
// Pass an icon (a Lucide icon) as the first child and it takes the mark's place. Destructive writes the rule, the mark
// and the title in the correction pen; the description stays in the reading pen.
const MARK = penMark("arrow", "alert", "calm")

const alertVariants = cva(
  "group/alert relative grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-tight gap-y-0.5 py-hair pl-snug text-left text-small leading-small text-pen before:absolute before:inset-y-0 before:left-0 before:w-3 before:-translate-x-1/2 before:bg-[linear-gradient(currentColor,currentColor)] before:bg-size-[var(--pen-weight)_100%] before:bg-center before:bg-no-repeat before:[filter:var(--wob,var(--wob-3))] has-data-[slot=alert-action]:pr-28 *:[svg]:row-span-2 *:[svg]:mt-[0.2rem] *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-correction",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="alert-mark"
        className="pointer-events-none col-start-1 row-start-1 mt-[0.15rem] block h-[0.85rem] w-[1.3rem] group-has-[>svg]/alert:hidden [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: MARK }}
      />
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-read text-ui leading-ui font-medium",
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 max-w-measure text-small leading-small text-balance text-pen-quiet md:text-pretty [&_p]:m-0 [&_p:not(:last-child)]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-1/2 right-0 -translate-y-1/2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
