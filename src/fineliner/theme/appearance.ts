// Appearance lives as attributes on <html>, so CSS does the work and every island reads the same state.
// Saved choices persist in localStorage; "system" follows the operating system's light or dark setting.
// Ported from Patina UI's appearance runtime.

export const APPEARANCE = {
  theme: ["system", "day", "night"],
  stock: ["bond", "recycled", "kraft"],
  /** The one pen that inks the document (styles/pens.css). */
  pen: ["navy", "black", "sepia", "forest", "oxblood", "custom"],
  /** How far lines wobble and run past their corners. */
  hand: ["calm", "lively"],
  /** Line boil: drawings redrawn a few times a second, on hover or all the time. */
  boil: ["off", "hover", "art"],
  /** Open: groups sit on the page. Boxed: a frame round every card. */
  containers: ["open", "boxed"],
  /** Labels in the serif's small caps, or typewriter capitals. */
  labels: ["caps", "type"],
  density: ["comfortable", "compact"],
} as const

/**
 * The custom pen's two numbers, each with its range: the hue on the OKLCH circle, and its strength as a share of the
 * most colour every stock keeps at 4.5:1. styles/pens.css derives the day pen, the night gel pen and the wash from them.
 */
export const PEN_MIX = {
  penHue: [0, 359],
  penStrength: [0, 100],
} as const

export type ThemePreference = (typeof APPEARANCE.theme)[number]
export type Stock = (typeof APPEARANCE.stock)[number]
export type Pen = (typeof APPEARANCE.pen)[number]
export type Hand = (typeof APPEARANCE.hand)[number]
export type Boil = (typeof APPEARANCE.boil)[number]
export type Containers = (typeof APPEARANCE.containers)[number]
export type Labels = (typeof APPEARANCE.labels)[number]
export type Density = (typeof APPEARANCE.density)[number]

export interface Appearance {
  theme: ThemePreference
  stock: Stock
  pen: Pen
  hand: Hand
  boil: Boil
  containers: Containers
  labels: Labels
  density: Density
  penHue: number
  penStrength: number
}

export const defaultAppearance: Appearance = {
  theme: "system",
  stock: "bond",
  pen: "navy",
  hand: "lively",
  boil: "hover",
  containers: "open",
  labels: "caps",
  density: "comfortable",
  penHue: 200,
  penStrength: 80,
}

/** Where the choice is saved. Two sites on one origin that each keep their own look pass a key of their own. */
export const STORAGE_KEY = "fineliner-appearance"

type Choice = keyof typeof APPEARANCE
type Mix = keyof typeof PEN_MIX
const KEYS = Object.keys(APPEARANCE) as Choice[]
const MIX_KEYS = Object.keys(PEN_MIX) as Mix[]
/** Settings written to <html> under their own name: data-stock, data-pen, data-pen-hue and so on. */
const ATTRIBUTES = [...KEYS.filter((key) => key !== "theme"), ...MIX_KEYS]
/** The mix's numbers also go on <html> as custom properties, which the custom pen reads: --pen-hue, --pen-strength. */
const PROPERTIES: Record<Mix, string> = {
  penHue: "--pen-hue",
  penStrength: "--pen-strength",
}

const pick = <T extends string>(
  options: readonly T[],
  value: unknown,
  fallback: T,
): T => (options.includes(value as T) ? (value as T) : fallback)

/** Keeps only known values, so a stale or hand-edited entry never breaks the page. */
export function normalize(
  value: Partial<Record<keyof Appearance, unknown>>,
  defaults = defaultAppearance,
): Appearance {
  const next: Record<string, string | number> = {}
  for (const key of KEYS)
    next[key] = pick<string>(APPEARANCE[key], value[key], defaults[key])
  for (const key of MIX_KEYS) {
    const [min, max] = PEN_MIX[key]
    const number = Math.round(Number(value[key] ?? Number.NaN))
    next[key] = Number.isFinite(number)
      ? Math.min(max, Math.max(min, number))
      : defaults[key]
  }
  return next as unknown as Appearance
}

export function readSaved(
  defaults = defaultAppearance,
  storageKey = STORAGE_KEY,
): Appearance {
  try {
    return normalize(
      JSON.parse(localStorage.getItem(storageKey) ?? "{}") ?? {},
      defaults,
    )
  } catch {
    return defaults
  }
}

export function save(appearance: Appearance, storageKey = STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(appearance))
  } catch {
    // Private windows and blocked storage keep the choice for this page only.
  }
}

export function resolveTheme(theme: ThemePreference): "day" | "night" {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day"
}

export function apply(
  appearance: Appearance,
  root: HTMLElement = document.documentElement,
) {
  root.dataset.theme = resolveTheme(appearance.theme)
  root.dataset.themePreference = appearance.theme
  for (const key of ATTRIBUTES) root.dataset[key] = String(appearance[key])
  for (const key of MIX_KEYS)
    root.style.setProperty(PROPERTIES[key], String(appearance[key]))
}

/** The appearance currently applied to the document. */
export function current(
  root: HTMLElement = document.documentElement,
): Appearance {
  const value: Partial<Record<keyof Appearance, unknown>> = {
    theme: root.dataset.themePreference,
  }
  for (const key of ATTRIBUTES) value[key] = root.dataset[key]
  return normalize(value)
}

/** The <html> attributes useAppearance watches. */
export const APPEARANCE_ATTRIBUTES = [
  "data-theme-preference",
  ...ATTRIBUTES.map(
    (key) => `data-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`,
  ),
]
