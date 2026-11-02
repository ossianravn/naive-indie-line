import type { ComponentType } from "react"
import { TooltipProvider } from "@/fineliner/ui/tooltip"
import type { DemoMeta } from "./demo-kit"

// Every demo, bundled into one island so each docs page can hydrate the demo it names.
type DemoModule = { default: ComponentType; meta: DemoMeta }
const modules = import.meta.glob<DemoModule>("./demos/*.tsx", { eager: true })
const demos = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    mod,
  ]),
)

/** Renders one component's demo by name. */
export function DemoHost({ name }: { name: string }) {
  const Demo = demos[name]?.default
  return (
    <TooltipProvider>
      {Demo ? <Demo /> : <p className="text-pen-quiet">No demo yet.</p>}
    </TooltipProvider>
  )
}
