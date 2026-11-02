import { Fragment } from "react"
import { Label } from "@/fineliner/ui/label"
import { Separator } from "@/fineliner/ui/separator"
import { Switch } from "@/fineliner/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Switch",
  description:
    "A drawn pill for a setting that is on or off and takes effect at once; on, the pen fills it with ink.",
  item: "switch",
  group: "Forms",
}

const SETTINGS = [
  {
    id: "thursday-mail",
    label: "Thursday events by email",
    hint: "A short note on Monday with the week's records and wine.",
    on: true,
  },
  {
    id: "hold-records",
    label: "Hold records for a day",
    hint: "Records you reserve stay behind the counter until closing tomorrow.",
    on: false,
  },
  {
    id: "own-records",
    label: "Bring your own records",
    hint: "We'll have the cleaning machine ready before your session.",
    on: false,
  },
]

export default function SwitchDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="On">
          <Label>
            <Switch defaultChecked /> Bring your own records
          </Label>
        </StateRow>
        <StateRow label="Off">
          <Label>
            <Switch /> Hold records for a day
          </Label>
        </StateRow>
        <StateRow label="Invalid">
          <Label>
            <Switch aria-invalid="true" /> Accept the house rules
          </Label>
        </StateRow>
        <StateRow label="Disabled">
          <Label>
            <Switch disabled /> Late listening (fully booked)
          </Label>
          <Label>
            <Switch disabled defaultChecked /> Members' evening
          </Label>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <Label>
            <Switch size="sm" defaultChecked /> Compact
          </Label>
          <Label>
            <Switch defaultChecked /> Default
          </Label>
        </StateRow>
      </DemoSection>
      <DemoSection title="Settings rows">
        <div className="max-w-[30rem]">
          {SETTINGS.map(({ id, label, hint, on }, i) => (
            <Fragment key={id}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between gap-snug py-hair">
                <div className="flex flex-col">
                  <Label htmlFor={id}>{label}</Label>
                  <span
                    id={`${id}-hint`}
                    className="text-small leading-small text-pen-quiet"
                  >
                    {hint}
                  </span>
                </div>
                <Switch
                  id={id}
                  aria-describedby={`${id}-hint`}
                  defaultChecked={on}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </DemoSection>
    </>
  )
}
