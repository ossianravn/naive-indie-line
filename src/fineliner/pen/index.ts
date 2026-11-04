// The framework-free pen engine: importing it registers no drawings. Import a collection such as
// "@/fineliner/pen/objects/indie", every collection with "@/fineliner/pen/objects", and the kit's scenes with
// "@/fineliner/pen/objects/rooms" where you draw them.
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
  sceneIn,
  stage,
  type Scene,
  type SceneFormat,
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
