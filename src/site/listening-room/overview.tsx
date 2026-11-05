import type { ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  drawnBar,
  drawnSector,
} from "@/fineliner/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { cn } from "@/fineliner/lib/utils"
import { kroner, tally } from "./data"
import { PageHeader, ShellPage } from "./page"
import {
  byGenre,
  eveningConfig,
  eveningFill,
  genreSlices,
  sessionConfig,
  sessionDays,
  sliceConfig,
  totals,
} from "./overview-data"

const CHART = "aspect-auto h-56 w-full"
const margin = { top: 8, right: 8, bottom: 0, left: 0 }

function Figure({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="min-w-0">
      <p className="label m-0 text-pen-quiet">{label}</p>
      <p className="m-0 mt-hair font-type text-h2 leading-subhead">{value}</p>
      <p className="m-0 text-small leading-small text-pen-quiet">{note}</p>
    </div>
  )
}

function Panel({
  title,
  note,
  className,
  children,
}: {
  title: string
  note: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="m-0 text-lead leading-subhead font-medium">{title}</h2>
      <p className="m-0 text-small leading-small text-pen-quiet">{note}</p>
      <div className="mt-tight">{children}</div>
    </section>
  )
}

/** A day of the fortnight as two short lines, its date over its weekday, so fourteen fit side by side on a phone. */
function DayTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value: string }
}) {
  const [weekday = "", date = ""] = (payload?.value ?? "").split(" ")
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="recharts-cartesian-axis-tick-value fill-pen-quiet font-type text-label"
    >
      <tspan x={x} dy="1em">
        {date}
      </tspan>
      <tspan x={x} dy="1.3em">
        {weekday.slice(0, 2)}
      </tspan>
    </text>
  )
}

/** Listening Room's overview: the shop in figures, charts and one table, all from the same records and sessions. */
export function Overview() {
  const t = totals()
  const slices = genreSlices()
  const genres = byGenre()
  return (
    <ShellPage>
      <PageHeader title="Overview" lede="The first week of November" />

      {/* Two columns that end together: the figures and the room on the left, the racks on the right. */}
      <div className="mt-line grid gap-x-section gap-y-section lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-section">
          <div className="grid grid-cols-2 gap-x-section gap-y-line md:grid-cols-4 lg:grid-cols-2">
            <Figure
              label="In the shop"
              value={tally(t.records)}
              note={`${t.held} on hold, ${t.sold} sold`}
            />
            <Figure
              label="At asking price"
              value={kroner(t.value)}
              note="Records not yet sold"
            />
            <Figure
              label="Sessions booked"
              value={tally(t.sessions)}
              note={`${t.guests} guests, ${t.roomHours} hours in the room`}
            />
            <Figure
              label="Thursday seats"
              value={`${t.eveningSeats} of ${t.eveningCapacity}`}
              note="Four evenings in November"
            />
          </div>
          <Panel
            title="Guests in the room"
            note="By day, the fortnight from Monday 2 November"
          >
            <ChartContainer config={sessionConfig} className={CHART}>
              <BarChart accessibilityLayer data={sessionDays()} margin={margin}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  interval={0}
                  height={44}
                  tick={<DayTick />}
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
          </Panel>
          <Panel title="Thursday evenings" note="Seats taken of twelve">
            <ChartContainer config={eveningConfig} className={CHART}>
              <BarChart accessibilityLayer data={eveningFill()} margin={margin}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="night" tickLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={28}
                  allowDecimals={false}
                  domain={[0, 12]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="taken" stackId="night" shape={drawnBar} />
                <Bar dataKey="free" stackId="night" shape={drawnBar} />
              </BarChart>
            </ChartContainer>
          </Panel>
        </div>
        <div className="flex min-w-0 flex-col gap-section">
          <Panel
            title="The racks by genre"
            note="Records in the shop, not yet sold"
          >
            <ChartContainer config={sliceConfig(slices)} className={CHART}>
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="genre" hideLabel />}
                />
                <Pie
                  data={slices}
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
                            {t.records}
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
          </Panel>
          <Panel title="Genres" note="Records in the shop and their value">
            <div className="-mx-tight">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Genre</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {genres.map((g) => (
                    <TableRow key={g.genre}>
                      <TableCell>{g.genre}</TableCell>
                      <TableCell className="text-right font-type text-small tabular-nums">
                        {g.count}
                      </TableCell>
                      <TableCell className="text-right font-type text-small tabular-nums">
                        {kroner(g.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>All</TableCell>
                    <TableCell className="text-right font-type text-small tabular-nums">
                      {t.records}
                    </TableCell>
                    <TableCell className="text-right font-type text-small tabular-nums">
                      {kroner(t.value)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Panel>
        </div>
      </div>
    </ShellPage>
  )
}
