import type { ChartConfig } from "@/fineliner/ui/chart"

// Listening Room's numbers for the chart demo: the week up to Sunday 1 November 2026 and the autumn before it. Made
// up, but consistent: the format split adds up to each day's sales, and the genre donut to the catalogue.

export const week = [
  { day: "Mon 26", sold: 6, lp: 4, single: 1, twelve: 1 },
  { day: "Tue 27", sold: 9, lp: 6, single: 2, twelve: 1 },
  { day: "Wed 28", sold: 7, lp: 5, single: 1, twelve: 1 },
  { day: "Thu 29", sold: 18, lp: 11, single: 4, twelve: 3 },
  { day: "Fri 30", sold: 12, lp: 8, single: 3, twelve: 1 },
  { day: "Sat 31", sold: 21, lp: 14, single: 4, twelve: 3 },
  { day: "Sun 1", sold: 8, lp: 6, single: 1, twelve: 1 },
]
export const weekTotal = week.reduce((sum, d) => sum + d.sold, 0)

export const soldConfig = {
  sold: { label: "Records sold" },
} satisfies ChartConfig

export const formatConfig = {
  lp: { label: "LP" },
  single: { label: "7″" },
  twelve: { label: "12″" },
} satisfies ChartConfig

/** Listening sessions booked and seats taken on Thursday evenings, week by week. */
export const autumn = [
  { week: "7 Sep", sessions: 14, thursday: 19 },
  { week: "14 Sep", sessions: 17, thursday: 22 },
  { week: "21 Sep", sessions: 15, thursday: 18 },
  { week: "28 Sep", sessions: 21, thursday: 26 },
  { week: "5 Oct", sessions: 24, thursday: 24 },
  { week: "12 Oct", sessions: 22, thursday: 30 },
  { week: "19 Oct", sessions: 27, thursday: 28 },
  { week: "26 Oct", sessions: 31, thursday: 34 },
]

export const autumnConfig = {
  sessions: { label: "Sessions booked" },
  thursday: { label: "Thursday seats" },
} satisfies ChartConfig

/** Visitors on Thursday evenings, 3 September to 29 October. */
export const thursdays = [
  { night: "3 Sep", visitors: 22 },
  { night: "10 Sep", visitors: 26 },
  { night: "17 Sep", visitors: 24 },
  { night: "24 Sep", visitors: 31 },
  { night: "1 Oct", visitors: 29 },
  { night: "8 Oct", visitors: 38 },
  { night: "15 Oct", visitors: 35 },
  { night: "22 Oct", visitors: 41 },
  { night: "29 Oct", visitors: 47 },
]

export const thursdayConfig = {
  visitors: { label: "Visitors", mark: "dotted" },
} satisfies ChartConfig

export const genres = [
  { genre: "jazz", count: 412 },
  { genre: "soul", count: 287 },
  { genre: "folk", count: 196 },
  { genre: "other", count: 341 },
]
export const genreTotal = genres.reduce((sum, g) => sum + g.count, 0)

export const genreConfig = {
  jazz: { label: "Jazz" },
  soul: { label: "Soul" },
  folk: { label: "Folk" },
  other: { label: "Everything else" },
} satisfies ChartConfig

/** Sales by genre over the same week. */
export const byGenre = [
  { day: "Mon 26", jazz: 3, soul: 2, folk: 1 },
  { day: "Tue 27", jazz: 4, soul: 3, folk: 2 },
  { day: "Wed 28", jazz: 3, soul: 2, folk: 2 },
  { day: "Thu 29", jazz: 8, soul: 6, folk: 4 },
  { day: "Fri 30", jazz: 5, soul: 4, folk: 3 },
  { day: "Sat 31", jazz: 9, soul: 7, folk: 5 },
  { day: "Sun 1", jazz: 3, soul: 3, folk: 2 },
]

export const byGenreConfig = {
  jazz: { label: "Jazz" },
  soul: { label: "Soul" },
  folk: { label: "Folk" },
} satisfies ChartConfig
