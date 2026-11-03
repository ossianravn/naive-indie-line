import type { AppearanceRow } from "@/fineliner/extras/appearance-control"

/**
 * The specimen sheet's sections in reading order: the title block's contents and every section's number, title,
 * introduction and the appearance settings that change what it shows all come from here. Each introduction picks up
 * where the one before left off, so the sheet reads as one story: paper, the pen on it, its line, its words, its
 * letters, its drawings, and the shop they run.
 */
export const SHEET = [
  {
    id: "paper",
    title: "Paper",
    intro:
      "Everything is drawn on paper. There are three stocks, and each turns over to a night card: a dark sheet drawn on with a light gel pen, not an inverted page.",
    rows: ["theme", "stock"],
  },
  {
    id: "pens",
    title: "Pens",
    intro:
      "One pen inks the words, the lines and the rare solid fill, and choosing another re-inks the whole page. A red pen only corrects; a thinned wash fills art only.",
    rows: ["pen"],
  },
  {
    id: "line",
    title: "The line",
    intro:
      "The pen draws one weight with a slow wobble, and its ends run a little past their corners. What you operate gets a calm hand; what you look at, a lively one.",
    rows: ["hand"],
  },
  {
    id: "voices",
    title: "Voices",
    intro:
      "The same pen sets the words: a book serif to read, a typewriter for menus and prices, small caps for labels, and a hand for the odd aside.",
    rows: ["labels"],
  },
  {
    id: "lettering",
    title: "Lettering",
    intro:
      "For covers and signs the pen letters its own words: one skeleton alphabet, stroked four ways, every letter leaning by its seed.",
    rows: [],
  },
  {
    id: "drawings",
    title: "Drawings",
    intro:
      "And it draws things: objects, people and rooms, each from a seed, so the same seed draws the same picture everywhere. Point at one and its line boils.",
    rows: ["boil"],
  },
  {
    id: "in-use",
    title: "In use",
    intro:
      "Put together, they run a record shop. These are the kit's own components as Listening Room uses them; open containers sit on the page, boxed ones get a frame.",
    rows: ["containers", "density"],
  },
] as const satisfies readonly {
  id: string
  title: string
  intro: string
  rows: readonly AppearanceRow[]
}[]

export type SheetId = (typeof SHEET)[number]["id"]

/** A section's number as the sheet prints it: 01, 02… */
export const numberOf = (id: SheetId) =>
  String(SHEET.findIndex((s) => s.id === id) + 1).padStart(2, "0")
