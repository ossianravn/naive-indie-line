// The people collection: importing this entry registers only its drawings.
// Shared drawing parts stay in the engine; other collections register through their own entries.
import "./faces"
import "./visitors"
import "./seated"
import "./figures"
export { clothes, TOPS, type Outfit } from "./clothes"
export { HAIR, hairBehind, head } from "./faces"
export { backOfHead, profile, profileBehind, type Look } from "./heads"
export { figure, VIEWS } from "./figures"
