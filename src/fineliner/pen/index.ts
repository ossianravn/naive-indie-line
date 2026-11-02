// The pen engine: framework-free, so it runs at build time, in share-image rendering and in the browser. Phase 1
// adds the stroke engine, the object library and scenes from the prototype in specimen/.
export { seedOf, prng, fork, stream } from "./seed"
export {
  WOBBLE_VARIANTS,
  wobbleFilter,
  sharedFilters,
  frameVars,
} from "./filters"
