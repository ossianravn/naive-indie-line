import type { CSSProperties } from "react"
import { PenMark } from "@/fineliner/drawing/pen-mark"
import { frameVars, seedOf } from "@/fineliner/pen"
import { cn } from "@/fineliner/lib/utils"
import { PRESETS, type Preset } from "./presets"

// Day paper per stock (styles/stocks.css). Stocks apply on <html> only, so a swatch cannot borrow one by attribute.
const PAPER = { recycled: "#ece2ca", kraft: "#cdb48f", bond: "#f4f0e6" }

/** The preset's paper and pen, as a swatch: a square of its stock with a stroke of its pen across it. */
function Swatch({ preset }: { preset: Preset }) {
  const { stock, pen } = preset.choices
  return (
    <span
      aria-hidden="true"
      className="relative block size-6 shrink-0 overflow-hidden rounded-[2px] border border-pen-faint"
      style={{ background: PAPER[stock] }}
    >
      <span
        className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 rotate-[-12deg] rounded-full"
        style={{ background: `var(--pen-${pen})` }}
      />
    </span>
  )
}

/** Named sets of choices, as small framed cards; the one the page matches presses harder and is ticked. */
export function PresetPicker({
  current,
  onPick,
}: {
  current?: Preset
  onPick: (preset: Preset) => void
}) {
  return (
    <section aria-labelledby="studio-presets">
      <h2 id="studio-presets" className="label m-0 text-pen-quiet">
        Presets
      </h2>
      <ul className="m-0 mt-tight grid list-none grid-cols-2 gap-tight p-0 md:grid-cols-3 xl:grid-cols-5">
        {PRESETS.map((preset) => {
          const on = preset === current
          return (
            <li key={preset.name} className="flex">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(preset)}
                style={frameVars(seedOf(preset.name)) as CSSProperties}
                className="frame press flex w-full cursor-pointer items-start gap-tight px-tight py-hair text-left aria-pressed:[--pen-weight:var(--pen-weight-pressed)] hover:[--pen-weight:var(--pen-weight-pressed)]"
              >
                <Swatch preset={preset} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center justify-between gap-hair">
                    <span className="font-medium leading-subhead">
                      {preset.name}
                    </span>
                    <PenMark
                      name="tick"
                      seed={preset.name}
                      hand="calm"
                      className={cn("put-down size-4", !on && "invisible")}
                    />
                  </span>
                  <span className="text-small leading-small text-pen-quiet">
                    {preset.note}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
