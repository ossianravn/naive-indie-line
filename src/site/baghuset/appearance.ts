import { defaultAppearance, type Appearance } from "@/fineliner/theme"
import type { Preset } from "@/site/studio/presets"

// BAGHUSET starts in its own look (recycled paper, the forest pen, the lively hand, small-caps labels, boil on hover)
// and keeps a visitor's changes under a key of its own, as MÅLTID does, so restyling the drawing office restyles
// nothing else on the site. The tools on its studio table write the same saved appearance as the panel.

export const BAGHUSET_STORAGE_KEY = "baghuset-appearance"

export const BAGHUSET_PRESET: Preset = {
  name: "BAGHUSET",
  note: "Recycled, forest, lively, small caps",
  choices: {
    stock: "recycled",
    pen: "forest",
    hand: "lively",
    boil: "hover",
    containers: "open",
    labels: "caps",
    density: "comfortable",
  },
}

export const baghusetAppearance: Appearance = {
  ...defaultAppearance,
  ...BAGHUSET_PRESET.choices,
}
