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

## Phones and page speed

Built for a mid-range Android phone on mobile data. [AGENTS.md](../AGENTS.md#phones-and-page-speed) has the rules every change follows; this section has the numbers they answer to.

### Budgets

Proposed 2026-11-04. Field numbers are Google's "good" Core Web Vitals at the 75th percentile; lab numbers are on the lab profile below, stricter where the lab can be.

| Measure                       | Budget                                                                | Measured 2026-11-04                                                                       |
| ----------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Largest contentful paint      | Field 2.5 s; lab 2.5 s                                                | Home 2.1 s (the live home before the open room also 2.1 s)                                |
| Interaction to next paint     | Field 200 ms; lab, no interaction over 200 ms                         | Not yet measured                                                                          |
| Cumulative layout shift       | Field 0.1; lab 0.05                                                   | 0.001–0.031 on home, studio, Listening Room and MÅLTID; home 0.029 with the open room     |
| Main thread                   | No task over 50 ms after the first screen; total blocking time 200 ms | Fails: tasks of 130–480 ms while islands hydrate at 6× CPU; the studio hydrates for 1.2 s |
| HTML per page                 | 100 KB gzipped                                                        | Home 82 KB (the open room's wide and tall drawings); the specimen 110 KB is over          |
| JavaScript for the first view | 150 KB gzipped                                                        | A docs page 129 KB                                                                        |
| Render-blocking CSS           | 60 KB gzipped                                                         | 55 KB with both fleck tiles                                                               |
| Preloaded fonts               | Only the first screen's, two or three files                           | Naïve Sans and Newsreader; MÅLTID Newsreader and Courier Prime                            |

### The lab profile

Headless Chrome (the installed Chrome, through Python Playwright) as a Pixel 7: 412 × 915 CSS px at 2.625×, touch and a mobile user agent (`devices["Pixel 7"]`); CPU slowed 4× (`Emulation.setCPUThrottlingRate`); slow 4G, 150 ms round trip, 1.6 Mbps down and 750 kbps up, cache off (`Network.emulateNetworkConditions`). Serve the build over a port (`npm run preview`, 4792): responses fulfilled by a Playwright route skip the network throttling.

- **Record** with performance observers added before load (`add_init_script`): `largest-contentful-paint`, `layout-shift`, `longtask`, `event` (duration threshold 16 ms) for interactions, and frame gaps from `requestAnimationFrame`. A CDP screencast (`Page.startScreencast`) shows what appears in what order.
- **Operate touch** with `Input.dispatchTouchEvent`: a tap is start and end within 100 ms, a long press holds 700 ms, a scroll adds moves.
- **It cannot show** GPU raster cost (headless rasterizes in software, and CPU throttling slows the main thread only), sticky hover, the on-screen keyboard, or Safari. For those, a Performance trace from a real phone through `chrome://inspect`.
- **After a deploy,** PageSpeed Insights (mobile) on the changed pages: https://pagespeed.web.dev, or `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<page>&strategy=mobile`. The keyless API's daily quota is small (it was spent on 2026-11-04); when it is, say so. Field data appears there once the site has the traffic.

### Techniques

| Technique                                                                         | State                                                                                       |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Static HTML first, islands only where something is operated                       | In use                                                                                      |
| Pictures visible without script; draw-on only for drawings that start out of view | In use since 2026-11-04                                                                     |
| One take per drawing in the page, the others drawn in idle time                   | In use                                                                                      |
| The paper's filtered grain on a fixed layer of its own                            | In use                                                                                      |
| Sharp flecks on dense screens                                                     | In use since 2026-11-04                                                                     |
| First-screen fonts preloaded as WOFF2, `font-display: swap`                       | In use since 2026-11-04                                                                     |
| A metric-matched fallback font (`size-adjust`, `ascent-override`)                 | Not yet: on 4G the swap to Newsreader still rewraps a line                                  |
| Same-origin prefetch through the Speculation Rules API (moderate eagerness)       | Not yet                                                                                     |
| Cross-document view transitions (`@view-transition`), none under reduced motion   | Not yet                                                                                     |
| Back/forward cache: no `unload` handlers, no `no-store`                           | Believed eligible; not checked                                                              |
| Brotli or zstd                                                                    | Not yet: nginx serves gzip; precompress at build and serve with `gzip_static`-style lookups |
| A year's cache for `/fonts/`                                                      | Not yet: the files revalidate on every visit; a versioned name would make them immutable    |
| `scheduler.yield()` in long work                                                  | Not yet: hydration and draw-on's measuring are the long tasks                               |
| The studio's island split, the chart library loaded when a chart is in view       | Not yet                                                                                     |
| `content-visibility: auto` on long pages                                          | Measured 2026-11-03 and left out: little gain, and it clips drawn edges                     |

### What the pages weigh

The kit renders on the server and hydrates only what moves or is chosen. Drawings are inline SVG drawn at build time; line boil swaps three takes by opacity in CSS; the page carries each drawing's first take, and the browser draws the other two only where boil can show them. A hydrating drawing keeps the server's markup. The paper's filtered grain lies on a fixed layer of its own, so nothing on the page repaints it.

Measured 2026-11-03: sizes gzipped (unpacked in brackets), speed in Chrome.

| Measure                            | Result                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A component docs page's JavaScript | 129 KB for the island runtime and host, plus the page's own demo chunk (was 566 KB, every demo, before v0.1) |
| Components index                   | 72 KB of HTML (579 KB), no JavaScript                                                                        |
| Home page                          | 55 KB of HTML (423 KB; was 3.9 MB, before masks took only the blanks that reach them and pages one take)     |
| Specimen                           | 103 KB of HTML (704 KB; was 8 MB)                                                                            |
| Theme studio                       | 39 KB of HTML (289 KB)                                                                                       |
| Listening Room catalogue           | 33 KB of HTML (215 KB)                                                                                       |
| The drawing library                | 83 KB of HTML (582 KB, 62 objects), plus the pen engine (23 KB) where boil shows the other takes             |
| Stylesheet                         | 51 KB with the paper textures; Naïve Sans loads beside it from `/fonts/` (74 KB, preloaded)                  |
| A collapsible opening              | No frame over 17 ms in Chrome with the GPU (one frame in three took 100 ms while the paper repainted)        |
| A 200-row table                    | No frame over 20 ms while scrolling at 1× CPU; two or three 33 ms frames at 4× (headless Chromium)           |
| Share images                       | 91 PNGs at 1200 × 630, about 31 KB each, drawn at build time                                                 |

Known heavy pages: the record sleeve and room header docs pages (83 KB and 79 KB of HTML), whose demos draw many large drawings. A drawing that never boils can pass `still`, so the browser never draws its other takes.

## Where v0.1 stands

- **Automated:** axe on 92 pages, day and night (184 runs), from 468 failing elements to 24, all on docs gallery pages or from upstream libraries; none on a block or in Listening Room. Details in the [accessibility review](accessibility-review.md).
- **Contrast:** every full pen passes on every textured stock (`npm run check:contrast`); the quiet pen on kraft was fixed after the review. The faint pen (disabled text, decoration) is below 4.5:1 by design and still sets a few pieces of needed text; see the review.
- **Not covered yet:** forced colours, reduced motion and right-to-left in a real browser, real screen readers, Safari and Firefox, and a real phone.
