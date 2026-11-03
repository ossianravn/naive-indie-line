import type { DemoMeta } from "./demo-kit"

// Every component with a docs page, found by its demo file, in one order shared by the Components index, the
// component nav and the previous/next links: by group as docs/components.md lists them, then by title.

type Group = NonNullable<DemoMeta["group"]>

const ORDER: (Group | "Other")[] = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data display",
  "Charts",
  "Conversation",
  "Fineliner extras",
  "Other",
]

export interface Entry extends DemoMeta {
  /** The demo's file name, which is the page's slug. */
  name: string
}

const modules = import.meta.glob<{ meta: DemoMeta }>("./demos/*.tsx", {
  eager: true,
})

const entries: Entry[] = Object.entries(modules)
  .map(([path, mod]) => ({
    name: path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    ...mod.meta,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

/** The components by group, groups in the index's order and empty ones left out. */
export const GROUPS = ORDER.map((group) => ({
  group,
  items: entries.filter((e) => (e.group ?? "Other") === group),
})).filter((g) => g.items.length > 0)

/** Every component in reading order: group by group. */
export const COMPONENTS: Entry[] = GROUPS.flatMap((g) => g.items)
