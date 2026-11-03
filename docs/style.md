# Style brief

Status: built into the kit as Fineliner's tokens (Phase 0, `src/fineliner/styles/`), 2026-11-02; direction approved by the maintainer; second round folded in (open containers, a typewriter voice, our own letters, people with faces, a larger object library). Choices still open are marked in the [plan](plan.md#decisions). Once agreed, this brief becomes `docs/design-language.md` (Patina's equivalent) and the specimen's values become the kit's tokens.

The live specimen (`specimen/`, served by `python -m http.server 4791` from the repository root, then `http://127.0.0.1:4791/specimen/`) shows every proposal below and switches between the options still open.

## The style in one line

**One fine-liner on unbleached paper.** A single thin pen in dark navy, wobbling gently and running a little past its corners; flattened, slightly wonky perspective; no tone at all, only empty paper and a few small pockets of solid ink; everyday things, and people (some with faces, some only their clothes).

It comes from natural-wine labels and indie record sleeves (zine culture, underground comix, outsider art). The reference is a photographed label for a record shop's pét-nat: a room corner with a disco ball, a turntable on a shelf of records, a potted sunflower, a pinned drawing of a treehouse, and three headless figures. The photograph is kept unpublished in `.dev-docs/reference/`, because the label is someone else's artwork.

## What the reference shows

Facts from the label, which the rules below generalize:

- **Line**: one monoline weight throughout, about 0.25 % of the label's width; a slow wobble rather than jitter; no doubled or sketchy strokes. Corners often cross or fall short: the border's top line runs past its left edge.
- **Fill**: no gradients, hatching or shading. Solid ink appears in about six places only: the disco ball's tiles, the record on the platter, the record a figure holds, the treehouse, the pins and the soil in the pot.
- **A second tone**: the soil in the pot is a lighter, brighter blue than the line, the one place the ink looks thinned.
- **Perspective**: oblique and intuitive. The shelf, turntable and speakers tip toward the viewer, and each object has its own idea of depth.
- **Composition**: a hand-drawn rectangular border inset from the paper's edge; a picture within the picture (the pinned treehouse); a sweeping floor curve; plenty of empty wall.
- **Subjects**: domestic objects (records, speakers, a plant) and absent people: a sweater and wide trousers with nobody in them, a collar ring where a head would be. People are young and dressed for everyday: loose sweaters, hoodies, open overshirts and tees, wide trousers with rolled hems, trainers, and hair as a pocket of ink (drawn as an outline, hair reads as grey).
- **Type**: a classical book serif in the same ink, small and quiet, set vertically up the right edge ("Pétillant Naturel") and as a tiny credit at the bottom left.
- **Paper**: cream unbleached stock with dark flecks and fibres.

## Rules

1. **One pen, one weight.** Every line is the same thin monoline (1.35 px), in one ink. A second pen, the red **correction pen**, appears only for errors and destructive actions.
2. **Contours, not tone.** No gradients, hatching or drop shadows. Things are their outlines.
3. **Ink is rare.** Solid fill marks the few places the eye should land: a record, a tile, the selected option, the one button to press.
4. **A slow hand.** Lines wobble gently and run past their corners; nothing is ruled. Operated controls get a steadier hand than drawings.
5. **Flattened perspective.** Objects tip toward the viewer in an oblique view, and neighbours disagree a little about depth.
6. **Air is the material.** Most of the sheet stays empty paper. Space and headings group things; lines belong to controls, tables and surfaces that float. Containers are **open** by default, with a **boxed** option that frames every card for those who want it.
7. **Quiet type.** A book serif set small, like the words on a label; a typewriter for menus, prices and labels; our own drawn letters for display; a hand only for asides.
8. **Quietly strange.** Everyday things, and people drawn as simply as the things: dot eyes and a line for a mouth, or no head at all. Whimsy stays deadpan: no mascots, no jokes in the interface copy.

## Paper

