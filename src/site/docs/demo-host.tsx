import { lazy, Suspense, type ComponentType } from "react"
import { TooltipProvider } from "@/fineliner/ui/tooltip"

// Every demo as its own chunk, loaded by name, so a docs page ships only the demo it shows. The server waits for the
// lazy demo while it streams the page, so the HTML holds the whole demo; the browser hydrates it once its chunk
// arrives, keeping the server's HTML on screen until then.
const loaders = import.meta.glob<{ default: ComponentType }>("./demos/*.tsx")
const demos = Object.fromEntries(
  Object.entries(loaders).map(([path, load]) => [
    path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    lazy(load),
  ]),
)

/** Renders one component's demo by name. */
export function DemoHost({ name }: { name: string }) {
  const Demo = demos[name]
  return (
    <TooltipProvider>
      <Suspense fallback={null}>
        {Demo ? <Demo /> : <p className="text-pen-quiet">No demo yet.</p>}
      </Suspense>
    </TooltipProvider>
  )
}
