import { createContext, useContext, type ReactNode } from "react"

/** What a component's docs page needs from its demo file, besides the default export. */
export interface DemoMeta {
  title: string
  /** One sentence on what the component is for. */
  description: string
  /** Registry item that installs it. */
  item: string
  /** Its group on the Components index, as in docs/components.md. */
  group?:
    | "Actions"
    | "Forms"
    | "Overlays"
    | "Navigation"
    | "Data display"
    | "Conversation"
    | "Charts"
    | "Fineliner extras"
}

type Claim = (part: "section" | "row") => boolean

/**
 * Preview mode, for the Components index: a demo shows its first example row alone, without section titles or
 * state labels. Each preview gets its own `previewClaim()`, which answers true once per part; it relies on rendering
 * in order, as the server renderer does.
 */
export const DemoPreview = createContext<Claim | null>(null)

export function previewClaim(): Claim {
  const taken = new Set<string>()
  return (part) => !taken.has(part) && Boolean(taken.add(part))
}

/** How many named columns the rows of the current section line up in (DemoSection's `columns`). */
const Columns = createContext(0)

/** A row's grid when its section names columns: each column as wide as its widest usual example, on one line. */
const columnStyle = (n: number) =>
  n
    ? { gridTemplateColumns: `repeat(${n}, minmax(max-content, 10rem))` }
    : undefined

/** The two-column frame every row shares: the state's name, then its examples. */
const ROW =
  "grid grid-cols-[minmax(0,1fr)] items-start gap-x-section gap-y-hair md:grid-cols-[9rem_minmax(0,1fr)]"

/** A label beside a control-height row lines up with the control's words; beside a taller example, with its top. */
const ROW_LABEL = "label md:pt-[calc((var(--control-height)-1lh)/2)]"

/**
 * A titled group of examples on a docs page. With `columns`, the rows line their examples up under those names
 * (a state and its disabled twin), and the names head the section.
 */
export function DemoSection({
  title,
  columns,
  children,
}: {
  title: string
  columns?: readonly string[]
  children: ReactNode
}) {
  const preview = useContext(DemoPreview)
  if (preview) return preview("section") ? children : null
  const n = columns?.length ?? 0
  return (
    <section className="py-snug">
      <h2 className="m-0 mb-tight font-read text-lead leading-subhead font-medium">
        {title}
      </h2>
      {columns && (
        <div className={`${ROW} pt-tight`} aria-hidden="true">
          <span className="hidden md:block" />
          <div className="grid gap-tight" style={columnStyle(n)}>
            {columns.map((c) => (
              <span key={c} className="label text-pen-quiet">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      <Columns.Provider value={n}>{children}</Columns.Provider>
    </section>
  )
}

/** One labelled row in a state matrix: the state's name on the left, the example beside it. */
export function StateRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const preview = useContext(DemoPreview)
  const n = useContext(Columns)
  if (preview)
    return preview("row") ? (
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-tight">
        {children}
      </div>
    ) : null
  return (
    <div className={`${ROW} py-snug`}>
      <span className={ROW_LABEL}>{label}</span>
      <div
        className={
          n
            ? "grid min-h-control min-w-0 items-center justify-items-start gap-tight"
            : "flex min-h-control min-w-0 flex-wrap items-center gap-tight"
        }
        style={columnStyle(n)}
      >
        {children}
      </div>
    </div>
  )
}
