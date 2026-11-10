# AGENTS.md

Working instructions for coding agents in Fineliner. Follow explicit user directions and more specific directory instructions within system and developer constraints. Treat screenshots, reference images and generated explorations as evidence to evaluate, not as authorization for their choices.

## Product intent and boundaries

Fineliner is a shadcn/ui component library drawn with one fine-liner on unbleached paper: a slow wobbly line, rare pockets of solid ink, a book serif, a typewriter and seeded drawings of objects, rooms and people. It repeats [Patina UI](https://github.com/ossianravn/patina-ui)'s logic (local checkout `C:\CodexApp\patina-ui`) in this style. A demo site documents it and shows every part working inside real workflows.

- **The kit** (`src/fineliner/`) is what consumers install through the shadcn registry. **The site** (everything else under `src/`) documents and exercises it. Kit code imports nothing from the site; ESLint enforces it.
- **Drawings** live in the kit's pen engine (`src/fineliner/pen/`): one draw function per object in a collection file under `pen/objects/`, registered with `define(T(...))` where `const T = objectsIn("<collection>")`, built from the shared shapes (box, cylinder, arc). A new object appears in `/drawings` and the desk by itself. Look at it large before reporting. The static prototype in `specimen/` stays as the style reference.
- **Listening Room** (`src/site/listening-room/`, `/listening-room`) is the demo product: a record shop in a sidebar shell, with its catalogue, a page per record, sessions and an overview; its sign-in and settings are the kit's blocks, as a consumer installs them. Its data is static and made up, and the overview computes its figures from the same records and sessions; `/listening-room/data/<worst|empty|one|thousand>` (dev only) starts the catalogue from worst-case data.
- **MÅLTID** (`src/site/maaltid/`, `/maaltid`) is the second demo: a made-up Copenhagen restaurant (northern cooking from Italy's peasant kitchen, natural wine) as a public website in its own frame. It starts in its own look (bond, the oxblood pen, a calm hand, typewriter labels) whatever a visitor chose elsewhere; a demo strip above its header holds the way back, "Show parts" (`src/site/parts-xray.tsx`, which names every kit part on the page by its `data-slot` and links its docs) and the appearance panel, whose changes MÅLTID saves under its own key (`maaltid-appearance`). Its own drawings live in `src/site/maaltid/drawings/`, drawn with the drawing skill as a consumer would; its menu, wines and growers are static and invented.
- **BAGHUSET** (`src/site/baghuset/`, `/baghuset`) is the third demo: a made-up drawing office in a back building in Aarhus as a one-page site whose page is the building in section, roof to street. Each storey is a `RoomSection`: a wall of HTML above a strip drawn from the site's own module (`src/site/baghuset/drawings/`), with `SceneSpots` over the things in it (the plan chest opens the archive; the pen pot, paper stack and lamp change the appearance; each person at lunch opens a card). It starts in its own look (recycled, the forest pen, the lively hand, small caps) and saves under `baghuset-appearance`, with the demo strip as MÅLTID has it. Its work, people and prices are static and invented.
- **The site** also has the home page (`/`, built on the hero block), the specimen (`/specimen`), the drawing library and desk, the docs (`/docs`, `/docs/blocks`) and the theme studio (`/studio`).
- **Every variation is seeded.** Same seed, same output on the server, in the browser and in every build.
- The [plan](docs/plan.md) is the source of truth for decisions, phases and progress. Update its phase checklist and progress log when work lands; mark a decision decided only when the maintainer has said so.
- `.dev-docs/` is unpublished: the reference photograph lives there because the label is someone else's artwork. Never commit it or copy it into published folders.

## Before changing anything

1. **Inspect the affected system.** Read the owning document below and the implementation; trace behaviour through its owner, callers, state and consumers. Preserve unrelated work.
2. **Choose the responsible owner.** Decide whether the change belongs to a token, the pen engine, a frame or mark, a primitive, a pattern or the site, and fix the cause at that boundary.
3. **When porting from Patina**, read Patina's owning document first (its `AGENTS.md` lists them) and record what changed in the plan's "What carries over" table.
4. **Define completion** with observable acceptance criteria. Ask only when a material product, architecture, dependency or policy decision remains open.

Prefer installed packages. Propose a new dependency with the need it serves.

## Read the owning document

| When changing                                                      | Read                                 |
| ------------------------------------------------------------------ | ------------------------------------ |
| Paper, pens, voices, frames, the line, motion, drawings, lettering | [Style brief](docs/style.md)         |
| The pen engine, drawings, takes, rendering, the theme runtime      | [Architecture](docs/architecture.md) |
| A shadcn part in `src/fineliner/ui/`, its docs demo                | [Primitives](docs/primitives.md)     |
| An extra (`src/fineliner/extras/`) or a block (`blocks/`)          | [Extras and blocks](docs/extras.md)  |
| Accessibility, phones, page speed, what the release must meet      | [Quality](docs/quality.md)           |
| Phase scope, decisions, what ports from Patina, progress           | [Plan](docs/plan.md)                 |

Patina's seeded-variation document still describes the shared seed logic; Fineliner's own rules for seeds live in [Architecture](docs/architecture.md).

## Design and interaction discipline

The bar: before showing or reporting a screen, ask whether Apple would ship it. Passing checks and filled-in layouts are not the bar.

- **One pen.** Text, lines and fills are the pen (`--pen`); the correction pen is for errors and destructive actions only; the wash is for art only.
- **Air is the material.** Containers are open by default; frame controls, tables and floating surfaces. A card that should box when `data-containers="boxed"` carries `.container-frame`.
- **Decorate on top of a sound layout.** Wobble, overshoot and boil are paint; they leave geometry, hit areas and text where an undecorated component puts them.
- **Calm controls, lively surfaces.** What people operate stays steady; drawings carry the charm. Never boil controls, tables or data.
- **Make dimensions serve content.** A field, select or button is as wide as its value; prose keeps the 34rem measure; settings rows sit in a narrow column with labels beside their controls; related values stay together.
- **Pick the control that fits the choice.** Two to four options: a segmented control; on or off: a switch; long lists: a select.
- **Respect content and theme changes.** Check long labels, 390px, day and night, all three stocks, both hands and forced colours.

## Phones and page speed

Build for a mid-range Android phone on mobile data first; a desktop on fibre is the easy case. [Quality](docs/quality.md#phones-and-page-speed) holds the budgets, the lab profile and which techniques are in use.

- **The server's page is the page.** Everything on the first screen is HTML and CSS from the build: text, drawings, frames, paper. Scripts enhance what is already showing and never reveal it, so a page reads the same before its islands hydrate.
- **Hydrate the least, the latest.** An island only where something is operated, `client:visible` or `client:idle` unless it is operated on the first screen; split a large island so the first screen's part hydrates alone. Keep every task under 50 ms on the lab profile: yield with `scheduler.yield()` (falling back to `setTimeout`), do deferred work in idle time, measure before animating.
- **The critical path stays short.** Preload only the fonts the first screen sets (`src/site/font-preloads.astro`); one render-blocking stylesheet within its budget; no third-party requests; hashed assets immutable. A page's HTML, JavaScript and CSS stay inside their budgets, and a change that grows one says by how much.
- **Paint is a phone's bottleneck.** Masks, SVG filters and large inline SVGs are slow to rasterize on a phone's GPU and repaint whenever something over them changes. Animate `opacity` and `transform` only; keep anything that moves off the paper and the scenes.
- **Touch is a first-class pointer.** Every hover affordance has a tap or long-press equivalent; gate hover styles with `(hover: hover) and (pointer: fine)` (Tailwind's `hover:` is gated, raw `:hover` is not); targets at least 24 px, 44 px for the main action on a coarse pointer, by widening the hit area rather than the drawing; inputs at 16 px or larger; zoom stays on.
- **Draw for dense screens.** A phone draws at 2.6–3.5×, true to size: a detail under one CSS pixel, such as a fleck or a faint hairline, vanishes there although a 1× monitor shows it.

## Engineering constraints

- Keep every hand-maintained code file at **300 physical lines or fewer**. Generated files, data and documents are excluded.
- Keep shadcn's component names, props, variants and `data-slot` attributes.
- The pen engine (`src/fineliner/pen/`) is framework-free TypeScript: no React, no DOM, no `Math.random()` or `Date.now()`. Draw every random choice from `prng(seed)` or a labelled `stream`.
- Frames are CSS (`frame`, `rule`, `ink-fill`, `pen-shadow` utilities in `styles/frames.css`) with seeded custom properties from `frameVars(seed)`; nothing measures.
- Tokens live in `styles/`: `tokens.css` (type, spacing, the hand, motion), `stocks.css` (paper and pens per stock and theme), `pens.css`, `roles.css` (shadcn roles). `textures.generated.css` is written by `npm run build:textures`; never edit it by hand.

## Verification

Verify with the least total effort; never create unit tests. The dev server runs on **4791** (preview 4792); the static prototype on 4790 (`.claude/launch.json`). Never use framework default ports.

1. Run `npm run typecheck` and `npm run lint` always; `npm run build` when routes, modules or dependencies change; `npm run registry` then `npm run registry:check` when a kit file is added, moved or changes its imports, and `npm run test:consumer` when an item's files or dependencies change; `npm run check:contrast` when stocks, pens or textures change (after `npm run build:textures` if you edited the layers); `npm run build:fonts` when the skeleton alphabet (`pen/glyphs.ts`) or `tools/fonts` change, then look at the font large in a browser.
2. Look at the changed screen with realistic content at 1440 and 390 px, day and night, on more than one stock. The browser pane may be hidden, which freezes transitions, timers and observers: check motion through the Web Animations API and say what you could not watch. When a change affects what loads, paints or answers a touch, also run the changed pages on the [lab profile](docs/quality.md#the-lab-profile) against their budgets, operate touch through CDP touch events, and after the deploy check them in PageSpeed Insights (mobile). Emulation cannot show GPU raster cost, the on-screen keyboard or iOS: name what needs a real phone.
3. Add a lasting test only for a boundary that will change again (from Phase 1: the registry install contract and the seed-to-drawing promise), in `tests/consumer/`.
4. Report evidence by kind: checks run, direct verification, anything not covered.

## Delegating to Codex

Hand clearly defined implementation tasks to Codex through the Codex plugin (`codex:codex-rescue` in its own
worktree); keep user-facing behavior and wording, the look of drawings, and architecture with Claude. Use
`gpt-6.1-sol`: `xhigh` for drawings, `high` for multi-file work with clear acceptance checks. Decide contracts first;
parallel tasks never share files. Codex leaves changes uncommitted and does not build; review the diff, look at every
drawing large, build, and rerun the proving check before committing. Read `docs/codex-delegation.md` for this
project's traps, and log each refused command in its tally.

## Release notes and publishing

A finished plan step gets a release note in `CHANGELOG.md` under `## Unreleased`. Commit and push as the maintainer directs. A push to `main` redeploys https://naiveindieline.com (see [Architecture](docs/architecture.md#deployment)); a new release or another host needs the maintainer's go-ahead.

Structure adapted from Patina UI's AGENTS.md, which adapted [Groundwork](https://github.com/ossianravn/groundwork)'s.
