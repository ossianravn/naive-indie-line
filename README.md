# Fineliner

A shadcn/ui component library drawn with one fine-liner on unbleached paper: a slow wobbly line, flattened perspective, no shading, and small pockets of solid ink where the eye should land. Its signature is seeded drawings: everyday objects, rooms and people drawn by a pen engine, each one different and the same on every render. The style is called Naïve Indie Line, after the natural-wine label it came from.

<img alt="The kit's four scenes, drawn by its pen: a record shop floor with browser bins and a counter, a freelancer's studio, a bistro table for two and someone at work at a desk under a window." src="docs/style/scenes.webp">

**Status:** v0.1, live at [naiveindieline.com](https://naiveindieline.com). All of shadcn/ui's parts (64, keeping shadcn's names, props and `data-slot`s; `form` and `toast` are served by `field` and `sonner`), twelve parts of Fineliner's own (label cards, record sleeves, track lists, price tags, hand notes and more), seven blocks, a chart drawn by the pen through the exact data, the pen engine with 85 drawings and four scenes, Naïve Indie Line Sans, Inline and Tramline (our own fonts), a theme studio, and Listening Room, a record shop built only from the kit.

## What is in it

- **The pen engine** (`pen`): framework-free TypeScript that draws objects, scenes, lettering and marks as SVG from a seed, the same in Node and in the browser. Three takes of each drawing give the line boil.
- **Drawings** (`drawing`): `<Drawing object="turntable" seed="…" />`, `<Lettering>`, `<PenMark>`, `<Circled>`. A drawing ships one take and draws its other two in the browser where line boil shows them; where drawings render without React in the browser (Astro, server components only), call `boilTakesIn()` from `drawing/drawing-takes` once on the page.
- **Naïve Indie Line Sans**: our own font, the pen as a typeface: round-ended monoline capitals for every Latin-script European language, three takes per letter that take turns. `<Lettering text="…" />` sets it as real text, so search engines read it; the kit's stylesheet carries it, and the [OTF](public/fonts/naive-indie-line-sans.otf) is there for design tools. MIT.
- **Naïve Indie Inline**: its contrasted serif: thick strokes drawn as two lines with the wash between them, thin strokes as one. Two fonts set one over the other (Inline and Inline Fill); `<Lettering face="inline" />` layers them for you once you add `@fineliner/font-inline` and import its stylesheet. [Inline](public/fonts/naive-indie-inline.otf) and [Fill](public/fonts/naive-indie-inline-fill.otf) OTFs, MIT.
- **Naïve Indie Tramline**: every stroke three parallel lines that cross where they meet, each letter leaning a little its own way. `<Lettering face="tramline" />` sets it once you add `@fineliner/font-tramline` and import its stylesheet. [OTF](public/fonts/naive-indie-tramline.otf), MIT.
- **A drawing skill** for your coding agent, to draw your own objects, people and scenes in the same style ([below](#more-drawings-the-drawing-skill)).
- **Components**: every shadcn part on Base UI, drawn: steady fields, frames that run past their corners, ink pockets, marks the pen puts down, sheets with the cartoonist's shadow, tables ruled by hand, charts drawn through the data.
- **Extras and blocks**: Fineliner's own parts and whole sections (sign-in, settings, dashboard, pricing, article, empty states, hero).
- **Appearance**: paper (bond, recycled, kraft; day and night), five pens, a calm or lively hand, line boil, open or boxed containers, small-caps or typewriter labels, density; saved per visitor and set before paint.

## Install

Fineliner installs with the shadcn CLI from its own registry at [naiveindieline.com](https://naiveindieline.com), into your project's `src/fineliner`, where it is yours to change. Add the registry to `components.json`:

```json
{
  "registries": {
    "@fineliner": "https://naiveindieline.com/r/{name}.json"
  }
}
```

Then add everything, or one part at a time (each docs page has its command):

```sh
npx shadcn add @fineliner/fineliner
```

```sh
npx shadcn add @fineliner/record-sleeve
```

Make `src/fineliner/styles/fineliner.css` your Tailwind entry (`@import "./fineliner/styles/fineliner.css";`), render `<FinelinerDefs />` once near the top of the page (the shared wobble filters), and run `appearanceScript()` in the document head before paint so the paper and pen are right on the first frame. The install contract is tested: `npm run test:consumer` installs items into a fresh Vite app and a Next.js App Router app offline, and type-checks and builds both.

## More drawings: the drawing skill

The kit draws 85 objects and four scenes; your project will want its own: a bicycle for a repair shop's empty state, your bakery's counter, someone walking a dog on the sign-up page. The drawing skill teaches your coding agent (Claude Code, Codex, or any agent that reads skills) to draw them in the kit's style, from a seed, in your own code.

Install it from the registry, next to the kit:

```sh
npx shadcn add @fineliner/drawing-skill
```

That puts the skill in `.claude/skills/fineliner-drawings` and `.agents/skills/fineliner-drawings`; it is also in this repository under [`skills/fineliner-drawings`](skills/fineliner-drawings) to copy by hand. Then ask your agent for the drawing you need. The skill's page, [naiveindieline.com/drawings/skill](https://naiveindieline.com/drawings/skill), shows what it draws and has the whole skill to read.

What the agent does with it:

- **Draws in your module, not the kit's.** New objects and scenes go in `src/drawings/index.ts`, registered with `define()` and `defineScene()`, so `npx shadcn add` can update `src/fineliner` without losing them. Import `@/drawings` where you render `<Drawing object="your-id" />` or `<Drawing scene="your-scene" />`.
- **Builds from the kit's parts.** Boxes, padded shapes, rounds seen from above and cylinders; people from the same clothes and hair as the kit's; scenes on the same stage, with walls, a rug and the drawn border.
- **Follows the style.** One monoline, calm 3/4 views, corners that meet, a few pockets of ink, every choice from the seed.
- **Looks before it reports.** `scripts/render.mjs` draws a contact sheet of the new drawings at several seeds and both hands (it uses `jiti`, and `sharp` for a PNG), and the skill's checklist is the one the kit's own drawings were reviewed against.

The skill's test prompts are in `skills/fineliner-drawings/evals`, in the layout `claude plugin eval` reads.

## Run the site

Requires Node.js 24 and npm 11.

```sh
npm ci
```

```sh
npm run dev
```

Open `http://127.0.0.1:4791`: the home page, the components and blocks (`/docs`), the drawing library and desk, the theme studio (`/studio`), the specimen and Listening Room (`/listening-room`). `npm run build` writes the static site, the registry (`public/r`) and the share images to `dist`.

Checks: `typecheck`, `lint`, `format:check`, `build`, `check:contrast` (every pen on every textured stock, day and night), `registry` and `registry:check`, `test:consumer`. `npm run build:textures` regenerates the paper.

## Documents

| Document                                             | What it owns                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Plan](docs/plan.md)                                 | Goals, decisions, phases, progress, risks, open questions                     |
| [Style brief](docs/style.md)                         | The style's rules, paper, pens, voices, the line, motion, drawings, lettering |
| [Architecture](docs/architecture.md)                 | The pen engine, takes, rendering, the registry, the theme runtime             |
| [Primitives](docs/primitives.md)                     | How each shadcn part is treated                                               |
| [Extras and blocks](docs/extras.md)                  | Fineliner's own parts, the blocks, the studio and the home page               |
| [Quality](docs/quality.md)                           | The accessibility and performance contract, and where the kit stands          |
| [Accessibility review](docs/accessibility-review.md) | The v0.1 review: what was checked, fixed and left                             |
| [Changelog](CHANGELOG.md)                            | What each release shipped                                                     |
| [AGENTS.md](AGENTS.md)                               | Working instructions for coding agents                                        |

Fineliner repeats [Patina UI](https://github.com/ossianravn/patina-ui)'s logic in a new style. The image above is the kit's own scenes, rendered by `tools/render-scenes.mjs`. The static prototype the style was agreed on stays in `specimen/` as a reference.

## License

Code, art and generated textures: [MIT](LICENSE). The fonts (Newsreader, Courier Prime, Gaegu) are under the SIL Open Font License, shipped with their Fontsource packages.
