import { Checkbox } from "@/fineliner/ui/checkbox"
import { Label } from "@/fineliner/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Checkbox",
  description:
    "A drawn box the pen ticks, for choices that are on or off; the tick runs past the box, as a hand's does.",
  item: "checkbox",
  group: "Forms",
}

export default function CheckboxDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Unchecked">
        <Label>
          <Checkbox /> Bring your own records
        </Label>
      </StateRow>
      <StateRow label="Checked">
        <Label>
          <Checkbox defaultChecked /> I'm visiting the shop
        </Label>
      </StateRow>
      <StateRow label="Partly checked">
        <Label>
          <Checkbox indeterminate /> Every Thursday in November
        </Label>
      </StateRow>
      <StateRow label="Invalid">
        <Label>
          <Checkbox aria-invalid="true" /> I've read the house rules
        </Label>
      </StateRow>
      <StateRow label="Disabled">
        <Label>
          <Checkbox disabled /> Late listening (fully booked)
        </Label>
        <Label>
          <Checkbox disabled defaultChecked /> Members' evening
        </Label>
      </StateRow>
    </DemoSection>
  )
}
