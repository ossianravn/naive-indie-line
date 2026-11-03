# People

The kit's people are young and dressed for everyday: loose sweaters, hoodies, open overshirts and tees, wide trousers with
rolled hems or a short skirt, and trainers. Hair is a pocket of ink. Faces are two dots, a line for a nose and a short
mouth. In scenes, people are usually only their clothes, with a collar ring where a head would be (the "visitor"), as on
the label the style comes from.

Reuse the kit's pieces rather than drawing bodies from scratch, so a new figure matches the others.

## The pieces

All exported from `@/fineliner/pen/objects/people`, which also registers the kit's people (on a kit from before the
collections split, from `@/fineliner/pen`).

```ts
clothes(s, p, r, at, k, { pose, top, bottom, stride, nobody }) // → { hands: [left, right], neck }
hairBehind(s, p, headCentre, k, hair) // long hair, a ponytail: draw before clothes()
head(s, p, r, headCentre, k, { hair, glasses, beard }) // face, ears, hair in front: draw after clothes()
HAIR // "bob", "crop", "fringe", "bun", "curls", "long", "ponytail", "waves"
TOPS // "sweater", "hoodie", "overshirt", "tee" (a tee shows bare arms: not for a headless visitor)
```

- `at` is between the feet on the floor; the figure is about 193 units tall at `k = 1`, and the head's centre is
  `[at[0], at[1] - 178 * k]`.
- Inside `clothes()` the units run **up as negative v**: a point is `[at[0] + u * k, at[1] + v * k]`, the neck at
  `v = -163`, the waist at `-90`. Use the same convention for anything you add on the body.
- `pose`: `"stand"`, `"wave"` (right arm up), `"mug"` (right forearm forward, hand in front of the chest) or `"walk"`
  (arms swinging, feet apart). `hands[1]` is the right hand: put what they hold there.
- `stride` spreads the feet; `nobody: true` leaves out hands and feet (the visitor).

## A person holding something

```ts
export const parcelCarrier: Draw = (
  s,
  p,
  r,
  at,
  k = 1,
  { hair = r.pick(HAIR) } = {},
) => {
  const c: Point = [at[0], at[1] - 178 * k]
  hairBehind(s, p, c, k, hair)
  const { hands } = clothes(s, p, r, at, k, { pose: "mug", top: r.pick(TOPS) })
  head(s, p, r, c, k, { hair })
  // The parcel goes last, in front of the arm that holds it.
  const o = depth(r)
  box(s, p, o, add(hands[1] as Point, [-8 * k, 8 * k]), 34 * k, 22 * k, 14 * k)
}
```

For a visitor (only clothes), skip `hairBehind` and `head`, pass `nobody: true`, pick the top from the first three
`TOPS`, and draw the collar ring: `s.stroke(p.ring([at[0], at[1] - 162.5 * k], [8 * k, 0], [0, 2.6 * k]))`.

## A pose clothes() doesn't have

Sitting, kneeling, seen from behind, bending: draw the figure yourself in the same proportions and the same clothes.
The kit's `src/fineliner/pen/objects/seated.ts` is the worked example (someone at a desk, from behind, on an office
chair): the torso as one closed outline, sleeves as closed shapes swung from the shoulder, hair from behind as a filled
cap, then the chair drawn over them. Read it before drawing a new pose. Keep:

- the proportions: head about a sixth of standing height, shoulders about 46 units wide, sleeves about 10 wide;
- the clothes' details: a rib band at the hem and cuffs of a sweater or hoodie, a hood lying on the back, an overshirt's
  open fronts and collar;
- hair as a filled shape, never an outline;
- hands as small rings (`p.ring`, radius about 3.6 units), only on people with heads.

## Avoid

- Outlined hair, bald heads with glasses, buttoned-up collars, tucked-in waistbands, long skirts and black shoes: together
  they make everyone look retired.
- Detailed faces (eyebrows, noses with nostrils, teeth), fingers, muscles. People are as simple as the objects.
- Mascot energy: big smiles, thumbs up, speech bubbles.
