// No React here: drawing-takes.ts uses this on pages that run no React.

/** Every id the markup declares, and every reference to one, with `-suffix` added. */
export function ownIds(markup: string, suffix: string) {
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  if (ids.length === 0) return markup
  const own = new Set(ids)
  return markup.replace(
    /(\sid="|url\(#|href="#)([^")]+)/g,
    (match, lead: string, id: string) =>
      own.has(id) ? `${lead}${id}-${suffix}` : match,
  )
}
