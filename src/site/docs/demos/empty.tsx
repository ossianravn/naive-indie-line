import { CalendarIcon, PlusIcon, RotateCwIcon } from "lucide-react"
import { Button } from "@/fineliner/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/fineliner/ui/empty"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Empty",
  description:
    "What a list shows when it has nothing in it yet: a drawing, a title, one line on why, and the one action that helps.",
  item: "empty",
  group: "Data display",
}

const COLUMN = "max-w-[34rem]"

export default function EmptyDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Nothing yet">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia object="crate" seed="empty:racks" />
              <EmptyTitle>The racks are empty</EmptyTitle>
              <EmptyDescription>
                Your first record starts the catalogue.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>
                <PlusIcon data-icon="inline-start" />
                Add a record
              </Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="No results">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia object="record" seed="empty:search" />
              <EmptyTitle>Nothing matches “harbor lites”</EmptyTitle>
              <EmptyDescription>
                Check the spelling, or search by artist or label.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Clear the search</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="Nothing booked">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia object="armchair" seed="empty:sessions" />
              <EmptyTitle>No sessions on Thursday 12 November</EmptyTitle>
              <EmptyDescription>
                Both chairs in the listening room are free all evening.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Book a session</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="Error">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia object="radio" seed="empty:error" />
              <EmptyTitle>The wine list didn’t load</EmptyTitle>
              <EmptyDescription>
                The connection dropped. Tonight’s bookings are safe.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">
                <RotateCwIcon data-icon="inline-start" />
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        </StateRow>
      </DemoSection>
      <DemoSection title="Icon media">
        <StateRow label="icon">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarIcon />
              </EmptyMedia>
              <EmptyTitle>No Thursday evenings planned</EmptyTitle>
              <EmptyDescription>
                Plan a listening night and the regulars will hear first.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Plan an evening</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
      </DemoSection>
    </>
  )
}
