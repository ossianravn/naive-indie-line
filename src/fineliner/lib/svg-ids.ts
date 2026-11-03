import { useCallback, useId } from "react"
import { ownIds } from "./own-ids"

/**
 * Pen markup names its masks from the seed, so two copies of the same drawing on one page share ids, and when the
 * first copy is hidden (display: none) the second loses its masks. This gives every id the markup declares a suffix
 * of this instance's own, and points its references at it.
 */
export function useOwnIds(): (markup: string) => string {
  const suffix = useId().replace(/[^\w-]/g, "")
  return useCallback((markup: string) => ownIds(markup, suffix), [suffix])
}
