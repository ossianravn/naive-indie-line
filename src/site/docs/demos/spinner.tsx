import { Button } from "@/fineliner/ui/button"
import { Spinner } from "@/fineliner/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Spinner",
  description:
    "A pen ring that turns while something of unknown length is happening.",
  item: "spinner",
  group: "Data display",
}

export default function SpinnerDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="In a button">
        <Button disabled>
          <Spinner data-icon="inline-start" /> Booking
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" /> Saving
        </Button>
      </StateRow>
      <StateRow label="Sizes">
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </StateRow>
      <StateRow label="Inline">
        <p className="m-0 flex items-center gap-hair text-small leading-small text-pen-quiet">
          <Spinner /> Checking the racks for Neon Orchard
        </p>
      </StateRow>
      <StateRow label="Correction pen">
        <p className="m-0 flex items-center gap-hair text-small leading-small text-correction">
          <Spinner /> Retrying the card payment
        </p>
      </StateRow>
    </DemoSection>
  )
}
