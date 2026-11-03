import type { ChartConfig } from "@/fineliner/ui/chart"
import { RELEASES, type Release } from "./data"
import {
  EVENINGS,
  ROOM_SEATS,
  SESSIONS,
  TODAY,
  shortDay,
} from "./sessions-data"

// The Overview's numbers, computed from the same records and sessions the Catalogue and Sessions screens show, so
// the totals agree everywhere. Nothing here is typed in by hand.

const inRacks = (r: Release) => r.status !== "sold"

/** Records still in the shop (in the racks or on hold), by genre, with their value at the asking price. */
export function byGenre(releases: Release[] = RELEASES) {
  const rows = new Map<
    string,
    { genre: string; count: number; value: number }
  >()
  for (const r of releases.filter(inRacks)) {
    const row = rows.get(r.genre) ?? { genre: r.genre, count: 0, value: 0 }
    row.count += 1
    row.value += r.price
    rows.set(r.genre, row)
  }
  return [...rows.values()].sort(
    (a, b) =>
      b.count - a.count || b.value - a.value || a.genre.localeCompare(b.genre),
  )
}

/** The three largest genres and everything else, as donut slices. */
export function genreSlices(releases: Release[] = RELEASES) {
  const rows = byGenre(releases)
  const top = rows.slice(0, 3).map((r) => ({ genre: r.genre, count: r.count }))
  const rest = rows.slice(3).reduce((sum, r) => sum + r.count, 0)
  return rest ? [...top, { genre: "Everything else", count: rest }] : top
}

export const sliceConfig = (slices: { genre: string }[]): ChartConfig =>
  Object.fromEntries(slices.map((s) => [s.genre, { label: s.genre }]))

/** The fortnight from the demo clock, every day of it, as ISO dates. */
export const FORTNIGHT = Array.from({ length: 14 }, (_, i) =>
  new Date(Date.parse(`${TODAY}T00:00:00Z`) + i * 86_400_000)
    .toISOString()
    .slice(0, 10),
)

/** Every day of the fortnight, empty ones too: people booked and people who cancelled. */
export function sessionDays() {
  return FORTNIGHT.map((date) => {
    const of = SESSIONS.filter((s) => s.date === date)
    return {
      day: shortDay(date).replace(/ \w+$/u, ""),
      booked: of
        .filter((s) => s.status !== "cancelled")
        .reduce((sum, s) => sum + s.party, 0),
      cancelled: of
        .filter((s) => s.status === "cancelled")
        .reduce((sum, s) => sum + s.party, 0),
    }
  })
}

export const sessionConfig = {
  booked: { label: "Guests booked" },
  cancelled: { label: "Cancelled" },
} satisfies ChartConfig

/** Thursday evenings: seats taken against the twelve. */
export const eveningFill = () =>
  EVENINGS.map((e) => ({
    night: shortDay(e.date).replace(/^\w+ /u, ""),
    taken: e.taken,
    free: e.seats - e.taken,
  }))

export const eveningConfig = {
  taken: { label: "Seats taken" },
  free: { label: "Seats free" },
} satisfies ChartConfig

/** The headline figures. */
export function totals(releases: Release[] = RELEASES) {
  const shop = releases.filter(inRacks)
  const live = SESSIONS.filter((s) => s.status !== "cancelled")
  return {
    records: shop.length,
    value: shop.reduce((sum, r) => sum + r.price, 0),
    held: releases.filter((r) => r.status === "held").length,
    sold: releases.filter((r) => r.status === "sold").length,
    sessions: live.length,
    guests: live.reduce((sum, s) => sum + s.party, 0),
    roomHours: live.reduce((sum, s) => sum + s.minutes, 0) / 60,
    roomSeats: ROOM_SEATS,
    eveningSeats: EVENINGS.reduce((sum, e) => sum + e.taken, 0),
    eveningCapacity: EVENINGS.reduce((sum, e) => sum + e.seats, 0),
  }
}
