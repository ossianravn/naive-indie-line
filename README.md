# Fineliner

A shadcn/ui component library drawn with one fine-liner on unbleached paper: a slow wobbly line, flattened perspective, no shading, and small pockets of solid ink. Its signature is seeded drawings: everyday objects, rooms and people drawn by a pen engine, each one different and the same on every render. The style is called Naïve Indie Line, after the natural-wine label it came from.

<img alt="Four room vignettes in the style: a kitchen where a shirt with nobody in it pours wine, a desk under a window, a balcony at night and a listening corner with a record player." src="docs/style/explorations/scenes.webp">

**Status:** Phase 4 is done: shadcn parity drawn with one pen (64 parts), twelve extras of Fineliner's own (label cards, record sleeves, track lists, price tags, hand notes and more), seven blocks, the theme studio and the home page, with Listening Room, a record shop, built from them. Phase 5, release v0.1, is next.

## Run it

Requires Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4791`. `package.json` lists the checks: `typecheck`, `lint`, `build`, `check:contrast` and `format:check`; `npm run build:textures` regenerates the paper.

The static prototype the style was agreed on (55 objects, scenes, lettering and motion) lives in `specimen/` until Phase 1 ports it. Serve the repository root and open `/specimen/`:

```sh
python -m http.server 4790 --bind 127.0.0.1
```

## Documents

| Document                     | What it owns                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------- |
| [Plan](docs/plan.md)         | Goals, decisions, phases, progress, risks, open questions                     |
| [Style brief](docs/style.md) | The style's rules, paper, pens, voices, the line, motion, drawings, lettering |
| [Changelog](CHANGELOG.md)    | What each phase shipped                                                       |
| [AGENTS.md](AGENTS.md)       | Working instructions for coding agents                                        |

Fineliner repeats [Patina UI](https://github.com/ossianravn/patina-ui)'s logic in a new style. The images in `docs/style/explorations/` were generated with gpt-image as direction for the drawings; the kit ships none of them.

## License

Code, art and generated textures: [MIT](LICENSE). The fonts (Newsreader, Courier Prime, Gaegu) are under the SIL Open Font License, shipped with their Fontsource packages.
