import type { ComponentType } from "react"

// Every block in the kit, found by its file: a module in src/fineliner/blocks that exports a component as default and
// a `meta`. Helper files (dashboard-01-parts.tsx) export neither and are skipped, so a new block appears here and in
// the previews without being listed.

export interface BlockMeta {
  title: string
  /** One sentence on what the block is. */
  description: string
  /** States the block switches between with its `variant` prop, previewed one at a time. */
  variants?: readonly string[]
}

export interface BlockModule {
  default?: ComponentType<{ variant?: string }>
  meta?: BlockMeta
}

const modules = import.meta.glob<BlockModule>(
  "../../../fineliner/blocks/*.tsx",
  { eager: true },
)

// The order of a visit to a product: arriving, signing in, working, settings, paying, reading, and the empty pages.
// Blocks not listed follow in alphabetical order.
const ORDER = [
  "hero-01",
  "sign-in-01",
  "dashboard-01",
  "settings-01",
  "pricing-01",
  "article-01",
  "empty-01",
]
const rank = (name: string) =>
  ORDER.includes(name) ? ORDER.indexOf(name) : ORDER.length

export const BLOCKS = Object.entries(modules)
  .flatMap(([path, mod]) =>
    mod.default && mod.meta
      ? [
          {
            name: path.replace(/^.*\/(.+)\.tsx$/u, "$1"),
            component: mod.default,
            ...mod.meta,
          },
        ]
      : [],
  )
  .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
