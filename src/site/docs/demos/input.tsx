import { Input } from "@/fineliner/ui/input"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input",
  description:
    "A single line of text inside a steady pen line, as wide as what it holds.",
  item: "input",
  group: "Forms",
}

export default function InputDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Empty">
        <Input
          className="w-64"
          placeholder="e.g. Maya Singh"
          aria-label="Your name"
        />
      </StateRow>
      <StateRow label="Filled">
        <Input
          className="w-64"
          defaultValue="Maya Singh"
          aria-label="Your name"
        />
      </StateRow>
      <StateRow label="Invalid">
        <Input
          className="w-64"
          defaultValue="maya@"
          aria-invalid="true"
          aria-label="Email"
        />
      </StateRow>
      <StateRow label="Disabled">
        <Input
          className="w-64"
          disabled
          defaultValue="Thursday 5 November"
          aria-label="Date"
        />
      </StateRow>
      <StateRow label="Sized to its value">
        <Input
          className="w-20 text-center tabular-nums"
          defaultValue="2"
          aria-label="Group size"
        />
        <Input
          className="w-36 font-type"
          defaultValue="Nº 0412"
          aria-label="Catalogue number"
        />
      </StateRow>
    </DemoSection>
  )
}
