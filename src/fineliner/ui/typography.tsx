import * as React from "react"
import { cn } from "@/fineliner/lib/utils"

// Long-form prose, styled through its children so plain HTML or Markdown output reads as typeset text: headings in the
// reading face (quiet weights, set tight), paragraphs held to the reading measure, list markers in the quiet pen with
// numbers typed, a quotation set off by a pen rule in its margin, code typed on a tint well, pen rules for <hr> and
// small ledger tables on hand-drawn rules. Selectors sit inside :where(), so a class on a child still wins. `dropCap`
// sets the first paragraph's opening letter three lines deep. shadcn ships typography as a docs page, not a
// component; Fineliner ships it as one, as Patina does.

const flow = [
  // Vertical rhythm between direct children: a paragraph gap, more room above headings, little below them.
  "[&>*]:my-0 [&>*+*]:mt-snug [&>:first-child]:mt-0",
  "[&>h1]:mt-section [&>h2]:mt-section [&>h3]:mt-line [&>h4]:mt-snug [&>hr]:my-line",
  "[&>:is(h1,h2)+*]:mt-tight [&>:is(h3,h4)+*]:mt-hair",
  "[&>*+[data-slot=typography-kicker]]:mt-section [&>[data-slot=typography-kicker]+*]:mt-hair",
]

const type = [
  "font-read text-body leading-body text-pen",
  "[&_:where(h1,h2,h3,h4)]:max-w-measure [&_:where(h1,h2,h3,h4)]:font-read [&_:where(h1,h2,h3,h4)]:text-balance [&_:where(h1,h2,h3,h4)]:text-pen",
  "[&_:where(h1,h2)]:font-normal [&_:where(h1)]:text-h1 [&_:where(h1,h2)]:leading-heading [&_:where(h2)]:text-h2",
  "[&_:where(h3,h4)]:font-medium [&_:where(h3)]:text-lead [&_:where(h3,h4)]:leading-subhead [&_:where(h4)]:text-body",
  "[&_:where(p,ul,ol,blockquote)]:max-w-measure [&_:where(strong,b)]:font-semibold",
  // Lists: markers in the quiet pen; numbered lists count on the typewriter.
  "[&_:where(ul)]:list-disc [&_:where(ol)]:list-decimal [&_:where(ul,ol)]:pl-snug",
  "[&_:where(li)]:pl-1 [&_:where(li+li)]:mt-hair [&_:where(li>ul,li>ol)]:mt-hair",
  "[&_:where(li)]:marker:text-pen-quiet [&_:where(ol>li)]:marker:font-type [&_:where(ol>li)]:marker:text-small",
  // A quotation set off by a pen rule standing in its margin.
  "[&_:where(blockquote)]:relative [&_:where(blockquote)]:pl-snug [&_:where(blockquote)]:text-pen-quiet [&_:where(blockquote)]:italic",
  "[&_:where(blockquote)]:before:absolute [&_:where(blockquote)]:before:inset-y-1 [&_:where(blockquote)]:before:-left-1.5 [&_:where(blockquote)]:before:rule-y",
  // Code: inline on the typewriter in a tint well; blocks scroll sideways rather than wrap.
  "[&_:where(:not(pre)>code)]:rounded-[2px] [&_:where(:not(pre)>code)]:bg-tint [&_:where(:not(pre)>code)]:px-[0.3em] [&_:where(:not(pre)>code)]:py-[0.1em] [&_:where(:not(pre)>code)]:font-type [&_:where(:not(pre)>code)]:text-[0.86em]",
  "[&_:where(pre)]:overflow-x-auto [&_:where(pre)]:rounded-[2px] [&_:where(pre)]:bg-tint [&_:where(pre)]:px-snug [&_:where(pre)]:py-tight [&_:where(pre)]:font-type [&_:where(pre)]:text-small [&_:where(pre)]:leading-small",
  "[&_:where(hr)]:rule [&_:where(hr)]:max-w-measure [&_:where(hr)]:border-0 [&_:where(hr)]:text-pen-faint",
  // Small tables: a ledger in miniature. Each row's rule hangs off its first cell and spans the row.
  "[&_:where(table)]:w-full [&_:where(table)]:max-w-measure [&_:where(table)]:border-collapse [&_:where(table)]:text-small [&_:where(table)]:leading-small [&_:where(table)]:tabular-nums",
  "[&_:where(th)]:label [&_:where(th)]:pb-hair [&_:where(th)]:text-left [&_:where(th)]:text-pen-quiet [&_:where(td)]:py-hair [&_:where(th,td)]:pr-snug [&_:where(th,td):last-child]:pr-0",
  "[&_:where(tr)]:relative [&_:where(tr>:first-child)]:after:absolute [&_:where(tr>:first-child)]:after:inset-x-0 [&_:where(tr>:first-child)]:after:-bottom-1.5 [&_:where(tr>:first-child)]:after:rule",
  "[&_:where(thead_tr>:first-child)]:after:text-pen [&_:where(tbody_tr>:first-child)]:after:text-pen-faint [&_:where(tbody_tr:last-child>:first-child)]:after:hidden",
  "[&_:where(figcaption)]:mt-hair [&_:where(figcaption)]:text-small [&_:where(figcaption)]:leading-small [&_:where(figcaption)]:text-pen-quiet",
]

// Sized so the letter's cap height runs from the first line's cap height to the third line's baseline.
const dropCapClasses =
  "[&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mt-[0.17em] [&>p:first-of-type]:first-letter:mr-[0.08em] [&>p:first-of-type]:first-letter:font-read [&>p:first-of-type]:first-letter:text-[5.2em] [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:font-normal [&>p:first-of-type]:first-letter:text-pen"

function Typography({
  className,
  dropCap = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Sets the first paragraph's opening letter three lines deep. */
  dropCap?: boolean
}) {
  return (
    <div
      data-slot="typography"
      data-drop-cap={dropCap || undefined}
      className={cn(...type, ...flow, dropCap && dropCapClasses, className)}
      {...props}
    />
  )
}

/** A label above a heading: the section, series or kind the heading belongs to. */
function TypographyKicker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography-kicker"
      className={cn("label text-pen-quiet", className)}
      {...props}
    />
  )
}

export { Typography, TypographyKicker }
