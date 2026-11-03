// The pen engine: framework-free, so it runs at build time, in share-image rendering and in the browser. Importing it
// registers every object in the library.
export { seedOf, prng, fork, stream, type Stream } from "./seed"
export {
  WOBBLE_VARIANTS,
  wobbleFilter,
  sharedFilters,
  frameVars,
} from "./filters"
export * from "./geometry"
export { pen, HANDS, type Pen, type HandName } from "./stroke"
export { plot, type Plot } from "./plot"
export { sheet, type Sheet } from "./layers"
export { pathOf, pathPoints, pathBox } from "./path"
export {
  banded,
  box,
  cylinder,
  depth,
  drum,
  handle,
  pad,
  scribble,
  sprig,
  type Box,
} from "./shapes"
export {
  COLLECTIONS,
  define,
  objectsIn,
  getObject,
  listObjects,
  place,
  tile,
  type Collection,
  type Draw,
  type DrawOptions,
  type DrawingObject,
} from "./library"
export {
  SCENES,
  defineScene,
  stage,
  type Scene,
  type SceneName,
  type Stage,
} from "./scenes"
export { drawing, type DrawingOptions } from "./drawing-svg"
export { GLYPHS, type Glyph } from "./glyphs"
export {
  FACES,
  lettering,
  type FaceName,
  type LetteringOptions,
} from "./lettering-svg"
export { MARKS, penMark, penBorder, type MarkName } from "./pen-marks"
// Building blocks for people, so a project can draw new poses in the same clothes and hair.
export { clothes, TOPS, type Outfit } from "./objects/clothes"
export { HAIR, hairBehind, head } from "./objects/people"
import "./objects"
