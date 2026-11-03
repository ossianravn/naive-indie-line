import stocksCss from "@/fineliner/styles/stocks.css?raw"

// The paper and pen colours as stocks.css sets them, read at build time so the specimen cannot drift from the tokens.
// Plain :root is the default stock (bond) by day with every pen; :root[data-theme="night"] is its night card and the
// night pens; every other stock's blocks override only what differs.

const block = (selector: string): Record<string, string> => {
  const start = stocksCss.indexOf(`${selector} {`)
  const body =
    start < 0 ? "" : stocksCss.slice(start, stocksCss.indexOf("}", start))
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  )
}

const base = {
  day: block(":root"),
  night: block(':root[data-theme="night"]'),
}

/** Every colour token on one side of a stock, its own values over the default stock's. */
export function stockColours(stock: string, theme: "day" | "night") {
  const own = block(
    theme === "day"
      ? `:root[data-stock="${stock}"]`
      : `:root[data-stock="${stock}"][data-theme="night"]`,
  )
  return { ...base[theme], ...own }
}
