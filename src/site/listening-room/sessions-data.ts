import { RELEASES, type Release } from "./data"

// Bookings for the listening room and the Thursday evenings, for the fortnight from Monday 2 November 2026 (the demo
// clock). The room seats four at the back of the shop; Thursday evenings take twelve. Made up, and static.

export type SessionStatus = "booked" | "arrived" | "cancelled"

export interface Session {
  id: string
  /** Local date, ISO 8601. */
  date: string
  start: string
  minutes: 30 | 60 | 90
  guest: string
  party: number
  /** Catalogue numbers of the records asked for. */
  records: string[]
  status: SessionStatus
}

export interface Evening {
  date: string
  title: string
  host: string
  seats: number
  taken: number
  note: string
}

export const SESSION_STATUS: Record<SessionStatus, string> = {
  booked: "Booked",
  arrived: "Arrived",
  cancelled: "Cancelled",
}

export const TODAY = "2026-11-02"
export const ROOM_SEATS = 4

const s = (
  n: number,
  date: string,
  start: string,
  minutes: Session["minutes"],
  guest: string,
  party: number,
  records: number[],
  status: SessionStatus = "booked",
): Session => ({
  id: `S-${String(n).padStart(3, "0")}`,
  date,
  start,
  minutes,
  guest,
  party,
  records: records.map((r) => `LR-${String(r).padStart(4, "0")}`),
  status,
})

// prettier-ignore
export const SESSIONS: Session[] = [
  s(101, "2026-11-02", "11:30", 60, "Rosa Lindgren", 2, [414, 427], "arrived"),
  s(102, "2026-11-02", "14:00", 30, "Jonas Berg", 1, [429]),
  s(103, "2026-11-02", "16:00", 60, "Ama Owusu", 3, [423, 417, 425]),
  s(104, "2026-11-03", "12:00", 90, "Lukas Brandt", 2, [422, 413]),
  s(105, "2026-11-03", "15:30", 30, "Ingrid Sæther", 1, [431]),
  s(106, "2026-11-04", "11:00", 60, "Tomás Ferreira", 2, [421, 418]),
  s(107, "2026-11-04", "13:30", 60, "Hana Kobayashi", 1, [414], "cancelled"),
  s(108, "2026-11-05", "11:30", 30, "Peter Lund", 1, [428]),
  s(109, "2026-11-05", "14:00", 60, "Rosa Lindgren", 4, [414, 419, 427]),
  s(110, "2026-11-06", "12:30", 60, "Selma Ahmed", 2, [416, 430]),
  s(111, "2026-11-07", "11:00", 90, "Jonas Berg", 3, [431, 415, 426]),
  s(112, "2026-11-07", "15:00", 60, "Ama Owusu", 2, [423]),
  s(113, "2026-11-10", "13:00", 30, "Oskar Nyberg", 1, [420]),
  s(114, "2026-11-12", "12:00", 60, "Freya Holm", 2, [412, 424]),
  s(115, "2026-11-14", "14:30", 60, "Lukas Brandt", 4, [413, 422]),
]

export const EVENINGS: Evening[] = [
  {
    date: "2026-11-05",
    title: "Blue Note night",
    host: "Ellen Moe",
    seats: 12,
    taken: 12,
    note: "Full; a waiting list of three.",
  },
  {
    date: "2026-11-12",
    title: "Folk from the crates",
    host: "Jonas Berg",
    seats: 12,
    taken: 7,
    note: "Bring a record you found in a bin.",
  },
  {
    date: "2026-11-19",
    title: "Listening club: Field Hum",
    host: "Tove Aske",
    seats: 12,
    taken: 9,
    note: "The whole record, both sides, lights low.",
  },
  {
    date: "2026-11-26",
    title: "City pop and wine",
    host: "Maya Singh",
    seats: 12,
    taken: 4,
    note: "With a natural wine from the list.",
  },
]

const BY_ID = new Map(RELEASES.map((r) => [r.id, r]))

/** The records a session asked for, in the order asked. */
export const recordsOf = (session: Session): Release[] =>
  session.records.flatMap((id) => BY_ID.get(id) ?? [])

/** The time a session ends, as HH:MM. */
export function endOf(session: Session) {
  const [h = 0, m = 0] = session.start.split(":").map(Number)
  const total = h * 60 + m + session.minutes
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
})
const LONG_DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
})

/** "Thu 5 Nov", from an ISO date. */
export const shortDay = (iso: string) =>
  DAY.format(new Date(`${iso}T00:00:00Z`))
/** "Thursday 5 November", from an ISO date. */
export const longDay = (iso: string) =>
  LONG_DAY.format(new Date(`${iso}T00:00:00Z`))

/** The ISO date of a calendar day picked in the browser's local time. */
export const isoOf = (day: Date) =>
  `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
