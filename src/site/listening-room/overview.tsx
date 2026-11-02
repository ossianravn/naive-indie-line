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
import { kroner, tally } from "./data"
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
  children,
}: {
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <section className="min-w-0">
      <h2 className="m-0 text-lead leading-subhead font-medium">{title}</h2>
      <p className="m-0 text-small leading-small text-pen-quiet">{note}</p>
      <div className="mt-tight">{children}</div>
    </section>
  )
}

/** Listening Room's overview: the shop in figures, charts and one table, all from the same records and sessions. */
export function Overview() {
  const t = totals()
  const slices = genreSlices()
  const genres = byGenre()
  return (
    <div className="mx-auto w-full max-w-[72rem] px-snug pt-section pb-page sm:px-line">
      <p className="label m-0 text-pen-quiet">
        The shop · first week of November
      </p>
      <h1 className="m-0 mt-hair text-h1">Overview</h1>

      <div className="mt-line grid grid-cols-2 gap-x-section gap-y-line md:grid-cols-4">
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

      <div className="mt-section grid gap-x-section gap-y-section lg:grid-cols-2">
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
        <Panel
          title="Guests in the room"
          note="By day, the fortnight from Monday 2 November"
        >
          <ChartContainer config={sessionConfig} className={CHART}>
            <BarChart accessibilityLayer data={sessionDays()} margin={margin}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} tickMargin={8} />
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
        <Panel title="Genres" note="Records in the shop and their value">
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
        </Panel>
      </div>
    </div>
  )
}
