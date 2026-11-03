import { seedOf } from "@/fineliner/pen"

// The bookings this visitor has made, kept for the visit in session storage so "Change a booking" can find them by
// their code, and one standing booking the page can always find. Nothing leaves the browser. A booking's code and
// number are seeded from what was booked, so the same booking always gets the same ones.

export interface Booked {
  day: Date
  time: string
  guests: string
  name: string
  email: string
}

const KEY = "maaltid-bookings"

/** The six-digit code sent with a booking, to change or cancel it. */
export const codeOf = (b: Booked) =>
  String(seedOf(`${b.email}:${b.day.toDateString()}:${b.time}`) % 1_000_000)
    .padStart(6, "0")
    .replace(/^0/, "1")

/** The booking's number in the book, for the ticket. */
export const numberOf = (b: Booked) => 300 + (seedOf(codeOf(b)) % 700)

export const dayName = (day: Date) =>
  day.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

/** A booking someone made before you came: the code the change dialog suggests. */
export const STANDING: Booked = {
  day: new Date(2026, 10, 6),
  time: "19:30",
  guests: "4",
  name: "Ingrid Holm",
  email: "ingrid@example.com",
}
export const STANDING_CODE = codeOf(STANDING)

function read(): Booked[] {
  try {
    const list = JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as Booked[]
    return list.map((b) => ({ ...b, day: new Date(b.day) }))
  } catch {
    return []
  }
}

function write(list: Booked[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // Blocked storage: the booking holds until the page is left.
  }
}

let cancelledStanding = false

export function addBooking(b: Booked) {
  write([...read().filter((x) => codeOf(x) !== codeOf(b)), b])
}

export function findBooking(code: string): Booked | undefined {
  if (code === STANDING_CODE && !cancelledStanding) return STANDING
  return read().find((b) => codeOf(b) === code)
}

/** Sent on window when a booking is cancelled, with its code, so a ticket on show can step down. */
export const CANCELLED = "maaltid:booking-cancelled"

export function cancelBooking(code: string) {
  if (code === STANDING_CODE) cancelledStanding = true
  write(read().filter((b) => codeOf(b) !== code))
  window.dispatchEvent(new CustomEvent(CANCELLED, { detail: code }))
}
