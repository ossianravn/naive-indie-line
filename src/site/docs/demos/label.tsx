import { Checkbox } from "@/fineliner/ui/checkbox"
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Label",
  description:
    "Names a control in the reading voice, beside it, so a click on the words reaches the control.",
  item: "label",
  group: "Forms",
}

export default function LabelDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Beside a box">
        <Label>
          <Checkbox /> Send me the Thursday list
        </Label>
      </StateRow>
      <StateRow label="For a field">
        <Label htmlFor="demo-label-name">Your name</Label>
        <Input id="demo-label-name" className="w-56" />
      </StateRow>
      <StateRow label="Disabled">
        <Label>
          <Checkbox disabled /> Late listening (fully booked)
        </Label>
      </StateRow>
    </DemoSection>
  )
}
