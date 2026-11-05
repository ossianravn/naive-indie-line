---
name: fineliner-drawings
description: Draw new objects, people and scenes for a project that uses Fineliner, the shadcn/ui kit drawn with one fine-liner (naiveindieline.com). The drawings are seeded SVG made by the kit's pen engine in src/fineliner/pen and shown with <Drawing object="…"> or <Drawing scene="…">. Use this skill whenever someone wants a drawing, spot illustration, empty-state picture, person or room in the Fineliner style, or needs something the library doesn't have yet ("we need a bicycle", "draw our bakery counter", "a person walking a dog for the sign-up page"), even if they never say "pen engine" or "Fineliner".
---

# Fineliner drawings

Fineliner's drawings are not image files. Each one is a small TypeScript function that tells a seeded pen where to go: the
same seed draws the same picture on the server and in the browser, and a different seed draws a sibling with its own
small differences. A project grows the library by writing more of these functions in its own files and registering them,
the same way the kit registers its own objects and scenes.

Your job is to draw what the project needs so that it sits on the page next to the kit's own drawings as if the same
person had drawn it: one thin wobbly line, calm 3/4 views, corners that meet, a few pockets of solid ink, nothing more.

## Before you draw

1. **Find the kit.** It lives in `src/fineliner/` (installed by `shadcn add`); the engine is `src/fineliner/pen/`. Look
   at `src/fineliner/pen/objects/*.ts`: every kit object is there (on an older kit, before the collections split), and the closest one to what you're asked for is your
   best guide (a bicycle starts from how the chair and desk lamp are built; a bakery counter from the desk and the bistro
   table). Read `references/style.md` once, before the first drawing of a session.
2. **Check it doesn't exist.** The ids in `objects/*.ts`, or `listObjects()` once the collections are imported. Sometimes the answer
   is an existing object with an option (`window` takes `view`, `plate` takes `dish`, `person` takes `pose` and `hair`).
3. **Decide what it is.** An object (one thing on its own tile, placed in scenes too), a person in a new pose, or a
   scene (a room composed from objects inside the drawn border). Know where it will appear and how big: a 48 px empty-state
   spot needs fewer, larger parts than a hero scene.

## Where the code goes

Write the drawings in the project's own module, never inside `src/fineliner/`. The kit's files are replaced when the
project runs `shadcn add` again to update, and anything added to them is lost.

```
src/drawings/index.ts   ← your objects and scenes, registered on import
```

Import that module (`import "@/drawings"`) at the top of every file that renders `<Drawing>` with one of your ids, or
calls `drawing()` with one. Registration happens when the module runs, into one library per JavaScript realm, so a Next.js server component
that imports it covers the server render of a client `<Drawing>` too. The browser needs it only to draw there (a reroll,
line boil's later takes): import it in a client component as well for those. A wrong or missing
import shows up as the error `No drawing object "your-id"`.

The kit's own drawings register the same way, one collection at a time: `@/fineliner/pen` is the engine only. Import
the collections your module places or your pages show (`import "@/fineliner/pen/objects/indie"`, or every one with
`@/fineliner/pen/objects`, and the kit's scenes with `@/fineliner/pen/objects/rooms`), and install them if the project
lacks them (`npx shadcn add @fineliner/drawings-indie`). A kit without `src/fineliner/pen/objects/indie.ts` predates the
split: there the engine registers everything itself.

`assets/example-drawings.ts` is a complete, working module (a watering can, a person carrying a parcel, and a shop
counter scene). Copy its shape.

## Drawing an object

Read `references/engine.md` for the API. The essentials:

```ts
import {
  define,
  objectsIn,
  depth,
  box,
  type Draw,
  type Point,
} from "@/fineliner/pen"

/** A wooden step stool. `at` is where it stands (bottom-left); k is its scale. */
export const stool: Draw = (s, p, r, at, k = 1) => {
  const o = depth(r) // where "back" is, from the seed
  const top = box(s, p, o, [at[0], at[1] - 40 * k], 60 * k, 6 * k, 30 * k)
  // …legs first (behind), then the top box drawn over their ends
}

const T = objectsIn("workshop") // your own collection name
define(T("stool", "Step stool", [120, 100], [20, 90], 1, stool, [
  "furniture",
  "home",
]))
```

- `s` is the sheet you draw on, `p` the pen, `r` the shape stream for every choice (sizes, angles, how many). `at` and
  `k` say where and how big; build every coordinate from them so scenes can place and scale the object.
- **Draw back to front.** `s.blank(p.shape(outline))` hides everything drawn earlier inside that outline; then stroke the
  outline. That's how a front leg hides the back one and a cup hides its handle's roots.
- **Closed outlines are one stroke** (`p.shape`), so corners meet. Inner lines should end on an outline or under a part
  drawn after them, so the pen's small run-on lands on a line instead of poking out. `box`, `pad`, `drum`, `banded` and
  `cylinder` already do this.
- **Every random choice comes from `r`**, never `Math.random()` or `Date.now()`: the drawing must be the same for the same
  seed everywhere. Take sizes and angles from `r` only where variety helps; keep the object recognisable at every seed.
- The tile (`size`, `at`, `k` in `define`) is the object's own frame for `<Drawing object>`: leave about 8 px of air round
  the drawing and check that no seed runs outside it.

## People and scenes

- **People**: `references/people.md`. Put people in with the kit's `figure()` (any pose, looking out, turned to either
  side or seen from behind), or build new poses from its `clothes()`, `head()`, `profile()` and `backOfHead()`, so they
  wear the same loose tops, wide trousers and trainers and the same inked hair. People in scenes have faces, and when a
  scene has two or more, they face different ways.
- **Scenes**: `references/scenes.md`. `defineScene(name, { name, label, size, compose })` with the kit's `stage()` for the
  walls, rug, border and `put()`, then `<Drawing scene="name" seed="…" />`.

## Look at it large, then fix it

A drawing that typechecks can still look wrong, and you only see that at size. Render a contact sheet of the new ids
across several seeds and both hands:

```bash
node <skill-dir>/scripts/render.mjs --module src/drawings/index.ts --ids stool,shop-counter --seeds a,b,c,d --out drawings-check.png
```

It needs `jiti` in the project (most Vite and Next apps have it already; if not, the script says so). For the PNG it uses
`sharp` if the project has it, or a Chrome or Edge on the machine, headless; with neither it writes an HTML page. Don't
add dependencies to the user's project just for this. It also warns when an object comes within 4 px of its tile's
edge or runs past it, and when a seed gives broken coordinates. Then look at the image and ask:

- Would it sit unnoticed next to the kit's chair, mug and turntable? Same line, same calm, same amount of ink?
- Do corners meet? Does anything poke through a part in front of it, or float without touching what holds it?
- Is the perspective one perspective (one `depth(r)` per object), tipping up and to the right?
- Does every seed still read as the thing, and does the calm hand (`--hands calm`) look as clean as the lively one?
- At the size it will be used, is any detail smaller than the pen's wobble (a scribble)? Drop it or make it bigger.

Fix and render again until the answers are yes. Two or three rounds is normal.

## Finish

- Run the project's typecheck, and render the page that uses the drawing.
- Tell the user what you drew, the id(s) and how to use them (`<Drawing object="stool" seed="any-string" />`), where the
  code lives, and what you weren't able to check.
