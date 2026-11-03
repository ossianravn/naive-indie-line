// Draws the drawing skill's worked example (skills/fineliner-drawings/assets/example-drawings.ts) for the skill's page,
// as src/site/skill/examples.generated.json. The page shows them as drawn; importing the example into the site would
// register its objects in the kit's library and change every count that lists it.
//   node tools/render-skill-examples.mjs
import { writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const jiti = createJiti(import.meta.url, {
  alias: { "@": path.join(root, "src") },
})
const pen = await jiti.import(path.join(root, "src/fineliner/pen/index.ts"))
await jiti.import(path.join(root, "src/fineliner/pen/objects/index.ts"))
await jiti.import(path.join(root, "src/fineliner/pen/objects/rooms.ts"))
await jiti.import(
  path.join(root, "skills/fineliner-drawings/assets/example-drawings.ts"),
)

const seed = "skill"
const object = (id) => {
  const o = pen.getObject(id)
  // The tile's own width, so the page shows each object at the scene's scale.
  const svg = pen.drawing({ object: id, seed })[0]
  return { id, name: o.name, width: o.size[0], svg }
}
const scene = pen.SCENES["plant-shop"]
const examples = {
  scene: {
    id: "plant-shop",
    name: scene.name,
    svg: pen.drawing({ scene: "plant-shop", seed })[0],
  },
  objects: [object("watering-can"), object("parcel-carrier")],
}
const out = path.join(root, "src/site/skill/examples.generated.json")
writeFileSync(out, `${JSON.stringify(examples, null, 2)}\n`)
console.log(`wrote ${path.relative(root, out)}`)
