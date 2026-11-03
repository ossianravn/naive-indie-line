# Architecture

Status: Phase 1, 2026-11-02. The kit/site split, theme runtime and registry follow Patina UI's ([its architecture](https://github.com/ossianravn/patina-ui/blob/main/docs/architecture.md)); this document owns what differs: the pen engine, drawings and their takes.

## Repository layout

```
src/fineliner/            # the kit: everything a consumer installs
  pen/                    # framework-free engine: seed, filters, geometry, stroke (the pen), layers (sheets and
                          #   blanks), shapes, library (object registry), scenes, drawing-svg, glyphs,
                          #   lettering-svg, pen-marks
    objects/              # one file per part of a collection; each registers its objects with define()
  drawing/                # React: <Drawing>, <Lettering>, <PenMark>, <Circled>, and drawing-motion (settle, draw-on)
  styles/                 # fineliner.css (Tailwind entry) and the files it imports: fonts, tokens, stocks, pens,
                          #   textures.generated, roles, base, frames, drawing
  theme/                  # appearance state, pre-paint script, useAppearance
  defs/                   # <FinelinerDefs>: the shared wobble filters
  lib/                    # cn
src/site/                 # layouts, the specimen sections, the appearance panel, the desk
src/pages/                # / (specimen), /drawings, /desk
specimen/                 # the static style prototype; the reference until everything is ported
tools/paper/              # the paper generator: writes styles/textures.generated.css
tools/registry/           # the registry builder: writes registry.json and public/r/
tools/check-contrast.mjs  # every pen against every textured stock
tests/consumer/           # the registry install contract
```

## The pen engine

`src/fineliner/pen/` has no React and no DOM, and ESLint keeps it that way. It renders at build time, in the browser and (later) in share images, and the same seed gives the same SVG everywhere.

- **`pen(seed, hand, take)`** draws strokes: each is resampled every 3px and offset along its normals by slow eased noise plus a faint tremor; open strokes run past or stop short of their ends; circles go a little past where they started. `hand` is `calm` or `lively`.
- **`sheet(id)`** collects paths in layers. `blank(d)` hides everything drawn before it inside a shape with a mask (the paper still shows through), so a figure stands in front of a wall line. One mask per layer, never nested: nested masks made the first prototype too slow to paint. Mask ids come from the drawing's seed and take, so server and browser agree.
- **The library** (`library.ts`): `define()` registers objects; `place()` draws one into a sheet with its own fork of the seed. An object draws its composition from `r`, the `shape` stream, and its lines from `p`, the pen. Objects are typed `Draw` functions; `DrawOptions` lists every choice a caller may fix instead of the seed.
- **Scenes** (`scenes.ts`) compose objects back to front inside the drawn border.
- **A project's own drawings.** A consumer registers objects with `define()` under any collection name and scenes with `defineScene()`, built on the exported `stage()` (walls, rug, border, `put`), from its own module (`src/drawings/`), so updating the kit through `shadcn add` never overwrites them. The engine exports the shapes (`box`, `pad`, `banded`, `drum`, `cylinder`, `sprig`) and the people parts (`clothes`, `head`, `hairBehind`) for this. The drawing skill (`skills/fineliner-drawings`, registry item `drawing-skill`) teaches a coding agent to do it in the kit's style; its `scripts/render.mjs` renders contact sheets through jiti and sharp or a headless Chrome or Edge.
- **`drawing({ object | scene, seed, hand, takes, title })`** returns one SVG per take. **`lettering(text, { face, seed, hand, takes })`** draws words from the skeleton alphabet in Tramline. Naïve Indie Line Sans, the other display face, is a real font built from the same skeleton by `tools/fonts/build.mjs` (`npm run build:fonts`): strokes wobbled, swept by a round pen and merged into outlines (polygon-clipping), fitted with cubic curves, three takes per glyph rotating through `calt`, kerning as a GPOS table, written as OTF and WOFF2 (`public/fonts/`) and embedded in `styles/line-sans.generated.css`. Naïve Indie Inline and its Fill come from the same build (`tools/fonts/inline.mjs`: a broad-nib contrast rule, double lines for thick parts, the tint as a second font) and are embedded in `styles/inline.generated.css`, its own registry item (`font-inline`), since together they weigh 160 KB; the site loads them from `/fonts/`. `tools/fonts/family.mjs` writes any family: three takes rotating through `calt`, kerning, and line metrics pinned in OS/2. The build is deterministic. **`penMark(name, seed)`** draws the small interface marks.

