// The little of opentype.js the share images use (the package ships no types): parse a font, set a line as a path.
declare module "opentype.js" {
  export type Command =
    | { type: "M" | "L"; x: number; y: number }
    | {
        type: "C"
        x1: number
        y1: number
        x2: number
        y2: number
        x: number
        y: number
      }
    | { type: "Q"; x1: number; y1: number; x: number; y: number }
    | { type: "Z" }
  interface Path {
    commands: Command[]
    getBoundingBox(): { x1: number; y1: number; x2: number; y2: number }
  }
  interface Font {
    getPath(
      text: string,
      x: number,
      y: number,
      size: number,
      options?: { kerning?: boolean },
    ): Path
  }
  const opentype: { parse(buffer: ArrayBuffer): Font }
  export default opentype
}
