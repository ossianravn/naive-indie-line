"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/fineliner/lib/utils"
import {
  ChartContext,
  THEMES,
  markFill,
  seriesMark,
  type ChartConfig,
} from "@/fineliner/ui/chart-context"
import { ChartMarkDefs } from "@/fineliner/ui/chart-marks"

// A chart drawn with the page's one pen: every series in the pen, told apart by its mark (solid, outline, dotted,
// lined); bars, lines, points and slices drawn by the pen through the exact data (drawnBar, drawnCurve, drawnDot,
// drawnSector in chart-drawn.tsx). Axis figures in the typewriter, grid lines faint dotted pencil. The data never
// moves and never boils.

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${(id ?? uniqueId).replace(/[^\w-]/g, "")}`
  const context = React.useMemo(() => ({ config, chartId }), [config, chartId])

  return (
    <ChartContext.Provider value={context}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative flex aspect-video justify-center font-type text-small text-pen-quiet",
          // Axes: typewriter figures in the quiet pen; the axis line in the pen; grid lines faint dotted pencil.
          "[&_.recharts-cartesian-axis-tick-value]:fill-pen-quiet [&_.recharts-cartesian-axis-tick-value]:tabular-nums [&_.recharts-polar-angle-axis-tick_text]:fill-pen-quiet [&_.recharts-label]:fill-pen-quiet",
          "[&_.recharts-cartesian-axis-line[stroke='#666']]:stroke-pen [&_.recharts-cartesian-axis-tick-line[stroke='#666']]:stroke-pen-quiet [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-pen-faint [&_.recharts-cartesian-grid_line[stroke='#ccc']:not([stroke-dasharray])]:[stroke-dasharray:0.1_5] [&_.recharts-cartesian-grid_line]:[stroke-linecap:round] [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-pen-faint [&_.recharts-reference-line_[stroke='#ccc']]:stroke-pen",
          // Hover: a dashed pencil line, or a band of tint behind the bars.
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-pen-faint [&_.recharts-curve.recharts-tooltip-cursor]:[stroke-dasharray:3_3] [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-tint [&_.recharts-radial-bar-background-sector]:fill-tint [&_.recharts-dot[stroke='#fff']]:stroke-paper [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:overflow-visible",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ChartMarkDefs chartId={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// Writes --mark-<key> for every series (its fill: ink, bare paper or its pattern, as `fill="var(--mark-<key>)"`) and
// --color-<key> for a series that names a colour. A series without one draws in the page's pen, which is the point:
// one pen, told apart by marks.
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const keys = Object.keys(config)

  const blocks = Object.entries(THEMES).map(([theme, prefix]) => {
    const night = theme !== "light"
    const lines = keys.flatMap((key) => {
      const item = config[key]
      const color =
        item?.theme?.[theme as keyof typeof item.theme] ?? item?.color
      return [
        color ? `  --color-${key}: ${color};` : null,
        night
          ? null
          : `  --mark-${key}: ${markFill(id, key, seriesMark(config, key))};`,
      ].filter((line) => line !== null)
    })
    return lines.length
      ? `${prefix} [data-chart="${id}"] {\n${lines.join("\n")}\n}`
      : ""
  })
  const css = blocks.join("\n").trim()

  return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartLegend = RechartsPrimitive.Legend

export { ChartContainer, ChartTooltip, ChartLegend, ChartStyle }
export {
  ChartTooltipContent,
  ChartLegendContent,
} from "@/fineliner/ui/chart-tooltip"
export { ChartSwatch } from "@/fineliner/ui/chart-marks"
export {
  drawnActiveDot,
  drawnBar,
  drawnCurve,
  drawnDot,
  drawnSector,
} from "@/fineliner/ui/chart-drawn"
export {
  CHART_MARKS,
  markDash,
  type ChartConfig,
  type ChartMark,
} from "@/fineliner/ui/chart-context"