### Takes

A take is the same drawing with another pen: the pen forks by `take:n` while the composition streams stay put, so takes differ only in the line. `<Drawing>` and `<Lettering>` render three takes stacked in a `.fl-takes` span; `styles/drawing.css` cycles them for line boil (`data-boil`, nearest element wins) and `settleDrawing()` plays them once after a reroll. Only the first take is named for screen readers.

### Determinism rules

JavaScript engines may differ in the last bit of `Math.sin`, `Math.cos`, `Math.hypot` and `**`. A last-bit difference in a length can change how many points a stroke gets, which shifts every random draw after it. So:

- Lengths use `Math.sqrt` (every engine rounds it the same way), never `Math.hypot`.
- Nothing uses `**` or `Math.pow`; a curve that needs a power uses a polynomial.
- `snap()` rounds coordinates and lengths to hundredths before they decide a count.
- Composition never comes from the pen, so takes cannot drift apart.

## Rendering in the page

- **Frames are CSS** (`frame`, `rule`, `ink-fill`, `pen-shadow` in `styles/frames.css`) with seeded custom properties from `frameVars(seed)`, so they render on the server and nothing measures (decision S6).
- **Drawings are inline SVG** from `drawing()`: in Astro at build time with no script, memoized in React islands. Pen lines use `vector-effect: non-scaling-stroke`, so every line is the pen's weight at any size.
- **Draw-on** (`drawOnView`) renders the drawing waiting undrawn, so the server's copy never flashes first; `drawWhenSeen()` draws it stroke by stroke when it comes into view, measuring each stroke in screen pixels (non-scaling strokes ignore `pathLength`). With no script it appears after 2.5s; under reduced motion it appears at once.

## Registry

`npm run registry` writes `registry.json` and `public/r/*.json` from `src/fineliner/` (Patina's builder, adapted); `npm run registry:check` fails when they are stale. Membership is in `tools/registry/items.json`: `base` (styles, theme, defs, `lib/utils`, and the engine files defs needs: `pen/seed`, `pen/filters`), `pen` (the rest of the engine, objects included), `drawing` (the React components) and the umbrella `fineliner`. New files in `pen/` or `drawing/` join their item without editing the builder. Rules carried from Patina: every kit file installs at the same path under `src/fineliner/`; basenames are unique, because `shadcn add` rewrites imports by file name; imports are read in either quote style, CSS `@import`s included. New here: the builder refuses a `base` file that imports another item.

`npm run test:consumer` builds the registry into a temporary folder, serves it, installs `drawing` into a copy of `tests/consumer/fixture/` through the real shadcn CLI with npm offline, and asserts byte-identical files, a clean type-check and a build.

## Theme runtime

As Patina's, with Fineliner's attributes on `<html>`: `data-theme` (and `data-theme-preference`), `data-stock` (bond, the default; recycled, kraft), `data-pen` (navy, black, sepia, forest, oxblood), `data-hand`, `data-boil` (off, hover, art), `data-containers` (open, boxed), `data-labels` (caps, type) and `data-density`. `appearanceScript()` applies the saved choice before first paint; `useAppearance()` reads and writes it. Any element can set `data-pen`, `data-hand`, `data-boil` or `data-labels` for its subtree.

## Deployment

The `Dockerfile` builds the static site and serves it with nginx (`deploy/nginx.conf`) as the `frontend` app of the Fineliner project in Dokploy, on the ByteHosting server (109.71.252.137), rebuilt on every push to `main`, at https://naiveindieline.com. `www` redirects to the apex; Traefik issues the certificates, and the domain is proxied by Cloudflare (the server only admits Cloudflare on 80 and 443). The registry JSON ships with the site under `/r/`, readable from any origin, and the share images under `/og/`. nginx serves each page at one URL without a trailing slash, as Astro builds them, and `404.html` for anything missing; hashed assets under `/_astro/` cache for a year. `astro.config.mjs` sets the canonical URL; the `SITE_URL` build argument overrides it.
