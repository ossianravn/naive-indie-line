# Style brief

Status: proposal for agreement, 2026-11-02. Nothing here is decided until the [plan](plan.md#decisions) says so. Once agreed, this brief becomes `docs/design-language.md` (Patina's equivalent) and the specimen's values become the kit's tokens.

The live specimen (`specimen/`, served by `python -m http.server 4791` from the repository root, then `http://127.0.0.1:4791/specimen/`) shows every proposal below and switches between the options still open.

## The style in one line

**One fine-liner on unbleached paper.** A single thin pen in dark navy, wobbling gently and running a little past its corners; flattened, slightly wonky perspective; no tone at all, only empty paper and a few small pockets of solid ink; everyday things, and people who are only their clothes.

It comes from natural-wine labels and indie record sleeves (zine culture, underground comix, outsider art). The reference is a photographed label for a record shop's pét-nat: a room corner with a disco ball, a turntable on a shelf of records, a potted sunflower, a pinned drawing of a treehouse, and three headless figures. The photograph is kept unpublished in `.dev-docs/reference/`, because the label is someone else's artwork.

## What the reference shows

Facts from the label, which the rules below generalize:

- **Line**: one monoline weight throughout, about 0.25 % of the label's width; a slow wobble rather than jitter; no doubled or sketchy strokes. Corners often cross or fall short: the border's top line runs past its left edge.
- **Fill**: no gradients, hatching or shading. Solid ink appears in about six places only: the disco ball's tiles, the record on the platter, the record a figure holds, the treehouse, the pins and the soil in the pot.
- **A second tone**: the soil in the pot is a lighter, brighter blue than the line, the one place the ink looks thinned.
- **Perspective**: oblique and intuitive. The shelf, turntable and speakers tip toward the viewer, and each object has its own idea of depth.
- **Composition**: a hand-drawn rectangular border inset from the paper's edge; a picture within the picture (the pinned treehouse); a sweeping floor curve; plenty of empty wall.
- **Subjects**: domestic objects (records, speakers, a plant) and absent people: a shirt and trousers with nobody in them, a collar ring where a head would be.
- **Type**: a classical book serif in the same ink, small and quiet, set vertically up the right edge ("Pétillant Naturel") and as a tiny credit at the bottom left.
- **Paper**: cream unbleached stock with dark flecks and fibres.

## Rules

1. **One pen, one weight.** Every line is the same thin monoline (1.35 px), in one ink. A second pen, the red **correction pen**, appears only for errors and destructive actions.
2. **Contours, not tone.** No gradients, hatching or drop shadows. Things are their outlines.
3. **Ink is rare.** Solid fill marks the few places the eye should land: a record, a tile, the selected option, the one button to press.
4. **A slow hand.** Lines wobble gently and run past their corners; nothing is ruled. Operated controls get a steadier hand than drawings.
5. **Flattened perspective.** Objects tip toward the viewer in an oblique view, and neighbours disagree a little about depth.
6. **Air is the material.** Most of the sheet stays empty paper. Space groups things before boxes do; frame only what you would frame on paper (a card, a field, a button).
7. **Quiet type.** A book serif set small, like the words on a label. A hand only for asides.
8. **Quietly strange.** Everyday things, and people who are only their clothes. Whimsy stays deadpan: no faces, no mascots, no jokes in the interface copy.

## Paper

| Stock              | Day       | Night     | Character                               |
| ------------------ | --------- | --------- | --------------------------------------- |
| Recycled (default) | `#ece2ca` | `#1c2131` | Cream unbleached; navy card at night    |
| Kraft              | `#cdb48f` | `#2a2119` | Brown wrapping paper; dark kraft        |
| Bond               | `#f4f0e6` | `#1b1b1a` | Bright cotton paper; black card         |

Night is a dark card drawn on with a light gel pen, not an inverted page. The texture is generated like Patina's: seamless SVG tiles of clouding, tooth, fibres and flecks from fixed seeds (the specimen has a quick version in `specimen/paper.js`; Phase 0 ports Patina's six-layer generator). Recycled stock carries more and darker flecks than Patina's papers, because flecks are part of this look.

## Pens

One pen inks the whole interface; choosing a pen re-inks everything.

| Pen            | Day       | Night (gel) | On recycled |
| -------------- | --------- | ----------- | ----------- |
| Navy (default) | `#263152` | `#dde3f2`   | 9.9:1       |
| Soft black     | `#262421` | `#efe9dc`   | 12.0:1      |
| Sepia          | `#4a3020` | `#eedcc6`   | 9.4:1       |
| Forest         | `#23412f` | `#d6e8d9`   | 8.7:1       |
| Oxblood        | `#5c2430` | `#f2d6da`   | 9.3:1       |
| Correction     | `#a3302a` | `#f28b80`   | 5.4:1       |

