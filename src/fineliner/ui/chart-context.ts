"use client"

import * as React from "react"

// The chart's shared state: its config, its id (which scopes the mark patterns) and the defaults that give every
// series a mark. One pen draws the whole chart, so series differ by mark (solid, outline, dotted, lined), not colour.

// Format: { THEME_NAME: CSS_SELECTOR }. Fineliner's night paper is data-theme="night" on the root, not shadcn's .dark.
export const THEMES = { light: "", dark: ':root[data-theme="night"]' } as const

/**
 * How a series fills its bars, areas and slices and marks its points: solid ink, an outline on bare paper, a
 * stipple of pen dots, or pen lines. The first three come first; lined is for a fourth series.
 */
export type ChartMark = "solid" | "outline" | "dotted" | "lined"

/** Series without a mark take the next one in this order. */
export const CHART_MARKS: readonly ChartMark[] = [
  "solid",
  "outline",
  "dotted",
  "lined",
]

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    /** Fineliner: the series' mark; defaults by position in the config. */
    mark?: ChartMark
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
  /** Scopes the chart's mark patterns, so several charts on a page never share an id. */
  chartId: string
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

/** The id of a series' mark pattern (dotted, lined) inside one chart. */
export function markId(chartId: string, key: string) {
  return `${chartId}-mark-${key.replace(/[^\w-]/g, "_")}`
}

/** A series' mark, explicit or by its position in the config. Every series is drawn by the pen unless it says so. */
export function seriesMark(
  config: ChartConfig,
  key: string | undefined,
): ChartMark {
  const own = key ? config[key]?.mark : undefined
  const index = key ? Math.max(0, Object.keys(config).indexOf(key)) : 0
  return own ?? CHART_MARKS[index % CHART_MARKS.length]!
}

/** What a mark fills a shape with: the series' ink, bare paper, or its pattern. */
export function markFill(chartId: string, key: string, mark: ChartMark) {
  if (mark === "solid") return `var(--color-${key}, var(--pen))`
  if (mark === "outline") return "var(--paper)"
  return `url(#${markId(chartId, key)})`
}

/** A line's dash for a mark: dotted series draw dotted lines, lined ones dashed; the others a full line. */
export function markDash(mark: ChartMark) {
  if (mark === "dotted") return "0.1 4.5"
  if (mark === "lined") return "7 4"
  return undefined
}

/**
 * The config key an item belongs to: the value of `key` on the item or its data row (a pie slice's name, say),
 * else `key` itself. Undefined when neither is in the config.
 */
export function getPayloadConfigKey(
  config: ChartConfig,
  payload: unknown,
  key: string,
): string | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  if (configLabelKey in config) return configLabelKey
  return key in config ? key : undefined
}
