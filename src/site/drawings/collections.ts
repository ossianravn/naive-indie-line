// What the drawings pages say about each collection: a line about it, the six drawings the overview shows, and how a
// project adds it. The collections themselves (names, order) are the kit's COLLECTIONS.
import { COLLECTIONS, listObjects } from "@/fineliner/pen"
import "@/fineliner/pen/objects"

const ABOUT: Record<string, { lead: string; picks: string[] }> = {
  indie: {
    lead: "A record shop and the room around it: the hi-fi, records in crates and bins, a guitar, plants and a chair to listen from.",
    picks: [
      "turntable",
      "record",
      "guitar",
      "armchair",
      "house-plant",
      "record-bin",
    ],
  },
  food: {
    lead: "A bistro table, a café counter and a kitchen that cooks simple food and pours natural wine.",
    picks: ["bottle", "glass", "bread", "cheese", "tomatoes", "fish"],
  },
  studio: {
    lead: "A creative freelancer's desk: screens that show a website, code or a canvas, a camera, a sketchbook and the coffee.",
    picks: ["laptop", "desk-lamp", "camera", "sketchbook", "headphones", "mug"],
  },
  people: {
    lead: "People with a dot for each eye, visitors who are only their clothes, portraits for avatars, and a cat.",
    picks: [
      "person-wave",
      "visitor",
      "portrait",
      "visitor-seated",
      "person-mug",
      "cat",
    ],
  },
  everyday: {
    lead: "Things to draw for the moments every site has: a welcome, an empty cart, a wait, a search with no results, a message sent, a task done.",
    picks: [
      "door",
      "basket",
      "hourglass",
      "magnifier",
      "paper-plane",
      "checklist",
    ],
  },
}

export const COLLECTION_PAGES = COLLECTIONS.map(([key, title]) => ({
  key,
  title,
  href: `/drawings/${key}`,
  lead: ABOUT[key]?.lead ?? "",
  objects: listObjects(key),
  picks: (ABOUT[key]?.picks ?? []).filter((id) =>
    listObjects(key).some((o) => o.id === id),
  ),
  item: `@fineliner/drawings-${key}`,
  module: `@/fineliner/pen/objects/${key}`,
}))
