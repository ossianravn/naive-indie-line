"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  drawnBar,
  type ChartConfig,
} from "@/fineliner/ui/chart"

// The dashboard's parts, usable on their own: a headline figure in the typewriter, a panel with a title and one line
// on what it shows, and the week's guests as bars drawn by the pen.

// A fixed locale, so the server and every browser print the same digits.
const count = new Intl.NumberFormat("en-GB")

/** A price in kroner: 4,320 kr. */
export const kroner = (n: number) => `${count.format(n)} kr`

/**
 * A headline figure: what it counts in the label voice, the figure in the typewriter, one line of context. In a column
 * too narrow for "4,320 kr" at heading size (a 320px phone) the figure steps down a size.
 */
export function Figure({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="@container/figure min-w-0">
      <p className="label m-0 text-pen-quiet">{label}</p>
      <p className="m-0 mt-hair font-type text-lead leading-subhead tabular-nums @min-[9rem]/figure:text-h2">
        {value}
      </p>
      <p className="m-0 text-small leading-small text-pen-quiet">{note}</p>
    </div>
  )
}

/**
 * A section of the dashboard as a card: its title, one line on what it shows, then the chart, table or list. Open on
 * the page by default; framed when the page's containers are boxed.
 */
export function Panel({
  title,
  note,
  action,
  children,
  className,
}: {
  title: string
  note: string
  /** A link or button beside the title. */
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit]">
            {title}
          </h2>
        </CardTitle>
        <CardDescription>{note}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export interface GuestDay {
  /** The axis label: "Mon 2". */
  day: string
  booked: number
  cancelled: number
}

const guestsConfig = {
  booked: { label: "Guests booked" },
  cancelled: { label: "Cancelled" },
} satisfies ChartConfig

/** Guests in the room by day: those booked in solid ink, those who cancelled in outline on top. */
export function GuestsChart({ days }: { days: GuestDay[] }) {
  return (
    <ChartContainer config={guestsConfig} className="aspect-auto h-60 w-full">
      <BarChart
        accessibilityLayer
        data={days}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={8}
          // Recharts measures ticks in the page's default face; the typewriter is wider, so leave it room.
          minTickGap={16}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="booked" stackId="day" shape={drawnBar} />
        <Bar dataKey="cancelled" stackId="day" shape={drawnBar} />
      </BarChart>
    </ChartContainer>
  )
}
