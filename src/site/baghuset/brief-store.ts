// What the estimate hands to the brief form at the street: the kinds of work chosen and the receipt's lines. Islands on
// one page share this module, so the form picks it up whether it hydrated before or after the button was pressed.

export interface Carried {
  kinds: string[]
  lines: string[]
}

let carried: Carried | null = null
const listeners = new Set<(c: Carried) => void>()

/** Hand the estimate to the form and let it know. */
export function carry(c: Carried) {
  carried = c
  for (const listener of listeners) listener(c)
}

/** What was carried so far, and every hand-over from now on. */
export function onCarried(listener: (c: Carried) => void) {
  if (carried) listener(carried)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
