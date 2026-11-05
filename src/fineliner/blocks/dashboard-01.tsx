"use client"

import { cn } from "@/fineliner/lib/utils"
import {
  HoldsTable,
  NextSessions,
  type Hold,
  type NextSession,
} from "@/fineliner/blocks/dashboard-01-lists"
import {
  Figure,
  GuestsChart,
  Panel,
  type GuestDay,
} from "@/fineliner/blocks/dashboard-01-parts"

// The shop's week at a glance: four figures in the typewriter, guests in the room as bars drawn by the pen, a ledger
// of the records on hold and the next sessions in the room. Pass your own data, shaped like SAMPLE; the layout
// follows the width of its container, so it works beside a sidebar as well as on a whole page.

export const meta = {
  title: "Dashboard",
  description:
    "The shop's week: four figures in the typewriter, guests by day drawn by the pen, the records on hold and the next sessions.",
}

export interface Dashboard01Data {
  /** The period the figures cover, under the title. */
  period: string
  figures: { label: string; value: string; note: string }[]
  guests: { title: string; note: string; days: GuestDay[] }
  holds: { title: string; note: string; rows: Hold[] }
  sessions: { title: string; note: string; rows: NextSession[] }
}

/** Listening Room on Monday 2 November 2026: the fortnight's bookings and the records in the shop. */
export const SAMPLE: Dashboard01Data = {
  period: "The first week of November",
  figures: [
    { label: "In the shop", value: "18", note: "3 on hold, 2 sold" },
    {
      label: "At asking price",
      value: "4,320 kr",
      note: "Records not yet sold",
    },
    {
      label: "Sessions booked",
      value: "14",
      note: "30 guests, 13 hours in the room",
    },
    {
      label: "Thursday seats",
      value: "32 of 48",
      note: "Four evenings in November",
    },
  ],
  guests: {
    title: "Guests in the room",
    note: "By day, the fortnight from Monday 2 November",
    days: [
      { day: "Mon 2", booked: 6, cancelled: 0 },
      { day: "Tue 3", booked: 3, cancelled: 0 },
      { day: "Wed 4", booked: 2, cancelled: 1 },
      { day: "Thu 5", booked: 5, cancelled: 0 },
      { day: "Fri 6", booked: 2, cancelled: 0 },
      { day: "Sat 7", booked: 5, cancelled: 0 },
      { day: "Tue 10", booked: 1, cancelled: 0 },
      { day: "Thu 12", booked: 2, cancelled: 0 },
      { day: "Sat 14", booked: 4, cancelled: 0 },
    ],
  },
  holds: {
    title: "On hold",
    note: "Records kept behind the counter",
    rows: [
      {
        id: "LR-0414",
        title: "Neon Orchard",
        artist: "Satoko Ishii",
        guest: "Maya Singh",
        until: "Thu 5 Nov",
        price: 420,
      },
      {
        id: "LR-0429",
        title: "Paper Moons",
        artist: "Odile & the Lanterns",
        guest: "Jonas Berg",
        until: "Thu 5 Nov",
        price: 180,
      },
      {
        id: "LR-0423",
        title: "Rain on Tin",
        artist: "Mabel Okafor",
        guest: "Ama Owusu",
        until: "Sat 7 Nov",
        price: 220,
      },
    ],
  },
  sessions: {
    title: "Next in the room",
    note: "The room seats four",
    // prettier-ignore
    rows: [
      { id: "S-102", day: "Today", start: "14:00", minutes: 30, guest: "Jonas Berg", party: 1 },
      { id: "S-103", day: "Today", start: "16:00", minutes: 60, guest: "Ama Owusu", party: 3 },
      { id: "S-104", day: "Tuesday 3 November", start: "12:00", minutes: 90, guest: "Lukas Brandt", party: 2 },
      { id: "S-105", day: "Tuesday 3 November", start: "15:30", minutes: 30, guest: "Ingrid Sæther", party: 1 },
      { id: "S-106", day: "Wednesday 4 November", start: "11:00", minutes: 60, guest: "Tomás Ferreira", party: 2 },
      { id: "S-108", day: "Thursday 5 November", start: "11:30", minutes: 30, guest: "Peter Lund", party: 1 },
    ],
  },
}

export interface Dashboard01Props {
  data?: Dashboard01Data
  title?: string
  className?: string
}

export function Dashboard01({
  data = SAMPLE,
  title = "Overview",
  className,
}: Dashboard01Props) {
  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[72rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <h1 className="m-0 text-h1">{title}</h1>
        <p className="m-0 mt-hair max-w-measure text-lead leading-subhead text-pen-quiet">
          {data.period}
        </p>

        <section
          aria-label="Figures"
          className="mt-line grid grid-cols-2 gap-line @min-[56rem]:grid-cols-4 @min-[56rem]:gap-x-section"
        >
          {data.figures.map((figure) => (
            <Figure key={figure.label} {...figure} />
          ))}
        </section>

        <div className="mt-section grid gap-section @min-[56rem]:grid-cols-[minmax(0,1fr)_18rem] @min-[56rem]:gap-x-page">
          <Panel title={data.guests.title} note={data.guests.note}>
            <GuestsChart days={data.guests.days} />
          </Panel>
          <Panel
            title={data.sessions.title}
            note={data.sessions.note}
            className="@min-[56rem]:col-start-2 @min-[56rem]:row-span-2 @min-[56rem]:row-start-1"
          >
            <NextSessions sessions={data.sessions.rows} />
          </Panel>
          <Panel title={data.holds.title} note={data.holds.note}>
            <HoldsTable holds={data.holds.rows} />
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default Dashboard01
