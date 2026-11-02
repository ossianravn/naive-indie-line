import { Button } from "@/fineliner/ui/button"
import { Kbd, KbdGroup } from "@/fineliner/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/fineliner/ui/tooltip"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Kbd",
  description: "A typewriter keycap that names a key or a shortcut.",
  item: "kbd",
  group: "Data display",
}

export default function KbdDemo() {
  return (
    <DemoSection title="Keys">
      <StateRow label="Group">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>B</Kbd>
        </KbdGroup>
      </StateRow>
      <StateRow label="Single">
        <Kbd>N</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </StateRow>
      <StateRow label="In text">
        <p className="m-0 max-w-measure text-small leading-small text-pen-quiet">
          Press <Kbd>N</Kbd> to add a record to the catalogue, or <Kbd>Esc</Kbd>{" "}
          to close the form without saving.
        </p>
      </StateRow>
      <StateRow label="In a tooltip">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Search the racks
          </TooltipTrigger>
          <TooltipContent>
            Search
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </StateRow>
    </DemoSection>
  )
}
