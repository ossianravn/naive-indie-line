# Changelog

## Unreleased

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
