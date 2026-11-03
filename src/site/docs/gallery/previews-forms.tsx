import { DiscIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/fineliner/ui/command"
import { Slider } from "@/fineliner/ui/slider"
import { RELEASES } from "@/site/listening-room/data"
import { PagePicker } from "../demos/pagination/page-picker"
import { Scaled, Sheet } from "./parts"

// Forms and finders whose demo opens with something only the browser draws (the questionnaire's steps) or a row
// wider than a card's plate: the same parts, with less in them.

function SliderPreview() {
  return (
    <div className="flex flex-col gap-hair">
      <span className="text-ui leading-ui">Volume in the booth</span>
      <div className="flex items-center gap-snug">
        <Slider min={0} max={10} defaultValue={6} className="w-40" />
        <span className="font-type text-small leading-small tabular-nums">
          6 of 10
        </span>
      </div>
    </div>
  )
}

/** The questionnaire's stack of sheets with its first question, as it opens. */
function QuestionnairePreview() {
  return (
    <div className="relative w-[16rem] pe-2 pb-2">
      <Sheet seed="gallery:questionnaire" className="grid gap-tight p-snug">
        <p className="label m-0 text-pen-quiet">1 of 3</p>
        <p className="m-0 font-read text-lead leading-subhead font-medium">
          When would you like the room?
        </p>
        <div className="flex flex-wrap gap-tight">
          <Button variant="outline" size="sm">
            <span className="font-type text-pen-quiet">A</span> Thursday
          </Button>
          <Button size="sm">
            <span className="font-type">B</span> Friday
          </Button>
        </div>
      </Sheet>
    </div>
  )
}

function CommandPreview() {
  return (
    <Command className="h-auto w-[16rem]" label="Search the shop">
      <CommandInput placeholder="Record, person or action" />
      <CommandList>
        <CommandGroup heading="Records">
          {RELEASES.slice(0, 2).map((r) => (
            <CommandItem key={r.id} value={r.title}>
              <DiscIcon />
              <span>{r.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function PaginationPreview() {
  return (
    <Scaled by={0.85}>
      <PagePicker page={2} pages={3} onPage={() => {}} />
    </Scaled>
  )
}

export const FORM_PREVIEWS = {
  slider: SliderPreview,
  questionnaire: QuestionnairePreview,
  command: CommandPreview,
  pagination: PaginationPreview,
}
