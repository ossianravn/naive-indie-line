import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { frameStyle } from "@/fineliner/lib/frame-style"
import { cn } from "@/fineliner/lib/utils"
import { Label } from "@/fineliner/ui/label"
import { Separator } from "@/fineliner/ui/separator"

// Label, control, description and error in one column of readable width. Children keep the widths they are given
// (a short field stays short). The label is in the reading voice above its control, the description quieter beneath,
// and an error is written in the correction pen.

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "m-0 flex min-w-0 flex-col gap-snug border-0 p-0 has-[>[data-slot=checkbox-group]]:gap-tight has-[>[data-slot=radio-group]]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-hair p-0 text-pen data-[variant=label]:label data-[variant=legend]:font-read data-[variant=legend]:text-body data-[variant=legend]:leading-subhead data-[variant=legend]:font-medium",
        className,
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-snug data-[slot=checkbox-group]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-hair", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal:
        "flex-row items-center gap-tight has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.5",
      responsive:
        "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-tight @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.5",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-small",
        className,
      )}
      {...props}
    />
  )
}

// A label that wraps a whole Field becomes a choice card: a drawn frame round it, pressed harder under the pointer
// and while its option is chosen (the option's own dot or tick carries the choice).
function FieldLabel({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-tight [[data-slot=field][data-orientation=vertical]>&]:label group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:text-pen-faint",
        "has-[>[data-slot=field]]:frame has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:cursor-pointer has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:[--pen-weight:var(--pen-weight-pressed)] has-[>[data-slot=field]]:has-data-checked:[--pen-weight:var(--pen-weight-pressed)] has-[>[data-slot=field]]:has-[[data-disabled]]:text-pen-faint *:data-[slot=field]:p-tight",
        className,
      )}
      style={frameStyle(props.htmlFor, style) as React.CSSProperties}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-tight text-ui leading-ui font-medium text-pen group-data-[disabled=true]/field:text-pen-faint",
        className,
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "m-0 text-left text-small leading-small font-normal text-pen-quiet group-has-data-[orientation=horizontal]/field:text-balance group-data-[disabled=true]/field:text-pen-faint [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        className,
      )}
      {...props}
    />
  )
}

// A rule across the form; with words, the words sit between two lengths of it.
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "-my-1 flex items-center gap-tight text-small leading-small text-pen-quiet",
        className,
      )}
      {...props}
    >
      <Separator className="flex-1" />
      {children && (
        <>
          <span className="label shrink-0" data-slot="field-separator-content">
            {children}
          </span>
          <Separator className="flex-1" />
        </>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="m-0 flex list-disc flex-col gap-0.5 pl-4">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-small leading-small font-normal text-correction",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
