"use client"

import { useId, type ReactNode } from "react"
import { cn } from "@/fineliner/lib/utils"
import { FieldError } from "@/fineliner/ui/field"

// The settings page's rows, laid out as AppearanceControl lays out its own: every name set to the end of one label
// column, right beside its control, the controls lined up on one edge and a hint under the control. Under a container
// 28rem wide each name stands above its control. Sections share the label column's width (--settings-label), so the
// controls of every section, the appearance rows included, line up on the same edge.

/** The label column's width, shared by every section and by the appearance rows. */
export const SETTINGS_LABEL = "[--settings-label:9rem]"

/** AppearanceControl reads --settings-label for its label column, so its controls line up with the other sections. */
export const ALIGN_APPEARANCE = "max-w-none"

/** A titled group of rows. */
export function SettingsSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section className={cn("mt-section", className)} aria-labelledby={id}>
      <h2 id={id} className="label m-0 text-pen-quiet">
        {title}
      </h2>
      <div className="mt-snug grid grid-cols-[minmax(0,1fr)] gap-y-snug @min-[28rem]/settings:grid-cols-[var(--settings-label)_minmax(0,1fr)] @min-[28rem]/settings:gap-x-snug">
        {children}
      </div>
    </section>
  )
}

/**
 * One setting: its name in the label column, the control beside it at control height, and an optional error (in the
 * correction pen) and hint under the control. Under 28rem the name stands above its control, except in a `beside` row
 * (a switch), which keeps its control at the end of the name's line, as phones do. A row without a label (a section's
 * save button) keeps the label cell empty, so its control stays on the controls' edge.
 */
export function SettingsRow({
  label,
  hint,
  error,
  htmlFor,
  hintId,
  errorId,
  beside,
  children,
}: {
  label?: string
  hint?: ReactNode
  error?: ReactNode
  htmlFor?: string
  /** Ids for the hint and the error, for the control's aria-describedby. */
  hintId?: string
  errorId?: string
  /** Keep the control beside its name on narrow screens too: for switches. */
  beside?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "col-span-full grid items-center gap-x-snug gap-y-hair @min-[28rem]/settings:grid-cols-subgrid @min-[28rem]/settings:items-start",
        beside ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)]",
      )}
    >
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn(
            "font-ui text-ui leading-ui font-medium text-pen",
            // Written out whole, so Tailwind finds them: the same column end and control height as AppearanceControl.
            "@min-[28rem]/settings:flex @min-[28rem]/settings:min-h-control @min-[28rem]/settings:items-center @min-[28rem]/settings:justify-end @min-[28rem]/settings:text-end",
          )}
        >
          {label}
        </label>
      ) : (
        <span aria-hidden="true" className="@max-[28rem]/settings:hidden" />
      )}
      <div className="flex min-h-control max-w-full min-w-0 items-center">
        {children}
      </div>
      {(error || hint) && (
        <div
          className={cn(
            "flex min-w-0 flex-col items-start gap-hair @min-[28rem]/settings:col-start-2",
            beside && "col-span-2 @min-[28rem]/settings:col-span-1",
          )}
        >
          {error && (
            <FieldError id={errorId} className="max-w-[24rem]">
              {error}
            </FieldError>
          )}
          {hint && (
            <p
              id={hintId}
              className="m-0 max-w-[24rem] text-small leading-small text-pen-quiet"
            >
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
