import { Label } from "@/fineliner/ui/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/fineliner/ui/native-select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Native select",
  description:
    "The platform's own select in a steady pen field, for long lists on phones and forms that must work before scripts load.",
  item: "native-select",
  group: "Forms",
}

function Evenings() {
  return (
    <>
      <NativeSelectOption value="">Choose an evening</NativeSelectOption>
      <NativeSelectOptGroup label="November">
        <NativeSelectOption value="nov-5">
          Thu 5 Nov · Blue Note night
        </NativeSelectOption>
        <NativeSelectOption value="nov-12">
          Thu 12 Nov · Folk from the crates
        </NativeSelectOption>
        <NativeSelectOption value="nov-19">
          Thu 19 Nov · Listening club
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="December">
        <NativeSelectOption value="dec-3">
          Thu 3 Dec · Jazz on 78s
        </NativeSelectOption>
        <NativeSelectOption value="dec-10">
          Thu 10 Dec · Winter wines
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </>
  )
}

function GroupSizes() {
  return (
    <>
      <NativeSelectOption value="1-2">1–2</NativeSelectOption>
      <NativeSelectOption value="3-4">3–4</NativeSelectOption>
      <NativeSelectOption value="5+">5+</NativeSelectOption>
    </>
  )
}

const EVENING = "w-72 max-w-full"

export default function NativeSelectDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Chosen">
          <NativeSelect
            aria-label="Thursday event"
            defaultValue="nov-12"
            className={EVENING}
          >
            <Evenings />
          </NativeSelect>
        </StateRow>
        <StateRow label="Placeholder">
          <div className="flex flex-col gap-hair">
            <Label htmlFor="thursday-event">Thursday event</Label>
            <NativeSelect
              id="thursday-event"
              defaultValue=""
              className={EVENING}
            >
              <Evenings />
            </NativeSelect>
          </div>
        </StateRow>
        <StateRow label="Invalid">
          <NativeSelect
            aria-label="Thursday event"
            aria-invalid="true"
            defaultValue=""
            className={EVENING}
          >
            <Evenings />
          </NativeSelect>
        </StateRow>
        <StateRow label="Disabled">
          <NativeSelect
            aria-label="Thursday event"
            disabled
            defaultValue="dec-3"
            className={EVENING}
          >
            <Evenings />
          </NativeSelect>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <NativeSelect
            size="sm"
            aria-label="Group size, compact"
            defaultValue="3-4"
            className="w-20"
          >
            <GroupSizes />
          </NativeSelect>
          <NativeSelect
            aria-label="Group size"
            defaultValue="3-4"
            className="w-20"
          >
            <GroupSizes />
          </NativeSelect>
        </StateRow>
      </DemoSection>
    </>
  )
}