Kraft darkens the correction pen to `#7d211c` to keep 4.5:1. Every pen passes AA as text on every flat stock; the textured check (Patina's `check:contrast`) comes with Phase 0.

**The wash** is each pen thinned (navy `#5b72a8`), the reference's soil colour. It fills art only: a pot, a picture, a highlight shape. It is never text and never the only carrier of meaning (3.7:1 on recycled).

## The line in the interface

How the rules land on controls (see the specimen's Interface section):

| Part                  | Treatment                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Frames (card, field)  | Four separate pen strokes whose ends cross or fall short at the corners, as on the label's border           |
| Primary button        | A pocket of solid ink with paper text: the one place on a form the eye should land                          |
| Secondary button      | A drawn frame                                                                                               |
| Destructive button    | A frame in the correction pen                                                                               |
| Hover                 | The pen presses harder: the frame thickens to 2 px                                                          |
| Focus                 | A dashed pen outline 4 px outside, in the pen colour                                                        |
| Selected option       | A pocket of ink inset from the frame (segmented controls), a solid dot (radio), a tick that overshoots the box (checkbox) |
| Switch                | A drawn pill; the knob fills with ink when on                                                               |
| Tabs                  | A hand underline under the current tab                                                                      |
| Badge                 | A word circled by the pen, or a small solid pocket for the rare loud one                                    |
| Table                 | Hand-drawn rules between rows, no boxes                                                                     |
| Elevation (dialog, menu) | A drawn frame on paper, plus a second line offset along the right and bottom: the cartoonist's shadow, no blur |
| Invalid               | The field's frame and a message under it in the correction pen                                              |
| Disabled              | A thinner, faded pen                                                                                        |
| Empty state           | A drawing from the object library (an empty crate) above a serif line and one action                        |
| Avatar                | Initials in serif italic inside a drawn ring, or a seeded object from the library                           |

Calm controls, lively surfaces, as in Patina: what people operate wobbles less than what they look at.

## Voices

| Voice | Proposal                                    | Job                                         |
| ----- | ------------------------------------------- | ------------------------------------------- |
| Read  | Newsreader (variable, optical sizes); alternatives EB Garamond, Libre Caslon Text | Headings, body and interface text |
| Label | The reading serif in tracked small caps     | Field labels, metadata, kickers. No mono face |
| Hand  | Gaegu; alternatives Patrick Hand, Shadows Into Light Two | Asides and annotations only     |
| Spine | The reading serif set vertically, bottom to top | Edition marks and page spines, after the label |

Two families instead of Patina's three: the label voice is the serif in small caps, which is what the reference does, and it keeps this kit visibly apart from Patina's mono labels.

## Drawings (the signature)

Patina's signature is seeded riso **prints** of abstract motifs. This kit's is seeded **drawings** of things: an object library drawn by the pen in oblique view, composed into scenes.

- **The pen** (`specimen/pen.js`): a seeded stroke engine. Each stroke is resampled every 3 px and offset along its normal by slow eased noise (wavelength about 40 px) plus a faint tremor; open strokes run past or stop short of their ends; drawn circles go a little past where they started. Every line has the same screen weight (`vector-effect: non-scaling-stroke`), so a 40 px avatar and a 600 px scene are drawn with one pen.
- **Blanks**: an object in front hides lines behind it with a mask, so the paper's texture still shows through the gap.
- **Objects** (`things.js`, `living.js`): turntable, speaker, record shelf, disco ball, sunflower, house plant, pinned picture (treehouse, moon or hills), bottle, glass and the visitor (a shirt and trousers, standing, walking or holding a record). Each draws its own depth angle from the seed.
- **Scenes** (`scene.js`): a room corner composed back to front inside the drawn border.

The generated explorations in `docs/style/explorations/` (gpt-image, from the label photograph) show where the library can grow: kitchen, desk, balcony at night, chair, lamp, teapot, radio, window, cassette. They are direction, not assets: everything the kit ships is drawn by code from a seed.

## Open choices

These are the style decisions to agree before Phase 0; the plan tracks them as decisions S1–S8.

1. Is the direction right: one pen, rare ink, oblique drawings of rooms and absent people?
2. Default pen: navy, as in the reference.
3. Reading face: Newsreader, EB Garamond or Libre Caslon Text.
4. Hand face: Gaegu, Patrick Hand or Shadows Into Light Two, or no hand voice at all.
5. Stocks: recycled, kraft and bond, each with a night card.
6. Frames: drawn by the pen at measured size (truest to the reference; needs a small script per frame, so no server rendering) or filtered CSS borders (no script, server-rendered). In the specimen the filtered frames read nearly as well, so the recommendation is filtered frames for anything that resizes and the pen only where a shape is fixed.
7. The correction pen as the only second colour.
8. The wash as an art-only second tone.
