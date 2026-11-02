// A drawing in layers of paths. `blank` hides everything drawn before it inside a shape (a mask, so the paper's
// texture still shows), which is how a figure stands in front of a wall line. Paths drawn between two blanks form one
// layer, masked once by every blank that came after it: one mask per layer, never nested, which keeps paint cheap.

export interface Sheet {
  /** A pen line. */
  stroke(d: string): void
  /** A pocket of solid ink. */
  fill(d: string): void
  /** The pen's wash: art fills only. */
  wash(d: string): void
  /** Flat paper, for small holes such as a record's label. */
  paper(d: string): void
  /** Markup the helpers cannot express, such as an even-odd ring. */
  raw(markup: string): void
  /** Hide everything drawn so far inside this shape. */
  blank(d: string): void
  /** The SVG: named by `label` (role="img"), or decorative without one. */
  svg(width: number, height: number, label?: string): string
}

const escape = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  )

/** `id` prefixes the sheet's mask ids; derive it from the drawing's seed and take so server and browser agree. */
export function sheet(id: string): Sheet {
  const layers: string[][] = [[]]
  const blanks: string[] = []
  const top = () => layers[layers.length - 1] as string[]
  const add = (cls: string) => (d: string) => {
    top().push(`<path class="${cls}" d="${d}"/>`)
  }
  return {
    stroke: add("ln"),
    fill: add("ink"),
    wash: add("wash"),
    paper: add("sheet-fill"),
    raw: (markup) => {
      top().push(markup)
    },
    blank(d) {
      if (layers.every((l) => !l.length)) return
      blanks.push(d)
      layers.push([])
    },
    svg(width, height, label) {
      const name = label
        ? `role="img" aria-label="${escape(label)}"`
        : `aria-hidden="true"`
      const pad = 24
      const box = `x="${-pad}" y="${-pad}" width="${width + 2 * pad}" height="${height + 2 * pad}"`
      let defs = ""
      let body = ""
      layers.forEach((paths, i) => {
        if (!paths.length) return
        const after = blanks.slice(i)
        if (!after.length) {
          body += paths.join("")
          return
        }
        const holes = after.map((d) => `<path d="${d}"/>`).join("")
        defs += `<mask id="${id}-m${i}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><g fill="#000">${holes}</g></mask>`
        body += `<g mask="url(#${id}-m${i})">${paths.join("")}</g>`
      })
      // fl-size-own contains "size-", so shadcn's icon rule ([&_svg:not([class*='size-'])]:size-4) leaves a drawing
      // or pen mark inside a button or menu item at the size its call site gives it.
      return `<svg class="fl-drawing fl-size-own" viewBox="0 0 ${width} ${height}" ${name}>${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`
    },
  }
}
