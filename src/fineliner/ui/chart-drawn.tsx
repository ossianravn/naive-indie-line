"use client"

import * as React from "react"
import {
  Sector,
  type BarShapeProps,
  type CurveProps,
  type PieSectorShapeProps,
} from "recharts"
import { pen } from "@/fineliner/pen/stroke"
import { curveRuns, plot } from "@/fineliner/pen/plot"
import { snap, type Point } from "@/fineliner/pen/geometry"
import {
  getPayloadConfigKey,
  markFill,
  seriesMark,
  useChart,
} from "@/fineliner/ui/chart-context"

// Data marks drawn by the pen. Strokes pass exactly through every data point and every bar corner (pen/plot.ts):
// the wobble lives between them, so the pen draws the chart and the data stays where Recharts put it. Fills are the
// exact geometry, in the series' mark. Seeds come from the series and its values, never from layout, so server and
// browser draw the same strokes.

const ink = (key: unknown) =>
  typeof key === "string" ? `var(--color-${key}, var(--pen))` : "var(--pen)"

// Recharts re-renders shapes on hover and while animating; a small cache keeps a redraw of the same geometry free.
const cache = new Map<string, string>()
function cached(key: string, make: () => string) {
  let d = cache.get(key)
  if (d === undefined) {
    d = make()
    cache.set(key, d)
    if (cache.size > 600) cache.delete(cache.keys().next().value as string)
  }
  return d
}

// ---- Curves -------------------------------------------------------------------------------------------------------

type CurveFactory = Extract<
  NonNullable<CurveProps["type"]>,
  (...args: never[]) => unknown
>
type CurveContext = Parameters<CurveFactory>[0]

/**
 * A curve for `<Line type>` and `<Area type>` whose stroke is drawn by the pen through the exact data points. An
 * area's fill keeps the plain curve, so fill and stroke meet. Horizontal layouts.
 */
export function drawnCurve(
  interpolation: "monotone" | "linear" = "monotone",
  seed: string | number = "chart",
): CurveFactory {
  return (context: CurveContext) => {
    let inArea = false
    let closing = false
    let points: Point[] = []
    return {
      areaStart() {
        inArea = true
        closing = false
      },
      areaEnd() {
        inArea = false
      },
      lineStart() {
        points = []
      },
      point(x: number, y: number) {
        const last = points[points.length - 1]
        if (!last || last[0] !== +x || last[1] !== +y) points.push([+x, +y])
      },
      lineEnd() {
        const [start] = points
        if (!start) return
        const path = curveRuns(points, interpolation)
        const drawn = inArea
          ? [start, ...path.flatMap((r) => r.slice(1))]
          : plot(`${seed}|${points.map((p) => p.join(",")).join(";")}`).through(
              path,
            )
        if (inArea && closing) context.lineTo(...start)
        else context.moveTo(...(drawn[0] ?? start))
        for (const p of drawn.slice(1)) context.lineTo(...p)
        if (inArea && closing) context.closePath()
        if (inArea) closing = !closing
      },
    }
  }
}

// ---- Points -------------------------------------------------------------------------------------------------------

type DotProps = {
  cx?: number
  cy?: number
  dataKey?: unknown
  index?: number
  value?: unknown
}

function DrawnDot({
  cx,
  cy,
  dataKey,
  index,
  value,
  active,
}: DotProps & { active?: boolean }) {
  const { config } = useChart()
  const key = typeof dataKey === "string" ? dataKey : undefined
  const mark = seriesMark(config, key)
  if (cx == null || cy == null) return null
  const r = (active ? 4.2 : 3) * (mark === "dotted" ? 0.75 : 1)
  const p = pen(`${String(dataKey)}:${index}:${String(value)}`, "calm")
  const c: Point = [cx, cy]
  const open = mark === "outline" || mark === "lined"
  return (
    <path
      className="fl-chart-dot"
      d={open ? p.ring(c, [r, 0]) : p.disc(c, [r, 0])}
      fill={open ? "var(--paper)" : ink(key)}
      stroke={ink(key)}
      strokeWidth={active ? 1.8 : 1.3}
      strokeLinecap="round"
    />
  )
}

