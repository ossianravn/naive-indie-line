import { Label } from "@/fineliner/ui/label"
import { RadioGroup, RadioGroupItem } from "@/fineliner/ui/radio-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Radio group",
  description:
    "Circles the pen draws, for picking exactly one of a few options; the chosen one takes an inked dot.",
  item: "radio-group",
  group: "Forms",
}

const LENGTHS = [
  { value: "half", label: "Half an hour" },
  { value: "hour", label: "An hour" },
  { value: "two", label: "Two hours" },
]

function Options({
  disabled,
  invalid,
}: {
  disabled?: string
  invalid?: boolean
}) {
  return LENGTHS.map(({ value, label }) => (
    <Label key={value}>
      <RadioGroupItem
        value={value}
        disabled={value === disabled}
        aria-invalid={invalid || undefined}
      />
      {label}
    </Label>
  ))
}

export default function RadioGroupDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Chosen">
          <RadioGroup
            aria-label="Session length"
            defaultValue="hour"
            className="w-auto"
          >
            <Options />
          </RadioGroup>
        </StateRow>
        <StateRow label="Nothing chosen">
          <RadioGroup aria-label="Session length" className="w-auto">
            <Options />
          </RadioGroup>
        </StateRow>
        <StateRow label="Invalid">
          <RadioGroup
            aria-label="Session length"
            aria-invalid="true"
            className="w-auto"
          >
            <Options invalid />
          </RadioGroup>
        </StateRow>
        <StateRow label="One disabled">
          <RadioGroup
            aria-label="Session length"
            defaultValue="hour"
            className="w-auto"
          >
            <Options disabled="two" />
          </RadioGroup>
        </StateRow>
        <StateRow label="All disabled">
          <RadioGroup
            aria-label="Session length"
            defaultValue="half"
            disabled
            className="w-auto"
          >
            <Options />
          </RadioGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Inline">
        <StateRow label="With a group label">
          <div className="flex flex-col gap-hair">
            <span id="play-first" className="label">
              Play first
            </span>
            <RadioGroup
              aria-labelledby="play-first"
              defaultValue="a"
              className="flex w-auto flex-wrap gap-x-snug gap-y-tight"
            >
              <Label>
                <RadioGroupItem value="a" /> Side A
              </Label>
              <Label>
                <RadioGroupItem value="b" /> Side B
              </Label>
              <Label>
                <RadioGroupItem value="shop" /> The shop's pick
              </Label>
            </RadioGroup>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
