# Changelog

## Unreleased

A review round after 0.1.0, from the maintainer's notes on the live site and a full design review.

- Paper: bond is the default stock. The paper's low-frequency clouding (mottle and relief) is at a fifth of its old strength, so it reads as paper rather than grease or marble; the flecks and fibres stay. The paper lies on the root, so it fills the window on short pages, and the scrollbar gutter is stable. Wells and hovers (`--tint`) are the paper's own darker tone instead of a grey.
- Drawings: armchair, record crate, phone, keyboard and mouse, teapot, moka pot, chair, window, cassette, camera, desk, cactus and cat redrawn or repaired to the object sheet's standard; `visitor` stands empty-handed (`visitor-record` holds the sleeve); every figure in a scene is only their clothes. The pen starts a closed shape mid-edge (no spike at the seam) and centres its wobble; scene masks are named per scene and hand. A sized drawing (`h-28 [&>svg]:h-full`) fits its height.
- Kit: pen markup gets instance-unique SVG ids (`useOwnIds`), so a hidden copy of the same drawing no longer breaks another's masks (a record sleeve's disc covered its cover). A record title too long to letter readably is set in small capitals. The chart tooltip follows the pointer at once instead of gliding for 400 ms. Settings-01 has one label column and `bare` and `appearance` props; pricing-01's "Most chosen" stamp sits with its plan.
- Site: the specimen is one composed sheet; the components index shows a preview of every part; docs pages share one header, a component nav and previous/next, with even demo rows and one copy affordance; block previews take their block's full height; the studio's panel no longer clips; the desk puts its controls under the drawing on phones; /drawings separates its collections and aligns its labels. Listening Room shares one page frame, Maya is staff throughout, sessions stack on phones, the overview shows every day, and badges count what the pages show. The home page's hold demo is one card with Jonas's request.

## 0.1.0 (2026-11-02)

The first release: shadcn parity drawn with one pen, Fineliner's own extras and blocks, the pen engine and its drawings, the theme studio and Listening Room.

Phase 5: the release.

- Share images drawn by the pen at build time, one per main page, block and component, with Open Graph and Twitter tags (`SITE_URL` makes them absolute).
- `test:consumer` installs into a Next.js 16 App Router app as well as Vite, and fails if a kit file a server component imports uses hooks without `"use client"`.
- Accessibility: drawings with `title=""` are hidden from assistive tech (they were named three times); calendar days are named by weekday and date; the combobox chevron, the sidebar trigger's state, command and item separators and the sign-in block's autocomplete fixed; kraft's quiet pen reaches 4.5:1. See `docs/accessibility-review.md`.
- Performance: a docs page loads only its own demo (129 KB of JavaScript gzipped instead of 566 KB). See `docs/quality.md`.
- The site and registry are live at https://naiveindieline.com (Dokploy, rebuilt on push to `main`).
- Docs: the README for installing and using the kit, `docs/quality.md` and `docs/accessibility-review.md`.

Phase 4: extras, blocks, the theme studio and the home page.

- Twelve extras, each its own registry item with a docs page: `label-card`, `record-sleeve`, `track-list`, `tasting-note`, `price-tag`, `hand-note`, `edition-number`, `drawn-border`, `room-header`, `pull-quote`, `reading-progress` and `appearance-control`.
- Seven blocks (`registry:block`): `sign-in-01`, `settings-01`, `dashboard-01`, `pricing-01`, `article-01`, `empty-01` and `hero-01`, with live previews at `/docs/blocks`. The `fineliner` umbrella leaves blocks out.
- The theme studio at `/studio`: presets, every setting on live previews, and the export as CSS or a shadcn `registry:theme` item.
- The home page: the hero block, the drawing library, components in use, an A–Z index and install; the specimen moved to `/specimen`.
- `drawing`: a caller's `ref` on `Drawing` is merged with the one draw-on needs; the takes' grid sits in the components layer, so `hidden` hides a drawing.
- Listening Room's sign-in and settings are the blocks.
- `test:consumer` also installs `record-sleeve` and `sign-in-01`.

Phase 3: the rest of shadcn parity.

