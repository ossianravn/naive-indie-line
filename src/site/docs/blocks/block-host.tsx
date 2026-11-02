import { TooltipProvider } from "@/fineliner/ui/tooltip"
import { BLOCKS } from "./blocks"

/** Renders one block by name, in a state when it has variants: the whole page of a preview frame. */
export function BlockHost({
  name,
  variant,
}: {
  name: string
  variant?: string
}) {
  const Block = BLOCKS.find((block) => block.name === name)?.component
  if (!Block)
    return <p className="m-0 p-line text-pen-quiet">No block called {name}.</p>
  return (
    <TooltipProvider>
      <Block {...(variant ? { variant } : {})} />
    </TooltipProvider>
  )
}
