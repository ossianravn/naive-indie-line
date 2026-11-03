"use client"

import { useId, type ComponentProps, type CSSProperties } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf } from "@/fineliner/pen/seed"
import { APPEARANCE, useAppearance, type Appearance } from "@/fineliner/theme"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

// Every appearance setting as a form column: each name beside its control, the names set to their column's end and
// the controls lined up on one edge, so every label sits next to what it sets. The short choices are segmented
// controls (the toggle group's joined outline); the pen is a row of ink swatches with the chosen one ringed by the
// pen and named beside them. Under a container 28rem wide each name stands above its control. Every change applies
// to <html> and persists through useAppearance, so every island on the page follows.

export type AppearanceRow = keyof Appearance

/** Every row, in reading order (the order of APPEARANCE). */
export const APPEARANCE_ROWS = Object.keys(APPEARANCE) as AppearanceRow[]

/** Each setting's name and its options' names, for any screen that shows them. */
export const appearanceLabels: {
  [K in AppearanceRow]: {
    label: string
    options: Record<Appearance[K], string>
  }
} = {
  theme: {
    label: "Light",
    options: { system: "System", day: "Day", night: "Night" },
  },
  stock: {
    label: "Paper",
    options: { bond: "Bond", recycled: "Recycled", kraft: "Kraft" },
  },
  pen: {
    label: "Pen",
    options: {
      navy: "Navy",
      black: "Soft black",
      sepia: "Sepia",
      forest: "Forest",
      oxblood: "Oxblood",
    },
  },
  hand: { label: "Hand", options: { calm: "Calm", lively: "Lively" } },
  boil: {
    label: "Line boil",
    options: { off: "Off", hover: "Hover", art: "Always" },
  },
  containers: {
    label: "Containers",
    options: { open: "Open", boxed: "Boxed" },
  },
  labels: {
    label: "Labels",
    options: { caps: "Small caps", type: "Typewriter" },
  },
  density: {
    label: "Density",
    options: { comfortable: "Comfortable", compact: "Compact" },
  },
}

const HINTS: Record<AppearanceRow, string> = {
  theme: "Night is a dark card drawn on with a light gel pen.",
  stock: "The paper under everything.",
  pen: "The one pen that inks text, lines and fills.",
  hand: "How far lines wobble and run past their corners.",
  boil: "Drawings redrawn a few times a second.",
  containers: "Boxed draws a frame round every card.",
  labels: "Field labels, metadata and kickers.",
  density: "Tighter spacing and shorter controls.",
}

export interface AppearanceControlProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Which rows show, in this order. Defaults to every row. */
  rows?: readonly AppearanceRow[]
  /** A line under each control saying what the setting changes. */
  hints?: boolean
  /** The defaults the page's appearanceScript uses, for the server render. */
  defaults?: Appearance
}

type Change = (change: Partial<Appearance>) => void

/** Light, paper, pen, hand, line boil, containers, labels and density as settings rows. */
export function AppearanceControl({
  rows = APPEARANCE_ROWS,
  hints = false,
  defaults,
  className,
  ...props
}: AppearanceControlProps) {
  const [appearance, update] = useAppearance(defaults)
  const id = useId()
  return (
    <div
      data-slot="appearance-control"
      className={cn("@container/appearance w-full max-w-[34rem]", className)}
      {...props}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-snug @min-[28rem]/appearance:grid-cols-[var(--settings-label,max-content)_minmax(0,1fr)] @min-[28rem]/appearance:gap-x-snug">
        {rows.map((row) => (
          <Row
            key={row}
            row={row}
            id={`${id}-${row}`}
            hint={hints ? HINTS[row] : undefined}
            appearance={appearance}
            update={update}
          />
        ))}
      </div>
    </div>
  )
}

function Row({
  row,
  id,
  hint,
  appearance,
  update,
}: {
  row: AppearanceRow
  id: string
  hint?: string
  appearance: Appearance
  update: Change
}) {
  const labelId = `${id}-label`
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div
      data-slot="appearance-control-row"
      data-row={row}
      className="col-span-full grid grid-cols-subgrid items-start gap-y-hair"
    >
      <span
        id={labelId}
        className="font-ui text-ui leading-ui font-medium text-pen @min-[28rem]/appearance:flex @min-[28rem]/appearance:h-control @min-[28rem]/appearance:items-center @min-[28rem]/appearance:justify-end @min-[28rem]/appearance:text-end"
      >
        {appearanceLabels[row].label}
      </span>
      <div className="flex min-w-0 flex-col items-start gap-hair">
        {row === "pen" ? (
          <Swatches
            value={appearance.pen}
            update={update}
            labelledBy={labelId}
            describedBy={hintId}
          />
        ) : (
          <Segmented
            row={row}
            value={appearance[row]}
            update={update}
            labelledBy={labelId}
            describedBy={hintId}
          />
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
    </div>
  )
}

type ControlProps = {
  update: Change
  labelledBy: string
  describedBy?: string
}

function Segmented({
  row,
  value,
  update,
  labelledBy,
  describedBy,
}: ControlProps & { row: Exclude<AppearanceRow, "pen">; value: string }) {
  const options: readonly string[] = APPEARANCE[row]
  const names: Record<string, string> = appearanceLabels[row].options
  return (
    <ToggleGroup
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      variant="outline"
      spacing={0}
      value={[value]}
      onValueChange={(next: unknown[]) =>
        next[0] && update({ [row]: next[0] } as Partial<Appearance>)
      }
      style={frameVars(seedOf(`appearance:${row}`)) as CSSProperties}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {names[option]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** The pens as ink swatches, each in its own pen; the chosen one is ringed by the pen and named beside the row. */
function Swatches({
  value,
  update,
  labelledBy,
  describedBy,
}: ControlProps & { value: Appearance["pen"] }) {
  const name = useId()
  const names = appearanceLabels.pen.options
  return (
    <div className="flex items-center gap-hair">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className="-ms-[0.3rem] flex items-center"
      >
        {APPEARANCE.pen.map((pen) => {
          const chosen = value === pen
          return (
            <label
              key={pen}
              title={names[pen]}
              data-pen={pen}
              className="press relative grid size-control cursor-pointer place-items-center rounded-full text-pen has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-0 has-focus-visible:outline-pen has-focus-visible:outline-dashed"
            >
              <input
                type="radio"
                name={name}
                value={pen}
                aria-label={names[pen]}
                checked={chosen}
                onChange={() => update({ pen })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="size-[1.125rem] rounded-full bg-pen [filter:var(--wob-2)] forced-colors:[forced-color-adjust:none]"
              />
              {chosen && (
                <PenMark
                  name="ring"
                  seed={`swatch:${pen}`}
                  className="put-down pointer-events-none absolute inset-[0.4rem]"
                />
              )}
            </label>
          )
        })}
      </div>
      <span
        aria-hidden="true"
        className="text-small leading-small text-pen-quiet"
      >
        {names[value]}
      </span>
    </div>
  )
}
