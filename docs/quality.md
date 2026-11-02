# Quality

What "good" means for the shipped kit and site, and where v0.1 stands against it. [AGENTS.md](../AGENTS.md#verification) owns how each change is checked; the [accessibility review](accessibility-review.md) records the v0.1 review in full. Adapted from Patina UI's quality contract.

## Accessibility

Target: WCAG 2.2 AA for every component and every shipped workflow, on every stock, day and night, at both hands.

| Area             | Acceptance                                                                                                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text contrast    | Every pen reaches 4.5:1 on every textured stock, day and night, measured against the paper's darkest flecks and fibres (`npm run check:contrast`); the correction pen too. Kraft carries darker pens, and mixes its quiet pen nearer the pen, to keep it |
| Meaningful marks | Focus rings, ticks, radio dots, switch states, chart marks and control lines are drawn in the pen, never in the wash or a faint pen alone                                                                                                                |
| Colour alone     | There is one pen: selection, status and chart series differ by a pocket of ink, a drawn mark, a word or a mark style (solid, outline, dotted, lined)                                                                                                     |
| Handwriting      | The hand voice is for asides at 1.3 rem or larger; anything a person needs also exists in a reading voice or an accessible name                                                                                                                          |
| Tilt             | Operated controls never tilt; tilted surfaces (price tags) stay within a few degrees and their text stays selectable                                                                                                                                     |
| Drawings         | A drawing is named by its `title` or hidden with `title=""`; lettering is named by its words; pen marks are decorative and the element they mark carries the meaning                                                                                     |
| Forced colours   | Wobble filters drop, pockets gain a border, chosen states use the system highlight, focus stays visible                                                                                                                                                  |
| Reduced motion   | No boil, no draw-on; marks appear with a short fade, sheets fade without scale, the reading line follows the scroll without gliding                                                                                                                      |
| Targets          | Pointer targets meet 24 × 24 CSS px, drawn controls included                                                                                                                                                                                             |
| Direction        | Arrows, chevrons and notes mirror in right-to-left text                                                                                                                                                                                                  |
| Interaction      | Base UI's keyboard behaviour, focus management and dismissal stay intact; dialogs and sheets move focus in, contain it and return it; menus and listboxes follow their ARIA patterns                                                                     |

## Performance

The kit renders on the server and hydrates only what moves or is chosen. Drawings are inline SVG drawn at build time; line boil swaps three takes by opacity in CSS, so nothing redraws in script.

| Measure (v0.1 build, gzipped)      | Result                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A component docs page's JavaScript | 129 KB for the island runtime and host, plus the page's own demo chunk (was 566 KB, every demo, before v0.1) |
| Home page                          | 197 KB of HTML (the hero scene, a shelf of drawings and the index, three takes each), 258 KB of JavaScript   |
| Theme studio                       | 133 KB of HTML, 264 KB of JavaScript                                                                         |
| Listening Room catalogue           | 115 KB of HTML, 213 KB of JavaScript                                                                         |
| The drawing library                | 294 KB of HTML (165 drawings, three takes each), no JavaScript                                               |
| Stylesheet                         | 50 KB, including the generated paper textures                                                                |
| A 200-row table                    | No frame over 20 ms while scrolling at 1× CPU; two or three 33 ms frames at 4× (headless Chromium)           |
| Share images                       | 91 PNGs at 1200 × 630, about 31 KB each, drawn at build time                                                 |

Known heavy pages: the record sleeve and room header docs pages (648 KB and 440 KB of HTML), whose demos draw many large drawings in three takes. A drawing that never boils can pass `still` to ship one take instead of three.

## Where v0.1 stands

- **Automated:** axe on 92 pages, day and night (184 runs), from 468 failing elements to 24, all on docs gallery pages or from upstream libraries; none on a block or in Listening Room. Details in the [accessibility review](accessibility-review.md).
- **Contrast:** every full pen passes on every textured stock (`npm run check:contrast`); the quiet pen on kraft was fixed after the review. The faint pen (disabled text, decoration) is below 4.5:1 by design and still sets a few pieces of needed text; see the review.
- **Not covered yet:** forced colours, reduced motion and right-to-left in a real browser, real screen readers, Safari and Firefox, and a real phone.
