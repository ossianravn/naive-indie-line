"use client"

import { seedOf, stream } from "@/fineliner/pen/seed"
import { cn } from "@/fineliner/lib/utils"
import {
  markDash,
  markId,
  seriesMark,
  useChart,
  type ChartConfig,
  type ChartMark,
} from "@/fineliner/ui/chart-context"

// The marks that tell series apart in one pen: a stipple of pen dots and a field of pen lines, as SVG patterns defined
// once per chart. Each tile's dots sit a little off the grid and the lines lean a few degrees, by a seed from the
// series key, so the same series looks the same on the server, in the browser and in every build.

function MarkPattern({
  id,
  mark,
  color,
  seed,
}: {
  id: string
  mark: ChartMark
  color: string
  seed: string
}) {
  const r = stream(seedOf(seed), "chart-mark")
  if (mark === "lined") {
    const lean = Math.round(r.signed() * 6)
    return (
      <pattern
        id={id}
        width={5}
        height={5}
        patternUnits="userSpaceOnUse"
        patternTransform={`rotate(${45 + lean})`}
      >
        <rect width={5} height={5} fill="var(--paper)" />
        <rect width={1.1} height={5} fill={color} />
      </pattern>
    )
  }
  // A 9px tile of three dots, each nudged off its place so the stipple reads as dotted by hand.
  const dots = [
    [1.5, 1.5],
    [6, 3.5],
    [3, 7],
  ].map(([x, y]) => [x! + r.signed() * 0.6, y! + r.signed() * 0.6])
  return (
    <pattern id={id} width={9} height={9} patternUnits="userSpaceOnUse">
      <rect width={9} height={9} fill="var(--paper)" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.95} fill={color} />
      ))}
    </pattern>
  )
}

/** The dotted and lined series' patterns for one chart, in a hidden SVG that the chart's shapes refer to by id. */
export function ChartMarkDefs({
  chartId,
  config,
}: {
  chartId: string
  config: ChartConfig
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        {Object.keys(config).map((key) => {
          const mark = seriesMark(config, key)
          return mark === "dotted" || mark === "lined" ? (
            <MarkPattern
              key={key}
              id={markId(chartId, key)}
              mark={mark}
              color={`var(--color-${key}, var(--pen))`}
              seed={key}
            />
          ) : null
        })}
      </defs>
    </svg>
  )
}

/**
 * A series' key in a tooltip or legend, in its mark: a small square filled solid, left bare, dotted or lined, or for
 * a line a short stroke in its dash with the point it marks.
 */
export function ChartSwatch({
  seriesKey,
  variant = "fill",
  className,
}: {
  seriesKey?: string
  variant?: "fill" | "line"
  className?: string
}) {
  const { chartId, config } = useChart()
  const mark = seriesMark(config, seriesKey)
  const ink = seriesKey ? `var(--color-${seriesKey}, var(--pen))` : "var(--pen)"
  const fill =
    mark === "solid"
      ? ink
      : mark === "outline" || !seriesKey
        ? "var(--paper)"
        : `url(#${markId(chartId, seriesKey)})`

  if (variant === "line") {
    return (
      <svg
        data-slot="chart-swatch"
        aria-hidden="true"
        viewBox="0 0 18 10"
        className={cn(
          "h-2.5 w-[1.125rem] shrink-0 overflow-visible",
          className,
        )}
      >
        <line
          x1={1}
          y1={5}
          x2={17}
          y2={5}
          stroke={ink}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={markDash(mark)}
        />
        <circle
          cx={9}
          cy={5}
          r={2.4}
          fill={mark === "outline" ? "var(--paper)" : ink}
          stroke={ink}
          strokeWidth={1.2}
        />
      </svg>
    )
  }

  return (
    <svg
      data-slot="chart-swatch"
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn("size-3 shrink-0", className)}
    >
      <rect
        x={0.75}
        y={0.75}
        width={10.5}
        height={10.5}
        rx={0.5}
        fill={fill}
        stroke={ink}
        strokeWidth={1.3}
      />
    </svg>
  )
}
