import type { ReactNode } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  drawnActiveDot,
  drawnBar,
  drawnCurve,
  drawnDot,
  drawnSector,
} from "@/fineliner/ui/chart"
import { DemoSection, type DemoMeta } from "../demo-kit"
import * as data from "./chart/data"

export const meta: DemoMeta = {
  title: "Chart",
  description:
    "Recharts drawn with the page's one pen: strokes through the exact data points, series told apart by solid, outline and dotted marks.",
  item: "chart",
  group: "Charts",
}

// Curves are made once, so Recharts sees a stable `type`; each seed keeps a series' wobble its own.
const sessionsCurve = drawnCurve("monotone", "sessions")
const thursdayCurve = drawnCurve("monotone", "thursday")
const visitorsCurve = drawnCurve("monotone", "visitors")

const CHART = "aspect-auto h-60 w-full"
const margin = { top: 8, right: 8, bottom: 0, left: 0 }

function ChartCard({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-small leading-small text-pen-quiet">
        {footer}
      </CardFooter>
    </Card>
  )
}

const xAxis = (key: string) => (
  <XAxis
    dataKey={key}
    tickLine={false}
    tickMargin={8}
    interval="equidistantPreserveStart"
  />
)
const yAxis = (
  <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
)

export default function ChartDemo() {
  return (
    <>
      <DemoSection title="Bars">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="Records sold"
            description="Mon 26 Oct – Sun 1 Nov 2026"
            footer={`${data.weekTotal} records; the most on Saturday, the day after payday.`}
          >
            <ChartContainer config={data.soldConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sold" shape={drawnBar} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Sold by format"
            description="Stacked · same week"
            footer="Two in three records sold were LPs."
          >
            <ChartContainer config={data.formatConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(data.formatConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="format"
                    shape={drawnBar}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Lines and areas">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="The listening room"
            description="Week by week · 7 Sep – 26 Oct"
            footer="Sessions more than doubled since September."
          >
            <ChartContainer config={data.autumnConfig} className={CHART}>
              <LineChart accessibilityLayer data={data.autumn} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("week")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="sessions"
                  type={sessionsCurve}
                  stroke="var(--pen)"
                  strokeWidth={1.35}
                  dot={drawnDot}
                  activeDot={drawnActiveDot}
                />
                <Line
                  dataKey="thursday"
                  type={thursdayCurve}
                  stroke="var(--pen)"
                  strokeWidth={1.35}
                  dot={drawnDot}
                  activeDot={drawnActiveDot}
                />
              </LineChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Thursday evenings"
            description="Visitors · 3 Sep – 29 Oct"
            footer="47 on 29 October, the busiest Thursday yet."
          >
            <ChartContainer config={data.thursdayConfig} className={CHART}>
              <AreaChart
                accessibilityLayer
                data={data.thursdays}
                margin={margin}
              >
                <CartesianGrid vertical={false} />
                {xAxis("night")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="visitors"
                  type={visitorsCurve}
                  fill="var(--mark-visitors)"
                  fillOpacity={1}
                  stroke="var(--pen)"
                  strokeWidth={1.35}
                  dot={drawnDot}
                  activeDot={drawnActiveDot}
                />
              </AreaChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Donut, tooltip and legend">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="The catalogue by genre"
            description="Every record in the racks"
            footer="Jazz fills a third of the racks."
          >
            <ChartContainer config={data.genreConfig} className={CHART}>
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="genre" hideLabel />}
                />
                <Pie
                  data={data.genres}
                  dataKey="count"
                  nameKey="genre"
                  innerRadius="58%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                  shape={drawnSector}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null
                      const { cx = 0, cy = 0 } = viewBox
                      return (
                        <text x={cx} y={cy} textAnchor="middle">
                          <tspan
                            x={cx}
                            y={cy + 4}
                            className="fill-pen font-type text-h2"
                          >
                            {data.genreTotal.toLocaleString("en-GB")}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 24}
                            className="fill-pen-quiet font-read text-small"
                          >
                            records
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="genre" />} />
              </PieChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Sold by genre"
            description="Tooltip held open on Thursday"
            footer="Thursday's listening evening sold as much as Friday and Monday together."
          >
            <ChartContainer config={data.byGenreConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.byGenre} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip
                  defaultIndex={3}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent verticalAlign="top" />}
                />
                {Object.keys(data.byGenreConfig).map((key) => (
                  <Bar key={key} dataKey={key} shape={drawnBar} />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>
    </>
  )
}
