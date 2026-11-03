import { defaultAppearance, type Appearance } from "@/fineliner/theme"
import type { Preset } from "@/site/studio/presets"

// MÅLTID starts in its own look (bond, the oxblood pen, a calm hand, typewriter labels) and keeps a visitor's changes
// under a key of its own, so restyling the restaurant never restyles the docs, nor the docs the restaurant.

export const MAALTID_STORAGE_KEY = "maaltid-appearance"

export const MAALTID_PRESET: Preset = {
  name: "MÅLTID",
  note: "Bond, oxblood, calm, typewriter",
  choices: {
    stock: "bond",
    pen: "oxblood",
    hand: "calm",
    boil: "hover",
    containers: "open",
    labels: "type",
    density: "comfortable",
  },
}

export const maaltidAppearance: Appearance = {
  ...defaultAppearance,
  ...MAALTID_PRESET.choices,
}
