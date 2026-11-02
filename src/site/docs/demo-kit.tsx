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

/** A titled group of examples on a docs page. */
export function DemoSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const preview = useContext(DemoPreview)
  if (preview) return preview("section") ? children : null
  return (
    <section className="py-snug">
      <h2 className="m-0 mb-tight font-read text-lead leading-subhead font-medium">
        {title}
      </h2>
      {children}
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
  if (preview)
    return preview("row") ? (
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-tight">
        {children}
      </div>
    ) : null
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-section gap-y-hair py-tight md:grid-cols-[9rem_minmax(0,1fr)]">
      <span className="label">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-tight">
        {children}
      </div>
    </div>
  )
}
