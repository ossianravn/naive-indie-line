import "@/fineliner/pen/objects"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/fineliner/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/fineliner/ui/empty"
import { Toaster } from "@/fineliner/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"
import { BookSession } from "./book-session"
import { Evenings } from "./evenings"
import { PageHeader, ShellPage } from "./page"
import {
  SESSIONS,
  SESSION_STATUS,
  TODAY,
  endOf,
  longDay,
  recordsOf,
  shortDay,
  type Session,
} from "./sessions-data"

type Show = "today" | "week" | "all"

const SHOW: [Show, string][] = [
  ["today", "Today"],
  ["week", "This week"],
  ["all", "Everything booked"],
]
const WEEK_END = "2026-11-08"
const BADGE = {
  booked: "outline",
  arrived: "default",
  cancelled: "secondary",
} as const

/** When a session runs; the day too, unless the list shows only today. */
const when = (s: Session, show: Show) =>
  `${show === "today" ? "" : `${shortDay(s.date)} `}${s.start}–${endOf(s)}`

/** The records a session asked for, by title. */
const asked = (s: Session) =>
  recordsOf(s)
    .map((r) => r.title)
    .join(", ") || "Their own choice"

/** Listening Room's sessions: who has the room when, booking it, and the Thursday evenings. */
export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS)
  const [show, setShow] = useState<Show>("today")
  const [next, setNext] = useState(116)

  const shown = useMemo(
    () =>
      sessions
        .filter((s) =>
          show === "today"
            ? s.date === TODAY
            : show === "week"
              ? s.date <= WEEK_END
              : true,
        )
        .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)),
    [sessions, show],
  )

  const book = (session: Session) => {
    setSessions((list) => [...list, session])
    setNext((n) => n + 1)
    toast.success(`${session.guest} has the room`, {
      description: `${longDay(session.date)}, ${session.start}–${endOf(session)}`,
    })
  }

  const today = sessions.filter(
    (s) => s.date === TODAY && s.status !== "cancelled",
  ).length

  return (
    <ShellPage>
      <PageHeader
        kicker={`${longDay(TODAY)} · ${today} ${today === 1 ? "session" : "sessions"} today`}
        title="Sessions"
        action={<BookSession onBook={book} next={next} />}
      />

      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[show]}
        onValueChange={(v) => v[0] && setShow(v[0] as Show)}
        aria-label="Show"
        className="mt-line"
      >
        {SHOW.map(([value, label]) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {shown.length ? (
        <>
          {/* The table's cells keep their padding; pulling it into the gutter puts its first column on the heading's edge. */}
          <div className="-mx-tight mt-snug max-w-[calc(52rem+2*var(--spacing-tight))] max-md:hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">When</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead className="w-20 text-right">Seats</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-type text-small whitespace-nowrap">
                      {when(s, show)}
                    </TableCell>
                    <TableCell>{s.guest}</TableCell>
                    <TableCell className="text-right font-type text-small tabular-nums">
                      {s.party}
                    </TableCell>
                    <TableCell className="text-small text-pen-quiet">
                      {asked(s)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={BADGE[s.status]}>
                        {SESSION_STATUS[s.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="m-0 mt-snug list-none p-0 md:hidden [&>li]:border-b [&>li]:border-dotted [&>li]:border-pen-faint">
            {shown.map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-snug gap-y-hair py-tight"
              >
                <p className="m-0 min-w-0 leading-subhead font-medium">
                  {s.guest}
                </p>
                <Badge variant={BADGE[s.status]}>
                  {SESSION_STATUS[s.status]}
                </Badge>
                <p className="col-span-2 m-0 text-small leading-small text-pen-quiet">
                  <span className="font-type whitespace-nowrap text-pen">
                    {when(s, show)}
                  </span>{" "}
                  · {s.party} {s.party === 1 ? "seat" : "seats"} · {asked(s)}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Empty className="mt-section">
          <EmptyHeader>
            <EmptyMedia object="armchair" seed={`empty-room-${show}`} />
            <EmptyTitle>The room is free</EmptyTitle>
            <EmptyDescription>Nobody has booked it yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <Evenings />
      <Toaster />
    </ShellPage>
  )
}
