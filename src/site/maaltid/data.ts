// MÅLTID, a restaurant that does not exist: tonight's menu, the wine list and where the food comes from. Static and
// made up, like Listening Room's records; every grower and producer here is invented.

export const PLACE = {
  name: "MÅLTID",
  street: "Baggesensgade 9",
  city: "2200 København N",
  hours: "Wednesday to Saturday from 17:30",
  kitchen: "Kitchen until 22:00",
  closed: "Closed Sunday to Tuesday",
}

/** The evening the menu is for, and the first day the booking calendar opens on. */
export const TONIGHT = { iso: "2026-11-05", label: "Thursday 5 November" }

/** The four things guests most often ask the kitchen to leave out. */
export const ALLERGENS = ["gluten", "dairy", "fish", "nuts"] as const
export type Allergen = (typeof ALLERGENS)[number]

export interface Dish {
  name: string
  with: string
  price: number
  /** Which of the four it has in it. */
  contains: Allergen[]
  diet?: "vegetarian" | "vegan"
  /** A drawing of its own; the course's when left out. */
  object?: string
  /** A word in the hand beside it on the printed card. */
  aside?: string
  /** What the waiter would tell you about it. */
  story: string
}
export interface Course {
  title: string
  /** A kit or MÅLTID drawing for the course. */
  object: string
  dishes: Dish[]
}

export const MENU: Course[] = [
  {
    title: "To start",
    object: "bread",
    dishes: [
      {
        name: "Rye focaccia",
        with: "cultured butter, whey caramel",
        price: 45,
        contains: ["gluten", "dairy"],
        diet: "vegetarian",
        aside: "more bread is free",
        story:
          "Baked twice a day from Stevns rye and a sourdough older than the restaurant. We culture the butter ourselves and boil the whey it leaves into caramel.",
      },
      {
        name: "Raw mackerel",
        with: "rhubarb, horseradish, cold-pressed rapeseed oil",
        price: 95,
        contains: ["fish"],
        object: "fish",
        story:
          "From the morning boats at Gilleleje, sliced to order and dressed with forced rhubarb, fresh horseradish and the green oil from a press on Fyn.",
      },
      {
        name: "From the jars",
        with: "pickled roots and leaves, hazelnut crumbs",
        price: 55,
        contains: ["nuts"],
        diet: "vegan",
        story:
          "Whatever we put up through the summer: beetroot, kohlrabi, nasturtium leaves, green tomatoes. The hazelnuts come from the same farm as the roots.",
      },
    ],
  },
  {
    title: "Pasta",
    object: "rolling-pin",
    dishes: [
      {
        name: "Pici cacio e pepe",
        with: "Danish sheep's cheese, smoked pepper",
        price: 145,
        contains: ["gluten", "dairy"],
        diet: "vegetarian",
        aside: "the one everyone orders",
        story:
          "Thick hand-rolled noodles, as in southern Tuscany, with a hard sheep's cheese from Lolland where Rome would use pecorino, and pepper we smoke over the grill.",
      },
      {
        name: "Spelt tagliatelle",
        with: "porcini, brown butter, thyme",
        price: 165,
        contains: ["gluten", "dairy"],
        diet: "vegetarian",
        object: "mushrooms",
        story:
          "Spelt from Bornholm rolled thin each afternoon, with porcini picked in Gribskov and butter browned until it smells of hazelnuts.",
      },
    ],
  },
  {
    title: "From the fire",
    object: "maaltid-pot",
    dishes: [
      {
        name: "Ribollita",
        with: "kale, white beans, yesterday's bread",
        price: 135,
        contains: ["gluten"],
        diet: "vegan",
        story:
          "The Tuscan way to use up bread: beans, black kale and yesterday's loaf, cooked down until a spoon stands in it, with plenty of olive oil.",
      },
      {
        name: "Whole mackerel",
        with: "grilled over beech, salsa verde of ramsons",
        price: 195,
        contains: ["fish"],
        object: "fish",
        aside: "twelve tonight",
        story:
          "A whole fish from Gilleleje grilled over beech, with a salsa verde of wild garlic we picked in spring and kept in oil.",
      },
    ],
  },
  {
    title: "To finish",
    object: "cheese",
    dishes: [
      {
        name: "Sheep's ricotta",
        with: "heather honey, burnt apple",
        price: 85,
        contains: ["dairy"],
        diet: "vegetarian",
        story:
          "Fresh ricotta from the same flock on Lolland, heather honey from Rold Skov and an apple burnt in the embers until it is soft.",
      },
      {
        name: "Two cheeses",
        with: "one hard, one soft, rye crispbread",
        price: 95,
        contains: ["dairy", "gluten"],
        diet: "vegetarian",
        story:
          "One hard and one soft, chosen the week they are ready, with a crispbread of rye and seeds baked here.",
      },
    ],
  },
]

