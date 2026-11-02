"use client"

// The specimen's appearance settings: one segmented row per setting, pens as swatches. Site code; Phase 2's toggle
// group replaces the hand-rolled segments.
import type { CSSProperties } from "react"
import { frameVars, seedOf } from "@/fineliner/pen"
import { APPEARANCE, useAppearance, type Appearance } from "@/fineliner/theme"
import { siteAppearance } from "@/site/appearance"

const ROWS: {
  key: keyof Appearance
  label: string
  names?: Record<string, string>
}[] = [
  {
    key: "theme",
    label: "Light",
    names: { system: "Auto", day: "Day", night: "Night" },
  },
  { key: "stock", label: "Paper" },
  { key: "pen", label: "Pen", names: { black: "Soft black" } },
  { key: "hand", label: "Hand" },
  { key: "boil", label: "Line boil" },
  { key: "containers", label: "Containers" },
  {
    key: "labels",
    label: "Labels",
    names: { caps: "Small caps", type: "Typewriter" },
  },
  { key: "density", label: "Density" },
]

const title = (value: string, names?: Record<string, string>) =>
  names?.[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
const frame = (seed: string) => frameVars(seedOf(seed)) as CSSProperties

export function AppearancePanel() {
  const [appearance, update] = useAppearance(siteAppearance)
  return (
    <div className="grid gap-snug sm:grid-cols-2">
      {ROWS.map(({ key, label, names }) => (
        <div key={key} className="grid justify-items-start gap-hair">
          <span className="label" id={`appearance-${key}`}>
            {label}
          </span>
          {key === "pen" ? (
            <div
              className="flex items-center gap-hair"
              role="radiogroup"
              aria-labelledby={`appearance-${key}`}
            >
              {APPEARANCE.pen.map((pen) => (
                <label
                  key={pen}
                  className="swatch"
                  title={title(pen, names)}
                  data-pen={pen}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name={key}
                    value={pen}
                    checked={appearance.pen === pen}
                    onChange={() => update({ pen })}
                    aria-label={title(pen, names)}
                  />
                  <span className="swatch-chip" aria-hidden="true" />
                </label>
              ))}
              <span className="text-small">{title(appearance.pen, names)}</span>
            </div>
          ) : (
            <div
              className="segmented frame"
              style={frame(`setting-${key}`)}
              role="radiogroup"
              aria-labelledby={`appearance-${key}`}
            >
              {APPEARANCE[key].map((value) => (
                <label key={value}>
                  <input
                    className="sr-only"
                    type="radio"
                    name={key}
                    value={value}
                    checked={appearance[key] === value}
                    onChange={() => update({ [key]: value })}
                  />
                  <i
                    className="ink-fill"
                    style={frame(`setting-${key}-${value}`)}
                  />
                  {title(value, names)}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
