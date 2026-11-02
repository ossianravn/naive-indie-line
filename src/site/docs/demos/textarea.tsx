import { Label } from "@/fineliner/ui/label"
import { Textarea } from "@/fineliner/ui/textarea"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Textarea",
  description:
    "A few lines of notes inside a steady pen line, growing with what is written.",
  item: "textarea",
  group: "Forms",
}

const NOTE =
  "We'd like to start with side B of Kind of Blue, then whatever came in this week. One of us uses a wheelchair, so the ground-floor room, please."

export default function TextareaDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Empty">
          <div className="flex w-[34rem] max-w-full flex-col gap-hair">
            <Label htmlFor="booking-notes">Notes for the shop</Label>
            <Textarea
              id="booking-notes"
              placeholder="Records you'd like ready, access, anything else"
            />
          </div>
        </StateRow>
        <StateRow label="Filled">
          <Textarea
            aria-label="Notes for the shop"
            defaultValue={NOTE}
            className="w-[34rem] max-w-full"
          />
        </StateRow>
        <StateRow label="Invalid">
          <Textarea
            aria-label="Why are you cancelling?"
            aria-invalid="true"
            placeholder="Tell us why, and we'll offer another evening"
            className="w-[34rem] max-w-full"
          />
        </StateRow>
        <StateRow label="Disabled">
          <Textarea
            aria-label="Note from the shop"
            disabled
            defaultValue="Your table is by the window. The Thorens will be warmed up and the Gamay open."
            className="w-[34rem] max-w-full"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Ruled">
        <StateRow label="data-ruled">
          <Textarea
            aria-label="Notes for the shop, ruled"
            data-ruled="true"
            defaultValue={NOTE}
            className="w-[34rem] max-w-full"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
