"use client"

import { Fragment } from "react"
import { kroner } from "@/fineliner/blocks/dashboard-01-parts"
import { Separator } from "@/fineliner/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"

// The dashboard's lists, usable on their own: a ledger of the records on hold, and the next sessions in the room
// grouped by day.

export interface Hold {
  /** Catalogue number, LR-0000. */
  id: string
  title: string
  artist: string
  /** Who it is held for. */
  guest: string
  /** Until when: "Thu 5 Nov". */
  until: string
  /** Price in kroner. */
  price: number
  /** A page for the record; its title links there. */
  href?: string
}

/**
 * Records on hold: what, for whom and until when, and the price. In a table narrower than 20rem (a 320px phone) the
 * guest and date move under the record, so no column is squeezed to a word a line.
 */
export function HoldsTable({ holds }: { holds: Hold[] }) {
  const until = (hold: Hold) => (
    <>
      until <span className="whitespace-nowrap">{hold.until}</span>
    </>
  )
  return (
    <div className="@container/holds">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Record</TableHead>
            <TableHead className="@max-[20rem]/holds:hidden">
              Held for
            </TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holds.map((hold) => (
            <TableRow key={hold.id}>
              <TableCell className="whitespace-normal">
                {hold.href ? <a href={hold.href}>{hold.title}</a> : hold.title}
                <span className="block text-small leading-small text-pen-quiet">
                  {hold.artist}
                </span>
                <span className="block text-small leading-small text-pen-quiet @min-[20rem]/holds:hidden">
                  For {hold.guest},{" "}
                  <span className="whitespace-nowrap">until {hold.until}</span>
                </span>
              </TableCell>
              <TableCell className="whitespace-normal @max-[20rem]/holds:hidden">
                {hold.guest}
                <span className="block text-small leading-small text-pen-quiet">
                  {until(hold)}
                </span>
              </TableCell>
              <TableCell className="text-right font-type text-small">
                {kroner(hold.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export interface NextSession {
  id: string
  /** The day it falls on, as its group's heading: "Today", "Tuesday 3 November". */
  day: string
  /** Start, HH:MM. */
  start: string
  minutes: number
  guest: string
  party: number
}

const length = (minutes: number) =>
  minutes % 60
    ? minutes > 60
      ? `${Math.floor(minutes / 60)} h ${minutes % 60} min`
      : `${minutes} min`
    : `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}`

/** The next sessions in the room, grouped under their day: start time in the typewriter, the guest, how long and how many. */
export function NextSessions({ sessions }: { sessions: NextSession[] }) {
  const days = [...new Set(sessions.map((s) => s.day))]
  if (!days.length)
    return (
      <p className="m-0 text-small leading-small text-pen-quiet">
        Nothing booked yet.
      </p>
    )
  return (
    <div className="flex flex-col gap-hair">
      {days.map((day, i) => (
        <Fragment key={day}>
          {i > 0 && <Separator className="text-pen-faint" />}
          <section aria-label={day}>
            <h3 className="label m-0 text-pen-quiet">{day}</h3>
            <ul className="m-0 mt-hair flex list-none flex-col gap-tight p-0">
              {sessions
                .filter((s) => s.day === day)
                .map((s) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-tight"
                  >
                    <span className="font-type text-small">{s.start}</span>
                    <span className="min-w-0">
                      <span className="block text-ui leading-ui">
                        {s.guest}
                      </span>
                      <span className="block text-small leading-small text-pen-quiet">
                        {length(s.minutes)} · {s.party}{" "}
                        {s.party === 1 ? "guest" : "guests"}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        </Fragment>
      ))}
    </div>
  )
}
