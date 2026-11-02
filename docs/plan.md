# Plan

Status: Phase S (style agreement) in progress, 2026-11-02. The style proposal and its specimen are ready for review; nothing below is decided until a row in [Decisions](#decisions) says so. This file is the progress record: update a phase's checklist and the [log](#progress-log) as work lands.

## What this is

Naive Indie Line (working name) is a shadcn/ui component library in the style of a natural-wine label: one fine-liner on unbleached paper, a slow wobbly line, flattened perspective, no shading, and small pockets of solid ink. Its signature is **seeded drawings**: a library of everyday objects drawn by a pen engine and composed into rooms, each one different and the same on every render.

It repeats [Patina UI](https://github.com/ossianravn/patina-ui) (`C:\CodexApp\patina-ui`) in a new style. Patina's **logic** carries over: the kit/site split, shadcn parity on Base UI, seeded variation, generated paper, the appearance runtime, the registry and its install tests, the docs site, the playground, the theme studio and a demo product. Patina's **look** does not: no riso drums, no misregistration, no three-voice type, no paper wear. Patina took its style from an existing site (Mental Models); this one starts from a photographed wine label, so the style is agreed first ([Style brief](style.md)).

## Goals

1. **The style, agreed and specified**: rules, tokens and a specimen the maintainer signs off before any kit code is written (Phase S).
2. **shadcn parity**: every `registry:ui` item in the current shadcn release, restyled, with shadcn's names, props, variants and `data-slot` attributes, built on Base UI, as Patina did.
3. **Seeded drawings as a system**: the pen engine, an object library, scene composition and formats (spot, scene, avatar, border), used in empty states, avatars, covers, headers and share images, with a playground to explore seeds.
4. **Extras the style suggests**: label cards with a spine, record sleeves, track lists, hand notes with arrows, circled words, price tags and the drawn border.
5. **A demo site**: home, component docs, the playground, a theme studio and a demo product used end to end.
6. **Installable** through the shadcn CLI into fresh Vite and Next.js apps.
7. **Quality**: WCAG 2.2 AA on every stock in day and night, and the "would Apple ship this" bar.

## Non-goals for v1

- A copy of the reference label or of anyone's illustrations. The reference teaches the rules; the drawings are our own code.
- Raster illustration assets. Generated images are direction only; everything the kit ships is drawn by code from a seed.
- A hand-drawn interface typeface. Interface text stays in a proven book serif.
- Faces, mascots or stickers. The people in drawings are their clothes.
- Backend services in the demo, and ports to other frameworks (the pen engine stays framework-free so a port remains possible).

## How it differs from Patina UI and Looseleaf

|                | Looseleaf                            | Patina UI                                    | Naive Indie Line                                         |
| -------------- | ------------------------------------ | -------------------------------------------- | -------------------------------------------------------- |
| Metaphor       | Pen on paper, stickers, a mascot     | Riso print shop and field notebook           | A natural-wine label: one fine-liner on recycled paper   |
| Colour         | Several                              | Seven drums, three per print, overprinted    | One pen; a red correction pen; the pen's wash for art    |
| Type           | One hand-drawn face                  | Serif to read, mono to label, hand to annotate | A book serif to read and label (small caps); hand for asides |
| Signature art  | Seeded strokes                       | Abstract seeded riso prints                  | Figurative seeded drawings: objects, rooms, absent people |
| Surfaces       | Drawn boxes                          | Cut, tilted, aged paper sheets with shadows  | Flat paper and drawn frames; no shadows, no wear         |

## Decisions

Style decisions (S) wait for the maintainer; the [Style brief](style.md#open-choices) explains each one.

| #   | Decision                                                                                                   | Status   | Notes                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| S1  | **Direction**: one pen, rare solid ink, oblique drawings of rooms and absent people                        | proposed | The specimen shows it on controls and drawings                                                                                   |
| S2  | **Pens**: navy (default), soft black, sepia, forest, oxblood, each with a night gel pen                    | proposed | All pass AA as text on every flat stock                                                                                          |
| S3  | **Reading face**: Newsreader                                                                               | open     | Recommended for its optical sizes and screen legibility; EB Garamond is closest to the label but small at UI sizes; Libre Caslon Text is sturdier |
| S4  | **Hand face**: Gaegu                                                                                       | open     | Recommended: a monoline, naive hand that matches a fine-liner; Patrick Hand is plainer, Shadows Into Light Two quicker and thinner |
| S5  | **Stocks**: recycled (default), kraft, bond, each with a night card                                        | proposed |                                                                                                                                  |
| S6  | **Frames**: filtered CSS borders for controls and cards; the pen draws drawings, marks and fixed-shape borders | open  | Recommended. Pen-drawn frames are truer at the corners but need a script to measure each box, so they cannot render on the server; in the specimen the filtered frames read nearly as well |
| S7  | **Correction pen** (red) as the only second colour, for errors and destructive actions                     | proposed |                                                                                                                                  |
| S8  | **The wash**: each pen thinned, for art fills only                                                         | proposed | From the soil in the reference's pot; never text or sole meaning                                                                  |
| S9  | **Two type families**: labels are the serif in tracked small caps, no mono                                 | proposed | Matches the label; keeps the kit visibly apart from Patina                                                                       |
| S10 | **Library name** and wordmark                                                                              | open     | "Naive Indie Line" is the style's name; the kit may want its own                                                                 |
| S11 | **Demo product**                                                                                           | open     | Proposal: a small record shop's listening room (catalogue, listening-session bookings, Thursday events, a wine list, settings)   |

Logic decisions (L) follow Patina's, carried over by request; each still needs the maintainer's confirmation where Patina's did.

| #   | Decision                                                                                         | Status   | Patina source |
| --- | ------------------------------------------------------------------------------------------------ | -------- | ------------- |
| L1  | Kit and site in one repository: kit in `src/<kit>/`, site around it                             | proposed | D1            |
| L2  | Base UI primitives (shadcn `base-nova`)                                                          | proposed | D2            |
| L3  | Site on Astro with React islands and MDX                                                         | proposed | D3            |
| L4  | Rendering: CSS draws frames, SVG draws drawings and marks, nothing measures (see S6)             | proposed | D4            |
| L5  | Seed model: Patina's `seedOf`, `prng`, `fork`, `stream`, unchanged                               | proposed | D5            |
| L6  | Paper generated by our own script as seamless SVG tiles                                          | proposed | D9            |
| L7  | Hosted shadcn registry generated from the source tree                                            | proposed | D8            |
| L8  | Proportional verification; first lasting tests at the registry install contract and seed stability | proposed | D10         |
| L9  | MIT license for code, art and generated textures                                                 | proposed | D11           |
| L10 | Parity items keep shadcn's own dependencies                                                      | proposed | D12           |

## What carries over from Patina

| Patina part                                    | Here                                                          | Change                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ink/seed.ts`                                  | Pen engine's seed module                                      | Copied as is                                                                                 |
| `ink/rough.ts` (rough.js)                      | The pen (`specimen/pen.js` today)                             | Our own monoline stroke: rough.js draws sketchy double strokes the reference does not have    |
| `ink/filters.ts`, `<PatinaDefs>`               | Wobble filters and `<Defs>`                                   | Same mechanism, one wobble per hand, no grain or wash filters                                 |
| `ink/motifs/`, `print()`, `<Print>`            | Objects, scenes, `drawing()`, `<Drawing>`                     | Figurative objects in oblique view instead of abstract motifs; blanks (masks) for overlap     |
| `ink/paper-shapes.ts`, `<Paper>`               | Drawn border and label card                                   | No wear, tilt or cut edges                                                                    |
| `styles/` tokens, stocks, inks                 | Tokens, stocks, pens                                          | One pen per document instead of drums and ink sets                                            |
| `theme/` appearance runtime                    | Same                                                          | Attributes: theme, stock, pen, hand, density                                                  |
| `marks/`                                       | Frame, underline, ring (circled word), strike, arrow note, tick | No highlighter, tape or stamp: they rely on tone or colour                                  |
| `tools/paper/`, `tools/check-contrast.mjs`, `tools/registry/`, `tests/consumer/` | Same | New stocks and surfaces                                                                       |
| Site: specimen, Press, docs, studio, Fieldbook | Specimen, the drawing desk, docs, studio, the demo product    | Desk rerolls drawings instead of prints                                                      |

## Phases

Each phase ships kit parts with the site pages and demo screens that use them, as in Patina.

### Phase S: agree the style (current)

- [x] Initialise the repository on `main` with the GitHub remote (2026-11-02)
- [x] Study the reference and Patina's documents and engine
- [x] Generate three explorations with gpt-image: objects, scenes, an imagined interface (`docs/style/explorations/`)
- [x] Write the [style brief](style.md)
- [x] Build the specimen (`specimen/`): pen engine, ten objects, a seeded room, an interface sampler, paper, pens and voices, with switches for every open choice
- [x] Check the specimen in day and night, on recycled and kraft, at 1440, 800 and 375 px
- [ ] Maintainer review: agree S1–S11, or redirect
- [ ] Fold the agreed choices into the specimen and the brief; drop the losing options

Exit: the maintainer signs off the specimen as the style.

### Phase 0: foundations

Port Patina's scaffold: Astro, React 19, Tailwind CSS 4, shadcn `base-nova`, path aliases, ESLint boundaries (kit imports nothing from the site; the pen engine imports no React or DOM and never calls `Math.random()` or `Date.now()`), Prettier and the scripts. Tokens from the agreed specimen; a `golden-ratio-ux` audit of type and spacing; the paper generator with the three stocks and their night cards; the appearance runtime with its pre-paint script; the contrast check against textured paper; `<Defs>`; the specimen as the site's first page. AGENTS.md grows Patina's verification and design sections.

Exit: the specimen page renders from the kit on every stock, day and night, at 1440 and 390 px; every text pair passes 4.5:1 on textured paper; typecheck, lint and build pass.

### Phase 1: the pen and the drawings (the signature)

Port the pen into the framework-free engine with labelled forks per object part, snapped inputs and no `**` or `Math.pow` (Patina's cross-engine rules). Object library v1: the specimen's ten plus ten from the explorations (chair, armchair, lamp, teapot, cup, radio, window, cassette, crate, cactus). Scene composition, formats (spot, scene, avatar, border), `<Drawing>` and `drawing()`. Marks: frame, underline, circled word, strike, tick, arrow note, chevron, pill. The drawing desk playground (seed, object or scene, hand, reroll, copy, download SVG). First registry build and install test.

Exit: server and browser render identical SVG for the same seed; the desk rerolls; `base` and `drawing` install into a scratch Vite app that builds.

### Phase 2: core primitives and the demo product's first screens

Button, badge, card, input, textarea, label, field, checkbox, radio group, switch, select, native select, tabs, toggle, toggle group, separator, skeleton, avatar (seeded fallback), alert, progress, slider, kbd, tooltip, popover, dialog, alert dialog, dropdown menu, spinner; docs pages with state matrices; the demo product's list screen, sign-in and settings.

Exit: as Patina's Phase 2, including a `break-ui` pass on the demo screens and the first consumer install test.

### Phase 3: data, navigation and the rest of parity

Table, pagination, breadcrumb, accordion, collapsible, command, combobox, sheet, drawer, menubar, navigation menu, context menu, hover card, calendar and date picker, chart (pen-drawn strokes at exact data positions; series told apart by solid, outline and dotted marks rather than colour), sonner, sidebar, scroll area, resizable, carousel, input OTP, input group, button group, empty, item, aspect ratio, typography, direction and the conversation set.

Exit: parity complete; a 200-row table scrolls without dropped frames.

### Phase 4: extras, blocks, the home page and the theme studio

Label card with spine text, record sleeve, track list, tasting note, price tag, hand note with arrow, edition number, drawn border, room header. Blocks: sign-in, settings, dashboard, pricing, article, empty state, hero. The home page with scenes built from real components; the theme studio with presets and export.

### Phase 5: release v0.1

Docs complete, changelog, share images drawn by the pen, consumer installs into Vite and Next.js, an accessibility review, a performance check, deployment once the maintainer approves.

## Risks

| Risk                                                                   | Mitigation                                                                                                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Figurative drawings by code look like clip art or repeat               | Seeded parameters per object part, a growing library, curated scene rules, the desk for rerolling; the explorations set the bar          |
| Many strokes and masks cost paint time                                 | Static rendering at build time; one mask per depth layer (nested masks made the first specimen too slow to screenshot); a measured budget |
| Pen noise drifts between JavaScript engines                            | Patina's rules: snap inputs, no `**`; Node and Chromium compared over many seeds before the seed promise                                 |
| A 1.35 px line looks faint on low-density screens                      | Check on a 1× display; a heavier pen at compact density or for night paper if needed                                                     |
| Handwriting is hard to read                                            | Hand voice for asides only, at 1.3 rem or larger; everything essential exists in the serif                                               |
| Too close to Patina or Looseleaf                                       | One pen, figurative drawings and an editorial serif; the comparison table above                                                          |
| Pen-drawn frames need measuring (S6)                                   | Filtered CSS frames for anything that resizes; the pen only where the shape is fixed                                                     |

## Progress log

- **2026-11-02**: Repository initialised. Read Patina's plan, design language, seeded variation and architecture. Three gpt-image explorations (objects, scenes, an imagined listening-room interface) all held the style closely. Built the specimen: a monoline pen with slow eased wobble, corner overshoot and circle loops; blanks as masks; ten objects; a seeded room; paper tiles; the interface sampler with drawn and filtered frames. The first scene with one nested mask per blank timed out the browser's screenshot; one mask per depth layer fixed it. Checked day and night, recycled and kraft, at 1440, 800 and 375 px, with no horizontal scroll. Waiting on the maintainer for S1–S11.

## Open questions for the maintainer

1. Does the specimen capture the style (S1)? What should change first?
2. Reading face (S3) and hand face (S4).
3. Frames (S6): filtered CSS frames everywhere they resize, as recommended?
4. Library name (S10) and demo product (S11).
5. License (L9): MIT, as Patina?
