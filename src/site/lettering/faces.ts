// The pen's three typefaces and their four styles, as the lettering page and the specimen show them: names, what each
// is, a sample, the files to download and the registry items that install them.
import type { LetteringFace } from "@/fineliner/drawing/lettering"

export interface Style {
  name: "Regular" | "Bold" | "Italic" | "Bold Italic"
  /** The file name's suffix, as tools/fonts/build.mjs writes it. */
  file: string
  bold: boolean
  italic: boolean
}

export const STYLES: Style[] = [
  { name: "Regular", file: "", bold: false, italic: false },
  { name: "Bold", file: "-bold", bold: true, italic: false },
  { name: "Italic", file: "-italic", bold: false, italic: true },
  { name: "Bold Italic", file: "-bold-italic", bold: true, italic: true },
]

export interface Face {
  face: LetteringFace
  name: string
  /** The face's short name, for controls. */
  short: string
  sample: string
  about: string
  /** The font files' base name in /fonts; Inline also has its Fill. */
  file: string
  fill?: string
  /** The registry items: the Regular, then the other styles. */
  items: [string, string]
}

export const FACES: Face[] = [
  {
    face: "line",
    name: "Fineliner Naïve Sans",
    short: "Sans",
    sample: "Paper Moons",
    about:
      "The pen as a typeface: capitals in one line, three takes of every letter that take turns, so a word never repeats a stamp.",
    file: "fineliner-naive-sans",
    items: ["base", "font-sans-styles"],
  },
  {
    face: "inline",
    name: "Fineliner Naïve Inline",
    short: "Inline",
    sample: "Rue Verte",
    about:
      "A contrasted serif: thick strokes drawn as two lines with a tint between them, thin strokes as one. Two fonts, the outlines and their Fill, set one over the other, so each takes its own colour.",
    file: "fineliner-naive-inline",
    fill: "fineliner-naive-inline-fill",
    items: ["font-inline", "font-inline-styles"],
  },
  {
    face: "tramline",
    name: "Fineliner Naïve Tramline",
    short: "Tramline",
    sample: "Rêverie",
    about:
      "Every stroke drawn three times side by side, the lines running past their ends where they meet, each letter leaning a little its own way.",
    file: "fineliner-naive-tramline",
    items: ["font-tramline", "font-tramline-styles"],
  },
]

/** The pens a sample can be inked in, with their names; each also has a wash for Inline's Fill. */
export const INKS = [
  ["navy", "Navy"],
  ["black", "Soft black"],
  ["sepia", "Sepia"],
  ["forest", "Forest"],
  ["oxblood", "Oxblood"],
] as const
export type Ink = (typeof INKS)[number][0]

/** The classes that set a style on <Lettering> (which sets font-normal itself). */
export const styleClass = ({ bold, italic }: Pick<Style, "bold" | "italic">) =>
  `${bold ? "font-bold" : "font-normal"} ${italic ? "italic" : "not-italic"}`

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ÆØÅ ŒẞÞÐŊĲ"
export const FIGURES = "0123456789"
export const SHARED: [string, string][] = [
  [
    "Marks",
    ".,:;!?¡¿ '\"‘’“”‚„ «»‹› -–— … ()[]{} /\\| @#$%&*+−=<>^_~ €£¥¢ §©®°±×÷•¶",
  ],
  [
    "Accents",
    "ÀÁÂÃÄĀĂĄ ÇĆĈĊČ ĎĐ ÈÉÊËĒĔĖĘĚ ĜĞĠĢ ĤĦ ÌÍÎÏĨĪĬĮİ Ĵ Ķ ĹĻĽĿŁ ÑŃŅŇ ÒÓÔÕÖØŌŎŐ ŔŖŘ ŚŜŞŠȘ ŢŤŦȚ ÙÚÛÜŨŪŬŮŰŲ ŴẀẂẄ ÝŶŸỲ ŹŻŽ",
  ],
  [
    "Languages",
    "Blåbærsyltetøy · Zażółć gęślą jaźń · Árvíztűrő tükörfúrógép · Șofer ținând · Glāžšķūņa rūķīši",
  ],
]
