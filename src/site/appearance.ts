import { defaultAppearance, type Appearance } from "@/fineliner/theme"

/**
 * Where the site starts before a visitor chooses. The layout's pre-paint script and every island that renders
 * appearance on the server use it; the kit's own defaults stay what an install starts from.
 */
export const siteAppearance: Appearance = { ...defaultAppearance }
