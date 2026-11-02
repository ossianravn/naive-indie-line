import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button",
  description:
    "Starts an action: a pocket of solid ink for the one thing to press, a drawn frame or less for the rest.",
  item: "button",
  group: "Actions",
}

const VARIANTS = [
  ["default", "Book session"],
  ["outline", "Hold a record"],
  ["secondary", "Add to the list"],
  ["ghost", "Later"],
  ["destructive", "Cancel booking"],
  ["link", "House rules"],
] as const

export default function ButtonDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map(([variant, words]) => (
          <StateRow key={variant} label={variant}>
            <Button variant={variant}>{words}</Button>
            <Button variant={variant} disabled>
              {words}
            </Button>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="xs · sm · default · lg">
          <Button size="xs">Tag</Button>
          <Button size="sm">Save</Button>
          <Button>Save booking</Button>
          <Button size="lg">Open the room</Button>
        </StateRow>
        <StateRow label="With icon">
          <Button>
            <PlusIcon data-icon="inline-start" /> Add a record
          </Button>
          <Button variant="outline">
            Next side <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add a record">
            <PlusIcon />
          </Button>
        </StateRow>
      </DemoSection>
    </>
  )
}