| Stock          | Day       | Night     | Character                            |
| -------------- | --------- | --------- | ------------------------------------ |
| Bond (default) | `#f4f0e6` | `#1b1b1a` | Bright cotton paper; black card      |
| Recycled       | `#ece2ca` | `#1c2131` | Cream unbleached; navy card at night |
| Kraft          | `#cdb48f` | `#2a2119` | Brown wrapping paper; dark kraft     |

Night is a dark card drawn on with a light gel pen, not an inverted page. The texture is generated like Patina's: seamless SVG tiles of clouding, tooth, fibres and flecks from fixed seeds (the specimen has a quick version in `specimen/paper.js`; Phase 0 ports Patina's six-layer generator). Recycled stock carries more and darker flecks than Patina's papers, because flecks are part of this look. The low-frequency clouding (mottle and relief) is kept almost flat, at a fifth of Patina's: stronger, it read as grease or marble rather than paper.

## Pens

One pen inks the whole interface; choosing a pen re-inks everything.

| Pen            | Day       | Night (gel) | On recycled |
| -------------- | --------- | ----------- | ----------- |
| Navy (default) | `#263152` | `#dde3f2`   | 9.9:1       |
| Soft black     | `#262421` | `#efe9dc`   | 12.0:1      |
| Sepia          | `#4a3020` | `#eedcc6`   | 9.4:1       |
| Forest         | `#23412f` | `#d6e8d9`   | 8.7:1       |
| Oxblood        | `#5c2430` | `#f2d6da`   | 9.3:1       |
| Correction     | `#962a23` | `#f28b80`   | 6.0:1       |

Kraft carries its own darker pens: sepia `#3e2718`, forest `#1b3524`, oxblood `#4d1e28` and correction `#5e1612`. `npm run check:contrast` holds every pen to 4.5:1 against the darkest 1 % of each textured stock and its recess, day and night; the flat-paper ratios above are the starting point, not the test.

**The wash** is each pen thinned (navy `#5b72a8`), the reference's soil colour. It fills art only: a pot, a picture, a highlight shape. It is never text and never the only carrier of meaning (3.7:1 on recycled).

## The line in the interface

