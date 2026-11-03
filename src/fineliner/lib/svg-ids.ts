import { useCallback, useId } from "react"

/**
 * Pen markup names its masks from the seed, so two copies of the same drawing on one page share ids, and when the
 * first copy is hidden (display: none) the second loses its masks. This gives every id the markup declares a suffix
 * of this instance's own, and points its references at it.
 */
export function useOwnIds(): (markup: string) => string {
  const suffix = useId().replace(/[^\w-]/g, "")
  return useCallback(
    (markup: string) => {
      const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
      if (ids.length === 0) return markup
      const own = new Set(ids)
      return markup.replace(
        /(\sid="|url\(#|href="#)([^")]+)/g,
        (match, lead: string, id: string) =>
          own.has(id) ? `${lead}${id}-${suffix}` : match,
      )
    },
    [suffix],
  )
}
