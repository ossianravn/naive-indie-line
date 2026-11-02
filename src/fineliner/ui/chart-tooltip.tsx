"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"
import { cn } from "@/fineliner/lib/utils"
import { getPayloadConfigKey, useChart } from "@/fineliner/ui/chart-context"
import { ChartSwatch } from "@/fineliner/ui/chart-marks"

// The tooltip is a small sheet of paper drawn round by the pen, like a popover: the label in the label voice, one row
// per series with its mark, its name and its value in the typewriter. The legend is a row of names, each with the
// series' mark (or its stroke and point, for a line).

type TooltipNameType = number | string

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const configKey = getPayloadConfigKey(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : configKey && config[configKey]?.label

    const classes = cn("label text-pen", labelClassName)
    if (labelFormatter) {
      return <div className={classes}>{labelFormatter(value, payload)}</div>
    }

    if (!value) {
      return null
    }

    return <div className={classes}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "float-sheet frame grid min-w-36 items-start gap-hair px-tight py-hair",
        className,
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const configKey = getPayloadConfigKey(config, item, key)
            const itemConfig = configKey ? config[configKey] : undefined

            return (
              <div
                key={index}
                className="flex w-full items-center gap-tight [&>svg:not([data-slot=chart-swatch])]:size-3 [&>svg:not([data-slot=chart-swatch])]:text-pen-quiet"
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <ChartSwatch
                          seriesKey={configKey}
                          variant={indicator === "dot" ? "fill" : "line"}
                        />
                      )
                    )}
                    <div className="flex flex-1 items-baseline justify-between gap-snug">
                      <span className="text-small leading-small text-pen-quiet">
                        {itemConfig?.label ?? item.name}
                      </span>
                      {item.value != null && (
                        <span className="font-type text-small leading-none text-pen tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString("en-GB")
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  const keys = Object.keys(config)
  const order = (key?: string) => {
    const at = key ? keys.indexOf(key) : -1
    return at < 0 ? keys.length : at
  }

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-snug gap-y-hair",
        verticalAlign === "top" ? "pb-tight" : "pt-tight",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          return { item, configKey: getPayloadConfigKey(config, item, key) }
        })
        // In config order, the order marks are dealt in, not Recharts' alphabetical one.
        .sort((a, b) => order(a.configKey) - order(b.configKey))
        .map(({ item, configKey }, index) => {
          const itemConfig = configKey ? config[configKey] : undefined
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 text-small leading-small text-pen-quiet [&>svg:not([data-slot=chart-swatch])]:size-3"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <ChartSwatch
                  seriesKey={configKey}
                  variant={item.type === "line" ? "line" : "fill"}
                />
              )}
              {itemConfig?.label ?? item.value}
            </div>
          )
        })}
    </div>
  )
}

export { ChartTooltipContent, ChartLegendContent }
