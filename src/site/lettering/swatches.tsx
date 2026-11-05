"use client"

// The lettering page's colour controls, shared by the tester and the Inline section: a row of pen dots, and for
// Inline a row of fill dots (each pen's wash, the pen's own, or none), each named beside its dots.
import { useId, type CSSProperties, type ReactNode } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { INKS, type Ink } from "./faces"

/** Inline's fill: the pen's own wash, another pen's, or none. */
export type Fill = "own" | Ink | "none"

/** The value of --wash that sets Inline's fill; the pen's own wash needs none. */
export const washOf = (fill: Fill) =>
  fill === "own"
    ? undefined
    : fill === "none"
      ? "transparent"
      : `var(--wash-${fill})`

/** The style that sets Inline's fill on an element. */
export const washStyle = (fill: Fill): CSSProperties | undefined => {
  const wash = washOf(fill)
  return wash ? ({ "--wash": wash } as CSSProperties) : undefined
}

export function Control({
  label,
  htmlFor,
  labelId,
  children,
}: {
  label: string
  htmlFor?: string
  labelId?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-y-hair">
      <label id={labelId} htmlFor={htmlFor} className="label text-pen-quiet">
        {label}
      </label>
      {children}
    </div>
  )
}

export function PenSwatches({
  labelledBy,
  value,
  onChange,
}: {
  labelledBy: string
  value: Ink | null
  onChange: (value: Ink) => void
}) {
  return (
    <Swatches
      labelledBy={labelledBy}
      options={INKS.map(([value, name]) => ({ value, name, pen: value }))}
      value={value}
      none="Default pen"
      onChange={(v) => onChange(v as Ink)}
    />
  )
}

export function FillSwatches({
  labelledBy,
  value,
  onChange,
}: {
  labelledBy: string
  value: Fill
  onChange: (value: Fill) => void
}) {
  return (
    <Swatches
      labelledBy={labelledBy}
      options={[
        { value: "own", name: "Matches the pen", wash: "own" },
        ...INKS.map(([value, name]) => ({
          value,
          name: `${name} wash`,
          wash: value,
        })),
        { value: "none", name: "No fill", wash: "none" },
      ]}
      value={value}
      onChange={(v) => onChange(v as Fill)}
    />
  )
}

interface Option {
  value: string
  name: string
  /** A pen's dot, or a wash: "own" (the pen's), a pen's, or "none". */
  pen?: Ink
  wash?: string
}

/** A row of colour dots as radios, the chosen one ringed by the pen. */
function Swatches({
  labelledBy,
  options,
  value,
  none = "",
  onChange,
}: {
  labelledBy: string
  options: Option[]
  value: string | null
  /** What a row with nothing chosen says beside it. */
  none?: string
  onChange: (value: string) => void
}) {
  const name = useId()
  const chosen = options.find((o) => o.value === value)?.name ?? none
  return (
    // The name drops under the dots when the row is too narrow for both, rather than wrapping beside them.
    <div className="flex min-h-control flex-wrap items-center gap-x-hair">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        className="-ms-[0.3rem] flex items-center"
      >
        {options.map((o) => (
          <label
            key={o.value}
            title={o.name}
            data-pen={o.pen}
            className="press relative grid size-control cursor-pointer place-items-center rounded-full text-pen has-focus-visible:outline-[1.5px] has-focus-visible:outline-pen has-focus-visible:outline-dashed"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              aria-label={o.name}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              style={
                o.wash && o.wash !== "own" && o.wash !== "none"
                  ? { background: `var(--wash-${o.wash})` }
                  : undefined
              }
              className={cn(
                "size-[1.125rem] rounded-full [filter:var(--wob-2)] forced-colors:[forced-color-adjust:none]",
                o.pen && "bg-pen",
                o.wash === "own" && "bg-wash",
                o.wash && "border border-pen",
              )}
            />
            {value === o.value && (
              <PenMark
                name="ring"
                seed={`swatch:${o.value}`}
                className="put-down pointer-events-none absolute inset-[0.4rem]"
              />
            )}
          </label>
        ))}
      </div>
      <span
        aria-hidden="true"
        className="text-small leading-small whitespace-nowrap text-pen-quiet"
      >
        {chosen}
      </span>
    </div>
  )
}
