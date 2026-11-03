import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  drawnBar,
  type ChartConfig,
} from "@/fineliner/ui/chart"

const WEEK = [
  { day: "Mon", lp: 4, single: 1, twelve: 1 },
  { day: "Tue", lp: 6, single: 2, twelve: 1 },
  { day: "Wed", lp: 5, single: 1, twelve: 1 },
  { day: "Thu", lp: 11, single: 4, twelve: 3 },
  { day: "Fri", lp: 8, single: 3, twelve: 1 },
  { day: "Sat", lp: 14, single: 4, twelve: 3 },
]
const CONFIG = {
  lp: { label: "LP" },
  single: { label: "7″" },
  twelve: { label: "12″" },
} satisfies ChartConfig

/** The shop's week drawn by the pen: records sold by format, told apart by solid, outline and dotted marks. */
export function WeekScene() {
  return (
    <ChartContainer config={CONFIG} className="aspect-auto h-56 w-full">
      <BarChart
        accessibilityLayer
        data={WEEK}
        margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(CONFIG).map((key) => (
          <Bar key={key} dataKey={key} stackId="format" shape={drawnBar} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
