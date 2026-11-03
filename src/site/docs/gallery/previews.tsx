import type { ComponentType } from "react"
import { DISPLAY_PREVIEWS } from "./previews-display"
import { EXTRA_PREVIEWS } from "./previews-extras"
import { FORM_PREVIEWS } from "./previews-forms"
import { OTHER_PREVIEWS } from "./previews-other"
import { OVERLAY_PREVIEWS } from "./previews-overlays"

export { SCALE } from "./previews-extras"

// Previews made for the Components index, by demo name, where a demo's first example row would not show the part:
// an overlay that opens in a portal, or a part whose first example is taller or wider than a card's plate.
export const PREVIEWS: Record<string, ComponentType> = {
  ...OVERLAY_PREVIEWS,
  ...FORM_PREVIEWS,
  ...DISPLAY_PREVIEWS,
  ...OTHER_PREVIEWS,
  ...EXTRA_PREVIEWS,
}
