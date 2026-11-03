"use client"

import { useId, type CSSProperties } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { APPEARANCE, PEN_MIX, type Appearance } from "@/fineliner/theme"
import { Slider } from "@/fineliner/ui/slider"

// The pen row of AppearanceControl: the pens as ink swatches, each in its own pen, the chosen one ringed by the pen
// and named beside the row. The last swatch is the custom pen; chosen, it opens a mixer under the row: a few
// directions to start from, then the hue and its strength. The strength's track runs from grey to the hue's full
// colour. Every swatch is drawn by the pens.css rule it names, so what the row shows is what the page will ink.

/** Starting points round the hue circle for the custom pen. */
export const PEN_DIRECTIONS = [
  { name: "Indigo", hue: 275 },
  { name: "Teal", hue: 200 },
  { name: "Moss", hue: 140 },
  { name: "Ochre", hue: 80 },
  { name: "Rust", hue: 40 },
  { name: "Plum", hue: 340 },
] as const

type Change = (change: Partial<Appearance>) => void

export interface PenControlProps {
  appearance: Appearance
  update: Change
  names: Record<Appearance["pen"], string>
  labelledBy: string
  describedBy?: string
}

const directionOf = (hue: number) =>
  PEN_DIRECTIONS.find((direction) => direction.hue === hue)

/** The pens as swatches, and the custom pen's mixer when it is chosen. */
export function PenControl({
  appearance,
  update,
  names,
  labelledBy,
  describedBy,
}: PenControlProps) {
  const name = useId()
  const custom = appearance.pen === "custom"
  const direction = directionOf(appearance.penHue)
  return (
    <div className="flex flex-col items-start gap-tight">
      <div className="flex items-center gap-hair">
        <div
          role="radiogroup"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className="-ms-[0.3rem] flex items-center"
        >
          {APPEARANCE.pen.map((pen) => (
            <Swatch
              key={pen}
              pen={pen}
              seed={`swatch:${pen}`}
              name={name}
              label={names[pen]}
              chosen={appearance.pen === pen}
              onChoose={() => update({ pen })}
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          className="text-small leading-small text-pen-quiet"
        >
          {custom && direction ? direction.name : names[appearance.pen]}
        </span>
      </div>
      {custom && <PenMixer appearance={appearance} update={update} />}
    </div>
  )
}

function Swatch({
  pen,
  seed,
  name,
  label,
  chosen,
  onChoose,
  small = false,
  style,
}: {
  pen: Appearance["pen"]
  seed: string
  name: string
  label: string
  chosen: boolean
  onChoose: () => void
  small?: boolean
  style?: CSSProperties
}) {
  return (
    <label
      title={label}
      data-pen={pen}
      style={style}
      className={cn(
        "press relative grid cursor-pointer place-items-center rounded-full text-pen has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-0 has-focus-visible:outline-pen has-focus-visible:outline-dashed",
        small ? "size-8" : "size-control",
      )}
    >
      <input
        type="radio"
        name={name}
        value={label}
        aria-label={label}
        checked={chosen}
        onChange={onChoose}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full bg-pen [filter:var(--wob-2)] forced-colors:[forced-color-adjust:none]",
          small ? "size-3.5" : "size-[1.125rem]",
        )}
      />
      {chosen && (
        <PenMark
          name="ring"
          seed={seed}
          className={cn(
            "put-down pointer-events-none absolute",
            small ? "inset-[0.3rem]" : "inset-[0.4rem]",
          )}
        />
      )}
    </label>
  )
}

// The hue circle and the strength scale for the slider tracks, at the lighter of the pen's and the wash's lightness,
// so the hues stay told apart on day paper as well as night.
const band = "max(var(--custom-lightness), var(--custom-wash-lightness))"
const hueTrack = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, k) => `oklch(${band} var(--custom-chroma) ${k * 30})`,
).join(", ")})`
const strengthTrack = `linear-gradient(to right, oklch(${band} 0 var(--pen-hue)), oklch(${band} var(--custom-chroma) var(--pen-hue)))`

function PenMixer({
  appearance,
  update,
}: {
  appearance: Appearance
  update: Change
}) {
  const id = useId()
  return (
    <div
      data-slot="appearance-pen-mixer"
      className="grid w-full grid-cols-[minmax(0,14rem)] items-center gap-x-tight gap-y-hair @min-[28rem]/appearance:grid-cols-[max-content_minmax(0,14rem)]"
    >
      <span id={`${id}-directions`} className="text-small text-pen-quiet">
        Colour
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-directions`}
        className="-ms-[0.35rem] flex items-center"
      >
        {PEN_DIRECTIONS.map((direction) => (
          <Swatch
            key={direction.name}
            pen="custom"
            seed={`swatch:${direction.name}`}
            name={`${id}-direction`}
            label={direction.name}
            small
            chosen={appearance.penHue === direction.hue}
            onChoose={() => update({ penHue: direction.hue })}
            style={
              {
                "--pen-hue": direction.hue,
                "--pen-strength": appearance.penStrength,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <MixSlider
        label="Hue"
        value={appearance.penHue}
        range={PEN_MIX.penHue}
        track={hueTrack}
        onValue={(penHue) => update({ penHue })}
      />
      <MixSlider
        label="Strength"
        value={appearance.penStrength}
        range={PEN_MIX.penStrength}
        track={strengthTrack}
        onValue={(penStrength) => update({ penStrength })}
      />
    </div>
  )
}

function MixSlider({
  label,
  value,
  range: [min, max],
  track,
  onValue,
}: {
  label: string
  value: number
  range: readonly [number, number]
  track: string
  onValue: (value: number) => void
}) {
  const id = useId()
  return (
    <>
      <span id={id} className="text-small text-pen-quiet">
        {label}
      </span>
      <div className="relative">
        {/* The colour under the line: the range the slider sweeps, as a band under the line. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full [filter:var(--wob-2)] forced-colors:hidden"
          style={{ background: track }}
        />
        <Slider
          aria-labelledby={id}
          min={min}
          max={max}
          value={[value]}
          onValueChange={(next) =>
            onValue(Array.isArray(next) ? next[0] : (next as number))
          }
          className="relative"
        />
      </div>
    </>
  )
}
