import { prng } from "@/fineliner/pen/seed"
import type { Condition, Format } from "@/site/listening-room/data"

// Two hundred lines of the shop's stock book for the long-table demo, drawn from a seed so every build and every
// browser prints the same rows. Every record and artist is made up.

const FIRST = [
  "Slow",
  "Paper",
  "Low",
  "Night",
  "Copper",
  "Velvet",
  "Quiet",
  "Blue",
  "Rain",
  "Neon",
  "Pine",
  "Salt",
  "Glass",
  "Field",
  "Lantern",
  "Harbour",
] as const
const SECOND = [
  "Weather",
  "Moons",
  "Tide",
  "Ferry",
  "Sun",
  "Hours",
  "Rooms",
  "Light",
  "Gardens",
  "Orchard",
  "Street",
  "Hum",
  "Canal",
  "Smoke",
  "Letters",
] as const
const ARTISTS = [
  "Ellen Moe Trio",
  "The Quiet Arcade",
  "Odile & the Lanterns",
  "Kingsway Sound System",
  "Ana Lindqvist",
  "Marcus Bell Quintet",
  "Saltwater Choir",
  "Mabel Okafor",
  "Kreis",
  "Lúcia Prado",
  "Tove Aske",
  "Roy Mensah & His Highlifers",
  "Hollow Pines",
  "Satoko Ishii",
  "Glass Canal",
  "Brun/Halvorsen Duo",
] as const
const FORMATS: Format[] = ["LP", "LP", "LP", "2×LP", "12″", "7″"]
const CONDITIONS: Condition[] = ["M", "NM", "VG+", "VG+", "VG", "G"]

export interface StockRow {
  no: string
  title: string
  artist: string
  year: number
  format: Format
  condition: Condition
  price: number
}

function build(): StockRow[] {
  const next = prng(2026)
  const pick = <T>(items: readonly T[]) =>
    items[Math.floor(next() * items.length)] as T
  return Array.from({ length: 200 }, (_, i) => {
    const format = pick(FORMATS)
    const base = format === "7″" ? 40 : format === "2×LP" ? 260 : 120
    return {
      no: `LR-${String(431 - i).padStart(4, "0")}`,
      title: `${pick(FIRST)} ${pick(SECOND)}`,
      artist: pick(ARTISTS),
      year: 1962 + Math.floor(next() * 62),
      format,
      condition: pick(CONDITIONS),
      price: base + Math.round(next() * 30) * 10,
    }
  })
}

export const STOCK_ROWS = build()
