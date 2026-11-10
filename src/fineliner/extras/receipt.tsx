import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf } from "@/fineliner/pen/seed"

// A till receipt, for estimates, order summaries and invoices: lines in the typewriter with dotted leaders from the
// item to its amount, the total under a doubled rule, and the lower edge torn, drawn in CSS as a pen line in teeth.
// It is data: it never boils, tilts or animates. Amounts are tabular, so a column of them lines up.

/** The torn edge: a row of teeth, as a mask over the pen's colour. */
const TEETH =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 1 L6 7 L12 1' fill='none' stroke='black' stroke-width='1.35'/%3E%3C/svg%3E\")"

export interface ReceiptProps extends ComponentProps<"div"> {
  /** Same seed, same frame. */
  seed?: string | number
}

/** A receipt: ReceiptLine rows and a ReceiptTotal. */
export function Receipt({
  seed = "receipt",
  className,
  children,
  ...props
}: ReceiptProps) {
  return (
    <div
      data-slot="receipt"
      className={cn(
        "relative w-full max-w-[22rem] font-type text-small leading-small text-pen tabular-nums",
        className,
      )}
      {...props}
    >
      <div
        className="frame grid gap-y-hair bg-paper px-snug pt-snug pb-line"
        style={frameVars(seedOf(String(seed)))}
      >
        {children}
      </div>
      {/* Paper over the frame's straight bottom edge, then the teeth in its place. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-[-4px] bottom-[-5px] h-3 bg-paper"
      />
      <span
        aria-hidden="true"
        data-slot="receipt-edge"
        className="absolute inset-x-0 -bottom-1 h-2 bg-pen forced-colors:bg-[CanvasText]"
        style={{
          maskImage: TEETH,
          WebkitMaskImage: TEETH,
          maskRepeat: "repeat-x",
          WebkitMaskRepeat: "repeat-x",
        }}
      />
    </div>
  )
}

export interface ReceiptLineProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** What the line is for. */
  children: ReactNode
  /** Its amount, as printed. */
  amount: ReactNode
}

/** One line: the item, a dotted leader, the amount. */
export function ReceiptLine({
  children,
  amount,
  className,
  ...props
}: ReceiptLineProps) {
  return (
    <div
      data-slot="receipt-line"
      className={cn("flex items-end gap-x-hair", className)}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      <span
        aria-hidden="true"
        className="mb-[0.4em] min-w-4 flex-1 border-b border-dotted border-pen-quiet"
      />
      <span className="shrink-0 text-end">{amount}</span>
    </div>
  )
}

/** The total, under a doubled rule. */
export function ReceiptTotal({
  children = "Total",
  amount,
  className,
  ...props
}: Omit<ReceiptLineProps, "children"> & { children?: ReactNode }) {
  return (
    <div
      data-slot="receipt-total"
      className={cn(
        "mt-tight flex items-baseline gap-x-snug border-t-[4px] border-double border-pen pt-tight",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 uppercase tracking-[0.08em]">
        {children}
      </span>
      <span className="shrink-0 text-end text-body leading-body">{amount}</span>
    </div>
  )
}
