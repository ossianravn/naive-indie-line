# The look

What a Fineliner drawing is, and the mistakes that make a new one stand out from the kit's. Read this once before you
draw; come back to the checklist at the end when you review a contact sheet.

## The look in one breath

One thin navy fine-liner on unbleached paper, drawn by a calm, slightly naive hand. It comes from natural-wine labels and
indie record sleeves: everyday things (records, a chair, a plant, a mug), people who are only their clothes or have a dot
for each eye, and rooms with plenty of empty wall. Deadpan, never cute.

## Rules

1. **One pen, one weight.** Every line is the same monoline; the CSS sets its width, so never draw a line twice to make
   it bolder, and never draw sketchy double strokes. Thin parts are one line: a bicycle's tubes and spokes, a lamp's
   stem, a cord, a lead, a chair's rail at small sizes. Draw both edges only of parts with real thickness at the size of
   use (a table top, a leg of a sofa, a pot's rim); doubling every tube makes a drawing heavy and technical.
2. **Contours, not tone.** No hatching, shading, gradients or drop shadows. A thing is its outline plus the few inner
   lines that explain it (a drawer's handle, a book's pages, a pot's rim).
3. **Ink is rare.** `s.fill` makes solid ink; use it for at most two or three small places per object, where the eye
   should land: a record on a platter, the soil in a pot, a lampshade's inside, buttons, hair. A large solid shape
   (a black animal, a dark coat, a heap of beans) needs a reason the drawing can't do without; a precedent in the kit
   (its black cat) is not one. A drawing with more fill than outline has left the style.
4. **The wash is for art.** `s.wash` is a thinned second tone for things like wine in a glass, a sticky note or a pot's
   rim band. One washed area per object at most; many objects have none.
5. **Flattened 3/4 view.** Objects are seen a little from above and from the front-left, receding up and to the right at
   the angle `depth(r)` gives. Round things are ellipses seen from above (`drum`, `cylinder`). One object has one
   perspective; neighbours may disagree a little. Things that read best from the side (a bicycle, a dog, a car) are
   drawn in profile.
6. **A calm hand.** The pen wobbles on its own. Your geometry should be clean and deliberate: straight where the thing is
   straight, symmetric where it is symmetric. The naivety is in simple shapes and slight wonkiness, not in errors.
7. **Air.** Leave space inside and around a drawing. Fewer, larger parts read better than many small ones.
8. **Deadpan subjects.** No faces on objects, no mascots, no speech, no lettering inside drawings beyond scribbled lines
   (`scribble`) where a label or a screen would have text.

## How the kit's drawings get clean (learned the hard way)

These are the fixes the kit's own library needed. A new drawing that skips them looks rough next to it.

- **Closed outlines in one stroke.** `p.shape(points)` draws a closed outline as one run whose ends meet mid-edge, so
  corners join. `p.edges(points)` draws every edge separately, and each overshoots its corners: rectangles turn into
  crossed sticks. Use `edges` only for a deliberately loose, sketchy part, which is rare.
- **Lines end on something.** An open line's ends run on a little past where you put them (up to about 4.5 px with the
  lively hand). End inner lines on an outline (the overshoot lands on that line), or under a part drawn later that blanks
  them, or pull the end back a couple of pixels. A seam across a box ends just inside its edges.
- **Back to front with blanks.** Draw what is behind first, then `s.blank(p.shape(outline))` and stroke the outline of
  what is in front. Legs run up into a table top drawn after them; stems go into a pot whose front is drawn after them.
  Joins then look made, not drawn.
- **Small details are scribbles.** Anything shorter than about 6 px at the size of use becomes a knot of wobble. Use a
  dot (`p.disc` filled) instead of a tiny line, or leave it out.
- **Rings look like rings.** A small closed circle reads cleaner as `p.disc(...)` stroked (`s.stroke(p.disc(...))`) than
  as `p.ring`, which deliberately runs past its start like a quick hand.
- **People don't read old.** Hair is a filled shape (outlined hair reads as grey); clothes are loose sweaters, hoodies,
  open overshirts and tees, wide trousers with rolled hems or a short skirt, and trainers. The kit's `clothes()` and
  `head()` already do this.

## Review checklist

Look at the contact sheet at several seeds, both hands, and ask:

- Would it pass unnoticed between the kit's chair, mug and turntable?
- Do all corners meet? Does any line poke through a part in front of it, past a rim, or out of the silhouette?
- Does every part touch what holds it (a handle its cup, a shade its arm, a person their chair)?
- One perspective? Round tops are ellipses, boxes recede up and to the right.
- Is ink rare and purposeful, with no large solid shape it could do without? Is there at most one washed area?
- Are thin parts single lines, and only thick parts drawn with both edges?
- Does every seed still read as the thing? Is anything outside the tile?
- At the size it will be used, are there scribbles where details were meant to be?