export const SET_MENU = { food: 495, wine: 395 }
/** How many menus the kitchen has printed since it opened; tonight's is the next. */
export const MENU_NUMBER = 214

export type WineKind = "Sparkling" | "White" | "Orange" | "Red"
export interface Wine {
  kind: WineKind
  name: string
  producer: string
  grape: string
  region: string
  year: number
  bottle: number
  glass?: number
  vessel?: "bottle" | "glass" | "carafe"
  soldOut?: boolean
  note: string
}

export const WINES: Wine[] = [
  {
    kind: "Sparkling",
    name: "Bolle di Casa",
    producer: "Cantina Fratelli Moro",
    grape: "Garganega",
    region: "Veneto",
    year: 2024,
    bottle: 420,
    glass: 85,
    vessel: "glass",
    note: "Cloudy and a little sour, like a green apple in the sun.",
  },
  {
    kind: "Sparkling",
    name: "Pétillant du Lavoir",
    producer: "Ferme du Lavoir",
    grape: "Chenin blanc",
    region: "Loire",
    year: 2023,
    bottle: 460,
    note: "Bread dough, pear skin, bubbles that will not sit still.",
  },
  {
    kind: "White",
    name: "Sasso",
    producer: "Azienda Agricola Ottavi",
    grape: "Trebbiano",
    region: "Abruzzo",
    year: 2023,
    bottle: 440,
    glass: 90,
    vessel: "glass",
    note: "Salt, almonds and the crust of the bread.",
  },
  {
    kind: "White",
    name: "Kalk",
    producer: "Weingut Haller",
    grape: "Grüner Veltliner",
    region: "Burgenland",
    year: 2022,
    bottle: 480,
    note: "White pepper and wet stone; good with the mackerel.",
  },
  {
    kind: "Orange",
    name: "Tre Settimane",
    producer: "Podere Lucciola",
    grape: "Malvasia",
    region: "Emilia",
    year: 2022,
    bottle: 495,
    glass: 100,
    vessel: "glass",
    note: "Three weeks on the skins: apricot, black tea and a grip at the end.",
  },
  {
    kind: "Orange",
    name: "Æblegården",
    producer: "Gården ved Kirken",
    grape: "Apples, wild-fermented",
    region: "Møn",
    year: 2024,
    bottle: 310,
    vessel: "carafe",
    note: "A cider from old trees, dry and a little funky.",
  },
  {
    kind: "Red",
    name: "Rosso Contadino",
    producer: "Cascina Pietra Bianca",
    grape: "Barbera",
    region: "Piemonte",
    year: 2022,
    bottle: 450,
    glass: 95,
    vessel: "glass",
    note: "Sour cherries. We serve it a little cold.",
  },
  {
    kind: "Red",
    name: "Nero di Collina",
    producer: "Vigne di Nonna Ada",
    grape: "Nerello Mascalese",
    region: "Sicilia",
    year: 2021,
    bottle: 560,
    note: "Smoke, red earth and dried herbs.",
  },
  {
    kind: "Red",
    name: "Lambrusco di Casa",
    producer: "Famiglia Gatti",
    grape: "Lambrusco Grasparossa",
    region: "Emilia",
    year: 2023,
    bottle: 380,
    soldOut: true,
    note: "Purple, frothy and gone for this year.",
  },
]

export const KINDS: WineKind[] = ["Sparkling", "White", "Orange", "Red"]

/** Where the food comes from, without names: the growers here are invented. */
export const SOURCES: { object: string; what: string; where: string }[] = [
  { object: "bread", what: "Rye", where: "milled and baked on Stevns" },
  {
    object: "fish",
    what: "Mackerel",
    where: "off the morning boats at Gilleleje",
  },
  {
    object: "carrots",
    what: "Roots and greens",
    where: "from a small farm in Odsherred",
  },
  {
    object: "cheese",
    what: "Sheep's cheese",
    where: "from a flock on Lolland",
  },
  {
    object: "mushrooms",
    what: "Porcini",
    where: "picked in the woods at Gribskov",
  },
  {
    object: "maaltid-crate",
    what: "Wine",
    where: "from fourteen small growers, none of them famous",
  },
]

export const kr = (n: number) => `${n} kr`
