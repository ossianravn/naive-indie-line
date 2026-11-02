"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CopyIcon } from "lucide-react"
import { penMark } from "@/fineliner/pen/pen-marks"
import { cn } from "@/fineliner/lib/utils"
import { Button } from "@/fineliner/ui/button"

// Code on a well of tint (a pocket, so its edge wobbles like everything else the pen fills), set in the typewriter.
// The header is a strip in the label voice (the file name typed in the full pen) over a pen rule; line numbers sit in a
// gutter ruled by one standing pen line. Highlighting is one pen (useHighlightedCode): weight, slant and a quieter pen,
// never colour. Added and removed lines are told by their + and − and by a strike, highlighted lines by a deeper
// tint. Copy is a ghost button whose icon becomes a tick put down by the pen. The focus ring goes round the well.

const FOCUS =
  "has-[>[data-slot=code-block-content]:focus-visible]:outline-[1.5px] has-[>[data-slot=code-block-content]:focus-visible]:outline-offset-4 has-[>[data-slot=code-block-content]:focus-visible]:outline-dashed has-[>[data-slot=code-block-content]:focus-visible]:outline-current"

const TICK = penMark("tick", "code-block-copy", "calm")

const codeBlockVariants = cva(
  `group/code-block pocket relative flex w-full min-w-0 flex-col text-small forced-colors:before:border data-[size=sm]:text-label ${FOCUS}`,
  {
    variants: {
      variant: {
        default: "text-pen before:bg-tint",
        destructive:
          "text-correction before:bg-[color-mix(in_srgb,var(--correction)_9%,var(--paper))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(codeBlockVariants({ variant }), className)}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "relative flex min-h-10 min-w-0 shrink-0 items-center gap-hair ps-tight pe-1.5 label text-pen-quiet after:rule after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1.5 after:text-pen-faint group-data-[size=sm]/code-block:min-h-9 group-data-[size=sm]/code-block:ps-2.5 group-data-[variant=destructive]/code-block:text-correction group-data-[variant=destructive]/code-block:after:text-correction/50 *:has-[>[data-slot=code-block-title]]:min-w-0",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-type text-small font-normal tracking-normal text-pen normal-case [font-variant-caps:normal] group-data-[size=sm]/code-block:text-label group-data-[variant=destructive]/code-block:text-correction [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-[-0.2em] [&_svg:not([class*='size-'])]:size-3.5 *:[svg]:me-1.5",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "ms-auto flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-1.5 [[data-slot=code-block]>&]:top-1.5 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100 [[data-slot=code-block]>&]:*:before:bg-tint",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={cn(
          "min-w-[6rem] justify-start text-pen-quiet hover:text-pen hover:before:bg-[color-mix(in_srgb,var(--pen)_16%,var(--paper))] data-copied:text-pen",
          className,
        )}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
        {...props}
      >
        {copied ? (
          <span
            data-icon="inline-start"
            className="put-down relative -top-0.5 block size-3.5 [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: TICK }}
          />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

/** The number of lines a code block's children make, for the gutter's width. */
function lineCount(children: React.ReactNode) {
  if (typeof children === "string")
    return children.replace(/\n$/, "").split("\n").length
  return Math.max(1, React.Children.count(children))
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
}) {
  const digits = Math.max(2, String(startLine + lineCount(children) - 1).length)
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={
        {
          counterReset: `line ${startLine - 1}`,
          "--gutter": `${digits}ch`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "m-0 min-h-0 min-w-0 overflow-auto px-tight py-tight text-start font-type leading-[1.7] font-normal focus-visible:outline-none group-has-data-[slot=code-block-footer]/code-block:pb-hair group-has-data-[slot=code-block-header]/code-block:pt-snug group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:py-2 data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap",
        className,
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className="relative grid min-h-lh min-w-max content-start font-[inherit] in-data-numbered:grid-cols-[auto_1fr] in-data-numbered:before:rule-y in-data-numbered:before:absolute in-data-numbered:before:inset-y-0 in-data-numbered:before:start-[calc(var(--gutter)+var(--space-tight)/2-0.375rem)] in-data-numbered:before:text-pen-faint in-data-wrap:min-w-0"
      >
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  )
}

const codeBlockLineVariants = cva(
  "relative -mx-tight block min-h-lh px-tight group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5 before:w-(--gutter) before:text-end before:text-pen-quiet before:tabular-nums after:absolute after:start-1 after:top-0 after:select-none after:text-pen-quiet in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-tight in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']",
  {
    variants: {
      variant: {
        default: "",
        added: "bg-pen/7 after:content-['+']",
        removed:
          "after:content-['−'] *:data-[slot=code-block-line-content]:line-through *:data-[slot=code-block-line-content]:decoration-pen-quiet",
        highlighted: "bg-pen/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines. A plain line's indent sits in its own
  // inline box, which a removed line's strike passes over, so the strike starts at the first word.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0)
  const indent = typeof children === "string" ? /^\s+/.exec(children)?.[0] : ""

  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(codeBlockLineVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="code-block-line-content" className="min-w-0">
        {empty ? (
          "\n"
        ) : indent ? (
          <>
            <span className="inline-block">{indent}</span>
            {(children as string).slice(indent.length)}
          </>
        ) : (
          children
        )}
      </span>
    </span>
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "relative flex min-h-9 min-w-0 shrink-0 items-center gap-hair px-tight label text-pen-quiet before:rule before:pointer-events-none before:absolute before:inset-x-0 before:-top-1.5 before:text-pen-faint group-data-[size=sm]/code-block:px-2.5 group-data-[variant=destructive]/code-block:before:text-correction/50",
        className,
      )}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
}
