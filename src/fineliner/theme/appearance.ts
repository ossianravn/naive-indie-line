// Appearance lives as attributes on <html>, so CSS does the work and every island reads the same state.
// Saved choices persist in localStorage; "system" follows the operating system's light or dark setting.
// Ported from Patina UI's appearance runtime.

export const APPEARANCE = {
  theme: ["system", "day", "night"],
  stock: ["recycled", "kraft", "bond"],
  /** The one pen that inks the document (styles/pens.css). */
  pen: ["navy", "black", "sepia", "forest", "oxblood"],
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
}

export const defaultAppearance: Appearance = {
  theme: "system",
  stock: "recycled",
  pen: "navy",
  hand: "lively",
  boil: "hover",
  containers: "open",
  labels: "caps",
  density: "comfortable",
}

export const STORAGE_KEY = "fineliner-appearance"

const KEYS = Object.keys(APPEARANCE) as (keyof Appearance)[]
/** Settings written to <html> under their own name: data-stock, data-pen and so on. */
const ATTRIBUTES = KEYS.filter((key) => key !== "theme")

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
  const next: Record<string, string> = {}
  for (const key of KEYS)
    next[key] = pick<string>(APPEARANCE[key], value[key], defaults[key])
  return next as unknown as Appearance
}

export function readSaved(defaults = defaultAppearance): Appearance {
  try {
    return normalize(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {},
      defaults,
    )
  } catch {
    return defaults
  }
}

export function save(appearance: Appearance) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance))
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
  for (const key of ATTRIBUTES) root.dataset[key] = appearance[key]
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
  ...ATTRIBUTES.map((key) => `data-${key}`),
]
