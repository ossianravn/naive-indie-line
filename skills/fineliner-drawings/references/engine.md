# The pen engine, for drawing

Everything here is exported from `@/fineliner/pen` (the kit's `src/fineliner/pen/index.ts`). The engine is
framework-free TypeScript: no React, no DOM, so a drawing runs on the server, at build time and in the browser.

## Contents

- Coordinates
- A draw function
- The sheet: what a mark is
- The pen: how a line goes
- Geometry helpers
- Shapes
- Seeds and the shape stream
- Registering an object
- Placing objects inside other drawings

## Coordinates

SVG coordinates: x to the right, **y down**. A drawing's `at` is usually its bottom-left or bottom-centre (say which in
the function's comment) and everything is built upward from it, scaled by `k`:

```ts
const P = (u: number, v: number): Point => [at[0] + u * k, at[1] - v * k] // u right, v up, in the object's own units
```

Write the object in its own units (a mug 40 wide, 44 tall) and let `P` place it. Angles in `arc` are degrees, 0 to the
right and **90 down**.

## A draw function

```ts
type Draw = (
  s: Sheet,
  p: Pen,
  r: Stream,
  at: Point,
  k: number,
  options: DrawOptions,
) => unknown
```

What it returns is for scenes that stack things: `desk` returns its top as a `Box` so a scene can put a lamp on
`top.top(0.9, 0.6)`. Return nothing if nothing sits on it.

`options` are choices a caller can make instead of the seed: `kind`, `pose`, `view`, `dish`, `hair`, `glasses`, `beard`,
`black`, `wine`, `top`, `w`, `h`, `d`, `legs`. Reuse these names; destructure with a seeded default
(`{ kind = r.pick(["round", "square"]) } = {}`) so the object works alone and on command.

## The sheet: what a mark is

| Call          | Draws                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| `s.stroke(d)` | a pen line                                                                          |
| `s.fill(d)`   | solid ink (rare)                                                                    |
| `s.wash(d)`   | the thinned second tone, for art (wine, a sticky note)                              |
| `s.paper(d)`  | flat paper over ink, for small holes (a record's label, a bulb inside a dark shade) |
| `s.blank(d)`  | hides everything drawn **before** it inside the shape; later marks are unaffected   |

`d` is SVG path data from the pen. Layering is by order: draw back to front and blank before each front part.

## The pen: how a line goes

| Call                           | Use for                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `p.shape(points)`              | a closed outline in one stroke, corners meeting; also the shape to blank or fill   |
| `p.path(points)`               | an open run through points (a sleeve's edge, a stem); its two ends run on a little |
| `p.line(a, b)`                 | one straight stroke; both ends run on a little                                     |
| `p.edges(points, closed?)`     | each edge its own stroke, overshooting every corner (rarely what you want)         |
| `p.disc(c, u, v?)`             | a closed ellipse outline, for fills, blanks and clean small rings                  |
| `p.ring(c, u, v?)`             | a drawn ellipse that goes a little past its start, like a quick hand               |
| `p.round(c, u, v, from, turn)` | points round an ellipse (radians), to feed into `path` or `shape`                  |

`u` and `v` are the ellipse's axis vectors: `dot(c, r)` gives `[c, [r, 0], [0, r]]` for a circle, so
`s.fill(p.disc(...dot(c, 3 * k)))`. `HANDS[p.hand].over` is how far this hand runs past an end, if you need to pull an end
back by it.

## Geometry helpers

`add(a, b, f?)`, `lerp(a, b, t)`, `times(v, f)`, `length(v)`, `dist(a, b)`, `turn(pt, centre, degrees)`,
`arc(c, rx, ry, a0, a1, n?)` (points on an ellipse), `rect(x, y, w, h)` (corners from the top-left),
`roundRect(x, y, w, h, rad)` (a rounded rectangle's loop, for `p.shape`), `dot(c, r)`, `deg`, `snap`, `last`.

Use `Math.sqrt`, never `**`, `Math.pow` or `Math.hypot`: they round differently between engines and a last-bit
difference can change how many points a stroke gets, so server and browser would draw different pictures.

## Shapes

| Helper                                          | Draws                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `depth(r)`                                      | the object's "back" direction, up and to the right at a seeded angle; use once per object   |
| `box(s, p, o, at, w, h, d)`                     | an oblique box (front face w × h, bottom-left at `at`, receding d along `o`); returns `Box` |
| `pad(s, p, o, at, w, h, d, rad)`                | a padded box with rolled top corners (cushions, arms of a sofa); returns `Box`              |
| `banded(s, p, x, y, w, h, rad, cut)`            | a rounded rectangle with a band across its top (a browser's tab bar, a camera's top)        |
| `cylinder(s, p, c, rx, ry, h)`                  | an upright cylinder; `c` is the centre of its top                                           |
| `drum(s, p, c, [rt, rb, h, e], inside?, wash?)` | a round seen from above (pot, lampshade, base); `inside()` draws what stands in it          |
| `handle(s, p, x, y0, y1, reach)`                | a cup's handle on its side                                                                  |
| `scribble(s, p, r, x, y, w, lines, gap?)`       | wavy lines of text for menus, notes and screens                                             |
| `sprig(s, p, a, b, size)`                       | a twig with small solid leaves                                                              |

A `Box` gives you points on it: `front(u, v)` on the front face (u left to right, v bottom to top, 0 to 1) and
`top(u, v)` on the top face (v front to back). Put things on a box with `top(u, v)`.

## Seeds and the shape stream

`r` is the drawing's **shape stream**: `r.next()` (0 to 1), `r.between(a, b)`, `r.signed()` (−1 to 1), `r.chance(p)`,
`r.pick(list)`. Every composition choice comes from `r`. Take the draws in a fixed order: a draw inside an `if` shifts
every draw after it for the seeds that take the other branch, which is fine, but don't make the number of draws depend
on anything but `r` and `options`.

The pen has its own stream for its wobble. Line boil redraws the same composition with another pen, so a drawing's
shape must never depend on the pen (don't call `p.next()` for composition).

## Registering an object

```ts
const T = objectsIn("bakery") // any collection name
define(T("croissant", "Croissant", [140, 90], [20, 78], 1, croissant, [
  "food",
  "breakfast",
]))
```

`T(id, name, size, at, k, draw, tags)`: the id is what `<Drawing object="croissant">` takes; the name is its accessible
name; `size` is the tile `[width, height]` in px; `at` and `k` are where and how large the object draws on its tile.
Defining an id again replaces it (handy with hot reload). Ids are global: prefix yours if they could clash with a kit id
(`listObjects()` lists them all).

## Placing objects inside other drawings

`place(s, id, seed, hand, at, k?, options?, take?)` draws a registered object into a sheet you are drawing, with its own
fork of the seed. You can also call one of your draw functions directly from another (`sack(s, p, r, at, k, {})`): it
shares the caller's pen and stream, and `options` is required, so pass `{}` when there are none. Scenes use it through `stage().put` (see `scenes.md`); an object can use it too, to hold another (a
person carrying a `record`).
