# Idea bank

Drawings the library could grow into, curated from two brainstorms (GPT-Pro and Gemini 4 Argon, 2026-11-03; the raw
lists stay in `.dev-docs/ideas-for-drawings.md`). An idea earns a place here when it is one everyday physical thing, reads
at tile size in a few lines, and serves a page someone builds. Waves are what gets drawn next; the rest waits for a
page that needs it. The [plan](plan.md) records what lands.

## What the brainstorms got wrong for this style

Kept out, or rewritten before they go in:

- **Colour.** "Solid blue footswitch", "blue-tinted filter", "blue sand". There is one pen; ink is rare and the wash is
  for art (wine in a glass, a sticky note), at most one area per object.
- **Brands.** Pantone, Chemex, Walkman, Anglepoise: drawn and named as the generic thing (swatch fan, pour-over,
  cassette player, desk lamp).
- **Faces that act.** "Eyes looking upward", "peeking colleague", "thinking person". Faces are dot eyes, a nose and a
  short mouth, with three moods at most (a smile, joy, eyes closed); a figure shows what it feels through its pose.
- **Bodiless hands.** A hand and cuff alone reads as a clip-art icon, not a drawing.
- **Too busy for a tile.** Drum kit, sewing machine, spiral staircase, tractor, mixing desk, slide projector: dozens of
  small parts that turn into scribble at 120 px.
- **Two people touching.** Sofa carriers, shared laptop, board-game players: the people engine poses one figure at a
  time; pairs that only stand near each other are fine and belong in scenes.
- **Abstract UI.** Bézier nodes, wireframe cards, a terminal window: the kit's drawings are things, the UI is the UI.
- **Duplicates.** Both lists propose the same dozen objects; each appears once below.

## Wave 1 (in progress, 2026-11-03)

### Everyday: the moments every website has

A new collection, `everyday`. Physical stand-ins for the states a shadcn app shows: empty, loading, sent, locked,
found nothing, done. The most useful addition for a kit, since every consumer has these screens.

| Id            | Drawing                                      | Where it serves                      |
| ------------- | -------------------------------------------- | ------------------------------------ |
| `door`        | A door swung inward, a mat before it         | Welcome, sign-up, onboarding         |
| `basket`      | An empty woven basket, handles folded out    | Empty cart, nothing saved yet        |
| `hourglass`   | Most of the sand already fallen              | Loading, processing, waitlist        |
| `paper-plane` | A folded plane in flight, a dashed trail     | Sent, published, deployed            |
| `padlock`     | A closed padlock, the keyhole in ink         | Private, permissions, security       |
| `keys`        | Two keys on a ring with a paper tag          | Sign-in, account, access             |
| `magnifier`   | A magnifying glass over two index cards      | Search, no results, docs lookup      |
| `checklist`   | A clipboard with three ticked rows, a pencil | Done, confirmation, onboarding steps |
| `telephone`   | A desk telephone with a curled cord          | Contact, support                     |
| `envelope`    | An envelope with a letter half out of it     | Newsletter, inbox, message received  |
| `parcel`      | A box tied with string, a label              | Order placed, shipping, gift         |

### Food & drink: a kitchen for MÅLTID

For the restaurant demo (northern Italian peasant food, natural wine). General enough for any café, bakery or wine bar,
so they go in the kit; the restaurant's own dishes and rooms are drawn in the site's module, as a consumer would.

| Id            | Drawing                                      |
| ------------- | -------------------------------------------- |
| `olive-oil`   | A tall oil tin with a pour cap and a label   |
| `jar`         | A swing-top preserving jar, pickles in brine |
| `cheese`      | A wedge and a small knife on a paddle board  |
| `rolling-pin` | A pin across a rolled-out sheet of pasta     |
| `corkscrew`   | A T-handle corkscrew still in its cork       |
| `chalkboard`  | A folding pavement sign with today's lines   |
| `tomatoes`    | Three tomatoes on the vine                   |
| `herbs`       | Basil in a pot, one leaf too big             |
| `mushrooms`   | Two porcini standing together                |
| `carrots`     | A bunch of carrots with their feathery tops  |
| `fish`        | A whole mackerel in profile                  |
| `oyster`      | An open oyster on its shell, a lemon wedge   |

## Later, by collection

Drawn when a page needs them. Names are the generic thing.

- **Indie.** Effects pedal, small synthesizer, guitar amp, microphone on a stand, cassette player with headphones,
  metronome, tambourine, coiled cable, gig ticket, setlist taped up, fanzine, record dividers, tote with a sleeve in it,
  lava lamp, string lights, incense, open matchbox, beanbag, slippers.
- **Food & drink.** Espresso machine, grinder, pour-over, French press, gooseneck kettle, milk jug, bag of beans,
  croissant, cinnamon bun, cake slice, egg cup, sandwich, pizza peel, bar stool, ice bucket with a bottle, salt and
  pepper mills, linen napkin, coupe glass, counter bell, tip jar, receipt spike, apron on a hook, pastry dome.
- **Studio.** Paint tubes, palette, ink bottle, eraser, easel, bulldog clip, compass, typewriter, tripod, film canister,
  contact sheet, print-drying rack.
- **People** (one figure, a pose in `clothes()`; see `skills/fineliner-drawings/references/people.md`). Reading,
  listening with eyes shut, carrying groceries, walking with headphones, with a dog on a
  lead, in a wheelchair at a shelf, with a cane, a barista pouring, a cook tasting, a server with a tray, a baker at
  the dough, a florist behind a bouquet, a potter at the wheel. Animals: a sleeping dog, a bird on a branch.

## Later, new collections

In the order they would serve the most sites:

1. **Home.** Bed with the duvet turned back, sofa, sideboard, leaning mirror, rug.
2. **Shop & post** (grows out of Everyday). Paper shopping bag, price tag on a string, card terminal, open box with
   tissue, receipt, awning, cargo bike.
3. **Garden.** Watering can, wrapped bouquet, secateurs, seed packets, seedling tray, vase with dried stems.
4. **Making.** Embroidery hoop, yarn and needles, thread spool, pinch pot, clay tools in a jar, toolbox, work gloves,
   paint roller and tray.
5. **Travel & stays.** Hotel key fob, reception bell, suitcase, folded map, passport with a boarding pass, binoculars,
   tent, lantern, lighthouse.
6. **Care.** Rolled yoga mat, soap on a dish, rolled towels, dropper bottle, mortar and pestle, folded linen stack.

## Before the library triples

Decided 2026-11-03 and done at 85 objects: each collection is its own registry item, so an object adds only to the
installs of projects that show its collection, and /drawings shows each collection in brief with a page of its own
(the single page had reached 112 KB of HTML gzipped).
