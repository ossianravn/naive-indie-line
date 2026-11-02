# Naive Indie Line

A shadcn/ui component library in the style of a natural-wine label: one fine-liner on unbleached paper, a slow wobbly line, flattened perspective, no shading, and small pockets of solid ink. Its signature is seeded drawings: everyday objects and rooms drawn by a pen engine, each one different and the same on every render.

<img alt="Four room vignettes in the style: a kitchen where a shirt with nobody in it pours wine, a desk under a window, a balcony at night and a listening corner with a record player." src="docs/style/explorations/scenes.webp">

**Status:** agreeing the style. The [style brief](docs/style.md) states the proposal and the [plan](docs/plan.md) tracks decisions and progress. The kit itself repeats [Patina UI](https://github.com/ossianravn/patina-ui)'s logic once the style is agreed.

## See the specimen

The specimen is a static page with no build step. From the repository root:

```sh
python -m http.server 4791 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4791/specimen/`. Its panel switches paper, light, pen, hand, typefaces and frame rendering; the seed field redraws the room.

## Documents

| Document                     | What it owns                                              |
| ---------------------------- | --------------------------------------------------------- |
| [Plan](docs/plan.md)         | Goals, decisions, phases, progress, risks, open questions |
| [Style brief](docs/style.md) | The style's rules, paper, pens, voices, drawings          |
| [AGENTS.md](AGENTS.md)       | Working instructions for coding agents                    |

The images in `docs/style/explorations/` were generated with gpt-image as direction for the drawings; the kit ships none of them.
