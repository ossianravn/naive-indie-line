// Listening Room's demo data: a small record shop with a listening room at the back, in the first week of November.
// Static, so every visit starts the same; changes made in the demo live in memory and reset on reload. Every record
// and artist is made up. The demo clock is fixed at Monday 2 November 2026.

export type Status = "racks" | "held" | "sold"
export type Condition = "M" | "NM" | "VG+" | "VG" | "G"
export type Format = "LP" | "2×LP" | "12″" | "7″"

/** One record in the shop's catalogue. (Not "Record", which TypeScript already uses.) */
export interface Release {
  /** Catalogue number, LR-0000. */
  id: string
  title: string
  artist: string
  label: string
  year: number
  format: Format
  genre: string
  condition: Condition
  /** Price in Danish kroner. */
  price: number
  status: Status
  note: string
}

export const STATUS_LABEL: Record<Status, string> = {
  racks: "In the racks",
  held: "On hold",
  sold: "Sold",
}

export const CONDITION_LABEL: Record<Condition, string> = {
  M: "Mint",
  NM: "Near mint",
  "VG+": "Very good plus",
  VG: "Very good",
  G: "Good",
}

export const FORMATS: Format[] = ["LP", "2×LP", "12″", "7″"]

export const GENRES = [
  "Ambient",
  "Bossa",
  "City pop",
  "Dub",
  "Folk",
  "Highlife",
  "Jazz",
  "Kraut",
  "Library",
  "Pop",
  "Post-punk",
  "Soul",
] as const

const r = (
  n: number,
  title: string,
  artist: string,
  label: string,
  year: number,
  format: Format,
  genre: string,
  condition: Condition,
  price: number,
  status: Status,
  note = "",
): Release => ({
  id: `LR-${String(n).padStart(4, "0")}`,
  title,
  artist,
  label,
  year,
  format,
  genre,
  condition,
  price,
  status,
  note,
})

// prettier-ignore
export const RELEASES: Release[] = [
  r(431, "Harbour Lights", "Ellen Moe Trio", "Nordlys", 1968, "LP", "Jazz", "VG+", 320, "racks", "First pressing; a whisper of surface noise on side two."),
  r(430, "Slow Weather", "The Quiet Arcade", "Fen Records", 1979, "LP", "Folk", "NM", 240, "racks"),
  r(429, "Paper Moons", "Odile & the Lanterns", "Rue Verte", 1971, "LP", "Folk", "VG", 180, "held", "Held for Jonas until Saturday."),
  r(428, "Low Tide Dub", "Kingsway Sound System", "Kingsway", 1982, "12″", "Dub", "VG+", 150, "racks"),
  r(427, "Music for Waiting Rooms", "Ana Lindqvist", "Halo", 1984, "LP", "Ambient", "NM", 280, "racks", "Plays beautifully in the listening room."),
  r(426, "Copper Sun", "Marcus Bell Quintet", "Meridian", 1966, "LP", "Jazz", "VG", 260, "sold"),
  r(425, "Night Ferry", "Saltwater Choir", "Brine", 1975, "7″", "Soul", "VG+", 90, "racks"),
  r(424, "Studies in Blue Light", "Library Ensemble Nº 4", "Archive Sound", 1973, "LP", "Library", "VG+", 340, "racks", "Promo copy, white label."),
  r(423, "Rain on Tin", "Mabel Okafor", "Southgate", 1977, "LP", "Soul", "VG", 220, "held", "Held for Ama until Saturday."),
  r(422, "Autobahn Gardens", "Kreis", "Kreislauf", 1974, "LP", "Kraut", "VG+", 300, "racks"),
  r(421, "Samba de Papel", "Lúcia Prado", "Mar Azul", 1965, "LP", "Bossa", "VG", 240, "racks"),
  r(420, "Second Breakfast", "The Allotments", "Trowel", 1969, "7″", "Pop", "G", 40, "racks", "Plays through; the sleeve is taped."),
  r(419, "Field Hum", "Tove Aske", "Halo", 2019, "2×LP", "Ambient", "M", 360, "racks", "Still sealed."),
  r(418, "Lantern Street", "Roy Mensah & His Highlifers", "Gold Coast", 1972, "LP", "Highlife", "VG+", 290, "racks"),
  r(417, "Velvet Hours", "The Delphines", "Southgate", 1968, "LP", "Soul", "VG+", 260, "sold"),
  r(416, "Pine & Smoke", "Hollow Pines", "Fen Records", 1981, "LP", "Folk", "NM", 200, "racks"),
  r(415, "Ostinato", "Brun/Halvorsen Duo", "Nordlys", 1976, "LP", "Jazz", "VG", 210, "racks"),
  r(414, "Neon Orchard", "Satoko Ishii", "Kasumi", 1986, "LP", "City pop", "NM", 420, "held", "Held for Rosa; she is coming in on Thursday."),
  r(413, "Weekend in Ruins", "Glass Canal", "Concrete", 1983, "12″", "Post-punk", "VG+", 140, "racks"),
  r(412, "A Room to Listen In", "Various artists", "Listening Room", 2024, "2×LP", "Library", "M", 300, "racks", "Our own compilation; the money goes to the Thursday nights."),
]

/** The next free catalogue number. */
export const nextNumber = (list: Release[]) =>
  list.reduce((top, item) => Math.max(top, Number(item.id.slice(3)) || 0), 0) +
  1

export const catalogueNumber = (n: number) => `LR-${String(n).padStart(4, "0")}`

const count = new Intl.NumberFormat("en-GB")

/** A count with thousands separators: 1,204. */
export const tally = (n: number) => count.format(n)

/** A price in kroner: 320 kr. */
export const kroner = (n: number) => `${count.format(n)} kr`

export const recordsWord = (n: number) => (n === 1 ? "record" : "records")