How the rules land on controls (see the specimen's Interface section):

| Part                               | Treatment                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Containers                         | Open by default: cards and sections sit on the page, grouped by space and their heading. Boxed: a drawn frame round every card |
| Frames (field, button, boxed card) | Four separate pen strokes whose ends cross or fall short at the corners, as on the label's border                              |
| Primary button                     | A pocket of solid ink with paper text: the one place on a form the eye should land                                             |
| Secondary button                   | A drawn frame                                                                                                                  |
| Destructive button                 | A frame in the correction pen                                                                                                  |
| Hover                              | The pen presses harder: the frame thickens to 2 px                                                                             |
| Focus                              | A dashed pen outline 4 px outside, in the pen colour                                                                           |
| Selected option                    | A pocket of ink inset from the frame (segmented controls), a solid dot (radio), a tick that overshoots the box (checkbox)      |
| Switch                             | A drawn pill; the knob fills with ink when on                                                                                  |
| Tabs                               | A hand underline under the current tab                                                                                         |
| Badge                              | A word circled by the pen, or a small solid pocket for the rare loud one                                                       |
| Table                              | Hand-drawn rules between rows, no boxes                                                                                        |
| Elevation (dialog, menu)           | A drawn frame on paper, plus a second line offset along the right and bottom: the cartoonist's shadow, no blur                 |
| Invalid                            | The field's frame and a message under it in the correction pen                                                                 |
| Disabled                           | A thinner, faded pen                                                                                                           |
| Empty state                        | A drawing from the object library (an empty crate) above a serif line and one action                                           |
| Avatar                             | Initials in serif italic inside a drawn ring, or a seeded object from the library                                              |

Calm controls, lively surfaces, as in Patina: what people operate wobbles less than what they look at.

## Voices

| Voice   | Proposal                                                                                 | Job                                                                 |
| ------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Read    | Newsreader (variable, optical sizes); alternatives EB Garamond, Libre Caslon Text        | Headings, body and interface text                                   |
| Type    | Courier Prime; alternative Cutive Mono (thinner, closer to a fine-liner)                 | Menus, prices, receipts, order numbers: the restaurant's typewriter |
| Label   | The reading serif in tracked small caps, or the typewriter in capitals (a theme setting) | Field labels, metadata, kickers                                     |
| Display | Our own letters: Liner, Stilt, Ribbon, Tramline (below)                                  | Wordmarks, headlines, signs, covers                                 |
| Hand    | Gaegu; alternatives Patrick Hand, Shadows Into Light Two                                 | Asides and annotations only                                         |
| Spine   | The reading serif set vertically, bottom to top                                          | Edition marks and page spines, after the label                      |

The typewriter replaces Patina's code mono: restaurants that use this style print their menus in it. Labels default to the serif's small caps, as on the reference label, and switch to typewriter capitals with `data-labels="type"`.

## Our own letters

Four display faces drawn by the pen from **one skeleton alphabet** (`specimen/lettering/`): every capital, digit, accent (Æ Ø Å Ä Ö Ü É Ï) and common mark as centre-line strokes at cap height 100. The faces differ only in how they stroke the skeleton:

| Face     | Stroke                                                        | Inspired by (not copied from) |
| -------- | ------------------------------------------------------------- | ----------------------------- |
| Liner    | One monoline, with a short serif across every free stroke end | A naive monoline serif        |
| Stilt    | Liner condensed to just over half its width: tall and narrow  | A condensed hand-drawn serif  |
| Ribbon   | Two outlines a stroke-width apart, filled with the pen's wash | An inline sans                |
| Tramline | Three parallel lines, no serifs                               | A multi-line deco sans        |

Each letter takes a small seeded tilt and lift, so a word reads as hand-lettered and still renders the same every time. Today they draw as SVG, named by their text for screen readers. The same skeleton can build real font files: expand the strokes to outlines, then compile OTF and WOFF2 with a few alternates per letter that cycle, as handwriting fonts do. Ribbon needs two layers (outline and fill) or a colour font.

## Motion

**The pen moves; the paper does not.** Motion in this style is drawing: lines that are redrawn, marks that are put down, a picture that is drawn in front of you. Surfaces do not slide, bounce or glow.

**Line boil** is the signature, and an option. A drawing is drawn three times from the same seed with a different pen each time (a labelled fork, `take:1`, `take:2`, so the composition never changes) and the takes cycle, as hand-drawn animation does when every frame is traced again. Rerolling to a new seed shows the opposite: everything changes at once, which reads as rough; boil keeps the thing still and lets only the line breathe.

| Setting (`data-boil`) | What boils                                                  |
| --------------------- | ----------------------------------------------------------- |
| `off`                 | Nothing                                                     |
| `hover` (default)     | A drawing while the pointer is over it (fine pointers only) |
| `art`                 | Every drawing, lettering and scene on screen, all the time  |

Any element can set `data-boil` for its subtree, and the nearest one wins (the choice travels as inherited custom properties), so a hero or an empty state can boil all the time inside a hover page, or a dense screen can switch it off. Heroes and empty states boil on hover like everything else for now; always-on for them can become a setting.

Never boiling: controls, frames round fields, tables and anything a person reads or operates. Boil pauses off screen, and `prefers-reduced-motion` stops it.

Values (proposed): three takes, 120 ms each (about 8 drawings a second, "on threes" at 24 fps); the takes swap by `opacity` in `steps(1, end)`, so nothing reflows. The other moments, from the motion sweep of 2 November 2026:

| Moment                                         | Motion                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reroll, scene or face change                   | The new drawing settles: its three takes play once at 60 ms each (180 ms), then rest on the first                                                                                                        |
| Tick, radio dot, tab underline, chosen segment | The pen puts the mark down: `clip-path: inset(0 100% 0 0)` to `inset(0)`, 140 ms `cubic-bezier(0.23, 1, 0.32, 1)`; removal is instant                                                                    |
| Press                                          | `scale: 0.97`, 160 ms on the same curve                                                                                                                                                                  |
| Dialogs and popovers                           | `opacity: 0; scale: 0.97` to settled, 200 ms on the same curve via `@starting-style`; popovers grow from their trigger (`--transform-origin`), dialogs stay centred; the shadow line follows 40 ms later |
| Empty states, first run, heroes                | The pen draws the picture: strokes draw on with `pathLength="1"` dash offsets, 240 ms each, staggered 18 ms, once per page view                                                                          |

Reduced motion: no boil and no draw-on; marks appear with a 100 ms fade; dialogs fade without scale.

In the specimen: `specimen/motion.js` (takes, settle, draw-on, dialogs) and `specimen/motion.css` (boil, reveals, press, dialog entrance). The Line boil setting switches `data-boil`; Reroll and the scene picker settle; Remove in the States card opens the dialog; the scene and the empty crate draw on the first time they are seen.

## Drawings (the signature)

Patina's signature is seeded riso **prints** of abstract motifs. This kit's is seeded **drawings** of things: an object library drawn by the pen in oblique view, composed into scenes.

- **The pen** (`specimen/pen.js`): a seeded stroke engine. Each stroke is resampled every 3 px and offset along its normal by slow eased noise (wavelength about 40 px) plus a faint tremor; open strokes run past or stop short of their ends; drawn circles go a little past where they started. Every line has the same screen weight (`vector-effect: non-scaling-stroke`), so a 40 px avatar and a 600 px scene are drawn with one pen.
- **Blanks**: an object in front hides lines behind it with a mask, so the paper's texture still shows through the gap.
- **The library** (`objects.js`, `objects/`): a registry where each object is one draw function filed in a collection, so the library page, scenes and the kit's future `<Drawing>` find objects the same way. It is meant to keep growing, now and release after release. 57 objects today:
  - **Indie** (17): turntable, speaker, record shelf, disco ball, record, cassette, radio, guitar, record crate, sunflower, house plant, cactus, pinned picture, chair, armchair, floor lamp, window.
  - **Food & drink** (15): wine bottle, wine glass, carafe, coffee, teapot, plate (fish, toast, pasta or salad), bowl, bread, lemons, candle, moka pot, fork and knife, menu card, bistro table, pendant lamp.
  - **Studio** (16), a creative freelancer's world: laptop, monitor, website, keyboard and mouse, phone, tablet and pen, headphones, camera, desk, office chair, desk lamp, books, sketchbook, sticky notes, mug, coffee to go. Screens show a website wireframe, code, a design canvas or an app.
  - **People** (9): a person with a face (standing, waving or holding a mug), a portrait for avatars, the visitor who is only clothes (standing, walking, holding a record), someone at work seen from behind on an office chair (as a visitor, or with the back of their head), and a cat. Hair (bob, crop, fringe, bun, curls, long, ponytail, waves), glasses, beards, the top (sweater, hoodie, overshirt or tee) and trousers or a short skirt all come from the seed.
- **Scenes** (`scene.js`): a listening room, a freelancer's studio, a bistro table for two and someone at work at a desk under a window, each composed back to front inside the drawn border.

The generated explorations in `docs/style/explorations/` (gpt-image, from the label photograph) show where the library can grow: kitchen, desk, balcony at night, chair, lamp, teapot, radio, window, cassette. They are direction, not assets: everything the kit ships is drawn by code from a seed.

## Open choices

The plan tracks these as decisions; the direction itself (S1) is agreed.

1. Typewriter face: Courier Prime or Cutive Mono; labels in small caps or typewriter by default.
2. Default pen: navy, as in the reference.
3. Reading face: Newsreader, EB Garamond or Libre Caslon Text.
4. Hand face: Gaegu, Patrick Hand or Shadows Into Light Two, or no hand voice at all.
5. Stocks: recycled, kraft and bond, each with a night card.
6. Frames: drawn by the pen at measured size (truest to the reference; needs a small script per frame, so no server rendering) or filtered CSS borders (no script, server-rendered). In the specimen the filtered frames read nearly as well, so the recommendation is filtered frames for anything that resizes and the pen only where a shape is fixed.
7. The correction pen as the only second colour.
8. The wash as an art-only second tone.
9. Our own letters: which of the four faces to keep, and whether to build them as font files now.
