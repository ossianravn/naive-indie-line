import type { Appearance } from "@/fineliner/theme"

/** What a theme fixes: every appearance setting but day or night, which the export covers both of. */
export type ThemeChoices = Omit<Appearance, "theme">

export interface Preset {
  name: string
  /** The look in a few words. */
  note: string
  choices: ThemeChoices
}

export const PRESETS: Preset[] = [
  {
    name: "Record shop",
    note: "Recycled stock, navy pen, open",
    choices: {
      stock: "recycled",
      pen: "navy",
      hand: "lively",
      boil: "hover",
      containers: "open",
      labels: "caps",
      density: "comfortable",
    },
  },
  {
    name: "Wine label",
    note: "Kraft, oxblood, boxed",
    choices: {
      stock: "kraft",
      pen: "oxblood",
      hand: "lively",
      boil: "hover",
      containers: "boxed",
      labels: "caps",
      density: "comfortable",
    },
  },
  {
    name: "Menu card",
    note: "Bond, soft black, typewriter",
    choices: {
      stock: "bond",
      pen: "black",
      hand: "calm",
      boil: "off",
      containers: "open",
      labels: "type",
      density: "comfortable",
    },
  },
  {
    name: "Sketchbook",
    note: "Bond, sepia, always boiling",
    choices: {
      stock: "bond",
      pen: "sepia",
      hand: "lively",
      boil: "art",
      containers: "open",
      labels: "caps",
      density: "comfortable",
    },
  },
  {
    name: "Ledger",
    note: "Forest pen, calm, compact",
    choices: {
      stock: "recycled",
      pen: "forest",
      hand: "calm",
      boil: "off",
      containers: "boxed",
      labels: "type",
      density: "compact",
    },
  },
]

export const CHOICE_KEYS = [
  "stock",
  "pen",
  "hand",
  "boil",
  "containers",
  "labels",
  "density",
] as const satisfies readonly (keyof ThemeChoices)[]

export const choicesOf = (appearance: Appearance) =>
  Object.fromEntries(
    CHOICE_KEYS.map((key) => [key, appearance[key]]),
  ) as unknown as ThemeChoices

/** The preset the page currently shows, if any. */
export const matchPreset = (appearance: Appearance) =>
  PRESETS.find((preset) =>
    CHOICE_KEYS.every((key) => preset.choices[key] === appearance[key]),
  )
