"use client"

// The desk's segmented rows: a label above a drawn frame of options, the chosen one filled with ink.
import type { CSSProperties } from "react"
import { frameVars, seedOf } from "@/fineliner/pen"

export const frame = (seed: string) => frameVars(seedOf(seed)) as CSSProperties

export function Segments<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly (readonly [T, string])[]
  onChange: (value: T) => void
}) {
  return (
    <div className="grid justify-items-start gap-hair">
      <span className="label" id={`desk-${label}`}>
        {label}
      </span>
      <div
        className="segmented frame"
        style={frame(`desk-${label}`)}
        role="radiogroup"
        aria-labelledby={`desk-${label}`}
      >
        {options.map(([v, name]) => (
          <label key={v}>
            <input
              className="sr-only"
              type="radio"
              name={`desk-${label}`}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
            />
            <i className="ink-fill" style={frame(`desk-${label}-${v}`)} />
            {name}
          </label>
        ))}
      </div>
    </div>
  )
}
