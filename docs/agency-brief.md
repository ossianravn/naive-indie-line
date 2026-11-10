# Brief: the agency drawings and BAGHUSET

Status: proposed 2026-11-10, written by Claude Fable 5.2 for Claude Opus 5.5 to build. Nothing here is decided by the
maintainer yet; the choices he still owns are listed under [Open choices](#open-choices). Follow `AGENTS.md` throughout:
this brief adds scope and contracts, it replaces no rule.

Two tasks, built in this order because the second needs the first:

1. **The agency wave.** More drawings, new poses, two engine additions and six extras, so the kit can carry a design
   studio's or agency's site as well as it carries a record shop and a restaurant.
2. **BAGHUSET.** A third demo: a made-up drawing office as a one-page website whose page is the building it works in.

## Where things stand

- "Agency" has no home in the repository yet. The nearest thing is the `studio` collection (16 objects: laptop, monitor,
  website, keyboard, phone, tablet, headphones, camera, desk, office chair, desk lamp, books, sketchbook, sticky notes,
  mug, coffee to go) and two boxed scenes, `studio` and `work` (`src/fineliner/pen/objects/rooms.ts`).
- Open rooms exist for one scene only (`room`, formats `wide` and `tall`), used by `hero-01`. The plan still lists the
  studio, bistro and work scenes in open formats as undone.
- A scene's SVG is flat: `stage().put()` draws into layers and nothing records where an object landed, so a page cannot
  put a button over the lamp without guessing coordinates.
- The maintainer's standing complaints, which this work must answer: scenes boxed in isolation, scenes where nothing
  happens, demos that use few parts in a template layout, anything slow or unsteady on a phone.

## The idea in short

**Flat things are the interface; the pen draws everything else.** A studio is full of flat rectangles: sheets pinned to
a wall, sticky notes, a whiteboard, a receipt, a sign, a form on a desk. Those are real HTML in the kit's frames, so
they hold text, reflow and can be operated. Everything with depth (tables, people, the plan chest, the plotter) is drawn
by the pen. The page reads as one room because the two meet on shared lines: the wall, the floor, a pin.

**The page is the building.** BAGHUSET is a back building (a _baghus_), so the one-pager is its section, roof to street.
Each page section is a storey. A storey is a wall of HTML above a drawn strip of floor where something is happening, and
storeys are joined by floor slabs, the outer walls and a staircase that zigzags down the page.

**The tools on the table are the controls.** The pot of fineliners picks the pen, the stack of paper picks the stock,
the lamp switches day and night. The kit's theming is shown as what an agency does: try it in your colour.

```
 demo strip: ← Fineliner · Show parts · Appearance
 header:     BAGHUSET        Work  Studio  People        [Write to us]
 ┌─────────────────────────────────────────────────────────────┐
 │  B A G H U S E T          one line · two actions     (sky)  │  Roof: hero
 │  ____/\________[skylight, someone waving]___[chimney, bird] │
 ╞═════════════════════════════════════════════════════════════╡
 │ 2  Work   [Identity|Web|Print|Type]                         │  Top floor
 │    ▢ ▢ ▢ ▢ ▢ ▢   sheets pinned to the wall (HTML)           │
 │  stepladder+pinning · someone pointing · plan chest · stair │  strip (SVG)
 ╞═════════════════════════════════════════════════════════════╡
 │ 1  Studio  services · the whiteboard · what it costs        │  Middle floor
 │  table: pen pot · paper · lamp · someone drawing · plotter  │
 ╞═════════════════════════════════════════════════════════════╡
 │ St. People  about · the five · clients                      │  Ground floor
 │  lunch table · coat rack · someone on the phone · the cat   │
 ╞═════════════════════════════════════════════════════════════╡
 │ Write to us  the brief on a sheet · address · hours         │  Street
 │  bicycle · street door, sign, letterbox · a courier         │
 └────────────────────────── pavement ─────────────────────────┘
```

Rejected, so the build does not drift back to them: one sticky room redrawn as the page scrolls (a large SVG repainting
under moving text breaks the phone rules, and the maintainer passed over "a day in the shop" for the home page); a wide
and a tall drawing per section as `hero-01` does (five storeys would double a page that must stay under 100 KB); objects
as separate drawings standing on a CSS line (no overlap, so it reads as clip art in a row).

## Task 1: the agency wave

### 1a. Drawings

All go in the kit. Follow `skills/fineliner-drawings/SKILL.md` and its references, and `docs/ideas.md` ("What the
brainstorms got wrong"): no brands, one pocket of ink or wash at most, one thing per tile, nothing smaller than the
pen's wobble. Each is drawn from scratch, looked at large over four seeds in both hands, and kept only when it would sit
unnoticed beside the chair, the mug and the turntable.

New files in the `studio` collection (add each to the `drawings-studio` group in `tools/registry/items.json` and to
`objects/studio.ts`; basenames must stay unique across the kit). **B** marks what BAGHUSET needs; build those first.

| File          | Id                | Drawing                                                                  | Ink or wash   | Serves                          |
| ------------- | ----------------- | ------------------------------------------------------------------------ | ------------- | ------------------------------- |
| `tools.ts`    | `pen-pot` B       | A cup of fineliners and pencils, a ruler standing in it, one pen capless | One cap       | Identity, illustration; the pen |
|               | `fineliner` B     | An uncapped fineliner lying beside its own test squiggle                 | The cap       | Drawing, type, "how we work"    |
|               | `swatch-fan` B    | Five colour chips fanned on a rivet                                      | One chip wash | Identity, colour                |
|               | `cutting-mat`     | A mat with a steel rule and a scalpel across it                          | None          | Packaging, craft                |
|               | `scissors`        | Scissors, open                                                           | None          | Editing                         |
|               | `tape`            | A roll of masking tape with a torn end                                   | None          | Fixes, small jobs               |
|               | `rubber-stamp`    | A stamp standing by its ink pad                                          | The pad       | Approved, sign-off              |
| `papers.ts`   | `paper-stack` B   | A stack of loose sheets, the top corner lifted                           | None          | Deliverables; the paper         |
|               | `paper-rolls` B   | Three rolled drawings standing in a bin                                  | None          | Plans, archive                  |
|               | `folder` B        | A portfolio tied with string, a label on it                              | None          | A case study, a project         |
|               | `proof` B         | A printed sheet with crop marks and a colour bar, a loupe on it          | One bar wash  | Print                           |
|               | `photo-prints`    | Three instant photos fanned                                              | One picture   | Photography, art direction      |
|               | `crumpled-drafts` | A wire waste basket of paper balls, one on the floor                     | None          | Iterations, 404, empty          |
|               | `mood-board` B    | A pinboard of scraps and a string between two pins (takes `w`, `h`)      | The pins      | Strategy, research              |
|               | `award`           | A small trophy: a pencil on a plinth                                     | The tip       | Recognition                     |
| `workshop.ts` | `plan-chest` B    | Flat-file drawers, one ajar with a sheet's edge showing (takes `w`)      | The handles   | The archive                     |
|               | `trestle-table` B | A long top on two trestles (takes `w`, `d`; returns its top as a `Box`)  | None          | The shared table                |
|               | `stool` B         | A three-legged stool                                                     | None          | Seating                         |
|               | `whiteboard` B    | A board on castors with a marker tray (takes `w`, `h`)                   | One marker    | Process                         |
|               | `plotter` B       | A large-format printer on a stand, a sheet curling out                   | None          | Production                      |
|               | `stepladder` B    | An A-frame ladder with three steps                                       | None          | Reaching, installing            |
|               | `drawing-board`   | A tilted board on a stand, a sheet clipped to it, a T-square             | The clip      | Craft                           |
|               | `wall-clock`      | A round wall clock, the hands from the seed                              | The hub       | Hours, turnaround               |
|               | `coat-rack` B     | A stand with a tote bag and a scarf on it                                | None          | Arrival, the team               |

New file `street.ts` in the `everyday` collection (group `drawings-everyday`):

| Id               | Drawing                                                             | Ink              |
| ---------------- | ------------------------------------------------------------------- | ---------------- |
| `street-door` B  | A front door seen straight on: letterbox, bell, a step              | The letterbox    |
| `hanging-sign` B | A blank board on a wall bracket (a page letters it; takes `w`, `h`) | None             |
| `bicycle` B      | A city bicycle leaning on its stand, a basket in front, few spokes  | The saddle       |
| `bird`           | A small bird standing, in profile                                   | The eye and beak |

People (`people` collection). Add poses to `figure()` (`figures.ts`, through `clothes()`'s `swing`) and one seated
figure in a new file; add each new file to `drawings-people`. People have faces, and in a strip they face different
ways (S20).

| Pose or id                                         | What                                                                                                                                                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pose `point`                                       | One arm out level towards what they present; turned in profile to it                                                                                                       |
| pose `reach`                                       | One arm straight up, the hand at a sheet; for the stepladder                                                                                                               |
| pose `carry`                                       | Both forearms forward under a load; returns the hands so a scene puts rolls or a parcel there                                                                              |
| pose `call`                                        | A hand at the ear                                                                                                                                                          |
| `person-sitting` (new object)                      | Seated in profile on a stool, either way round; option `pose`: `draw` (arm on the table, pen in hand), `mug`, `rest`. Built like `seated.ts`, same proportions and clothes |
| `person-pointing`, `person-carrying` (new objects) | Tiles for the library pages, as `person-cheer` and `person-listening` are                                                                                                  |

Done when: contact sheets of every new id (four seeds, both hands) have been looked at large and fixed; the tile check
in `render.mjs` is clean; every object and scene that existed before hashes the same as before (the recipe is in
`HANDOFF.md`, "Proving nothing else changed"); the counts in `docs/style.md`, `src/pages/desk.astro` and the drawings
pages are updated; `docs/ideas.md` moves what was drawn out of "Later".

Drawing may go to Codex per `AGENTS.md` (`gpt-6.1-sol`, `xhigh`, one file per run, fixed specs from the tables above);
the review at full size is the work, and expect two to four rounds per file.

### 1b. Engine: regions and the strip format

Two additions to `src/fineliner/pen/`, both framework-free and seeded.

**Regions: where each placed object landed.**

- `Sheet` gains `measure(draw: () => void): Bounds | undefined`, the box of everything put on the sheet while `draw`
  runs (strokes, fills, washes, blanks), and `regions: Region[]`, where `Region` is `{ key, id, box }`.
- `stage().put(id, key, …)` wraps `place()` in `measure` and records a region under its `key`. A scene may also record
  a part of an object it wants addressable (the whiteboard's face, the sign's board).
- `sceneRegions({ scene, format, seed, hand })` composes take 0 and returns `{ size, regions }` keyed by `key`, in the
  drawing's own units. Composition never comes from the pen, so one take's regions hold for all three.
- The SVG that `drawing()` returns does not change by a byte. Prove it with the hash comparison.

**The strip: one open drawing for every width.** `SceneFormat` gains `"strip"`: about 1600 by 520, no border, the floor
line past both edges, no back wall drawn (the page's wall is above it). It is composed to be cropped from the centre:
the moment and everything operable sit within x 400 to 1200, and what stands outside is furniture a phone can lose. A
wide container shows all of it; a narrow one shows the middle half at the same scale as today's tall room. One SVG
serves both, which is what keeps a five-storey page inside its HTML budget. Document both additions in
`docs/architecture.md`.

### 1c. Extras

Six new extras in `src/fineliner/extras/`, each with a docs page and demo as `docs/extras.md` requires, each its own
registry item, each rendering on the server. Add their rows to `docs/extras.md`.

| Extra                        | What it is                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pinned` (pinned)            | A sheet fixed to the wall: a framed paper surface holding any content, fixed by `pin` (a dot of ink), `tape` (two strips in the wash) or `clip`; a few seeded degrees off true at the lively hand, straight at the calm one. As a link or button the whole sheet is the target and it never tilts further on hover; the pen presses harder instead                                                                                |
| `StickyNote` (sticky-note)   | A small square note in the hand voice (1.3 rem or larger), an outline with a curled corner and a band of wash along its glued edge. The wash never sits behind text                                                                                                                                                                                                                                                               |
| `Receipt` (receipt)          | A till receipt: `ReceiptLine` rows in the typewriter with dotted leaders, `ReceiptTotal` under a doubled rule, a torn lower edge drawn in CSS. For estimates, order summaries, invoices. Data never boils or animates                                                                                                                                                                                                             |
| `Stamp` (stamp)              | A rubber-stamp mark: a word in typewriter capitals inside a doubled drawn frame, a few seeded degrees off true. Put down like the kit's other marks (the 140 ms clip reveal), a fade under reduced motion. In the pen; the correction pen only for a destructive meaning                                                                                                                                                          |
| `SceneSpots` (scene-spots)   | A scene with operable places: renders the `<Drawing>` and, over it, one `SceneSpot` per named region, positioned in percentages from `sceneRegions()` at render time (nothing measures). A spot is a real button or link (it takes the kit's trigger parts through `render`), at least 44 px on a coarse pointer, with a visible label in the label voice; on hover and focus the pen rings the object. Spots follow in DOM order |
| `RoomSection` (room-section) | A page section with a room in it: its children on the wall, then a scene strip along its floor, cropped from the centre on narrow containers (`width: max(100cqw, …)`, as `hero-01` crops its wide room), drawn on the first time it is seen. Takes `scene`, `seed`, an optional `SceneSpots` layer, and `side` for a stair or wall edge. This is the open room for any section, and closes the plan's `RoomHeader` open item     |

Rules for all six: sized to their content; no tilt on anything operated; forced colours keep borders and focus; each
checked at 390 and 1440, day and night, on two stocks, with long content.

When the page has settled, lift what proved general into blocks (`work-01`: a filterable wall of pinned work;
`contact-01`: a brief on a sheet with its receipt). Not before.

## Task 2: BAGHUSET

`/baghuset`, in `src/site/baghuset/` and `src/pages/baghuset/index.astro`, built as MÅLTID is: its own layout and
frame, a demo strip above its header (the way back, "Show parts", the appearance panel saving under
`baghuset-appearance`), its own drawings module in `src/site/baghuset/drawings/` written as a consumer would with the
drawing skill, static invented content in `data.ts`. It starts in its own look: recycled paper, the forest pen, the
lively hand, small-caps labels, boil on hover.

### The building

- The page's container is the house. Its outer walls are `rule-y` lines down both sides from the eaves to the pavement;
  each slab between storeys is a doubled `rule`; a storey's number sits on the wall in the typewriter ("2", "1", "St.").
  All CSS, so a storey is as tall as its content needs and the walls follow.
- Each storey is a `RoomSection` with a strip scene from the site's module. Every strip has a staircase at its right
  end, drawn so the flights meet across slabs when stacked. On a phone the stair is cropped away and the walls sit at
  the screen's edges with the usual 16 px gutter inside.
- Every strip is a moment, never a still room, and the people in it face different ways.
- The header is BAGHUSET's own: the wordmark, three anchors (Work, Studio, People) with the tabs' hand underline on the
  storey in view, and one button, "Write to us". On a phone, the site's burger pattern.

### The storeys

**Roof (hero).** The sky is empty paper. "BAGHUSET" lettered large in Fineliner Naïve Sans (already preloaded); under
it, in the reading face at the 34 rem measure: "A small drawing office in a back building in Aarhus. We make identities,
websites and printed things for people who make something themselves." Actions: "See the work" (primary), "Write to us".
Strip: the roof line across the page, a chimney with a bird on it, an open skylight with someone leaning out and waving
at the bird, the cat on the ridge, the hanging sign at the gable.

**Top floor, Work.** The wall is the pin-up: six `Pinned` sheets in a loose grid, each a drawing, a title, and client,
year and kind in the typewriter. A toggle group (Identity, Web, Print, Type) takes sheets off the wall; their tape stays.
A sheet opens its case in a dialog on wide screens and a drawer on phones: the drawing large, three short paragraphs, a
`PullQuote`, an `EditionNumber`, and "Visit" where the work is live. The studio's work is the rest of this site:

| Sheet           | Kind          | Shown with                            | Link              |
| --------------- | ------------- | ------------------------------------- | ----------------- |
| MÅLTID          | Identity, Web | MÅLTID's dining room scene            | `/maaltid`        |
| Listening Room  | Web           | The record shop scene                 | `/listening-room` |
| Fineliner Naïve | Type          | A word set in the three faces         | `/lettering`      |
| Rêverie         | Print         | A `LabelCard`: an orange wine's label | None              |
| Side B          | Print         | A `RecordSleeve`                      | None              |
| Årsskrift 2025  | Print         | The `proof` drawing                   | None              |

Strip: someone on the stepladder pinning the last sheet (`reach`), a colleague pointing at the wall (`point`, in
profile), the plan chest, paper rolls in their bin. Spot: the plan chest, labelled "Archive", opens a drawer with a
table of twelve older jobs (year, client, what).

**Middle floor, Studio.** On the wall, left to right: four services as open items, each with a tile drawing, two lines
and a "from" price in the typewriter (Identity, `swatch-fan`; Websites, `website`; Printed things, `proof`; Drawing and
type, `fineliner`); the process as four `StickyNote`s joined by pen arrows (Listen, Sketch, Make, Hand over), drawn on
when seen; and "What it costs", the page's one calculator:

- Kind: a toggle group, any of Identity (60.000 kr.), Website (90.000 kr.), Printed thing (25.000 kr.)
- Size: a segmented control, Small, Medium, Large (×1, ×1.5, ×2.2)
- Weeks until you need it: a slider, 4 to 16; under 6 adds 20 %
- Two switches: "Drawings" (18.000 kr.), "We write the words" (12.000 kr.)
- The answer is a `Receipt` beside the controls, one line per choice, the total "excl. moms", a `Stamp` reading
  ESTIMATE, and a button, "Send this with a brief", that carries the lines into the form at the street.

Strip: the trestle table with the pen pot, the paper stack, a desk lamp and a cutting mat; someone seated in profile,
drawing; the plotter with a sheet curling out and someone waiting to take it (`carry`). Spots, the room's own
appearance controls, writing the same saved appearance as the panel: the pen pot ("Pen", a popover with the kit's pen
swatches), the paper stack ("Paper", a segmented control of the three stocks), the lamp ("Light", day or night).

**Ground floor, People.** On the wall: two paragraphs about the office at the reading measure; the five as a plain list
with `Avatar` portraits; clients as a typewriter list in two columns; the `award` drawing with one line. Strip: lunch at
the long table (two seated, one standing with a mug, one on the phone by the coat rack), the cat under the table, the
wall clock. Each figure is a spot opening a hover card (a popover on touch) with name, role and one plain fact. Give
both the figure and the portrait the same `hair`, `glasses` and `beard` from `data.ts`, so the person at the table is
the person in the list.

| Name             | Role                         |
| ---------------- | ---------------------------- |
| Asta Lindqvist   | Partner, identity            |
| Malik Østergaard | Partner, websites            |
| Ingrid Holm      | Drawing and type             |
| Jonas Bak        | Print and production         |
| Sille Thygesen   | Projects, keeps the calendar |
| Tusse            | Cat                          |

Clients, all invented: MÅLTID, Listening Room, Andelsforeningen Solsiden, Forlaget Løv, Risteriet Nord,
Cykelværkstedet Kæde, Keramiker Ane Storm, Vinbaren Skål.

**Street, Write to us.** The brief as a form on a `Pinned` sheet in a narrow column: name, email, what you need (the
toggle group again, filled from the estimate), a message, and "Send" as the page's one pocket of ink here. Beside it in
the typewriter: Mejlgade 48, baghuset, 8000 Aarhus C; Monday to Thursday 9–16, Friday until lunch;
`hej@baghuset.example`; +45 86 00 00 00. Nothing is sent anywhere: on submit the sheet gives way to the `envelope`
drawn on, a `Stamp` reading RECEIVED, a reference as an `EditionNumber` and a toast, as MÅLTID's booking ticket does.
Errors in the correction pen. Strip: the pavement line past both walls, the street door with its letterbox, the bicycle,
and a courier arriving with a parcel (`carry`, seen from behind). Under the pavement, the colophon: "Drawn with
Fineliner", linking home.

### Behaviour that must hold

- **Without script** the page is complete: every strip, every sheet, the services, prices, people and the form are in
  the server's HTML. Islands: the work wall, the estimate, the spots, the form (`client:visible`); the demo strip as on
  MÅLTID.
- **Every spot has a second way.** The appearance panel holds pen, paper and light; the people list holds the people;
  the archive is linked from the work wall's foot. A spot cropped off a narrow screen costs nothing.
- **Motion** is the pen's only: strips draw on when first seen, drawings boil on hover or a tap, marks and the stamp are
  put down, sheets leave and return by opacity. Nothing slides, and no control, receipt line or table moves.
- **Phone first.** 390 px is designed, not derived: storeys stack as wall then strip, sheets one or two to a row, the
  estimate's receipt under its controls, inputs at 16 px, the main actions 44 px.
- **Budgets** (`docs/quality.md`): HTML at most 100 KB gzipped with five strips (aim for 90; thin a strip before
  dropping one), first-view JavaScript within 150 KB, LCP within 2.5 s and CLS within 0.05 on the lab profile, no task
  over 50 ms after the first screen. Report each number.

### Around the page

Link BAGHUSET from the site's nav list and the home page's "in use" section beside the other demos; add a share image
(`src/site/share/shares.ts`); add its paragraph to `AGENTS.md` under "Product intent and boundaries"; add a section and
a progress-log entry to `docs/plan.md`, and release notes to `CHANGELOG.md` under "Unreleased".

## Order of work and where to stop

1. **Prototype, then stop.** A dev-only page (`/lab/baghuset`) with the building's walls and slabs, the top floor only:
   a first strip scene registered from a site module (existing objects plus rough `plan-chest` and `stepladder`), and
   plain framed boxes for the pinned sheets. Screenshot it at 1440 and 390, day and night, and show the maintainer.
   Go on only when he says so; he may change the concept here.
2. Drawings marked B, then the poses. Show the contact sheets.
3. Regions and the strip format, with the hash proof.
4. The six extras, with docs pages.
5. BAGHUSET, storey by storey from the roof down; delete the lab page.
6. The remaining drawings, documentation, registry, release notes.

Commit and push only when the maintainer says so.

## Verification

Per `AGENTS.md`: `npm run typecheck` and `npm run lint` always; `npm run build`; `npm run registry`, then
`npm run registry:check`; `npm run test:consumer` (it has failed offline with ENOTCACHED since 2026-11-04: warm the npm
cache first, and say so if it still cannot run); `npm run format:check`. Look at every changed screen at 1440 and 390,
day and night, on recycled and kraft, in both hands, with forced colours; run BAGHUSET on the lab profile with touch
through CDP. The browser pane has not reached this checkout's dev server (see `HANDOFF.md`): use headless Chrome, and
run one of dev and preview at a time. Name what a real phone, Safari and Firefox still have to show.

## Open choices

The maintainer's to make; build to the recommendation and change on his word. Record none as decided in the plan until
he says so.

1. **The concept:** the page as a building in section, storeys as strips (recommended), or one open room as today.
2. **The name and place:** BAGHUSET, Aarhus (recommended); the route follows the name.
3. **Its look:** recycled, forest, lively.
4. **The tools as controls:** pen pot, paper stack and lamp operating the appearance, beside the panel.
5. **The portfolio:** BAGHUSET credited with MÅLTID, Listening Room and the typeface, linking the demos together.
6. **Where the building's parts live:** storeys and strips in the site's module (recommended, as MÅLTID's room), with
   only objects, poses, regions, the strip format and the extras in the kit.
7. **The kit's own `studio` and `work` scenes:** redraw them with the new objects and give them strips, after BAGHUSET.
