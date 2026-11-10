// BAGHUSET's invented content: a drawing office in a back building in Aarhus. The studio's work is the rest of this
// site, plus three printed things; the people, clients and prices are made up.

export const PLACE = {
  street: "Mejlgade 48, baghuset",
  city: "8000 Aarhus C",
  hours: "Monday to Thursday 9–16, Friday until lunch",
  email: "hej@baghuset.example",
  phone: "+45 86 00 00 00",
}

export const KINDS = ["Identity", "Web", "Print", "Type"] as const
export type Kind = (typeof KINDS)[number]

export interface Work {
  id: string
  title: string
  client: string
  year: number
  kinds: Kind[]
  /** The drawing on the sheet: an object from the library. */
  object: string
  fix: "pin" | "tape" | "clip"
  href?: string
  /** The case: three short paragraphs, a quote and who said it, and its number in the archive. */
  story: [string, string, string]
  quote: [string, string]
  number: number
}

export const WORK: Work[] = [
  {
    id: "maaltid",
    title: "MÅLTID",
    client: "MÅLTID, København N",
    year: 2026,
    kinds: ["Identity", "Web"],
    object: "plate",
    fix: "tape",
    href: "/maaltid",
    story: [
      "A restaurant that cooks the north with Italy's peasant kitchen wanted to look like its tables: bare wood, one candle, good bread.",
      "We drew the wordmark with the same pen that draws the dishes, set the menu on the typewriter and kept the oxblood for the wine.",
      "The site books a table in three steps and shows tonight's menu as the kitchen writes it.",
    ],
    quote: [
      "It looks like we wrote it on the back of a menu, which is the point.",
      "The chef",
    ],
    number: 41,
  },
  {
    id: "listening-room",
    title: "Listening Room",
    client: "Listening Room",
    year: 2026,
    kinds: ["Web"],
    object: "turntable",
    fix: "pin",
    href: "/listening-room",
    story: [
      "A record shop with a room at the back for listening sessions needed a catalogue the staff could keep up to date between customers.",
      "We built it as a sidebar shell: the records, a page for each, the sessions and an overview that counts what sold.",
      "Every figure comes from the same records the shelves hold, so the overview never disagrees with the till.",
    ],
    quote: ["We finally know what is in the back room.", "The shop"],
    number: 43,
  },
  {
    id: "naive",
    title: "Fineliner Naïve",
    client: "Our own",
    year: 2026,
    kinds: ["Type"],
    object: "fineliner",
    fix: "clip",
    href: "/lettering",
    story: [
      "Our own typeface, drawn with the pen we draw everything else with, in three faces: Sans, Inline and Tramline.",
      "Every letter has three takes that rotate as you type, so a word never repeats itself exactly.",
      "Bold, Italic and Bold Italic followed in November; the lettering page lets you try them all.",
    ],
    quote: ["A typeface that looks drawn, because it was.", "Ingrid Holm"],
    number: 44,
  },
  {
    id: "reverie",
    title: "Rêverie",
    client: "Vinbaren Skål",
    year: 2025,
    kinds: ["Print"],
    object: "bottle",
    fix: "tape",
    story: [
      "An orange wine from a small grower, bottled for a wine bar's own label: one run of six hundred.",
      "The label is a drawing of the vineyard at dusk, printed in two colours on uncoated paper that takes the wet of a cellar.",
      "The bar numbers every bottle by hand.",
    ],
    quote: [
      "People photograph the bottle before they drink it.",
      "Vinbaren Skål",
    ],
    number: 38,
  },
  {
    id: "side-b",
    title: "Side B",
    client: "Forlaget Løv",
    year: 2025,
    kinds: ["Print"],
    object: "record",
    fix: "pin",
    story: [
      "A small publisher's first record: poems read over music, pressed on black vinyl in a sleeve we drew.",
      "The sleeve opens like a book and carries the poems inside, set on the typewriter.",
      "Three hundred copies, all gone by the spring.",
    ],
    quote: ["The sleeve is half the record.", "Forlaget Løv"],
    number: 36,
  },
  {
    id: "aarsskrift",
    title: "Årsskrift 2025",
    client: "A/F Solsiden",
    year: 2025,
    kinds: ["Print"],
    object: "proof",
    fix: "clip",
    story: [
      "A housing co-operative's yearbook: forty pages for two hundred members who mostly know each other.",
      "Two colours, a cover drawn by hand, and a page for every staircase with who lives there now.",
      "We proofed it at the plotter and the board signed it off on the first round.",
    ],
    quote: ["The members kept it, which never happened before.", "The board"],
    number: 39,
  },
]

