// The wobble that turns a crisp CSS border into a slow hand. One copy of each filter lives in the document
// (FinelinerDefs); frames pick a variant from their seed, so neighbouring frames wobble differently.
import { stream } from "./seed"

/** How many wobble variants exist per hand. */
export const WOBBLE_VARIANTS = 6

/** A displacement filter at a low frequency: lines bend slowly rather than jitter. Lively bends about three times as far. */
export function wobbleFilter(
  id: string,
  variant: number,
  hand: "calm" | "lively",
) {
  const frequency = (0.011 + (variant % 3) * 0.005).toFixed(3)
  const scale =
    hand === "lively" ? 2.4 + (variant % 4) * 0.35 : 0.8 + (variant % 3) * 0.2
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="1" seed="${variant * 7 + 4}"/><feDisplacementMap in="SourceGraphic" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G"/></filter>`
}

/** Every shared filter, as one string for a hidden <svg>: fl-wob-1…6 and fl-wob-calm-1…6. */
export function sharedFilters() {
  return Array.from(
    { length: WOBBLE_VARIANTS },
    (_, i) =>
      wobbleFilter(`fl-wob-${i + 1}`, i, "lively") +
      wobbleFilter(`fl-wob-calm-${i + 1}`, i, "calm"),
  ).join("")
}

/**
 * The custom properties a frame reads: which wobble it uses (--wob) and how far each edge runs past its corners
 * (--o1 top, --o2 right, --o3 bottom, --o4 left, as fractions of the hand's --over; negative stops short).
 */
export function frameVars(seed: number): Record<string, string> {
  const r = stream(seed, "frame")
  const vars: Record<string, string> = {
    "--wob": `var(--wob-${1 + Math.floor(r.next() * WOBBLE_VARIANTS)})`,
  }
  for (let n = 1; n <= 4; n++) vars[`--o${n}`] = r.between(-0.2, 1).toFixed(2)
  return vars
}
