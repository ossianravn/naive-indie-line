import { RELEASES, catalogueNumber, type Release } from "./data"

// Worst-case catalogue data, for the dev-only data switch (`/listening-room/data/worst`). Every value is one a real
// shop's catalogue produces or an import could carry: long reissue titles, orchestras as artists, non-Latin scripts,
// a one-letter name, an unbreakable string, a six-figure price. Never imported by client code.

const base = RELEASES[0] as Release

const WORST: Release[] = [
  {
    ...base,
    id: "LR-0560",
    title:
      "Variations for a Door and a Sigh (The Complete Studio Sessions, 1963–1967, Remastered from the Original Tapes)",
    artist:
      "Orchestre et Chœur de la Radiodiffusion-Télévision de la Haute-Normandie",
    genre: "Experimental electroacoustic",
    format: "2×LP",
    price: 1_250_000,
    status: "held",
    note: "Held for the collector from Lyon, who has phoned four times.",
  },
  {
    ...base,
    id: "LR-0559",
    title: "X",
    artist: "Ø",
    format: "7″",
    price: 1,
    condition: "G",
  },
  {
    ...base,
    id: "LR-0558",
    title: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    artist: "info@verylongrecordlabelnamethatneverbreaks.example.com",
  },
  {
    ...base,
    id: "LR-0557",
    title: "東京ナイトクルージング（夜の街のための音楽）",
    artist: "山下 和子とシティ・ライツ・オーケストラ",
    genre: "City pop",
    status: "sold",
  },
  {
    ...base,
    id: "LR-0556",
    title: "أغاني المساء على شاطئ الإسكندرية",
    artist: "فرقة النور الموسيقية",
    genre: "Folk",
  },
  {
    ...base,
    id: "LR-0555",
    title: "🌊 Waves, Again 🌊",
    artist: "The 🦜 Parrots",
    genre: "Pop",
  },
  ...RELEASES.slice(1, 6),
]

const THOUSAND: Release[] = Array.from({ length: 1000 }, (_, i) => {
  const from = RELEASES[i % RELEASES.length] as Release
  return { ...from, id: catalogueNumber(2000 - i) }
})

export const DATASETS = {
  demo: RELEASES,
  worst: WORST,
  empty: [],
  one: RELEASES.slice(0, 1),
  thousand: THOUSAND,
} satisfies Record<string, Release[]>

export type Dataset = keyof typeof DATASETS