/** Twelve older jobs in the plan chest. */
export const ARCHIVE: [number, string, string][] = [
  [2025, "Keramiker Ane Storm", "Identity and price list"],
  [2025, "Cykelværkstedet Kæde", "Shop sign and website"],
  [2024, "Risteriet Nord", "Coffee bags, three roasts"],
  [2024, "Vinbaren Skål", "Wine list and menu"],
  [2024, "Forlaget Løv", "Book covers, autumn list"],
  [2023, "A/F Solsiden", "Årsskrift 2023"],
  [2023, "Keramiker Ane Storm", "Exhibition poster"],
  [2023, "Risteriet Nord", "Identity"],
  [2022, "Cykelværkstedet Kæde", "Identity"],
  [2022, "Forlaget Løv", "Identity and website"],
  [2021, "Vinbaren Skål", "Identity"],
  [2021, "A/F Solsiden", "Årsskrift 2021"],
]

export interface Service {
  name: string
  object: string
  lines: string
  from: string
}

export const SERVICES: Service[] = [
  {
    name: "Identity",
    object: "swatch-fan",
    lines:
      "A name drawn, a few colours, the paper it goes on and how to use them.",
    from: "60.000 kr.",
  },
  {
    name: "Websites",
    object: "website",
    lines: "Sites that read well on a phone and that you can keep up yourself.",
    from: "90.000 kr.",
  },
  {
    name: "Printed things",
    object: "proof",
    lines: "Labels, sleeves, books and signs, proofed here and printed nearby.",
    from: "25.000 kr.",
  },
  {
    name: "Drawing and type",
    object: "fineliner",
    lines: "Drawings and lettering for whatever needs a hand in it.",
    from: "12.000 kr.",
  },
]

export const PROCESS = ["Listen", "Sketch", "Make", "Hand over"]

/** The estimate's prices, in kroner. */
export const PRICES = {
  kinds: { Identity: 60000, Website: 90000, "Printed thing": 25000 } as Record<
    string,
    number
  >,
  sizes: { Small: 1, Medium: 1.5, Large: 2.2 } as Record<string, number>,
  drawings: 18000,
  words: 12000,
  rush: 0.2,
}

export interface Person {
  id: string
  name: string
  role: string
  fact: string
  hair: string
  glasses: boolean
  beard: boolean
}

export const PEOPLE: Person[] = [
  {
    id: "asta",
    name: "Asta Lindqvist",
    role: "Partner, identity",
    fact: "Draws every wordmark by hand first.",
    hair: "bob",
    glasses: true,
    beard: false,
  },
  {
    id: "malik",
    name: "Malik Østergaard",
    role: "Partner, websites",
    fact: "Cycles in from Risskov all year.",
    hair: "crop",
    glasses: false,
    beard: true,
  },
  {
    id: "ingrid",
    name: "Ingrid Holm",
    role: "Drawing and type",
    fact: "Drew all three faces of Fineliner Naïve.",
    hair: "bun",
    glasses: false,
    beard: false,
  },
  {
    id: "jonas",
    name: "Jonas Bak",
    role: "Print and production",
    fact: "Knows every printer within a day's ride.",
    hair: "curls",
    glasses: true,
    beard: false,
  },
  {
    id: "sille",
    name: "Sille Thygesen",
    role: "Projects, keeps the calendar",
    fact: "Answers the phone before it rings twice.",
    hair: "ponytail",
    glasses: false,
    beard: false,
  },
]

export const CAT = {
  id: "tusse",
  name: "Tusse",
  role: "Cat",
  fact: "Sleeps under the lunch table from twelve.",
}

export const CLIENTS = [
  "MÅLTID",
  "Listening Room",
  "Andelsforeningen Solsiden",
  "Forlaget Løv",
  "Risteriet Nord",
  "Cykelværkstedet Kæde",
  "Keramiker Ane Storm",
  "Vinbaren Skål",
]

/** Kroner as Danes write them, the same on the server and in every browser: 120.000 kr. */
export const kr = (n: number) =>
  `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kr.`