- 38 more parts, each its own registry item with a docs page: table, pagination, breadcrumb, accordion, collapsible, command, combobox, sheet, drawer, menubar, navigation menu, context menu, hover card, calendar, sonner, sidebar, scroll area, resizable, carousel, input OTP, input group, button group, empty, item, aspect ratio, typography, direction, and the conversation set (message, bubble, message scroller, marker, trace, attachment, code block, questionnaire). Tables rule their rows with hand-drawn lines cheap enough for 200 rows; sheets, drawers and toasts fade and grow, never slide; code is highlighted with one pen.
- `chart`: Recharts drawn by the pen through the exact data points (`drawnBar`, `drawnCurve`, `drawnDot`, `drawnSector`), series told apart by solid, outline, dotted and lined marks rather than colour.
- `pen`: `plot()` for strokes through data, and the straight `next` mark.
- `base`: `shadowRoom` collision padding; `frameStyle` reads words through nested elements; drawings carry `fl-size-own`, so shadcn's icon size rule leaves pen marks alone; the typewriter's italic.
- Listening Room: a sidebar shell, a page per record, sessions with a booking sheet, and an overview.
- `test:consumer` also installs `table` and `chart`.

Phase 2: core primitives and Listening Room.

- 28 shadcn primitives on Base UI, each its own registry item with shadcn's names, props, variants and `data-slot`s: button, badge, card, input, textarea, label, field, checkbox, radio group, switch, select, native select, tabs, toggle, toggle group, separator, skeleton, avatar, alert, progress, slider, kbd, tooltip, popover, dialog, alert dialog, dropdown menu and spinner. Fields keep a steady pen line; buttons, boxes and sheets are drawn frames seeded by their own words; the main action and chosen options are pockets of ink; ticks, dots and underlines are pen marks put down; menus, selects, popovers and dialogs float on paper with the cartoonist's shadow and grow from their trigger. Avatar fallbacks are portraits drawn from the name.
- `base`: `styles/controls.css` (`control-field`, `float-sheet`, `put-down`, `press`, `term`), the `pocket` and `rule-y` utilities, a shadow that follows its sheet, `lib/frame-style.ts` (`frameStyle()`, `clearOfShadow`), containers that follow the nearest `data-containers`, and drawings that utilities can size.
- Docs: `/docs` and a page per component with its states; `docs/primitives.md`.
- Listening Room, the demo product: a record shop's catalogue, sign-in and settings at `/listening-room`.
- `test:consumer` installs seven items, primitives included.

Phase 1: the pen and the drawings.

- `pen` (new item): the framework-free pen engine. `drawing({ object | scene, seed, hand, takes })` and `lettering(text, { face, seed, hand, takes })` return one SVG per take; `penMark()` draws ticks, rings, underlines, strikes, arrows, chevrons and pills; `define()` with `objectsIn()` adds objects. 55 objects in four collections (indie, food and drink, studio, people), three scenes (listening room, studio, bistro) and four lettering faces (Liner, Stilt, Ribbon, Tramline). The same seed draws the same SVG in Node and in Chromium.
- `drawing` (new item): `<Drawing>`, `<Lettering>`, `<PenMark>` and `<Circled>`; three takes per drawing for line boil in CSS alone; `drawOnView` for drawings drawn on when first seen; `settleDrawing()` for rerolls.
- `base`: `styles/drawing.css` (how drawings paint, line boil with `data-boil`, draw-on) joins the stylesheet.
- Registry: `npm run registry`, `registry:check` and `test:consumer` (installs `drawing` into a fresh Vite app offline and builds it).
- Site: `/drawings`, the library by collection; `/desk`, the drawing desk; the specimen's hero scene; a lettered wordmark.

Phase 0: foundations.

- The kit, `src/fineliner/`: tokens from the agreed specimen (Newsreader to read, Courier Prime for menus and labels, Gaegu for asides; a Golden Ratio type and spacing scale at 18px and a 34rem measure), three stocks (recycled, kraft, bond) with night cards, five pens, the wash and the correction pen, shadcn's semantic roles, generated paper with flecks and fibres, CSS frames, rules, ink pockets and the drawn shadow, the appearance runtime (theme, stock, pen, hand, line boil, containers, labels, density) with its pre-paint script, and `<FinelinerDefs>` for the shared wobble filters.
- `npm run check:contrast`: every pen against every textured stock, day and night; kraft carries darker sepia, forest, oxblood and correction pens to keep 4.5:1.
- Site: the specimen at `/`, built from the kit, with an appearance panel that persists.
- Style phase: the static prototype in `specimen/` (pen engine, 55 objects, scenes, lettering, motion) stays as the reference for Phase 1.
