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

  return (
    <div className="mx-auto w-full max-w-[72rem] px-snug pt-section pb-page sm:px-line">
      <header className="flex flex-wrap items-end justify-between gap-snug">
        <div>
          <p className="label m-0 text-pen-quiet">
            The room · {longDay(TODAY)}
          </p>
          <h1 className="m-0 mt-hair text-h1">Sessions</h1>
        </div>
        <BookSession onBook={book} next={next} />
      </header>

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
        <Table className="mt-snug">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">When</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead className="w-20 text-right">Seats</TableHead>
              <TableHead className="max-md:hidden">Records</TableHead>
              <TableHead className="w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-type text-small whitespace-nowrap">
                  {show === "today" ? "" : `${shortDay(s.date)} `}
                  {s.start}–{endOf(s)}
                </TableCell>
                <TableCell>{s.guest}</TableCell>
                <TableCell className="text-right font-type text-small tabular-nums">
                  {s.party}
                </TableCell>
                <TableCell className="text-small text-pen-quiet max-md:hidden">
                  {recordsOf(s)
                    .map((r) => r.title)
                    .join(", ") || "Their own choice"}
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
    </div>
  )
}