/** A point for `<Line dot>`: an ink disc, a drawn ring or a small dot, by the series' mark. */
export function drawnDot(props: DotProps) {
  return <DrawnDot key={`${String(props.dataKey)}-${props.index}`} {...props} />
}

/** The hovered point for `<Line activeDot>`: the same mark, larger and pressed harder. */
export function drawnActiveDot(props: DotProps) {
  return <DrawnDot {...props} active />
}

// ---- Bars and slices ----------------------------------------------------------------------------------------------

function DrawnBar(props: BarShapeProps & { dataKey?: unknown }) {
  const { x = 0, y = 0, width = 0, height = 0, dataKey, index, value } = props
  const { config, chartId } = useChart()
  const key = typeof dataKey === "string" ? dataKey : "value"
  const mark = seriesMark(config, key)
  const x0 = Math.min(x, x + width)
  const y0 = Math.min(y, y + height)
  const w = Math.abs(width)
  const h = Math.abs(height)
  const seed = `${key}:${index}:${String(value)}`
  const d = React.useMemo(
    () =>
      w < 1 || h < 1
        ? null
        : cached(`${seed}|${snap(x0)},${snap(y0)},${snap(w)},${snap(h)}`, () =>
            plot(seed).edges([
              [x0, y0],
              [x0 + w, y0],
              [x0 + w, y0 + h],
              [x0, y0 + h],
            ]),
          ),
    [x0, y0, w, h, seed],
  )
  return (
    <g className="fl-chart-bar">
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill={markFill(chartId, key, mark)}
      />
      {d && (
        <path
          d={d}
          fill="none"
          stroke={ink(key)}
          strokeWidth={1.35}
          strokeLinecap="round"
        />
      )}
    </g>
  )
}

/** A bar for `<Bar shape>`: the exact rectangle filled in the series' mark, outlined by the pen. */
export function drawnBar(props: BarShapeProps) {
  return <DrawnBar {...props} />
}

const RADIAN = Math.PI / 180
const at = (cx: number, cy: number, r: number, angle: number): Point => [
  cx + Math.cos(-RADIAN * angle) * r,
  cy + Math.sin(-RADIAN * angle) * r,
]
function arcRun(cx: number, cy: number, r: number, a0: number, a1: number) {
  const steps = Math.max(2, Math.round(snap((Math.abs(a1 - a0) * r) / 220)))
  return Array.from({ length: steps + 1 }, (_, i) =>
    at(cx, cy, r, a0 + ((a1 - a0) * i) / steps),
  )
}

function DrawnSector(props: PieSectorShapeProps) {
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0 } = props
  const { startAngle = 0, endAngle = 0, name, value, isActive } = props
  const { config, chartId } = useChart()
  const key = getPayloadConfigKey(config, props, "name") ?? String(name)
  const mark = seriesMark(config, key)
  const seed = `${String(name)}:${String(value)}`
  const d = React.useMemo(() => {
    const span =
      Math.sign(endAngle - startAngle) *
      Math.min(Math.abs(endAngle - startAngle), 359.9)
    const end = startAngle + span
    if (Math.abs(span) < 0.5 || outerRadius < 1) return null
    const outer = arcRun(cx, cy, outerRadius, startAngle, end)
    const inner =
      innerRadius > 0
        ? arcRun(cx, cy, innerRadius, end, startAngle)
        : [[cx, cy] as Point]
    const close = [inner[inner.length - 1]!, outer[0]!]
    return plot(seed).path([
      outer,
      [outer[outer.length - 1]!, inner[0]!],
      ...(inner.length > 1 ? [inner] : []),
      close,
    ])
  }, [cx, cy, innerRadius, outerRadius, startAngle, endAngle, seed])
  return (
    <g className="fl-chart-sector">
      <Sector {...props} fill={markFill(chartId, key, mark)} stroke="none" />
      {d && (
        <path
          d={d}
          fill="none"
          stroke={ink(key)}
          strokeWidth={isActive ? 2.2 : 1.35}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  )
}

/** A slice for `<Pie shape>`: the exact sector filled in its mark, outlined by the pen, pressed harder when active. */
export function drawnSector(props: PieSectorShapeProps) {
  return <DrawnSector {...props} />
}
