# Scenes

A scene is a room drawn inside the hand-drawn border, composed back to front from objects. The kit's four (`room`,
`studio`, `bistro`, `work`) are in `src/fineliner/pen/scenes.ts`; read one before writing your own.

## Adding a scene

```ts
import { defineScene, stage, type Box, type HandName } from "@/fineliner/pen"

function shop(seed: string, hand: HandName, take: number) {
  const { s, p, r, put, w, h, m, floor, walls, rug, border } = stage(
    seed,
    hand,
    take,
    "shop",
  )
  walls()
  put("window", "window", [r.between(0.24, 0.3) * w, floor - 124], 0.85)
  // …furniture back to front, then what stands on it, then people…
  border()
  return s
}

defineScene("shop", {
  name: "Shop",
  label: "A shop counter with a till, bread and someone buying a parcel", // the accessible name
  size: [640, 440],
  compose: shop,
})
```

Then `<Drawing scene="shop" seed="anything" />` or `drawing({ scene: "shop", seed })`.

## The stage

`stage(seed, hand, take, name)` returns:

| Field                            | What it is                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `s`, `p`                         | the scene's sheet and pen, for anything you draw directly (a counter, a doorway, a floor curve)   |
| `r`                              | the room's stream: every layout choice comes from it, so every take has the same composition      |
| `put(id, key, at, k?, options?)` | draws a registered object (yours or the kit's); `key` names its seed fork, so two speakers differ |
| `w`, `h`, `m`                    | the sheet's size (640 × 440) and the border's margin (14)                                         |
| `corner`, `floor`                | x where the side wall meets the back wall, y where the back wall meets the floor                  |
| `walls()`, `rug()`, `border()`   | the room's lines, a sweeping floor curve, and the frame (draw it last)                            |

`name` goes into the sheet's mask ids, so two scenes from one seed on a page don't collide: pass the scene's own name.

## Composing

- **Order is depth.** Walls, then what hangs on the back wall (window, picture, shelf), then furniture from back to front,
  then what stands on it, then people and pets in front, then `border()`. Each object blanks what was drawn before it, so
  something drawn later always sits in front.
- **Nearer is lower and larger.** Things standing on the floor at the back wall stand at `y ≈ floor + 40…80`; things near
  the viewer stand near `h - m - 14`, scaled up a little. A standing visitor near the front is `k ≈ 1.25`; a desk at the
  back wall `k = 1`.
- **Stack with boxes.** Furniture that returns a `Box` (`desk`, `shelf`) gives you its top, so
  `top.top(0.9, 0.6)` is the right back of the desk: put a lamp there. Things further back (higher `v`) go first.
- **Leave air.** Most of the wall stays empty. Two or three things on the wall, one piece of furniture with a few things
  on it, one or two people: that's a full scene.
- **Seeded variety, same story.** Take positions from `r.between(…)` within a small range, and use `r.chance(…)` for
  swaps (a cat or a plant, a monitor or a laptop), never for the scene's main subject.
- **Check the seams.** In the contact sheet, look at every place where two objects meet: legs on the floor, a person in a
  chair, a lamp on a desk. Nothing should float above what holds it or sink into it.
