import type { DemoMeta } from "@/site/docs/demo-kit"
import type { Share } from "./share-image"

// Every share image the site draws: the main pages, each block and each component, with the drawing that suits it.
// A page finds its own by its path (shareFor); anything else shares the home page's.

const PAGES: Share[] = [
  {
    slug: "home",
    title: "Fineliner",
    kicker: "One pen, cream paper",
    scene: "room",
  },
  { slug: "docs", title: "Components", kicker: "Fineliner", object: "crate" },
  { slug: "docs-blocks", title: "Blocks", kicker: "Fineliner", object: "desk" },
  {
    slug: "studio",
    title: "Theme studio",
    kicker: "Fineliner",
    scene: "studio",
  },
  {
    slug: "drawings",
    title: "Drawings",
    kicker: "Fineliner",
    object: "sketchbook",
  },
  {
    slug: "drawings-skill",
    title: "Drawing skill",
    kicker: "Fineliner",
    object: "sketchbook",
  },
  ...[
    ["indie", "Indie", "turntable"],
    ["food", "Food & drink", "bottle"],
    ["studio", "Studio", "laptop"],
    ["people", "People", "person-wave"],
    ["everyday", "Everyday", "paper-plane"],
  ].map(([key, title, object]) => ({
    slug: `drawings-${key}`,
    title: title!,
    kicker: "Fineliner drawings",
    object,
  })),
  {
    slug: "lettering",
    title: "Lettering",
    kicker: "Fineliner",
    object: "sketchbook",
  },
  {
    slug: "desk",
    title: "Drawing desk",
    kicker: "Fineliner",
    object: "desk-lamp",
  },
  {
    slug: "specimen",
    title: "Specimen",
    kicker: "Fineliner",
    object: "record",
  },
  {
    slug: "maaltid",
    title: "MÅLTID",
    kicker: "Peasant food · natural wine",
    scene: "maaltid",
    // Bond's oxblood pen and wash (src/fineliner/styles/stocks.css).
    ink: { pen: "#5c2430", wash: "#a9636e" },
  },
  {
    slug: "listening-room",
    title: "Listening Room",
    kicker: "Records · Room · Wine",
    scene: "room",
  },
]

const BY_GROUP: Record<string, string> = {
  Actions: "turntable",
  Forms: "menu",
  Overlays: "picture",
  Navigation: "window",
  "Data display": "record",
  Charts: "speaker",
  Conversation: "phone",
  "Fineliner extras": "bottle",
}

const metas = import.meta.glob<DemoMeta>("../docs/demos/*.tsx", {
  eager: true,
  import: "meta",
})
const COMPONENTS: Share[] = Object.entries(metas).map(([path, meta]) => ({
  slug: `components-${path.replace(/^.*\/(.+)\.tsx$/u, "$1")}`,
  title: meta.title,
  kicker: "Fineliner component",
  object: BY_GROUP[meta.group ?? ""] ?? "record",
}))

const BLOCKS: Share[] = [
  ["sign-in-01", "Sign in", "person-wave"],
  ["settings-01", "Settings", "desk"],
  ["dashboard-01", "Dashboard", "monitor"],
  ["pricing-01", "Pricing", "bottle"],
  ["article-01", "Article", "books"],
  ["empty-01", "Empty states", "crate"],
  ["hero-01", "Hero", "turntable"],
].map(([name, title, object]) => ({
  slug: `blocks-${name}`,
  title: title!,
  kicker: "Fineliner block",
  object,
}))

export const SHARES: Share[] = [...PAGES, ...COMPONENTS, ...BLOCKS]
const SLUGS = new Set(SHARES.map((s) => s.slug))

/** The share image for a path: its own if the site draws one, else the home page's. */
export function shareFor(pathname: string) {
  const path = pathname.replace(/\/$/u, "")
  const component = /^\/docs\/components\/(.+)$/u.exec(path)
  const block = /^\/docs\/blocks\/view\/([^/]+)/u.exec(path)
  const slug = component
    ? `components-${component[1]}`
    : block
      ? `blocks-${block[1]}`
      : path.startsWith("/listening-room")
        ? "listening-room"
        : path.slice(1).replaceAll("/", "-") || "home"
  return `/og/${SLUGS.has(slug) ? slug : "home"}.png`
}
